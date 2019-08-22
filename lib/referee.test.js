"use strict";

var referee = require("../lib/referee");
var testHelper = require("./test-helper");
var sinon = require("sinon");

/*
testHelper.assertionTests("assert", "isTrue", function (pass, fail, msg) {
    pass("for true", true);
    fail("for false", false);
    msg("represent expected value in message",
        "[assert.isTrue] Expected [object Object] to be true", {});
    msg("include custom message",
        "[assert.isTrue] Oh: Expected [object Object] to be true",
        {},
        "Oh");
    fail("for object", {});
    fail("for array", []);
    fail("for string", "32");
    fail("for number", 32);
    msg("fail if not passed arguments",
        "[assert.isTrue] Expected to receive at least 1 argument");
});

testHelper.assertionTests("assert", "isFalse", function (pass, fail, msg) {
    pass("for false", false);
    fail("for true", true);
    msg("fail with message",
        "[assert.isFalse] Expected true to be false", true);
    msg("fail with custom message",
        "[assert.isFalse] Nooo! Expected true to be false", true, "Nooo!");
    msg("represent expected value in message",
        "[assert.isFalse] Expected [object Object] to be false", {});
    fail("for empty string", "");
    fail("for 0", 0);
    fail("for NaN", NaN);
    fail("for null", null);
    fail("for undefined", undefined);
});

var obj = { id: 42 };
var obj2 = { id: 42 };

testHelper.assertionTests("assert", "same", function (pass, fail, msg) {
    pass("when comparing object to itself", obj, obj);
    fail("when comparing different objects", obj, obj2);
    pass("when comparing strings", "Hey", "Hey");
    pass("when comparing booleans", true, true);
    pass("when comparing numbers", 32, 32);
    pass("when comparing infinity", Infinity, Infinity);
    fail("when comparing without coercion", 666, "666");
    fail("when comparing falsy values without coercion", 0, "");
    pass("when comparing null to null", null, null);
    pass("when comparing undefined to undefined", undefined, undefined);
    msg("include objects in message",
        "[assert.same] Obj expected to be the same object as [object Object]",
        "Obj", {});
    msg("include custom message",
        "[assert.same] Back again: Obj expected to be the same object as [object Object]",
        "Obj", {}, "Back again");
    pass("when comparing NaN to NaN", NaN, NaN);
    fail("when comparing -0 to +0", -0, +0);
});

testHelper.assertionTests("refute", "same", function (pass, fail, msg) {
    fail("comparing object to itself", obj, obj);
    pass("when comparing different objects", obj, obj2);
    fail("when comparing strings", "Hey", "Hey");
    fail("when comparing booleans", true, true);
    fail("when comparing numbers", 32, 32);
    fail("when comparing infinity", Infinity, Infinity);
    fail("when comparing null to null", null, null);
    fail("when comparing undefined to undefined", undefined, undefined);
    msg("include objects in message",
        "[refute.same] [object Object] expected not to be the same object as [object Object]", obj, obj);
    msg("include custom message",
        "[refute.same] Sigh... [object Object] expected not to be the same object as [object Object]",
        obj, obj, "Sigh...");
    fail("when comparing NaN to NaN", NaN, NaN);
    pass("when comparing -0 to +0", -0, +0);
});

testHelper.assertionTests("assert", "equals", function (pass, fail, msg) {
    var func = function () {};
    var arr = [];
    var date = new Date();
    var sameDate = new Date(date.getTime());
    var anotherDate = new Date(date.getTime() - 10);

    pass("when comparing object to itself", obj, obj);
    pass("when comparing strings", "Hey", "Hey");
    pass("when comparing numbers", 32, 32);
    pass("when comparing booleans", false, false);
    pass("when comparing null", null, null);
    pass("when comparing undefined", undefined, undefined);
    pass("when comparing function to itself", func, func);
    fail("when comparing functions", function () {}, function () {});
    pass("when comparing array to itself", arr, arr);
    pass("when comparing date objects with same date", date, sameDate);
    fail("when comparing date objects with different dates", date, anotherDate);
    fail("when comparing date objects to null", date, null);
    fail("when comparing strings and numbers with coercion", "4", 4);
    fail("when comparing numbers and strings with coercion", 4, "4");
    // eslint-disable-next-line no-new-wrappers
    fail("when comparing number object with coercion", 32, new Number(32));
    // eslint-disable-next-line no-new-wrappers
    fail("when comparing number object reverse with coercion", new Number(32), 32);
    fail("when comparing falsy values with coercion", 0, "");
    fail("when comparing falsy values reverse with coercion", "", 0);
    // eslint-disable-next-line no-new-wrappers
    fail("when comparing string boxing with coercion", "4", new String("4"));
    // eslint-disable-next-line no-new-wrappers
    fail("when comparing string boxing reverse with coercion", new String("4"), "4");
    pass("when comparing NaN to NaN", NaN, NaN);
    fail("when comparing -0 to +0", -0, +0);
    fail("when comparing objects with different own properties",
        { id: 42 }, { id: 42, di: 24 });
    fail("when comparing objects with different own properties #2",
        { id: undefined }, { di: 24 });
    fail("when comparing objects with different own properties #3",
        { id: 24 }, { di: undefined });
    pass("when comparing objects with one property", { id: 42 }, { id: 42 });
    pass("when comparing objects with one object property",
        { obj: { id: 42 } }, { obj: { id: 42 } });
    fail("when comparing objects with one property with different values",
        { id: 42 }, { id: 24 });

    var deepObject = {
        id: 42,
        name: "Hey",
        sayIt: function () {
            return this.name;
        },

        child: {
            speaking: function () {}
        }
    };

    pass("when comparing complex objects", deepObject, {
        sayIt: deepObject.sayIt,
        child: { speaking: deepObject.child.speaking },
        id: 42,
        name: "Hey"
    });

    pass("when comparing arrays",
        [1, 2, "Hey there", func, { id: 42, prop: [2, 3] }],
        [1, 2, "Hey there", func, { id: 42, prop: [2, 3] }]);

    pass("when comparing regexp literals", /a/, /a/);
    pass("when comparing regexp objects", new RegExp("[a-z]+"), new RegExp("[a-z]+"));

    var re1 = new RegExp("[a-z]+");
    var re2 = new RegExp("[a-z]+");
    re2.id = 42;

    fail("when comparing nested array with shallow array", [["hey"]], ["hey"]);
    fail("when comparing regexp objects with custom properties", re1, re2);
    fail("when comparing different objects", { id: 42 }, {});
    fail("when comparing object to null", {}, null);
    fail("when comparing object to undefined", {}, undefined);
    fail("when comparing object to false", {}, false);
    fail("when comparing false to object", false, {});
    fail("when comparing object to true", {}, true);
    fail("when comparing true to object", true, {});
    fail("when comparing 'empty' object to date", {}, new Date());
    // eslint-disable-next-line no-new-wrappers
    fail("when comparing 'empty' object to string object", {}, new String());
    // eslint-disable-next-line no-new-wrappers
    fail("when comparing 'empty' object to number object", {}, new Number());
    fail("when comparing 'empty' object to empty array", {}, []);

    function gather() { return arguments; }
    var arrayLike = { length: 4, "0": 1, "1": 2, "2": {}, "3": [] };

    pass("when comparing arguments to array", [1, 2, {}, []], gather(1, 2, {}, []));
    pass("when comparing array to arguments", gather(), []);

    pass("when comparing arguments to array like object",
        arrayLike, gather(1, 2, {}, []));

    msg("fail with understandable message",
        "[assert.equals] [object Object] expected to be equal to Hey", {}, "Hey");

    msg("fail with custom message",
        "[assert.equals] Here: [object Object] expected to be equal to Hey",
        {}, "Hey", "Here:");

    msg("fail with special message for multi-line strings",
        "[assert.equals] Expected multi-line strings to be equal:\n" +
        "line 2: The quick brown fox jumps over the lazy god\n" +
        "was:    The quick brown fox jumps over the lazy dog",
        "Yo!\nThe quick brown fox jumps over the lazy dog",
        "Yo!\nThe quick brown fox jumps over the lazy god").expectedFormats = 0;

    msg("fail with custom message for multi-line strings",
        "[assert.equals] Slick! Expected multi-line strings to be equal:\n" +
        "line 2: The quick brown fox jumps over the lazy god\n" +
        "was:    The quick brown fox jumps over the lazy dog",
        "Yo!\nThe quick brown fox jumps over the lazy dog",
        "Yo!\nThe quick brown fox jumps over the lazy god",
        "Slick!").expectedFormats = 0;

    msg("fail with special message for multi-line strings with too short actual",
        "[assert.equals] Expected multi-line strings to be equal:\n" +
        "line 2: The quick brown fox jumps over the lazy god\n" +
        "was:    ",
        "Yo!",
        "Yo!\nThe quick brown fox jumps over the lazy god").expectedFormats = 0;

    msg("fail with special message for multi-line strings with too long actual",
        "[assert.equals] Expected multi-line strings to be equal:\n" +
        "line 2: \n" +
        "was:    The quick brown fox jumps over the lazy god",
        "Yo!\nThe quick brown fox jumps over the lazy god",
        "Yo!").expectedFormats = 0;

    msg("fail with all differing lines in multi-line string fail",
        "[assert.equals] Expected multi-line strings to be equal:\n" +
        "line 1: Yo!\n" +
        "was:    Yo\n\n" +
        "line 4: Hey\n" +
        "was:    Oh noes",
        "Yo\n2\n3\nOh noes",
        "Yo!\n2\n3\nHey").expectedFormats = 0;

    msg("fail with regular message for one-line strings",
        "[assert.equals] Yo expected to be equal to Hey",
        "Yo", "Hey");
});


testHelper.assertionTests("refute", "equals", function (pass, fail, msg) {
    fail("when comparing object to itself", obj, obj);
    fail("when comparing strings", "Hey", "Hey");
    fail("when comparing numbers", 32, 32);
    fail("when comparing booleans", false, false);
    fail("when comparing null", null, null);
    fail("when comparing undefined", undefined, undefined);

    var func = function () {};
    var arr = [];
    var date = new Date();
    var sameDate = new Date(date.getTime());
    var anotherDate = new Date(date.getTime() - 10);

    fail("when comparing function to itself", func, func);
    pass("when comparing functions", function () {}, function () {});
    fail("when comparing array to itself", arr, arr);
    fail("when comparing date objects with same date", date, sameDate);
    pass("when comparing date objects with different dates", date, anotherDate);
    pass("when comparing date objects to null", new Date(), null);
    pass("when comparing string with number with coercion", "4", 4);
    pass("when comparing number with string with coercion", 32, "32");
    pass("when comparing with coercion", 0, "");
    pass("when comparing objects with different own properties",
        { id: 42 }, { id: 42, di: 24 });
    pass("when comparing objects with different own properties #2",
        { id: undefined }, { di: 24 });
    pass("when comparing objects with different own properties #3",
        { id: 24 }, { di: undefined });
    fail("when comparing objects with one property", { id: 42 }, { id: 42 });
    fail("when comparing objects with one object property",
        { obj: { id: 42 } }, { obj: { id: 42 } });
    pass("when comparing objects with one property with different values",
        { id: 42 }, { id: 24 });
    fail("when comparing NaN to NaN", NaN, NaN);
    pass("when comparing -0 to +0", -0, +0);

    var deepObject = {
        id: 42,
        name: "Hey",
        sayIt: function () {
            return this.name;
        },

        child: {
            speaking: function () {}
        }
    };

    fail("when comparing complex objects", deepObject, {
        sayIt: deepObject.sayIt,
        child: { speaking: deepObject.child.speaking },
        id: 42,
        name: "Hey"
    });

    var arr1 = [1, 2, "Hey there", func, { id: 42, prop: [2, 3] }];
    var arr2 = [1, 2, "Hey there", func, { id: 42, prop: [2, 3] }];

    fail("when comparing arrays", arr1, arr2);
    fail("when comparing regexp literals", /a/, /a/);

    fail("when comparing regexp objects", new RegExp("[a-z]+"), new RegExp("[a-z]+"));

    var re1 = new RegExp("[a-z]+");
    var re2 = new RegExp("[a-z]+");
    re2.id = 42;

    pass("when comparing regexp objects with custom properties", re1, re2);
    pass("when comparing different objects", obj, {});
    pass("when comparing object to null", {}, null);
    pass("when comparing null to object", {}, null);
    pass("when comparing object to undefined", {}, undefined);
    pass("when comparing undefined to object", undefined, {});
    pass("when comparing object to false", {}, false);
    pass("when comparing false to object", false, {});
    pass("when comparing object to true", {}, true);
    pass("when comparing true to object", true, {});
    pass("when comparing 'empty' object to date", {}, new Date());
    // eslint-disable-next-line no-new-wrappers
    pass("when comparing 'empty' object to string object", {}, new String());
    // eslint-disable-next-line no-new-wrappers
    pass("when comparing 'empty' object to number object", {}, new Number());
    pass("when comparing 'empty' object to empty array", {}, []);
    pass("when comparing multi-line strings", "Hey\nHo", "Yo\nNo");

    function gather() { return arguments; }
    var arrayLike = { length: 4, "0": 1, "1": 2, "2": {}, "3": [] };

    fail("when comparing arguments to array", [1, 2, {}, []], gather(1, 2, {}, []));
    fail("when comparing array to arguments", gather(), []);
    fail("when comparing arguments to array like object",
        arrayLike, gather(1, 2, {}, []));

    msg("fail with understandable message",
        "[refute.equals] [object Object] expected not to be equal to [object Object]", {}, {});

    msg("fail with custom message",
        "[refute.equals] Eh? [object Object] expected not to be equal to [object Object]",
        {}, {}, "Eh?");
});

testHelper.assertionTests("assert", "greater", function (pass, fail, msg) {
    pass("when greater than", 2, 1);
    fail("when equal", 1, 1);
    fail("when less than", 0, 1);
    msg(
        "fail with descriptive message",
        "[assert.greater] Expected 1 to be greater than 2",
        1,
        2
    );
});

testHelper.assertionTests("refute", "greater", function (pass, fail, msg) {
    fail("when greater than", 2, 1);
    pass("when equal", 1, 1);
    pass("when less than", 0, 1);
    msg(
        "fail with descriptive message",
        "[refute.greater] Expected 2 to be less than or equal to 1",
        2,
        1
    );
});

testHelper.assertionTests("assert", "less", function (pass, fail, msg) {
    fail("when greater than", 2, 1);
    fail("when equal", 1, 1);
    pass("when less than", 0, 1);
    msg(
        "fail with descriptive message",
        "[assert.less] Expected 2 to be less than 1",
        2,
        1
    );
});

testHelper.assertionTests("refute", "less", function (pass, fail, msg) {
    pass("when greater than", 2, 1);
    pass("when equal", 1, 1);
    fail("when less than", 0, 1);
    msg(
        "fail with descriptive message",
        "[refute.less] Expected 1 to be greater than or equal to 2",
        1,
        2
    );
});

testHelper.assertionTests("assert", "isString", function (pass, fail, msg) {
    pass("for string", "Hey");
    fail("for object", {});
    msg("fail with descriptive message",
        "[assert.isString] Expected [object Object] (object) to be string",
        {});
    msg("fail with custom message",
        "[assert.isString] Snap: Expected [object Object] (object) to be string",
        {}, "Snap");
});

testHelper.assertionTests("refute", "isString", function (pass, fail, msg) {
    fail("for string", "Hey");
    pass("for object", {});
    msg("fail with descriptive message",
        "[refute.isString] Expected Yo not to be string",
        "Yo");
    msg("fail with custom message",
        "[refute.isString] Here goes: Expected Yo not to be string",
        "Yo", "Here goes");
});

testHelper.assertionTests("assert", "isObject", function (pass, fail, msg) {
    pass("for object", {});
    fail("for function", function () {});
    fail("for null", null);
    msg("fail with descriptive message",
        "[assert.isObject] Hey (string) expected to be object and not null",
        "Hey");
    msg("fail with custom message",
        "[assert.isObject] OH! Hey (string) expected to be object and not null",
        "Hey", "OH!");
});

testHelper.assertionTests("refute", "isObject", function (pass, fail, msg) {
    fail("for object", {});
    pass("for function", function () {});
    pass("for null", null);
    msg("fail with descriptive message",
        "[refute.isObject] [object Object] expected to be null or not an object",
        {});
    msg("fail with custom message",
        "[refute.isObject] Oh no! [object Object] expected to be null or not an object",
        {}, "Oh no!");
});

testHelper.assertionTests("assert", "isFunction", function (pass, fail, msg) {
    pass("for function", function () {});
    fail("for object", {});
    msg("fail with descriptive message",
        "[assert.isFunction] Hey (string) expected to be function",
        "Hey");
    msg("fail with custom message",
        "[assert.isFunction] Oh no: Hey (string) expected to be function",
        "Hey", "Oh no");
});

testHelper.assertionTests("refute", "isFunction", function (pass, fail, msg) {
    fail("for function", function () {});
    pass("for object", {});
    msg("fail with descriptive message",
        "[refute.isFunction] function () {} expected not to be function",
        function () {});
    msg("fail with custom message",
        "[refute.isFunction] Hmm: function () {} expected not to be function",
        function () {}, "Hmm");
});

testHelper.assertionTests("assert", "isBoolean", function (pass, fail, msg) {
    pass("for boolean", true);
    fail("for function", function () {});
    fail("for null", null);
    msg("fail with descriptive message",
        "[assert.isBoolean] Expected Hey (string) to be boolean", "Hey");
    msg("fail with custom message",
        "[assert.isBoolean] Boolean, plz: Expected Hey (string) to be boolean",
        "Hey", "Boolean, plz");
});

testHelper.assertionTests("refute", "isBoolean", function (pass, fail, msg) {
    fail("for boolean", true);
    pass("for function", function () {});
    pass("for null", null);
    msg("fail with descriptive message",
        "[refute.isBoolean] Expected true not to be boolean", true);
    msg("fail with custom message",
        "[refute.isBoolean] Here: Expected true not to be boolean",
        true, "Here");
});

testHelper.assertionTests("assert", "isNumber", function (pass, fail, msg) {
    pass("for number", 32);
    fail("for NaN (sic)", NaN);
    fail("for function", function () {});
    fail("for null", null);
    msg("fail with descriptive message",
        "[assert.isNumber] Expected Hey (string) to be a non-NaN number",
        "Hey");
    msg("fail with custom message",
        "[assert.isNumber] Check it: Expected Hey (string) to be a non-NaN number",
        "Hey", "Check it");
});

testHelper.assertionTests("refute", "isNumber", function (pass, fail, msg) {
    fail("for number", 32);
    pass("for NaN (sic)", NaN);
    pass("for function", function () {});
    pass("for null", null);
    msg("fail with descriptive message",
        "[refute.isNumber] Ho ho! Expected 42 to be NaN or a non-number value",
        42, "Ho ho!");
});

testHelper.assertionTests("assert", "isNaN", function (pass, fail, msg) {
    pass("for NaN", NaN);
    fail("for number", 32);
    fail("for function", function () {});
    fail("for object", {});
    fail("for null", null);
    msg("fail with descriptive message", "[assert.isNaN] Expected 32 to be NaN", 32);
    msg("fail with custom message", "[assert.isNaN] No! Expected 32 to be NaN",
        32, "No!");
});

testHelper.assertionTests("refute", "isNaN", function (pass, fail, msg) {
    fail("for NaN", NaN);
    pass("for number", 32);
    pass("for function", function () {});
    pass("for object", {});
    pass("for null", null);
    msg("fail with descriptive message",
        "[refute.isNaN] Expected not to be NaN", NaN);
    msg("fail with custom message",
        "[refute.isNaN] Hey: Expected not to be NaN", NaN, "Hey");
});

testHelper.assertionTests("assert", "isArray", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    var arrayLike = {
        length: 4,
        "0": "One",
        "1": "Two",
        "2": "Three",
        "3": "Four",
        splice: function () {}
    };

    pass("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    fail("for array like", arrayLike);
    msg("fail with descriptive message",
        "[assert.isArray] Expected [object Object] to be array", {});
    msg("fail with custom message",
        "[assert.isArray] Nope: Expected [object Object] to be array",
        {}, "Nope");
});

testHelper.assertionTests("assert", "isArrayBuffer", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    pass("for ArrayBuffer", new global.ArrayBuffer(8));
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isArrayBuffer] Expected [object Object] to be an ArrayBuffer", {});
    msg("fail with custom message", "[assert.isArrayBuffer] Nope: Expected [object Object] to be an ArrayBuffer", {}, "Nope");
});

testHelper.assertionTests("assert", "isDataView", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    var ab = new global.ArrayBuffer(8);
    var dv = new global.DataView(ab);

    pass("for DataView", dv);
    fail("for ArrayBuffer", ab);
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isDataView] Expected [object Object] to be a DataView", {});
    msg("fail with custom message", "[assert.isDataView] Nope: Expected [object Object] to be a DataView", {}, "Nope");
});

testHelper.assertionTests("assert", "isDate", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    pass("for Date", new Date());
    fail("for RegExp", new RegExp("[a-z]"));
    fail("for string", "123");
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isDate] Expected [object Object] to be a Date", {});
    msg("fail with custom message", "[assert.isDate] Nope: Expected [object Object] to be a Date", {}, "Nope");
});

testHelper.assertionTests("assert", "isError", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    pass("for Error", new Error("error"));
    pass("for EvalError", new EvalError("eval error"));
    pass("for RangeError", new RangeError("range error"));
    pass("for ReferenceError", new ReferenceError("reference error"));
    pass("for SyntaxError", new SyntaxError("syntax error"));
    pass("for TypeError", new TypeError("type error"));
    pass("for URIError", new URIError("uri error"));
    fail("for string", "not an error");
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isError] Expected [object Object] to be an Error", {});
    msg("fail with custom message", "[assert.isError] Nope: Expected [object Object] to be an Error", {}, "Nope");
});

testHelper.assertionTests("assert", "isEvalError", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    fail("for Error", new Error("error"));
    pass("for EvalError", new EvalError("eval error"));
    fail("for RangeError", new RangeError("range error"));
    fail("for ReferenceError", new ReferenceError("reference error"));
    fail("for SyntaxError", new SyntaxError("syntax error"));
    fail("for TypeError", new TypeError("type error"));
    fail("for URIError", new URIError("uri error"));
    fail("for string", "not an error");
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isEvalError] Expected [object Object] to be an EvalError", {});
    msg("fail with custom message", "[assert.isEvalError] Nope: Expected [object Object] to be an EvalError", {}, "Nope");
});

testHelper.assertionTests("assert", "isFloat32Array", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    pass("for Float32Array", new Float32Array(2));
    fail("for Float64Array", new Float64Array(2));
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isFloat32Array] Expected [object Object] to be a Float32Array", {});
    msg("fail with custom message", "[assert.isFloat32Array] Nope: Expected [object Object] to be a Float32Array", {}, "Nope");
});

testHelper.assertionTests("assert", "isFloat64Array", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    fail("for Float32Array", new Float32Array(2));
    pass("for Float64Array", new Float64Array(2));
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isFloat64Array] Expected [object Object] to be a Float64Array", {});
    msg("fail with custom message", "[assert.isFloat64Array] Nope: Expected [object Object] to be a Float64Array", {}, "Nope");
});

testHelper.assertionTests("assert", "isInfinity", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    pass("for Infinity", Infinity);
    fail("for NaN", NaN);
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isInfinity] Expected [object Object] to be Infinity", {});
    msg("fail with custom message", "[assert.isInfinity] Nope: Expected [object Object] to be Infinity", {}, "Nope");
});

testHelper.assertionTests("assert", "isInt8Array", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    pass("for Int8Array", new Int8Array(2));
    fail("for Int16Array", new Int16Array(2));
    fail("for Int32Array", new Int32Array(2));
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isInt8Array] Expected [object Object] to be an Int8Array", {});
    msg("fail with custom message", "[assert.isInt8Array] Nope: Expected [object Object] to be an Int8Array", {}, "Nope");
});

testHelper.assertionTests("assert", "isInt16Array", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    fail("for Int8Array", new Int8Array(2));
    pass("for Int16Array", new Int16Array(2));
    fail("for Int32Array", new Int32Array(2));
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isInt16Array] Expected [object Object] to be an Int16Array", {});
    msg("fail with custom message", "[assert.isInt16Array] Nope: Expected [object Object] to be an Int16Array", {}, "Nope");
});

testHelper.assertionTests("assert", "isInt32Array", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    fail("for Int8Array", new Int8Array(2));
    fail("for Int16Array", new Int16Array(2));
    pass("for Int32Array", new Int32Array(2));
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isInt32Array] Expected [object Object] to be an Int32Array", {});
    msg("fail with custom message", "[assert.isInt32Array] Nope: Expected [object Object] to be an Int32Array", {}, "Nope");
});

testHelper.assertionTests("assert", "isIntlCollator", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    pass("for Intl.Collator", new Intl.Collator());
    fail("for string", "apple pie");
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isIntlCollator] Expected [object Object] to be an Intl.Collator", {});
    msg("fail with custom message", "[assert.isIntlCollator] Nope: Expected [object Object] to be an Intl.Collator", {}, "Nope");
});

testHelper.assertionTests("assert", "isIntlDateTimeFormat", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    pass("for Intl.DateTimeFormat", new Intl.DateTimeFormat());
    fail("for string", "apple pie");
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isIntlDateTimeFormat] Expected [object Object] to be an Intl.DateTimeFormat", {});
    msg("fail with custom message", "[assert.isIntlDateTimeFormat] Nope: Expected [object Object] to be an Intl.DateTimeFormat", {}, "Nope");
});

testHelper.assertionTests("assert", "isIntlNumberFormat", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    pass("for Intl.NumberFormat", new Intl.NumberFormat());
    fail("for string", "apple pie");
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isIntlNumberFormat] Expected [object Object] to be an Intl.NumberFormat", {});
    msg("fail with custom message", "[assert.isIntlNumberFormat] Nope: Expected [object Object] to be an Intl.NumberFormat", {}, "Nope");
});

testHelper.assertionTests("assert", "isMap", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    pass("for Map", new Map());
    fail("for string", "apple pie");
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isMap] Expected [object Object] to be a Map", {});
    msg("fail with custom message", "[assert.isMap] Nope: Expected [object Object] to be a Map", {}, "Nope");
});

testHelper.assertionTests("assert", "isPromise", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    pass("for Promise", Promise.resolve("apple pie"));
    fail("for string", "apple pie");
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isPromise] Expected [object Object] to be a Promise", {});
    msg("fail with custom message", "[assert.isPromise] Nope: Expected [object Object] to be a Promise", {}, "Nope");
});

testHelper.assertionTests("assert", "isRangeError", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    fail("for Error", new Error("not pie"));
    pass("for RangeError", new RangeError("apple pie"));
    fail("for string", "apple pie");
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isRangeError] Expected [object Object] to be a RangeError", {});
    msg("fail with custom message", "[assert.isRangeError] Nope: Expected [object Object] to be a RangeError", {}, "Nope");
});

testHelper.assertionTests("assert", "isReferenceError", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    fail("for Error", new Error("not pie"));
    pass("for ReferenceError", new ReferenceError("apple pie"));
    fail("for string", "apple pie");
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isReferenceError] Expected [object Object] to be a ReferenceError", {});
    msg("fail with custom message", "[assert.isReferenceError] Nope: Expected [object Object] to be a ReferenceError", {}, "Nope");
});

testHelper.assertionTests("assert", "isRegExp", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    pass("for RegExp", new RegExp("apple pie"));
    pass("for RegExp literal", /apple pie/);
    fail("for string", "apple pie");
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isRegExp] Expected [object Object] to be a RegExp", {});
    msg("fail with custom message", "[assert.isRegExp] Nope: Expected [object Object] to be a RegExp", {}, "Nope");
});

testHelper.assertionTests("assert", "isSet", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    pass("for Set", new Set());
    fail("for string", "apple pie");
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isSet] Expected [object Object] to be a Set", {});
    msg("fail with custom message", "[assert.isSet] Nope: Expected [object Object] to be a Set", {}, "Nope");
});

testHelper.assertionTests("assert", "isSymbol", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    pass("for Symbol", Symbol("apple pie"));
    fail("for string", "apple pie");
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isSymbol] Expected [object Object] to be a Symbol", {});
    msg("fail with custom message", "[assert.isSymbol] Nope: Expected [object Object] to be a Symbol", {}, "Nope");
});

testHelper.assertionTests("assert", "isSyntaxError", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    fail("for Error", new Error("not pie"));
    pass("for SyntaxError", new SyntaxError("apple pie"));
    fail("for string", "apple pie");
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isSyntaxError] Expected [object Object] to be a SyntaxError", {});
    msg("fail with custom message", "[assert.isSyntaxError] Nope: Expected [object Object] to be a SyntaxError", {}, "Nope");
});

testHelper.assertionTests("assert", "isTypeError", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    fail("for Error", new Error("not pie"));
    pass("for TypeError", new TypeError("apple pie"));
    fail("for string", "apple pie");
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isTypeError] Expected [object Object] to be a TypeError", {});
    msg("fail with custom message", "[assert.isTypeError] Nope: Expected [object Object] to be a TypeError", {}, "Nope");
});

testHelper.assertionTests("assert", "isURIError", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    fail("for Error", new Error("not pie"));
    pass("for URIError", new URIError("apple pie"));
    fail("for string", "apple pie");
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isURIError] Expected [object Object] to be a URIError", {});
    msg("fail with custom message", "[assert.isURIError] Nope: Expected [object Object] to be a URIError", {}, "Nope");
});

testHelper.assertionTests("assert", "isUint16Array", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    pass("for Uint16Array", new Uint16Array());
    fail("for Uint32Array", new Uint32Array());
    fail("for Uint8Array", new Uint8Array());
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isUint16Array] Expected [object Object] to be a Uint16Array", {});
    msg("fail with custom message", "[assert.isUint16Array] Nope: Expected [object Object] to be a Uint16Array", {}, "Nope");
});

testHelper.assertionTests("assert", "isUint32Array", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    fail("for Uint16Array", new Uint16Array());
    pass("for Uint32Array", new Uint32Array());
    fail("for Uint8Array", new Uint8Array());
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isUint32Array] Expected [object Object] to be a Uint32Array", {});
    msg("fail with custom message", "[assert.isUint32Array] Nope: Expected [object Object] to be a Uint32Array", {}, "Nope");
});

testHelper.assertionTests("assert", "isUint8Array", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    fail("for Uint16Array", new Uint16Array());
    fail("for Uint32Array", new Uint32Array());
    pass("for Uint8Array", new Uint8Array());
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isUint8Array] Expected [object Object] to be a Uint8Array", {});
    msg("fail with custom message", "[assert.isUint8Array] Nope: Expected [object Object] to be a Uint8Array", {}, "Nope");
});

testHelper.assertionTests("assert", "isUint8ClampedArray", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    fail("for Uint8Array", new Uint8Array());
    pass("for Uint8ClampedArray", new Uint8ClampedArray());
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isUint8ClampedArray] Expected [object Object] to be a Uint8ClampedArray", {});
    msg("fail with custom message", "[assert.isUint8ClampedArray] Nope: Expected [object Object] to be a Uint8ClampedArray", {}, "Nope");
});

testHelper.assertionTests("assert", "isWeakMap", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    // eslint-disable-next-line ie11/no-weak-collections
    pass("for WeakMap", new WeakMap());
    fail("for Map", new Map());
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isWeakMap] Expected [object Object] to be a WeakMap", {});
    msg("fail with custom message", "[assert.isWeakMap] Nope: Expected [object Object] to be a WeakMap", {}, "Nope");
});

testHelper.assertionTests("assert", "isWeakSet", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    // eslint-disable-next-line ie11/no-weak-collections
    pass("for WeakSet", new WeakSet());
    fail("for Set", new Set());
    fail("for array", []);
    fail("for object", {});
    fail("for arguments", captureArgs());
    msg("fail with descriptive message", "[assert.isWeakSet] Expected [object Object] to be a WeakSet", {});
    msg("fail with custom message", "[assert.isWeakSet] Nope: Expected [object Object] to be a WeakSet", {}, "Nope");
});

testHelper.assertionTests("refute", "isArray", function (pass, fail, msg) {
    function captureArgs() {
        return arguments;
    }

    var arrayLike = {
        length: 4,
        "0": "One",
        "1": "Two",
        "2": "Three",
        "3": "Four",
        splice: function () {}
    };

    fail("for array", []);
    pass("for object", {});
    pass("for arguments", captureArgs());
    pass("for array like", arrayLike);
    msg("fail with descriptive message",
        "[refute.isArray] Expected 1,2 not to be array", [1, 2]);
    msg("fail with custom message",
        "[refute.isArray] Hmm: Expected 1,2 not to be array",
        [1, 2], "Hmm");
});

testHelper.assertionTests("assert", "isArrayLike", function (pass, fail, msg) {
    function captureArgs() { return arguments; }

    var arrayLike = {
        length: 4,
        "0": "One",
        "1": "Two",
        "2": "Three",
        "3": "Four",
        splice: function () {}
    };

    pass("for array", []);
    fail("for object", {});
    pass("for arguments", captureArgs());
    pass("for array like", arrayLike);
    msg("fail with descriptive message",
        "[assert.isArrayLike] Expected [object Object] to be array like", {});
    msg("fail with custom message",
        "[assert.isArrayLike] Here! Expected [object Object] to be array like",
        {}, "Here!");
});

testHelper.assertionTests("refute", "isArrayLike", function (pass, fail, msg) {
    function captureArgs() { return arguments; }

    var arrayLike = {
        length: 4,
        "0": "One",
        "1": "Two",
        "2": "Three",
        "3": "Four",
        splice: function () {}
    };

    fail("for array", []);
    pass("for object", {});
    fail("for arguments", captureArgs());
    fail("for array like", arrayLike);
    msg("fail with descriptive message",
        "[refute.isArrayLike] Expected 1,2 not to be array like", [1, 2]);
    msg("fail with custom message",
        "[refute.isArrayLike] Hey: Expected 1,2 not to be array like",
        [1, 2], "Hey");
});

testHelper.assertionTests("assert", "defined", function (pass, fail, msg) {
    fail("for undefined", undefined);
    pass("for function", function () {});
    pass("for null", null);
    msg("fail with descriptive message",
        "[assert.defined] Expected to be defined", undefined);
    msg("fail with custom message",
        "[assert.defined] Huh? Expected to be defined",
        undefined, "Huh?");
});

testHelper.assertionTests("refute", "defined", function (pass, fail, msg) {
    pass("for undefined", undefined);
    fail("for function", function () {});
    fail("for null", null);
    msg("fail with descriptive message",
        "[refute.defined] Expected Hey (string) not to be defined",
        "Hey");
    msg("fail with custom message",
        "[refute.defined] Yawn... Expected Hey (string) not to be defined",
        "Hey", "Yawn...");
});

testHelper.assertionTests("assert", "isNull", function (pass, fail, msg) {
    pass("for null", null);
    fail("for function", function () {});
    fail("for undefined", undefined);
    msg("fail with descriptive message",
        "[assert.isNull] Expected Hey to be null", "Hey").expectedFormats = 1;
    msg("fail with custom message",
        "[assert.isNull] Hmm: Expected Hey to be null",
        "Hey", "Hmm").expectedFormats = 1;
});

testHelper.assertionTests("refute", "isNull", function (pass, fail, msg) {
    fail("for null", null);
    pass("for function", function () {});
    pass("for undefined", undefined);
    msg("fail with descriptive message",
        "[refute.isNull] Expected not to be null", null).expectedFormats = 0;
    msg("fail with custom message",
        "[refute.isNull] Here: Expected not to be null",
        null, "Here").expectedFormats = 0;
});

testHelper.assertionTests("assert", "match", function (pass, fail, msg) {
    pass("matching regexp", "Assertions", /[a-z]/);
    pass("for generic object with test method returning true", "Assertions", {
        test: function () {
            return true;
        }
    });

    fail("for non-matching regexp", "Assertions 123", /^[a-z]$/);
    pass("matching boolean", true, true);
    fail("mis-matching boolean", true, false);

    fail("for generic object with test method returning false", {
        test: function () {
            return false;
        }
    }, "Assertions");

    msg("fail with understandable message",
        "[assert.match] Assertions 123 expected to match /^[a-z]+$/",
        "Assertions 123", /^[a-z]+$/);

    msg("fail with custom message",
        "[assert.match] Yeah! Assertions 123 expected to match /^[a-z]+$/",
        "Assertions 123", /^[a-z]+$/, "Yeah!");

    fail("if match object is null", "Assertions 123", null);

    fail("if match object is undefined", "Assertions 123", undefined);

    fail("with custom message if match object is undefined",
        "Assertions 123", undefined, "No");

    fail("if match object is false", "Assertions 123", false);
    fail("if matching a number against a string", "Assertions 123", 23);
    fail("if matching a number against a similar string", "23", 23);
    pass("if matching a number against itself", 23, 23);

    pass("if matcher is a function that returns true",
        "Assertions 123", function () { return true; });

    fail("if matcher is a function that returns false",
        "Assertions 123", function () { return false; });

    fail("if matcher is a function that returns falsy",
        "Assertions 123", function () {});

    fail("if matcher does not return explicit true",
        "Assertions 123", function () { return "Hey"; });

    this["should call matcher with assertion argument"] = function () {
        var listener = this.stub().returns(true);

        referee.assert.match("Assertions 123", listener);

        sinon.assert.calledWith(listener, "Assertions 123");
    };

    pass("if matcher is substring of matchee", "Diskord", "or");
    pass("if matcher is string equal to matchee", "Diskord", "Diskord");
    pass("for strings ignoring case", "Look ma, case-insensitive",
        "LoOk Ma, CaSe-InSenSiTiVe");

    fail("if match string is not substring of matchee", "Vim", "Emacs");
    fail("if match string is not substring of object", {}, "Emacs");

    fail("if matcher is substring of object.toString", "Emacs", {
        toString: function () {
            return "Emacs";
        }
    });

    fail("for null and empty string", null, "");
    fail("for undefined and empty string", undefined, "");
    fail("for false and empty string", false, "");
    fail("for 0 and empty string", 0, "");
    fail("for NaN and empty string", NaN, "");

    var object = {
        id: 42,
        name: "Christian",
        doIt: "yes",

        speak: function () {
            return this.name;
        }
    };

    pass("if object contains all properties in matcher", object, {
        id: 42,
        doIt: "yes"
    });

    var object2 = {
        id: 42,
        name: "Christian",
        doIt: "yes",
        owner: {
            someDude: "Yes",
            hello: "ok"
        },

        speak: function () {
            return this.name;
        }
    };

    pass("for nested matcher", object2, {
        owner: {
            someDude: "Yes",
            hello: function (value) {
                return value === "ok";
            }
        }
    });

    pass("for empty strings", "", "");
    pass("for empty strings as object properties", { foo: "" }, { foo: "" });
    pass("for similar arrays", [1, 2, 3], [1, 2, 3]);
    pass("for array subset", [1, 2, 3], [2, 3]);
    pass("for single-element array subset", [1, 2, 3], [1]);
    pass("for matching array subset", [1, 2, 3, { id: 42 }], [{ id: 42 }]);
    fail("for mis-matching array 'subset'", [1, 2, 3], [2, 3, 4]);
    fail("for mis-ordered array 'subset'", [1, 2, 3], [1, 3]);
});

testHelper.assertionTests("refute", "match", function (pass, fail, msg) {
    fail("matching regexp", "Assertions", /[a-z]/);
    fail("generic object with test method returning true", "Assertions", {
        test: function () {
            return true;
        }
    });

    pass("for non-matching regexp", "Assertions 123", /^[a-z]$/);

    pass("for generic object with test method returning false", "Assertions", {
        test: function () {
            return false;
        }
    });

    msg("fail with understandable message",
        "[refute.match] Assertions 123 expected not to match /^.+$/",
        "Assertions 123", /^.+$/);
    msg("fail with custom message",
        "[refute.match] NO! Assertions 123 expected not to match /^.+$/",
        "Assertions 123", /^.+$/, "NO!");

    pass("if match object is null", "Assertions 123", null);
    pass("if match object is undefined", "Assertions 123", undefined);
    pass("if match object is false", "Assertions 123", false);
    pass("if matching a number against a string", "Assertions 123", 23);
    fail("if matching a number against a similar string", 23, "23");
    fail("if matching a number against itself", 23, 23);
    fail("if matcher is a function that returns true", "Assertions 123",
        function () { return true; });

    pass("if matcher is a function that returns false",
        "Assertions 123", function () { return false; });

    pass("if matcher is a function that returns falsy",
        "Assertions 123", function () {});

    pass("if matcher does not return explicit true",
        "Assertions 123", function () { return "Hey"; });

    this["should call matcher with assertion argument"] = function () {
        var listener = this.stub().returns(false);

        referee.refute.match("Assertions 123", listener);

        sinon.assert.calledWith(listener, "Assertions 123");
    };

    fail("if matcher is substring of matchee", "Diskord", "or");
    fail("if matcher is string equal to matchee", "Diskord", "Diskord");
    pass("if match string is not substring of matchee", "Vim", "Emacs");
    pass("if match string is not substring of object", {}, "Emacs");

    pass("if matcher is substring of object.toString", "Emacs", {
        toString: function () {
            return "Emacs";
        }
    });

    pass("if matching an empty string with null", null, "");
    pass("if matching an empty string with undefined", undefined, "");
    pass("if matching an empty string with false", false, "");
    pass("if matching an empty string with 0", 0, "");
    pass("if matching an empty string with NaN", NaN, "");

    var object = {
        id: 42,
        name: "Christian",
        doIt: "yes",

        speak: function () {
            return this.name;
        }
    };

    fail("if object contains all properties in matcher", object, {
        id: 42,
        doIt: "yes"
    });

    var object2 = {
        id: 42,
        name: "Christian",
        doIt: "yes",
        owner: {
            someDude: "Yes",
            hello: "ok"
        },

        speak: function () {
            return this.name;
        }
    };

    fail("for nested matcher", object2, {
        owner: {
            someDude: "Yes",
            hello: function (value) {
                return value === "ok";
            }
        }
    });

    var object3 = {
        id: 42,
        name: "Christian",
        doIt: "yes",
        owner: {
            someDude: "Yes",
            hello: "ok"
        },

        speak: function () {
            return this.name;
        }
    };

    pass("for nested matcher with mismatching properties", object3, {
        owner: {
            someDude: "No",
            hello: function (value) {
                return value === "ok";
            }
        }
    });

    fail("for similar arrays", [1, 2, 3], [1, 2, 3]);
    fail("for array subset", [1, 2, 3], [2, 3]);
    fail("for single-element array subset", [1, 2, 3], [1]);
    fail("for matching array subset", [1, 2, 3, { id: 42 }], [{ id: 42 }]);
    pass("for mis-matching array 'subset'", [1, 2, 3], [2, 3, 4]);
    pass("for mis-ordered array 'subset'", [1, 2, 3], [1, 3]);
});

testHelper.assertionTests("assert", "keys", function (pass, fail, msg) {
    function Class(o) {
        for (var key in o) {
            if (o.hasOwnProperty(key)) {
                this[key] = o[key];
            }
        }
    }
    Class.prototype.methodA = function () {};
    Class.prototype.methodB = function () {};

    pass("when keys are exact", {a: 1, b: 2, c: 3}, ["a", "b", "c"]);
    fail("when keys are missing", {a: 1, b: 2, c: 3}, ["a", "b"]);
    fail("when keys are excess", {a: 1, b: 2, c: 3}, ["a", "b", "c", "d"]);
    fail("when keys are not exact", {a: 1, b: 2, c: 3}, ["a", "b", "d"]);
    pass("when there are no keys", {}, []);
    pass("when values are special", {a: -1, b: null, c: undefined}, ["a", "b", "c"]);
    pass("and ignore object methods", new Class({a: 1, b: 2, c: 3}), ["a", "b", "c"]);
    pass("and allow overwriting object methods",
        new Class({a: 1, methodA: 2}), ["a", "methodA"]);

    msg("fail with message",
        "[assert.keys] Expected [object Object] to have exact keys a,b",
        {a: 1, b: 2, c: 3}, ["a", "b"]);

    msg("fail with custom message",
        "[assert.keys] Too bad: Expected [object Object] to have exact keys a,b",
        {a: 1, b: 2, c: 3}, ["a", "b"], "Too bad");
});

testHelper.assertionTests("refute", "keys", function (pass, fail, msg) {
    function Class(o) {
        for (var key in o) {
            if (o.hasOwnProperty(key)) {
                this[key] = o[key];
            }
        }
    }
    Class.prototype.methodA = function () {};
    Class.prototype.methodB = function () {};

    fail("when keys are exact", {a: 1, b: 2, c: 3}, ["a", "b", "c"]);
    pass("when keys are missing", {a: 1, b: 2, c: 3}, ["a", "b"]);
    pass("when keys are excess", {a: 1, b: 2, c: 3}, ["a", "b", "c", "d"]);
    pass("when keys are not exact", {a: 1, b: 2, c: 3}, ["a", "b", "d"]);
    fail("when there are no keys", {}, []);
    fail("when values are special", {a: -1, b: null, c: undefined}, ["a", "b", "c"]);
    fail("and ignore object methods", new Class({a: 1, b: 2, c: 3}), ["a", "b", "c"]);
    fail("and allow overwriting object methods",
        new Class({a: 1, methodA: 2}), ["a", "methodA"]);

    msg("fail with message",
        "[refute.keys] Expected not to have exact keys a,b,c",
        {a: 1, b: 2, c: 3}, ["a", "b", "c"]);

    msg("fail with custom message",
        "[refute.keys] Too bad: Expected not to have exact keys a,b,c",
        {a: 1, b: 2, c: 3}, ["a", "b", "c"], "Too bad");
});

testHelper.assertionTests("assert", "exception", function (pass, fail, msg) {
    pass("when callback throws", function () { throw new Error(); });
    fail("when callback does not throw", function () {});

    msg("fail with message", "[assert.exception] Expected exception",
        function () {}).expectedFormats = 0;

    pass("when callback throws expected name", function () {
        throw new TypeError("Oh hmm");
    }, { name: "TypeError" });

    fail("when callback does not throw expected name", function () {
        throw new Error();
    }, { name: "TypeError" });

    fail("when thrown message does not match", function () {
        throw new Error("Aright");
    }, { message: "Aww" });

    pass("when message and type matches", function () {
        throw new TypeError("Aright");
    }, { name: "Type", message: "Ar" });

    fail("when callback does not throw and specific type is expected",
        function () {}, { name: "TypeError" });

    msg("fail with message when not throwing",
        "[assert.exception] Expected [object Object] but no exception was thrown",
        function () {}, { name: "TypeError" }).expectedFormats = 1;

    msg("fail with custom message",
        "[assert.exception] Hmm: Expected exception",
        function () {}, "Hmm").expectedFormats = 0;

    msg("fail with matcher and custom message",
        "[assert.exception] Hmm: Expected [object Object] but no exception was thrown",
        function () {}, { name: "TypeError" }, "Hmm").expectedFormats = 1;

    pass("when matcher function returns true", function () {
        throw new TypeError("Aright");
    }, function (err) { return err.name === "TypeError"; });

    fail("when matcher function returns truthy", function () {
        throw new TypeError("Aright");
    }, function (err) { return err.name; });

    fail("when matcher function returns false", function () {
        throw new TypeError("Aright");
    }, function (err) { return err.name === "Error"; });

    msg("when matcher function fails",
        "[assert.exception] Expected thrown TypeError (Aright) to pass matcher function",
        function () {
            throw new TypeError("Aright");
        }, function (err) { return err.name === "Error"; }).expectedFormats = 0;

    msg("if not passed arguments",
        "[assert.exception] Expected to receive at least 1 argument");
});


testHelper.assertionTests("refute", "exception", function (pass, fail, msg) {
    fail("when callback throws", function () {
        throw new Error("Yo, Malcolm");
    });

    pass("when callback does not throw", function () {});
    pass("with message when callback does not throw", function () {}, "Oh noes");

    msg("fail with message",
        "[refute.exception] Expected not to throw but threw Error (:()",
        function () { throw new Error(":("); });

    msg("fail with custom message",
        "[refute.exception] Jeez: Expected not to throw but threw Error (:()",
        function () {
            throw new Error(":(");
        }, "Jeez");

    msg("fail if not passed arguments",
        "[refute.exception] Expected to receive at least 1 argument");
});

testHelper.assertionTests("assert", "tagName", function (pass, fail, msg) {
    pass("for matching tag names", { tagName: "li" }, "li");
    pass("for case-insensitive matching tag names", { tagName: "LI" }, "li");
    pass("for case-insensitive matching tag names #2", { tagName: "li" }, "LI");
    pass("for uppercase matching tag names", { tagName: "LI" }, "LI");
    fail("for non-matching tag names", { tagName: "li" }, "p");
    fail("for substring matches in tag names", { tagName: "li" }, "i");

    msg("fail with message",
        "[assert.tagName] Expected tagName to be p but was li",
        { tagName: "li" }, "p");

    msg("fail with custom message",
        "[assert.tagName] Here: Expected tagName to be p but was li",
        { tagName: "li" }, "p", "Here");

    msg("fail if not passed arguments",
        "[assert.tagName] Expected to receive at least 2 arguments");

    msg("fail if not passed tag name",
        "[assert.tagName] Expected to receive at least 2 arguments",
        { tagName: ""}).expectedFormats = 0;

    msg("fail if object does not have tagName property",
        "[assert.tagName] Expected [object Object] to have tagName property",
        {}, "li");

    msg("fail with custom message if object does not have tagName property",
        "[assert.tagName] Yikes! Expected [object Object] to have tagName property",
        {}, "li", "Yikes!");

    if (typeof document !== "undefined") {
        pass("for DOM elements", document.createElement("li"), "li");
    }
});

testHelper.assertionTests("refute", "tagName", function (pass, fail, msg) {
    fail("for matching tag names", { tagName: "li" }, "li");
    fail("for case-insensitive matching tag names", { tagName: "LI" }, "li");
    fail("for case-insensitive matching tag names #2", { tagName: "LI" }, "li");
    fail("for same casing matching tag names", { tagName: "li" }, "li");
    pass("for non-matching tag names", { tagName: "li" }, "p");
    pass("for substring matching tag names", { tagName: "li" }, "i");
    pass("for case-insensitive non-matching tag names", { tagName: "li" }, "P");
    pass("for case-insensitive substring mathcing tag names",
        { tagName: "li" }, "i");

    msg("fail with message",
        "[refute.tagName] Expected tagName not to be li",
        { tagName: "li" }, "li");

    msg("fail with custom message",
        "[refute.tagName] Oh well: Expected tagName not to be li",
        { tagName: "li" }, "li", "Oh well");

    msg("fail if not passed arguments",
        "[refute.tagName] Expected to receive at least 2 arguments");

    msg("fail if not passed tag name",
        "[refute.tagName] Expected to receive at least 2 arguments",
        { tagName: "p" }).expectedFormats = 0;

    msg("fail if object does not have tagName property",
        "[refute.tagName] Expected [object Object] to have tagName property",
        {}, "li");

    msg("fail with custom message if object does not have tagName property",
        "[refute.tagName] Yes: Expected [object Object] to have tagName property",
        {}, "li", "Yes");

    if (typeof document !== "undefined") {
        pass("for DOM elements", document.createElement("li"), "p");
    }
});

testHelper.assertionTests("assert", "className", function (pass, fail, msg) {
    msg("fail without arguments",
        "[assert.className] Expected to receive at least 2 arguments");

    msg("fail without class name",
        "[assert.className] Expected to receive at least 2 arguments",
        { className: "" }).expectedFormats = 0;

    msg("fail if object does not have className property",
        "[assert.className] Expected object to have className property",
        {}, "item");

    msg("fail with custom message if object does not have className property",
        "[assert.className] Nope: Expected object to have className property",
        {}, "item", "Nope");

    msg("fail when element does not include class name",
        "[assert.className] Expected object's className to include item but was ",
        { className: "" }, "item");

    msg("fail with custom message when element does not include class name",
        "[assert.className] Come on! Expected object's className to include item but was ",
        { className: "" }, "item", "Come on!");

    pass("when element's class name matches", { className: "item" }, "item");
    pass("when element includes class name", { className: "feed item" }, "item");
    fail("when element does not include all class names",
        { className: "feed item" }, "item post");

    pass("when element includes all class names",
        { className: "feed item post" }, "item post");

    pass("when element includes all class names in different order",
        { className: "a b c d e" }, "e a d");

    pass("with class names as array", { className: "a b c d e" }, ["e", "a", "d"]);

    if (typeof document !== "undefined") {
        var li = document.createElement("li");
        li.className = "some thing in here";

        pass("for DOM elements", li, "thing some");
    }
});

testHelper.assertionTests("refute", "className", function (pass, fail, msg) {
    msg("fail without arguments",
        "[refute.className] Expected to receive at least 2 arguments");

    msg("fail without class name",
        "[refute.className] Expected to receive at least 2 arguments",
        { className: "item" }).expectedFormats = 0;

    msg("fail if object does not have className property",
        "[refute.className] Expected object to have className property",
        {}, "item");

    msg("fail with custom message if object does not have className property",
        "[refute.className] Yikes: Expected object to have className property",
        {}, "item", "Yikes");

    pass("when element does not include class name", { className: "" }, "item");

    msg("fail when element's class name matches",
        "[refute.className] Expected object's className not to include item",
        { className: "item" }, "item");

    msg("fail with custom message when element's class name matches",
        "[refute.className] Noes: Expected object's className not to include item",
        { className: "item" }, "item", "Noes");

    fail("when element includes class name", { className: "feed item" }, "item");
    pass("when element does not include all class names",
        { className: "feed item" }, "item post");
    fail("when element includes all class names",
        { className: "feed item post" }, "item post");
    fail("when element includes all class names in different order",
        { className: "a b c d e" }, "e a d");
    fail("with class names as array", { className: "a b c d e" }, ["e", "a", "d"]);
    pass("with class names as array", { className: "a b c d e" }, ["f", "a", "d"]);

    if (typeof document !== "undefined") {
        var li = document.createElement("li");
        li.className = "some thing in here";

        pass("for DOM elements", li, "something");
    }
});

testHelper.assertionTests("assert", "near", function (pass, fail, msg) {
    pass("for equal numbers", 3, 3, 0);
    fail("for numbers out of delta range", 2, 3, 0.5);
    msg("fail with descriptive message",
        "[assert.near] Expected 3 to be equal to 2 +/- 0.6", 3, 2, 0.6);
    msg("fail with custom message",
        "[assert.near] Ho! Expected 3 to be equal to 2 +/- 0.6",
        3, 2, 0.6, "Ho!");
    pass("for numbers in delta range", 2, 3, 1);
    msg("fail if not passed arguments",
        "[assert.near] Expected to receive at least 3 arguments");
});

testHelper.assertionTests("refute", "near", function (pass, fail, msg) {
    fail("for equal numbers", 3, 3, 0);
    pass("for numbers out of delta range", 2, 3, 0.5);
    msg("with descriptive message",
        "[refute.near] Expected 3 not to be equal to 3 +/- 0", 3, 3, 0);
    msg("with custom message",
        "[refute.near] Hey: Expected 3 not to be equal to 3 +/- 0",
        3, 3, 0, "Hey");
    fail("for numbers in delta range", 2, 3, 1);
    msg("fail if not passed arguments",
        "[refute.near] Expected to receive at least 3 arguments");
});

function MyThing() {}
var myThing = new MyThing();
var otherThing = {};
function F() {}
F.prototype = myThing;
var specializedThing = new F();

testHelper.assertionTests("assert", "hasPrototype", function (pass, fail, msg) {
    fail("when object does not inherit from prototype", otherThing, MyThing.prototype);
    fail("when primitive does not inherit from prototype", 3, MyThing.prototype);
    fail("with only one object", {});
    pass("when object has other object on prototype chain", myThing, MyThing.prototype);
    pass("when not directly inheriting", specializedThing, MyThing.prototype);
    msg("with descriptive message",
        "[assert.hasPrototype] Expected [object Object] to have [object Object] on its prototype chain", otherThing, MyThing.prototype);
    msg("with custom message",
        "[assert.hasPrototype] Oh: Expected [object Object] to have [object Object] on its prototype chain",
        otherThing, MyThing.prototype, "Oh");
    msg("fail if not passed arguments",
        "[assert.hasPrototype] Expected to receive at least 2 arguments");
});

testHelper.assertionTests("refute", "hasPrototype", function (pass, fail, msg) {
    fail("when object inherits from prototype", myThing, MyThing.prototype);
    fail("when not inheriting 'indirectly'", specializedThing, MyThing.prototype);
    fail("with only one object", {});
    pass("when primitive does not inherit from prototype", 3, MyThing.prototype);
    pass("when object does not inherit", otherThing, MyThing.prototype);
    msg("with descriptive message",
        "[refute.hasPrototype] Expected [object Object] not to have [object Object] on its prototype chain", myThing, MyThing.prototype);
    msg("with descriptive message",
        "[refute.hasPrototype] Oh: Expected [object Object] not to have [object Object] on its prototype chain",
        myThing, MyThing.prototype, "Oh");
    msg("fail if not passed arguments",
        "[refute.hasPrototype] Expected to receive at least 2 arguments");
});

testHelper.assertionTests("assert", "contains", function (pass, fail, msg) {
    pass("when array contains value", [0, 1, 2], 1);
    fail("when array does not contain value", [0, 1, 2], 3);
    msg("with descriptive message",
        "[assert.contains] Expected [0,1,2] to contain 3", [0, 1, 2], 3);
    var thing = {};
    var someOtherThing = {};
    pass("when array contains the actual object", [thing], thing);
    fail("when array contains different object with same value",
        [thing], someOtherThing);
});

testHelper.assertionTests("refute", "contains", function (pass, fail, msg) {
    fail("when array contains value", [0, 1, 2], 1);
    pass("when array does not contain value", [0, 1, 2], 3);
    msg("with descriptive message",
        "[refute.contains] Expected [0,1,2] not to contain 2", [0, 1, 2], 2);
    var thing = {};
    var someOtherThing = {};
    fail("when array contains the actual object", [thing], thing);
    pass("when array contains different object with same value",
        [thing], someOtherThing);
});

testHelper.assertionTests("assert", "json", function (pass, fail, msg) {
    pass("when json string equals object", "{\"key\":\"value\"}", { key: "value" });
    fail("when json string does not equal object", "{\"key\":\"value\"}", { key: "different" });
    msg("with descriptive message",
        "[assert.json] Expected {\"key\":\"value\"} to equal {\"key\":\"different\"}",
        "{\"key\":\"value\"}", { key: "different" });
    fail("when json string cannot be parsed", "{something:not parsable}", {});
    msg("with descriptive message on parse error",
        "[assert.json] Expected {something:not parsable} to be valid JSON",
        "{something:not parsable}", {});
});

testHelper.assertionTests("refute", "json", function (pass, fail, msg) {
    fail("when json string equals object", "{\"key\":\"value\"}", { key: "value" });
    pass("when json string does not equal object", "{\"key\":\"value\"}", { key: "different" });
    msg("with descriptive message",
        "[refute.json] Expected {\"key\":\"value\"} not to equal {\"key\":\"value\"}",
        "{\"key\":\"value\"}", { key: "value" });
    fail("when json string cannot be parsed", "{something:not parsable}", {});
    msg("with descriptive message on parse error",
        "[refute.json] Expected {something:not parsable} to be valid JSON",
        "{something:not parsable}", {});
});

testHelper.assertionTests("assert", "matchJson", function (pass, fail, msg) {
    pass("when json string matches object", "{\"key\":\"value\",\"and\":42}", { key: "value" });
    fail("when json string does not equal object", "{\"key\":\"value\",\"and\":42}", { key: "different" });
    msg("with descriptive message",
        "[assert.matchJson] Expected {\"key\":\"value\",\"and\":42} to match {\"key\":\"different\"}",
        "{\"key\":\"value\",\"and\":42}", { key: "different" });
    fail("when json string cannot be parsed", "{something:not parsable}", {});
    msg("with descriptive message on parse error",
        "[assert.matchJson] Expected {something:not parsable} to be valid JSON",
        "{something:not parsable}", {});
});

testHelper.assertionTests("refute", "matchJson", function (pass, fail, msg) {
    fail("when json string equals object", "{\"key\":\"value\",\"and\":42}", { key: "value" });
    pass("when json string does not equal object", "{\"key\":\"value\",\"and\":42}", { key: "different" });
    msg("with descriptive message",
        "[refute.matchJson] Expected {\"key\":\"value\",\"and\":42} not to match {\"key\":\"value\"}",
        "{\"key\":\"value\",\"and\":42}", { key: "value" });
    fail("when json string cannot be parsed", "{something:not parsable}", {});
    msg("with descriptive message on parse error",
        "[refute.matchJson] Expected {something:not parsable} to be valid JSON",
        "{something:not parsable}", {});
});

*/
testHelper.assertionTests("assert", "rejects", function (pass, fail, msg) {
    pass("when promise rejects", Promise.reject());
    fail("when promise resolves", Promise.resolve());
    // pass("when json string does not equal object", "{\"key\":\"value\",\"and\":42}", { key: "different" });
    // msg("with descriptive message",
        // "[refute.matchJson] Expected {\"key\":\"value\",\"and\":42} not to match {\"key\":\"value\"}",
        // "{\"key\":\"value\",\"and\":42}", { key: "value" });
    // fail("when json string cannot be parsed", "{something:not parsable}", {});
    // msg("with descriptive message on parse error",
        // "[refute.matchJson] Expected {something:not parsable} to be valid JSON",
        // "{something:not parsable}", {});
});
