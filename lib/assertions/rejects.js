"use strict";

var captureException = require("../capture-exception");

module.exports = function (referee) {
    referee.captureException = captureException;

    referee.add("rejects", {
        assert: function (promise) {
            var matcher = arguments[1];
            var customMessage = arguments[2];

            if (typeof matcher === "string") {
                customMessage = matcher;
                matcher = undefined;
            }

            this.expected = matcher;
            this.customMessage = customMessage;

            var self = this;

            console.log("####", promise); // eslint-disable-line
            var result = promise
                .then(
                    function () {
                        if (typeof matcher === "object") {
                            self.fail("typeNoExceptionMessage");
                        }

                        self.fail("message");
                    },
                    function (err) {
                        if (!err && !matcher) {
                            return;
                        }

                        if (typeof matcher === "object" && !referee.match(err, matcher)) {
                            self.fail("typeFailMessage");
                        }

                        if (typeof matcher === "function" && matcher(err) !== true) {
                            self.fail("matchFailMessage");
                        }
                    }
                )
            ;
            console.log("####=====>", result); // eslint-disable-line
            return result;
        },

        refute: function (promise) {
            var self = this;

            this.customMessage = arguments[1];

            return promise
                .catch(function (err) {
                    self.actualExceptionType = err.name;
                    self.actualExceptionMessage = err.message;
                })
            ;

            /*
            if (err) {
                this.customMessage = arguments[1];
                this.actualExceptionType = err.name;
                this.actualExceptionMessage = err.message;
                return false;
            }

            return true;
            */
        },

        expectation: "toThrow",
        assertMessage: "${customMessage}Expected rejection",
        refuteMessage: "${customMessage}Expected not to throw but threw ${actualExceptionType} (${actualExceptionMessage})"
    });

    referee.assert.exception.typeNoExceptionMessage = "${customMessage}Expected ${expected} but no exception was thrown";
    referee.assert.exception.typeFailMessage = "${customMessage}Expected ${expected} but threw ${actualExceptionType} (${actualExceptionMessage})\n${actualExceptionStack}";
    referee.assert.exception.matchFailMessage = "${customMessage}Expected thrown ${actualExceptionType} (${actualExceptionMessage}) to pass matcher function";
};
