// hadnles moving and resizing keys as well as the key right click menu

const menuDialog = document.getElementById("keyOptionDialog");
var activeKey;
// show menu
function showOptions() {
    menuDialog.style.display = "block";
    menuDialog.style.top = parseInt(activeKey.style.top) + 8 + "px";
    menuDialog.style.left = parseInt(activeKey.style.left) + activeKey.clientWidth + 20 + "px";
}

// update direction of key object
function updateKeySettings(direction) {
    if (activeKey != null) {
        var progress = activeKey.getElementsByClassName('progress')[0];
        progress.className = "progress";
        progress.classList.add(direction);
    }
    saveState();
}

// hide menu
document.addEventListener("click", function (event) {
    if (activeKey != null && !menuDialog.contains(event.target)) {
        activeKey = null;
        menuDialog.style.display = "none";
    }
});

async function removeKey() {
    if (activeKey != null) {
        activeKey.style.opacity = 0;
        activeKey.style.backgroundColor = "#925555";
        hideDialog();
        await new Promise(resolve => setTimeout(resolve, 500));
        try { keyboard.removeChild(activeKey); } catch (exception) { }
        activeKey = null;
        saveState();
    }
}

// all functions related to dragging and resizing a key             
function dragElement(elmnt) {
    // current position
    var x = parseInt(elmnt.style.left);
    var y = parseInt(elmnt.style.top);
    // curent size
    var width = elmnt.clientWidth;
    var height = elmnt.clientHeight;
    // previous mouse position
    var oldPosX = 0;
    var oldPosY = 0;

    elmnt.onmousedown = dragMouseDown;

    async function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup
        oldPosX = e.clientX;
        oldPosY = e.clientY;
        document.onmouseup = closeDragElement;

        // call a function whenever the cursor moves
        if (e.button === 2) { // show options on left click
            activeKey = elmnt;
            showOptions();
        } else if ((e.clientX > parseInt(elmnt.style.left) + elmnt.offsetWidth - 5)) { // resize width when dragging right side
            document.onmousemove = elementResizeWidth;
        } else if (e.clientY > parseInt(elmnt.style.top) + elmnt.offsetHeight - 5) { // resize height when dragging bottom
            document.onmousemove = elementResizeHeight;
        } else { // move on drag
            document.onmousemove = elementDrag;
        }


    }

    function elementResizeWidth(e) {
        e = e || window.event;
        e.preventDefault();

        // calculate the new cursor position to add to width
        width += (e.clientX - oldPosX);
        if (width < 24) width = 24;

        // set the element's new position:
        elmnt.style.width = snapGrid(width) + "px";
        // set old values
        oldPosX = e.clientX;
    }

    function elementResizeHeight(e) {
        e = e || window.event;
        e.preventDefault();

        // calculate the new cursor position to add to height
        height += (e.clientY - oldPosY);
        if (height < 24) height = 24;

        // set the element's new position:
        elmnt.style.height = snapGrid(height) + "px";
        // set old values
        oldPosY = e.clientY;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        x += (e.clientX - oldPosX);
        y += (e.clientY - oldPosY);
        // set the element's new position:
        elmnt.style.top = snapGrid(y) + "px";
        elmnt.style.left = snapGrid(x) + "px";
        // set old values
        oldPosX = e.clientX;
        oldPosY = e.clientY;

    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        saveState();
    }

    function snapGrid(num) {
        return Math.ceil(num / 12) * 12;
    }
}


