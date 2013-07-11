define('utils/logging', function () {
    /**
     * @module utils/logging
     * @description  Handles if messages should be shown, and if a native console is available.
     * @private
     * @param {string} method - a string which represents what kind of log message is being sent (eg: log, info, warn)
     * @param {array} argumentArray - an array of arguments being sent to be logged (the array items can be any type)
     */
    var _logMessage = function (method, argumentArray) {

        // Checking if console is availible
        // Also checking if the popup should be used in preference
        if (!!window.console && !!window.console[method]) {

            // Checking for standards compliant console function.
            if (typeof window.console[method] === 'function') {
                window.console[method].apply(window.console, argumentArray);
            } else { // Checking for IE console (rare)
                window.console[method](Array.prototype.join.call(argumentArray, ' '));
            }
        }
    };

    /**
     * @description Attaching "logging._logMessage('log', arguments)" to the log on the global namespace
     * @method log
     * @global
     * @type {function}
     * @example log('string', {object: {}}, 1); // RESULTS in console log message: "string", {object: {}}, 1
     */
    window.log = window.log || function () {
        _logMessage('log', arguments);
    };

    /**
     * @description Attaching "logging._logMessage('info', arguments)" to the info on the global namespace
     * @method info
     * @global
     * @type {function}
     * @example info('string', {object: {}}, 1); // RESULTS in console info message: "string", {object: {}}, 1
     */
    window.info = window.info || function () {
        _logMessage('info', arguments);
    };

    /**
     * @description Attaching "logging._logMessage('warn', arguments)" to the warn on the global namespace
     * @method warn
     * @global
     * @type {function}
     * @example warn('string', {object: {}}, 1); // RESULTS in console warning message: "string", {object: {}}, 1
     */
    window.warn = window.warn || function () {
        _logMessage('warn', arguments);
    };

    /**
     * @description Attaching "logging._logMessage('error', arguments)" to the error on the global namespace
     * @method error
     * @global
     * @type {function}
     * @example error('string', {object: {}}, 1); // RESULTS in console error message: "string", {object: {}}, 1
     */
    window.error = window.error || function () {
        _logMessage('error', arguments);
    };
});