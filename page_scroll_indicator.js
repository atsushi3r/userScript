// ==UserScript==
// @name         Page Scroll Indicator
// @namespace    page_scroll_indicator
// @version      1.0
// @description  Add page scroll indicator at the bottom right.
// @author       atsushi3r
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

window.addEventListener('DOMContentLoaded', () => {
    'use strict';
    console.log('UserScript: Add Page Scroll Indicator');
    let scrollTop
    let scrollHeight;
    let ticking = false;
    const scrollIndicator = document.createElement('input');
    const scrollElem = document.scrollingElement;

    function updateIndicator() {
        scrollTop = scrollElem.scrollTop;
        scrollHeight = scrollElem.scrollHeight - scrollElem.clientHeight;
        if (scrollHeight === 0) {
            scrollIndicator.value = '';
            return;
        }
        scrollIndicator.value =
            String(Math.floor(scrollTop / scrollHeight * 100)).padStart(2);
    }

    updateIndicator();
    scrollIndicator.style.cssText = `
        position: fixed;
        bottom: 0;
        right: 0;
        margin: 5px;
        color: inherit;
        background: none;
        border: none;
        text-align: center;
        width: 2em;
        z-index: 99999;
        filter: drop-shadow(white 0px 0px 1px)
                drop-shadow(white 0px 0px 1px)
                drop-shadow(white 0px 0px 1px)
                drop-shadow(white 0px 0px 1px);
    `;
    scrollIndicator.addEventListener('keypress', function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            scrollElem.scrollTop = this.value / 100 * scrollHeight;
            this.blur();
        }
    });
    document.body.appendChild(scrollIndicator);

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateIndicator();
                ticking = false;
            });
            ticking = true;
        }
    });
    window.addEventListener('resize', function() {
        updateIndicator();
    });
});
