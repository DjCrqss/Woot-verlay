// hadnles moving and resizing keys as well as the key right click menu

const menuDialog = document.getElementById("keyOptionDialog");
const renameInput = document.getElementById("keyLabel");
const selectionhint = document.getElementById("selectionhint");

var activeKey; // current key being interacted with for single select and for right click menu positioning
var selectedKeys = new Set(); // list of keys selected with shift or box select

// show menu
function showOptions() {
    menuDialog.style.display = "flex";
    menuDialog.style.top = parseInt(activeKey.style.top) + 8 - window.scrollY + "px";

    // if key is too close to the right side of the screen, show menu on the left
    if (parseInt(activeKey.style.left) + activeKey.clientWidth + menuDialog.offsetWidth > window.innerWidth) {
        menuDialog.style.left = parseInt(activeKey.style.left) - menuDialog.clientWidth - window.scrollX + "px";
    } else {
        menuDialog.style.left = parseInt(activeKey.style.left) + activeKey.clientWidth + 20 - window.scrollX + "px";
    }

    if(activeKey != null) {
        renameInput.value = activeKey.getElementsByClassName('label')[0].innerHTML;
    }

    // show hint for selection
    selectionhint.style.opacity = 1;

}

// update direction of key object
function updateKeySettings(direction) {
    if (activeKey != null) {
        selectedKeys.forEach(key => {
            key.element.getElementsByClassName('progress')[0].className = "progress";
            key.element.getElementsByClassName('progress')[0].classList.add(direction);
        });
    }
    saveState();
}

// update label of key object
function updateKeyLabel(event){
    if (activeKey != null) {
        var label = activeKey.getElementsByClassName('label')[0];
        label.innerHTML = event.value;
    }
    saveState();
}

// hide menu when clicking outside of it
document.addEventListener("click", function (event) {
    if (activeKey != null && !menuDialog.contains(event.target) && !activeKey.contains(event.target) 
    && ![...selectedKeys].some(x => x.element.contains(event.target)) && !event.shiftKey){
        activeKey.style.backgroundColor = "";
        activeKey = null;
        deselect();
    }
});

// add listener for CTRL + A when at least one key is already selected
document.addEventListener("keydown", function (event) {
    if(activeKey == null) return;
    if (event.ctrlKey && event.key === 'a') {
        event.preventDefault();
        // select all keys
        keyboard.childNodes.forEach(key => {
            select(key);
        });
    }
});


function hideDialog() {
    menuDialog.style.display = "none";
    selectionhint.style.opacity = 0;
}

async function removeKey() {
    if (activeKey != null) {
        hideDialog();
        selectedKeys.forEach(key => {
            key.element.style.opacity = 0;
            key.element.style.backgroundColor = "#925555";
        });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        try { 
            selectedKeys.forEach(key => {
                keyboard.removeChild(key.element);
            });
        } catch (exception) { }
        activeKey = null;
        deselect();
        saveState();
    }
}

async function select(elmnt){
    // if not already in selected keys, add to list
    if(![...selectedKeys].some(x => x.element == elmnt)){
        selectedKeys.add({
            element: elmnt,
            x: parseInt(elmnt.style.left),
            y: parseInt(elmnt.style.top),
            oldPosX: 0,
            oldPosY: 0,
            width: elmnt.clientWidth,
            height: elmnt.clientHeight
        });
    }

    activeKey = elmnt;
    elmnt.style.backgroundColor = "var(--wooting-yellow)";
}
async function deselect(){
    selectedKeys.forEach(key => {
        key.element.style.backgroundColor = "";
    });
    selectedKeys.clear();
    hideDialog();
}

// all functions related to dragging and resizing a key             
function keyInteract(elmnt) {
    // current position
    var x = 0;
    var y = 0;
    // curent size
    var width = 0;
    var height = 0;
    // previous mouse position
    var oldPosX = 0;
    var oldPosY = 0;

    elmnt.onmousedown = mouseDown;
    elmnt.onmousemove = showResize;

    async function showResize(e){
        if(e.clientX > parseInt(elmnt.style.left) + elmnt.offsetWidth - 5 && e.clientY > parseInt(elmnt.style.top) + elmnt.offsetHeight - 5){ // resize both when dragging bottom right corner
            elmnt.style.cursor = "nwse-resize";
        }else if ((e.clientX > parseInt(elmnt.style.left) + elmnt.offsetWidth - 5)) { // resize width when dragging right side
           elmnt.style.cursor = "ew-resize";
        } else if (e.clientY > parseInt(elmnt.style.top) + elmnt.offsetHeight - 5) { // resize height when dragging bottom
            elmnt.style.cursor = "ns-resize";
        } else {
            elmnt.style.cursor = "move";
        }
    }

    async function mouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // update initial values
        x = parseInt(elmnt.style.left);
        y = parseInt(elmnt.style.top);
        oldPosX = e.clientX;
        oldPosY = e.clientY;
        width = elmnt.clientWidth;
        height = elmnt.clientHeight;

        document.onmouseup = mouseUp;

        
        if (e.shiftKey && e.button === 0) { 
            // add to selection on shift click
            if(![...selectedKeys].some(x => x.element == elmnt)){
                select(elmnt);
            } else {
                // remove from selection on shift click
                selectedKeys.delete([...selectedKeys].find(x => x.element == elmnt));
                elmnt.style.backgroundColor = "";
            }
        }
        // deselect if not shift click
        else if(activeKey != null && ![...selectedKeys].some(x => x.element == elmnt)) {
            deselect();
        }

        if (e.button === 2) { // show options on left click
            select(elmnt);
            showOptions();
        } else if(e.clientX > parseInt(elmnt.style.left) + elmnt.offsetWidth - 5 && e.clientY > parseInt(elmnt.style.top) + elmnt.offsetHeight - 5){ // resize both when dragging bottom right corner
            document.onmousemove = elementResizeBoth;
        } else if ((e.clientX > parseInt(elmnt.style.left) + elmnt.offsetWidth - 5)) { // resize width when dragging right side
            document.onmousemove = elementResizeWidth;
        } else if (e.clientY > parseInt(elmnt.style.top) + elmnt.offsetHeight - 5) { // resize height when dragging bottom
            document.onmousemove = elementResizeHeight;
        } else { // move on drag
            document.onmousemove = elementDrag;
        }
        

    }

    function elementResizeBoth(e) {{
            e = e || window.event;
            e.preventDefault();
            hideDialog();

            // calculate the new cursor position to add to width and height
            width += (e.clientX - oldPosX);
            height += (e.clientY - oldPosY);
            if (width < 24) width = 24;
            if (height < 24) height = 24;

            // set the element's new position:
            elmnt.style.width = snapGrid(width) + "px";
            elmnt.style.height = snapGrid(height) + "px";
            // set old values
            oldPosX = e.clientX;
            oldPosY = e.clientY;
        }
    }

    function elementResizeWidth(e) {
        e = e || window.event;
        e.preventDefault();
        hideDialog();

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
        hideDialog();

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

        hideDialog();
        
        // calculate the new cursor position:
        
        xDiff = e.clientX - oldPosX;
        yDiff = e.clientY - oldPosY;

        x += xDiff;
        y += yDiff;
        elmnt.style.top = snapGrid(y) + "px";
        elmnt.style.left = snapGrid(x) + "px";

        selectedKeys.forEach(key => {
            // if(key.element == elmnt) return;
            key.x += xDiff;
            key.y += yDiff;
            key.element.style.top = snapGrid(key.y) + "px";
            key.element.style.left = snapGrid(key.x) + "px";
            key.oldPosX = e.clientX;
            key.oldPosY = e.clientY;
        });

        // set old values
        oldPosX = e.clientX;
        oldPosY = e.clientY;

    }

    function mouseUp() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        saveState();
    }

}

function snapGrid(num) {
    return Math.ceil(num / 4) * 4;
}


