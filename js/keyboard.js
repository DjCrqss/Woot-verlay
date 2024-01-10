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

// convert key ID's to readable names
const keyPairs = {
    A: 4, B: 5, C: 6, D: 7, E: 8, F: 9, G: 10, H: 11, I: 12, J: 13, K: 14, L: 15, M: 16, N: 17, O: 18, P: 19, Q: 20, R: 21, S: 22, T: 23, U: 24, V: 25, W: 26, X: 27, Y: 28, Z: 29,
    1: 30, 2: 31, 3: 32, 4: 33, 5: 34, 6: 35, 7: 36, 8: 37, 9: 38, 0: 39,
    Enter: 40, Esc: 41, Back: 42, Tab: 43, __: 44, '-': 45, '+': 46, '[': 47, ']': 48, '\\': 49,
    '; :': 51, '\' "': 52, '~': 53, ',': 54, '.': 55, '/ ?': 56, Caps: 57,
    F1: 58, F2: 59, F3: 60, F4: 61, F5: 62, F6: 63, F7: 64, F8: 65, F9: 66, F10: 67, F11: 68, F12: 69,
    PrtSc: 70, ScrLk: 71, "⏵⏸": 72, Pau: 72, Ins: 73, Home: 74, PgUp: 75, Del: 76, End: 77, PgDn: 78,
    '▶': 79, '◀': 80, '▼': 81, '▲': 82, NumLk: 83, 
    'N/': 84, 'N*': 85, 'N-': 86, 'N+': 87, Enter: 88, 'N1': 89, 'N2': 90, 'N3': 91, 'N4': 92, 'N5': 93, 'N6': 94, 'N7': 95, 'N8': 96, 'N9': 97, 'N0': 98, '.': 99,
    Menu: 101,
    F13: 104, F14: 105, F15: 106, F16: 107, F17: 108, F18: 109, F19: 110, F20: 111, F21: 112, F22: 113, F23: 114, F24: 115,
    Ctrl: 224, "🡅": 225, Alt: 226, Win: 227, RCtrl: 228, "R🡅": 229, RMenu: 230, RWin: 231, Fn: 1033,
    A1: 1027, A2: 1028, A3: 1029, Mode: 1030,
};

// build keyPool options based on available keys
function buildOptions() {
    // clear existing options
    var keyPool = document.getElementById("keyPool");
    while (keyPool.firstChild) {
        keyPool.removeChild(keyPool.firstChild);
    }
    // add all options
    for (const [label, keyID] of Object.entries(keyPairs)) {
        if (!activeKeyIDs.includes(keyID)) {
            var curDiv = document.createElement('span');
            curDiv.className = "keyOption";
            curDiv.textContent = label;
            keyPool.append(curDiv);
            // attach onclick listener
            curDiv.onclick = function () {
                buildKey(new Key(keyID, label, parseInt((Math.random() * (parseInt(window.innerWidth * 0.7 / 72)))) * 72, snapGrid(window.innerHeight * 0.75) - 72 - parseInt((Math.random() * 2)) * 72, 1, 1, "bottom"));
                saveState();
            }
        }
    }

    presetInput.value = localStorage.getItem("keys");
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
    dragElement(curDiv);

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
function loadState() {
    var data = JSON.parse(presetInput.value);
    keys = [];
    data.forEach(element => {
        keys.push(new Key(element[0], element[1], element[2], element[3], element[4], element[5], element[6]));
    });
    // clear existing keys off screen by deleting all children of keyboard
    while (keyboard.firstChild) {
        keyboard.removeChild(keyboard.firstChild);
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