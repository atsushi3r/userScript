// ==UserScript==
// @name         Add Copy Buttons to Pre Tags
// @namespace    add_copy_buttons_to_pre_tags
// @version      1.6.3
// @description  Add copy buttons to pre tags
// @author       atsushi3r
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

window.addEventListener('load', function () {
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
    position: absolute;
    top: 0;
    left: -50px;
    width: 45px;
    display: none;
    padding: 5px;
    margin-top: 1px;
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
    }

    function resetBalloon(event) {
        this.querySelector('span > span:first-child').style.display = 'block';
        this.querySelector('span > span:last-child').style.display = 'none';
    }

    for (let i = 0; i < pres.length; i++) {
        if (pres[i].style.display === 'none') {
            return;
        }
        pres[i].setAttribute('add-copy-buttons-to-pre-tags-id', String(i));
        let btn = document.createElement('button');
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg><span class="add-copy-buttons-to-pre-tags-balloon"><span>Copy</span><span style="display:none;">Done!</span></span>';
        btn.setAttribute('add-copy-buttons-to-pre-tags-id', String(i));
        let brightness =
            window.getComputedStyle(pres[i]).backgroundColor
                .match(/[0-9]+\.?[0-9]*/g)
                .reduce((avg, str) => {return avg + Number(str)/3}, 0);
        if (brightness < 128) {
            btn.className = 'add-copy-buttons-to-pre-tags-btn dark';
        } else {
            btn.className = 'add-copy-buttons-to-pre-tags-btn light';
        }
        btn.tabIndex = -1;
        btn.addEventListener('click', copyPreContent, false);
        btn.addEventListener('blur', resetBalloon, false);
        let parent = pres[i].parentElement;
        if (window.getComputedStyle(parent).overflow !== 'visible') {
            let grandparent = parent.parentElement;
            grandparent.classList.add('add-copy-buttons-to-pre-tags-parent');
            btn.style.marginRight = parseInt(window.getComputedStyle(grandparent).paddingRight) + 5 + 'px';
            grandparent.insertBefore(btn, parent);
        } else {
            parent.classList.add('add-copy-buttons-to-pre-tags-parent');
            btn.style.marginRight = parseInt(window.getComputedStyle(parent).paddingRight) + 5 + 'px';
            parent.insertBefore(btn, pres[i]);
        }
    }
});
