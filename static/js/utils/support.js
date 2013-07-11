/**
 * @module utils/support
 * @description Support utility to identify what the current browser is capable of.
 */
define('utils/support', function () {

    var support = {

        features: [],

        registerFeature: function (key, value) {
            if (!this.features[key]) {
                this.features[key] = value;
            }

            return this.features[key];
        },

        featureCompatibility: function (key) {
            var ret = null,
                feature = this.features[key];

            if (!feature) {
                return;
            }

            if (typeof feature !== 'function') {
                ret = feature;
            } else {
                ret = feature();
                this.features[key] = ret;
            }

            return ret;
        },

        /**
         * @method Test whether browser supports the given CSS property.
         * @param {string} prop - Name of CSS property to test. Must be in CamelCase i.e. "borderRadius".
         * @return {boolean}
         */
        cssProperty: function (prop) {
            // create element to peform property detection against
            var el = document.createElement("div"),
                i,
                prefixes = [
                    "Webkit",   // Chrome & Safari
                    "Moz",      // Firefox
                    "O",        // Opera
                    "Ms",       // IE
                    "Khtml"     // Konqueror
                ];

            // test standard property name first
            if (el.style[prop] !== undefined) {
                return true;
            }

            prop = prop.charAt(0).toUpperCase() + prop.slice(1);

            for (i in prefixes) {
                if (prefixes.hasOwnProperty(i) && el.style[prefixes[i] + prop] !== undefined) {
                    return true;
                }
            }
            return false;
        },

        /**
         * @method userInterface
         * @param  {string} prop
         * @return {Boolean}
         */
        userInterface: function (prop) {
            var el = document.createElement('div');

            if (prop === 'touch') {
                prop = 'gesturestart';
            }

            el.setAttribute('on' + prop, 'return;');

            if (typeof el['on' + prop] === "function") {
                return true;
            }
            return false;
        }
    };

    return support;
});
