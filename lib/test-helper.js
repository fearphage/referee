"use strict";

var referee = require("./referee");
var sinon = require("sinon");
var sandbox = sinon.sandbox.create();
var assert = require("assert");

var testHelper = {
    setUp: function () {
        sandbox.spy(referee, "fail");

        referee.format = sandbox.spy(function (object) {
            return String(object);
        });

        testHelper.okListener = sandbox.spy();
        referee.on("pass", testHelper.okListener);
        testHelper.failListener = sandbox.spy();
        referee.on("failure", testHelper.failListener);
    },

    tearDown: function () {
        sandbox.restore();
        delete testHelper.okListener;
        delete testHelper.failListener;
        delete referee.listeners;
        referee.count = 0;
        delete referee.throwOnFailure;
    },

    // eslint-disable-next-line no-use-before-define
    assertionFailureEventTest: assertionFailureEventTest,
    // eslint-disable-next-line no-use-before-define
    assertionTests: assertionTests
};

function slice(args, index) {
    return Array.prototype.slice.call(args, index);
}

function isPromise(object) {
    return object && typeof object.then === "function";
}

function assertFailureEvent(callback) {
    var fails = this.failListener.callCount;
    var passes = this.okListener.callCount;
    var result;
    referee.throwOnFailure = false;

    try {
        result = callback();
    } catch (e) {
        assert.fail("Assertion threw when it should not: " + e.message);
    }

    if (isPromise(result)) {
        console.log('!@#!@$!@$', 'promise');
    }
    assert.equal(this.failListener.callCount, fails + 1,
        "Fail listener was not called once: " +
                  this.failListener.callCount - fails);
    assert.equal(this.okListener.callCount, passes,
        "Pass listener was unexpectedly called");
}

function assertionFailureEventTest(callback) {
    return function () {
        assertFailureEvent.call(this, callback);
    };
}

function passingAssertionTest(type, assertion, args) {
    return function () {
        var initialCount = referee.count;
        var argsAsStrings = args.map(function (value) {
            if (value && value.toString) {
                return value.toString();
            }

            return value;
        });
        var callStr = type + "." + assertion + "(" + argsAsStrings.join(", ") + ")";

        try {
            referee[type][assertion].apply(referee, args);
        // eslint-disable-next-line no-empty
        } catch (e) {}

        assert.equal(
            testHelper.okListener.callCount,
            1,
            "Expected referee to emit the pass event once for " + callStr
        );
        sinon.assert.calledWith(testHelper.okListener, type + "." + assertion);
        assert.equal(referee.count - initialCount, 1);
        sinon.assert.notCalled(referee.fail);
        sinon.assert.notCalled(testHelper.failListener);
    };
}

function failingAssertionTest(type, assertion, args) {
    var usePromise = ["rejects", "resolves"].indexOf(assertion) != -1;

    return function () {
        var initialCount = referee.count;
        var callStr = type + "." + assertion + "(" + args.join(", ") + ")";
        var method = referee[type][assertion];
        var result;

        function makeAssertions() {
            assert.equal(
                referee.fail.callCount,
                1,
                "Expected referee.fail to be called once for " +
                    callStr + ", was called " + referee.fail.callCount +
                    " times"
            );

            assert.equal(referee.count - initialCount, 1);
            sinon.assert.notCalled(testHelper.okListener);
            sinon.assert.calledOnce(testHelper.failListener);

            assertFailureEvent.call(testHelper, function () {
                referee[type][assertion].apply(referee, args);
            });
        }

        try {
            result = (usePromise ? method.test : method).apply(referee, args);

            console.log(
                '-------',
                typeof result,
                referee[type][assertion],
            );
            if (isPromise(result)) {
                console.log('!@#!@#!@#!@ PROMISE');
                return result.then(makeAssertions);
            }

            // eslint-disable-next-line no-console
            console.log("Unexpectedly passed: " + callStr);
        // eslint-disable-next-line no-empty
        } catch (e) {}
    };
}

function assertionMessageTest(type, assertion, message, args) {
    var test = function () {
        var msg;

        try {
            referee[type][assertion].apply(referee, args);
            throw new Error(type + "." + assertion + " expected to fail");
        } catch (e) {
            assert.equal(e.name, "AssertionError",
                e.name + ": " + e.message);
            assert.equal(
                e.message,
                message,
                "Message was " + e.message + ", " + "expected " + message
            );
            msg = e.message;
        }

        var expected = test.expectedFormats;

        if (typeof expected !== "number") {
            expected = args.length;

            if (typeof args[args.length - 1] === "string") {
                expected -= 1;
            }
        }

        assert(referee.format.callCount >= expected);

        for (var i = 0, l = expected; i < l; ++i) {
            if (!isNaN(args[i]) || !isNaN(referee.format.args[i][0])) {
                sinon.assert.calledWith(referee.format, args[i]);
            }
        }

        assert.equal(testHelper.failListener.args[0][0].name, "AssertionError");
        assert.equal(testHelper.failListener.args[0][0].message, msg);
    };

    return test;
}

function assertionTests(type, assertion, callback) {
    var tests = {
        setUp: testHelper.setUp,
        tearDown: testHelper.tearDown
    };

    function pass(name) {
        var label = "should pass " + name;
        it(label, passingAssertionTest(
            type,
            assertion,
            slice(arguments, 1),
            name
        ));
    }

    function fail(name) {
        var label = "should fail " + name;
        it(label, failingAssertionTest(
            type,
            assertion,
            slice(arguments, 1)
        ));
    }

    function msg(name, message) {
        var label = "should fail " + name;
        var test = assertionMessageTest(
            type,
            assertion,
            message,
            slice(arguments, 2)
        );
        it(label, test);
        return test;
    }

    describe(type + "." + assertion, function () {
        beforeEach(testHelper.setUp);
        afterEach(testHelper.tearDown);

        return callback.call(tests, pass, fail, msg);
    });

    return;
}

module.exports = testHelper;
