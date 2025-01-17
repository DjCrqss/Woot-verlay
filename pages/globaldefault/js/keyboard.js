// this file handles the keyboard display and the individual keys
// key class
class Key {
    constructor(keyCode, label, x, y, width, height, fillDir) {
        this.keyCode = keyCode;
        this.label = label;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fillDir = fillDir;
    }
}


// Store list of keys and environment variables
var keys = [];
var activeKeyIDs = [];
getState();

var keySize = parseInt(getComputedStyle(document.body).getPropertyValue('--key-size'));
var keyboard = document.getElementById("keyboard");
var presetInput = document.getElementById("presetInput");

// builds a key given an object
function buildKey(curKey) {
    var curDiv = document.createElement('div');
    activeKeyIDs.push(curKey.keyCode);
    keyboard.appendChild(curDiv);

    // key styling
    curDiv.id = "draggable";
    curDiv.className = "key";
    curDiv.style.top = curKey.y + "px";
    curDiv.style.left = curKey.x + "px";
    curDiv.style.width = curKey.width == 1 ? "var(--key-size)" : "calc(var(--key-size)*" + curKey.width + ")";
    curDiv.style.height = curKey.height == 1 ? "var(--key-size)" : "calc(var(--key-size)*" + curKey.height + ")";

    // progress styling
    var curProgress = document.createElement('div');
    curDiv.appendChild(curProgress);
    curProgress.className = "progress";
    curProgress.classList.add(curKey.fillDir);
    curProgress.id = curKey.keyCode;

    // label styling
    var curLabel = document.createElement('span');
    curDiv.appendChild(curLabel);
    curLabel.className = "label";
    curLabel.textContent = curKey.label;

    // make key draggable and listen to other mouse events
    keyInteract(curDiv);

    buildOptions();
}

// get locally stored key states for usage
function getState() {
    // localStorage.removeItem("keys");
    if (localStorage.getItem("keys") != null) { // retrieve locally stored keys
        var storedKeys = JSON.parse(localStorage.getItem("keys", storedKeys));
        storedKeys.forEach(element => {
            keys.push(new Key(element[0], element[1], element[2], element[3], element[4], element[5], element[6]));
        });

    } else { // default keys
        keys = [
            new Key(26, "W", 156, 0, 1, 1, "bottom"), // W
            new Key(4, "A", 96, 72, 1, 1, "bottom"), // A
            new Key(22, "S", 168, 72, 1, 1, "bottom"), // S
            new Key(7, "D", 240, 72, 1, 1, "bottom"), // D
            new Key(225, "🡅", 0, 0, 1.6, 1, "bottom"), // Left Shift
            new Key(224, "Ctrl", 0, 72, 1.2, 1, "bottom"), // Left Ctrl
            new Key(44, "__", 324, 72, 1.8, 1, "bottom"), // Space
        ];
    }
}

// loads  an imported set of key JSON from the presetInput
function loadState(optionalData, optionalColours, optionalSettings) {
    try{
        // loads json data from preset(optionaldata) otherwise from the clipboard field. 
        var data = optionalData ? JSON.parse(optionalData) : JSON.parse(presetInput.value);
        var colours = optionalColours ? optionalColours : null;
        var settings = optionalSettings ? optionalSettings : null;
    } catch (e) {
        alert("Invalid keyboard layout!");
        return;
    }

    // check if data is json object containing settings
    if (data.constructor === Object) {
        if(!data.layout) {
            alert("Invalid keyboard layout!");
            return;
        }
        colours = data.colours || colours;
        settings = data.settings || settings;
        data = data.layout;
    }

    keys = [];
    data.forEach(element => {
        keys.push(new Key(element[0], element[1], element[2], element[3], element[4], element[5], element[6]));
    });
    // clear existing keys off screen by deleting all children of keyboard
    while (keyboard.firstChild) {
        keyboard.removeChild(keyboard.firstChild);
    }

    // update colours
    if(colours){
        updateColours(colours);
    }

    // update settings
    if(settings){
        loadSettings(settings);
    }

    buildOptions();
    displayKeys();
    saveState();
}

// saves the state of all keys in local storage
function saveState() {
    // store key array, key elements, and key size information
    var storedKeys = [];
    activeKeyIDs = [];
    var childKeys = document.getElementById('keyboard').getElementsByClassName('key');

    // turn key elements into arrays for storage
    for (i = 0; i < childKeys.length; i++) {
        var progress = childKeys[i].getElementsByClassName('progress')[0];
        var fillDir = progress.classList[1];
        var label = childKeys[i].getElementsByClassName('label')[0].textContent;
        let keyData = [
            parseInt(progress.id), label, parseInt(childKeys[i].style.left), parseInt(childKeys[i].style.top),
            childKeys[i].clientWidth / keySize, childKeys[i].clientHeight / keySize, fillDir
        ]
        storedKeys.push(keyData);
        activeKeyIDs.push(parseInt(progress.id));

    }
    // store updated keys in local storage
    localStorage.setItem("keys", JSON.stringify(storedKeys));
    buildOptions();
}

function displayKeys() {
    // create keys on screen
    keyboard.addEventListener('contextmenu', event => event.preventDefault());
    for (var i = 0; i < keys.length; i++) buildKey(keys[i]);
}


displayKeys();
buildOptions();