"use strict";

var assertArgNum = require("./assert-arg-num");
var interpolatePosArg = require("./interpolate-pos-arg");
var interpolateProperties = require("./interpolate-properties");
var expect = require("./expect");
var bane = require("bane");
var Promise = require("es6-promise").Promise;

var slice = Array.prototype.slice;
var referee = bane.createEventEmitter();

referee.countAssertion = function countAssertion() {
    if (typeof referee.count !== "number") { referee.count = 0; }
    referee.count += 1;
};

function createAssertion(type, name, func, minArgs, messageValues, pass, fail) {

    var assertion = function () {

        var fullName = type + "." + name;
        var failed = false;

        if (!assertArgNum(referee.fail, fullName, arguments, minArgs || func.length, fail)) {
            return;
        }

        var args = slice.call(arguments, 0);
        var namedValues = {};

        if (typeof messageValues === "function") {
            var replacedValues = messageValues.apply(this, args);
            if (typeof (replacedValues) === "object") {
                namedValues = replacedValues;
            } else {
                args = replacedValues;
            }
        }

        var ctx = {
            fail: function (msg) {
                failed = true;
                delete this.fail;
                var message = referee[type][name][msg] || msg;
                message = interpolatePosArg(message, args);
                message = interpolateProperties(referee, message, this);
                message = interpolateProperties(referee, message, namedValues);
                fail("[" + type + "." + name + "] " + message);
                return false;
            }
        };

        var result = func.apply(ctx, arguments);

        if (result && typeof result.catch === "function") {
            result
                .catch(function () {
                    if (!failed) {
                        ctx.fail("message");
                    }
                })
                .then(function () {
                    pass(["pass", fullName].concat(args));
                })
            ;
            return;
        }

        if (!result && !failed) {
            // when a function returns false and hasn't already failed with a custom message,
            // fail with default message
            ctx.fail("message");
        }

        if (!failed) {
            pass(["pass", fullName].concat(args));
        }
    };

    return assertion;
}

// Internal helper. Not the most elegant of functions, but it takes
// care of all the nitty-gritty of assertion functions: counting,
// verifying parameter count, interpolating messages with actual
// values and so on.
function defineAssertion(type, name, func, minArgs, messageValues) {

    referee[type][name] = function () {
        referee.countAssertion();
        var assertion = createAssertion(type, name, func, minArgs, messageValues, referee.pass, referee.fail);
        assertion.apply(null, arguments);
    };
    referee[type][name].test = function () {
        var args = arguments;
        return new Promise(function (resolve, reject) {
            var assertion = createAssertion(type, name, func, minArgs, messageValues, resolve, reject);
            assertion.apply(null, args);
        });
    };
}


referee.assert = function assert(actual, message) {
    referee.countAssertion();
    if (!assertArgNum(referee.fail, "assert", arguments, 1)) {
        return;
    }

    if (!actual) {
        referee.fail(message || "[assert] Expected " + String(actual) + " to be truthy");
        return;
    }

    referee.emit("pass", "assert", message || "", actual);
};

referee.assert.toString = function () {
    return "referee.assert()";
};

referee.refute = function refute(actual, message) {
    referee.countAssertion();
    if (!assertArgNum(referee.fail, "refute", arguments, 1)) {
        return;
    }

    if (actual) {
        referee.fail(message || "[refute] Expected " + String(actual) + " to be falsy");
        return;
    }

    referee.emit("pass", "refute", message || "", actual);
};

referee.refute.toString = function () {
    return "referee.refute()";
};

referee.add = function add(name, opt) {
    var refuteArgs = opt.refute ? opt.refute.length : opt.assert.length;

    if (!opt.refute) {
        opt.refute = function () {
            return !opt.assert.apply(this, arguments);
        };
    }

    defineAssertion("assert", name, opt.assert, opt.assert.length, opt.values);
    defineAssertion("refute", name, opt.refute, refuteArgs, opt.values);

    referee.assert[name].message = opt.assertMessage;
    referee.refute[name].message = opt.refuteMessage;

    if (!opt.expectation) {
        return;
    }

    if (referee.expect && referee.expect.wrapAssertion) {
        referee.expect.wrapAssertion(name, opt.expectation, referee);
        return;
    }

    referee.assert[name].expectationName = opt.expectation;
    referee.refute[name].expectationName = opt.expectation;
};

referee.count = 0;

referee.pass = function (message) {
    referee.emit.apply(referee, message);
};

referee.fail = function (message) {
    var exception = new Error(message);
    exception.name = "AssertionError";

    try {
        throw exception;
    } catch (e) {
        referee.emit("failure", e);
    }

    if (typeof referee.throwOnFailure !== "boolean" ||
            referee.throwOnFailure) {
        throw exception;
    }
};

referee.format = function (object) { return String(object); };

referee.prepareMessage = function msg(message) {
    if (!message) {
        return "";
    }
    return message + (/[.:!?]$/.test(message) ? " " : ": ");
};

require("./assertions/defined")(referee);
require("./assertions/class-name")(referee);
require("./assertions/contains")(referee);
require("./assertions/equals")(referee);
require("./assertions/exception")(referee);
require("./assertions/greater")(referee);
require("./assertions/has-prototype")(referee);
require("./assertions/is-array")(referee);
require("./assertions/is-array-buffer")(referee);
require("./assertions/is-array-like")(referee);
require("./assertions/is-boolean")(referee);
require("./assertions/is-data-view")(referee);
require("./assertions/is-date")(referee);
require("./assertions/is-error")(referee);
require("./assertions/is-eval-error")(referee);
require("./assertions/is-false")(referee);
require("./assertions/is-float-32-array")(referee);
require("./assertions/is-float-64-array")(referee);
require("./assertions/is-function")(referee);
require("./assertions/is-infinity")(referee);
require("./assertions/is-int-8-array")(referee);
require("./assertions/is-int-16-array")(referee);
require("./assertions/is-int-32-array")(referee);
require("./assertions/is-intl-collator")(referee);
require("./assertions/is-intl-date-time-format")(referee);
require("./assertions/is-intl-number-format")(referee);
require("./assertions/is-map")(referee);
require("./assertions/is-nan")(referee);
require("./assertions/is-null")(referee);
require("./assertions/is-number")(referee);
require("./assertions/is-object")(referee);
require("./assertions/is-promise")(referee);
require("./assertions/is-range-error")(referee);
require("./assertions/is-reference-error")(referee);
require("./assertions/is-reg-exp")(referee);
require("./assertions/is-set")(referee);
require("./assertions/is-string")(referee);
require("./assertions/is-symbol")(referee);
require("./assertions/is-syntax-error")(referee);
require("./assertions/is-true")(referee);
require("./assertions/is-type-error")(referee);
require("./assertions/is-uri-error")(referee);
require("./assertions/is-u-int-16-array")(referee);
require("./assertions/is-u-int-32-array")(referee);
require("./assertions/is-u-int-8-array")(referee);
require("./assertions/is-u-int-8-clamped-array")(referee);
require("./assertions/is-weak-map")(referee);
require("./assertions/is-weak-set")(referee);
require("./assertions/keys")(referee);
require("./assertions/less")(referee);
require("./assertions/match")(referee);
require("./assertions/near")(referee);
require("./assertions/rejects")(referee);
require("./assertions/same")(referee);
require("./assertions/tag-name")(referee);
require("./assertions/json")(referee);
require("./assertions/match-json")(referee);

referee.expect = function () {
    expect.init(referee);
    return expect.apply(referee, arguments);
};

module.exports = referee;
