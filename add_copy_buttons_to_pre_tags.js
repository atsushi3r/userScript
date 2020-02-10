// ==UserScript==
// @name         Add Copy Buttons to Pre Tags
// @namespace    add_copy_buttons_to_pre_tags
// @version      1.0
// @description  Add copy buttons to pre tags
// @author       atsushi3r
// @match        *://*/*
// @grant        none
// @noframes
// ==/UserScript==

(function (d) {
    'use strict';
    console.log('UserScript: Add Copy Buttons to Pre Tags');
    let pres = d.getElementsByTagName('pre');
    if (pres.length < 1) {
        return;
    }
    let linkMaterialIcon = d.createElement('link');
    linkMaterialIcon.setAttribute('rel', 'stylesheet');
    linkMaterialIcon.setAttribute('href', 'https://fonts.googleapis.com/icon?family=Material+Icons');
    let head = d.getElementsByTagName('head')[0];
    head.appendChild(linkMaterialIcon);
    let style = d.createElement('style');
    style.innerHTML = `
.add-copy-buttons-to-pre-tags-parent {
    position: relative;
}

button.add-copy-buttons-to-pre-tags-btn {
    color: #aaa;
    font-size: 14px;
    position: absolute;
    right: 0;
    border: none;
    border-radius: 5px;
    background-color: #fefef6;
    box-shadow: none;
    white-space: nowrap;
    line-height: 14px;
    height: 24px;
    min-height: 24px;
    width: 22px;
    padding: 5px 4px;
    margin: 5px;
    outline: none;
    z-index: 9;
}

button.add-copy-buttons-to-pre-tags-btn:hover, button.add-copy-buttons-to-pre-tags-btn:focus {
    color: #666;
    background-color: #fefef6;
    box-shadow: none;
}

button.add-copy-buttons-to-pre-tags-btn:active {
    color:#333;
}


button.add-copy-buttons-to-pre-tags-btn > i.material-icons {
    font-size: 14px;
}

span.add-copy-buttons-to-pre-tags-balloon {
    font-size: 12px;
    position: absolute;
    top: 0;
    left: -50px;
    width: 45px;
    display: none;
    padding: 5px;
    opacity: 0;
    border-radius: 5px;
    color: #fefef6;
    background-color: #555;
    animation: 0.3s ease show-balloon;
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
    head.appendChild(style);

    function copyPreContent(event) {
        event.preventDefault();
        let target = this.parentElement.querySelector('.add-copy-buttons-to-pre-tags-target');
        d.getSelection().selectAllChildren(target);
        d.execCommand('copy');
        d.getSelection().empty();
        this.querySelector('span > span:first-child').style.display = 'none';
        this.querySelector('span > span:last-child').style.display = 'block';
    }

    function resetBalloon(event) {
        this.querySelector('span > span:first-child').style.display = 'block';
        this.querySelector('span > span:last-child').style.display = 'none';
    }

    Array.prototype.forEach.call(pres, pre => {
        if (pre.style.display === 'none') {
            return;
        }
        pre.classList.add('add-copy-buttons-to-pre-tags-target');
        let btn = d.createElement('button');
        btn.innerHTML = '<i class="material-icons">content_copy</i><span class="add-copy-buttons-to-pre-tags-balloon"><span>Copy</span><span style="display:none;">Done!</span></span>';
        btn.className = 'add-copy-buttons-to-pre-tags-btn';
        btn.tabIndex = -1;
        btn.addEventListener('click', copyPreContent, false);
        btn.addEventListener('blur', resetBalloon, false);
        let parent = pre.parentElement;
        parent.classList.add('add-copy-buttons-to-pre-tags-parent');
        parent.insertBefore(btn, pre);
    });
    d.getSelection().empty();
})(document);
