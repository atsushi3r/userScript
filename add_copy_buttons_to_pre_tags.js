// ==UserScript==
// @name         Add Copy Buttons to Pre Tags
// @namespace    add_copy_buttons_to_pre_tags
// @version      1.8
// @description  Add copy buttons to pre tags
// @author       atsushi3r
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

window.addEventListener('DOMContentLoaded', function () {
    'use strict';
    console.log('UserScript: Add Copy Buttons to Pre Tags');
    let pres = document.getElementsByTagName('pre');
    if (pres.length < 1) {
        return;
    }

    let style = document.createElement('style');
    style.innerHTML = `
.add-copy-buttons-to-pre-tags-parent {
    position: relative;
}

button.add-copy-buttons-to-pre-tags-btn {
    position: absolute;
    right: 0;
    border: none;
    background: none;
    box-shadow: none;
    white-space: nowrap;
    font-size: 18px;
    line-height: 1;
    height: 22px;
    min-height: 0;
    min-width: 0;
    margin: 5px;
    padding-top: 0;
    padding-bottom: 0;
    overflow: visible;
    outline: none;
    z-index: 9;
}

button.add-copy-buttons-to-pre-tags-btn.dark {
    color: #fefef6;
}

button.add-copy-buttons-to-pre-tags-btn.light {
    color: #555;
}

button.add-copy-buttons-to-pre-tags-btn.dark:hover, button.add-copy-buttons-to-pre-tags-btn.dark:focus {
    color: #ddd;
    background: none;
    box-shadow: none;
}

button.add-copy-buttons-to-pre-tags-btn.light:hover, button.add-copy-buttons-to-pre-tags-btn.light:focus {
    color: #888;
    background: none;
    box-shadow: none;
}

button.add-copy-buttons-to-pre-tags-btn.dark:active, button.add-copy-buttons-to-pre-tags-btn.light:active {
    color:#aaa;
}

button.add-copy-buttons-to-pre-tags-btn > svg {
    fill: currentColor;
    width: 18px;
    height: 18px;
    margin: 2px;
}

span.add-copy-buttons-to-pre-tags-balloon {
    font-size: 12px;
    line-height: 1;
    position: absolute;
    top: 0;
    left: -50px;
    width: 45px;
    display: none;
    padding: 5px;
    opacity: 0;
    border-radius: 5px;
    animation: 0.3s ease show-balloon;
}

button.add-copy-buttons-to-pre-tags-btn.dark > span.add-copy-buttons-to-pre-tags-balloon {
    color: #555;
    background-color: #fefef6;
}

button.add-copy-buttons-to-pre-tags-btn.light > span.add-copy-buttons-to-pre-tags-balloon {
    color: #fefef6;
    background-color: #555;
}

button.add-copy-buttons-to-pre-tags-btn:hover > span.add-copy-buttons-to-pre-tags-balloon {
    display: block;
    opacity: 1;
}

span.add-copy-buttons-to-pre-tags-balloon > span {
    color: inherit;
    background: inherit;
}

@keyframes show-balloon {
    0% {
        display: none;
        opacity: 0;
        left: -45px;
    }
    1% {
        display: block;
        opacity: 0;
        left: -45px;
    }
    100% {
        display: block;
        opacity: 1;
        left: -50px;
    }
}
`;
    document.head.appendChild(style);

    function copyPreContent(event) {
        event.preventDefault();
        let id = this.getAttribute('add-copy-buttons-to-pre-tags-id');
        let target = this.parentElement.querySelector(`pre[add-copy-buttons-to-pre-tags-id="${id}"]`);
        document.getSelection().selectAllChildren(target);
        document.execCommand('copy');
        document.getSelection().empty();
        this.querySelector('span > span:first-child').style.display = 'none';
        this.querySelector('span > span:last-child').style.display = 'block';
        this.blur();
        window.setTimeout(resetBalloon, 1500, this);
    }

    function resetBalloon(btn) {
        btn.querySelector('span > span:first-child').style.display = 'block';
        btn.querySelector('span > span:last-child').style.display = 'none';
    }

    function getBrightness(elem) {
        let elemcolor = window.getComputedStyle(elem).backgroundColor
                        .match(/([0-1]?[.][0-9]+|[0-9]+)/g).map(Number);
        if (elemcolor.length === 4) {
            let parentbrightness = getBrightness(elem.parentElement);
            let elembrightness =
                elemcolor.slice(0, 3).reduce((sum, val) => sum + val) / 3;
            return (1 - elemcolor[3]) * parentbrightness +
                   elemcolor[3] * elembrightness;

        }
        return elemcolor.reduce((sum, val) => sum + val) / 3;
    }

    for (let i = 0; i < pres.length; i++) {
        if (pres[i].style.display === 'none') {
            return;
        }
        pres[i].setAttribute('add-copy-buttons-to-pre-tags-id', String(i));
        let btn = document.createElement('button');
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg><span class="add-copy-buttons-to-pre-tags-balloon"><span style="font-size:12px;line-height:1;">Copy</span><span style="font-size:12px;line-height:1;display:none;">Done!</span></span>';
        btn.setAttribute('add-copy-buttons-to-pre-tags-id', String(i));
        let brightness = getBrightness(pres[i]);
        if (brightness < 128) {
            btn.className = 'add-copy-buttons-to-pre-tags-btn dark';
        } else {
            btn.className = 'add-copy-buttons-to-pre-tags-btn light';
        }
        btn.tabIndex = -1;
        btn.addEventListener('click', copyPreContent, false);
        let parent = pres[i].parentElement;
        let adjacent = pres[i];
        if (window.getComputedStyle(parent).overflow !== 'visible') {
            adjacent = parent;
            parent = parent.parentElement;
        }
        parent.classList.add('add-copy-buttons-to-pre-tags-parent');
        let pre_marginTop =
                parseInt(window.getComputedStyle(pres[i]).marginTop);
        btn.style.marginTop =
                pre_marginTop + 5 + 'px';
        let parent_paddingRight =
                parseInt(window.getComputedStyle(parent).paddingRight);
        let pre_marginRight =
                parseInt(window.getComputedStyle(pres[i]).marginRight);
        btn.style.marginRight =
                parent_paddingRight + pre_marginRight + 5 + 'px';
        parent.insertBefore(btn, adjacent);
    }
});
