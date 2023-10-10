// hadnles moving and resizing keys as well as the key right click menu

const menuDialog = document.getElementById("keyOptionDialog");
const renameInput = document.getElementById("keyLabel");
var activeKey;
// show menu
function showOptions() {
    menuDialog.style.display = "block";
    menuDialog.style.top = parseInt(activeKey.x) + 8 + "px";
    menuDialog.style.left = parseInt(activeKey.y) + activeKey.width + 20 + "px";
    // if(activeKey != null) renameInput.value = activeKey.label;
}

// update label of key object
function updateKeyLabel(event){
    if (activeKey != null) {
        // var label = activeKey.getElementsByClassName('label')[0];
        // label.innerHTML = event.value;
    }
    saveState();
}

// hide menu
document.addEventListener("click", function (event) {
    if (activeKey != null) {
        activeKey = null;
        hideDialog();
    }
});

function hideDialog() {
    // menuDialog.style.display = "none";
}

async function removeKey() {
    if (activeKey != null) {
        // delete key later
        hideDialog();
        activeKey = null;
        saveState();
    }
}

// find mouse position at all times
var mouseX = 0;
var mouseY = 0;
document.addEventListener("mousemove", function (event) {
     // scale mouse position by canvas scale and window dimensions
     mouseX = event.clientX * canvasWidth / canvas.clientWidth;
     mouseY = event.clientY * canvasHeight / canvas.clientHeight;

    if(!activeKey){
        // check if a key is hoeverd over
        keys.forEach(curKey => {
            if(curKey.isHovered(mouseX, mouseY)){
                // show options
                activeKey = curKey;
            }
        });
    }

    if(mouseDown){
        // check if mouse is dragging a key
        if(activeKey != null){
            // move key
            activeKey.x = snapGrid(mouseX);
            activeKey.y = snapGrid(mouseY);
            saveState();
        }
    }
});

// check mouse drag
var mouseDown = false;
document.addEventListener("mousedown", function (event) {
    mouseDown = true;
});
document.addEventListener("mouseup", function (event) {
    activeKey = null;
    mouseDown = false;
});









// // all functions related to dragging and resizing a key             
// function dragElement(elmnt) {
//     // current position
//     var x = parseInt(elmnt.style.left);
//     var y = parseInt(elmnt.style.top);
//     // curent size
//     var width = elmnt.clientWidth;
//     var height = elmnt.clientHeight;
//     // previous mouse position
//     var oldPosX = 0;
//     var oldPosY = 0;

//     elmnt.onmousedown = dragMouseDown;

//     async function dragMouseDown(e) {
//         e = e || window.event;
//         e.preventDefault();
//         // get the mouse cursor position at startup
//         oldPosX = e.clientX;
//         oldPosY = e.clientY;
//         document.onmouseup = closeDragElement;

//         // call a function whenever the cursor moves
//         if (e.button === 2) { // show options on left click
//             activeKey = elmnt;
//             showOptions();
//         } else if ((e.clientX > parseInt(elmnt.style.left) + elmnt.offsetWidth - 5)) { // resize width when dragging right side
//             document.onmousemove = elementResizeWidth;
//         } else if (e.clientY > parseInt(elmnt.style.top) + elmnt.offsetHeight - 5) { // resize height when dragging bottom
//             document.onmousemove = elementResizeHeight;
//         } else { // move on drag
//             document.onmousemove = elementDrag;
//         }


//     }

//     function elementResizeWidth(e) {
//         e = e || window.event;
//         e.preventDefault();

//         // calculate the new cursor position to add to width
//         width += (e.clientX - oldPosX);
//         if (width < 24) width = 24;

//         // set the element's new position:
//         elmnt.style.width = snapGrid(width) + "px";
//         // set old values
//         oldPosX = e.clientX;
//     }

//     function elementResizeHeight(e) {
//         e = e || window.event;
//         e.preventDefault();

//         // calculate the new cursor position to add to height
//         height += (e.clientY - oldPosY);
//         if (height < 24) height = 24;

//         // set the element's new position:
//         elmnt.style.height = snapGrid(height) + "px";
//         // set old values
//         oldPosY = e.clientY;
//     }

//     function elementDrag(e) {
//         e = e || window.event;
//         e.preventDefault();
//         // calculate the new cursor position:
//         x += (e.clientX - oldPosX);
//         y += (e.clientY - oldPosY);
//         // set the element's new position:
//         elmnt.style.top = snapGrid(y) + "px";
//         elmnt.style.left = snapGrid(x) + "px";
//         // set old values
//         oldPosX = e.clientX;
//         oldPosY = e.clientY;

//     }

//     function closeDragElement() {
//         // stop moving when mouse button is released:
//         document.onmouseup = null;
//         document.onmousemove = null;
//         saveState();
//     }

// }

function snapGrid(num) {
    return Math.ceil(num / 12) * 12;
}


