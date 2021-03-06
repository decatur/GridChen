// Must be loaded as script, not module!

(function () {
    "use strict";

    function applyScheme() {
        // We avoid a https://en.wikipedia.org/wiki/Flash_of_unstyled_content
        let colorScheme = window.localStorage.getItem('colorScheme');
        if (colorScheme === 'dark' || colorScheme === 'light') {
            const styleSheet = /** @type {CSSStyleSheet} */ document.styleSheets[0];
            const m = {};
            for (let index = styleSheet.cssRules.length - 1; index >= 0; index--) {
                const rule = styleSheet.cssRules[index];
                if (rule.conditionText && rule.conditionText.startsWith("(prefers-color-scheme:")) {
                    styleSheet.deleteRule(index);
                    m[rule.conditionText] = rule;
                }
            }

            const feature = `(prefers-color-scheme: ${colorScheme})`;
            if (!(feature in m)) {
                return
            }

            for (const rule of m[feature].cssRules) {
                styleSheet.insertRule(rule.cssText);
            }
        }
    }

    window.onload = function () {
        const colorSchemeElement = /** @type {HTMLSelectElement} */ document.getElementById('colorScheme');
        if (!colorSchemeElement) {
            return
        }
        const colorScheme = window.localStorage.getItem('colorScheme') || 'preferred';

        colorSchemeElement.namedItem(colorScheme).selected = true;
        colorSchemeElement.onchange = function () {
            window.localStorage.setItem('colorScheme', colorSchemeElement.value);
            //applyScheme();
            location.reload();
        }
    };

    applyScheme();

})();



