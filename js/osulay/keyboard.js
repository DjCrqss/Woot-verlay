// this file handles the keyboard display and the individual keys
// key class
const keyHeight = 1;
const keyScale = 80;
lines = [];


class Key {
    constructor(keyCode, label, x, y, width, colour) {
        this.keyCode = keyCode;
        this.label = label;
        this.x = x;
        this.y = y;
        this.width = width;
        this.colour = colour;
        this.pressure = 0;
        this.prevPressures = [];
    }

    // draw key on canvas
    draw(ctx) {
        ctx.beginPath();
        // draw on canvas
        // set color to white
        // console.log(this.colour);
        ctx.strokeStyle = "white";
        ctx.rect(this.x, this.y, this.width * keyScale, keyHeight * keyScale);
        // draw letter
        ctx.font = "24px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(this.label, this.x + (this.width * keyScale) / 2, this.y + (keyHeight * keyScale) / 1.6);
        ctx.stroke();

        drawPressure(ctx, this);    
    }


    // update key
    update() {
        this.prevPressures.unshift(this.pressure);
        if (this.prevPressures.length > 1000) {
            this.prevPressures.pop();
        }
    }

    // check if mouse is hovering over key
    isHovered(mouseX, mouseY) {

        // check if mouse is over key
        if (mouseX > this.x && mouseX < this.x + this.width * keyScale) {
            if (mouseY > this.y && mouseY < this.y + keyHeight * keyScale) {
                return true;
            }
        }
        return false;
    }
}

var keys = [];
var activeKeyIDs = [];
const canvas = document.getElementById('canvas');

// convert key ID's to readable names
const keyPairs = {
    A: 4, B: 5, C: 6, D: 7, E: 8, F: 9, G: 10, H: 11, I: 12, J: 13, K: 14, L: 15, M: 16, N: 17, O: 18, P: 19, Q: 20, R: 21, S: 22, T: 23, U: 24, V: 25, W: 26, X: 27, Y: 28, Z: 29,
    1: 30, 2: 31, 3: 32, 4: 33, 5: 34, 6: 35, 7: 36, 8: 37, 9: 38, 0: 39,
    Enter: 40, Esc: 41, Back: 42, Tab: 43, __: 44, '-': 45, '+': 46, '[': 47, ']': 48, '\\': 49,
    '; :': 51, '\' "': 52, '~': 53, ',': 54, '.': 55, '/ ?': 56, Caps: 57,
    F1: 58, F2: 59, F3: 60, F4: 61, F5: 62, F6: 63, F7: 64, F8: 65, F9: 66, F10: 67, F11: 68, F12: 69,
    PrtScr: 70, ScrLk: 71, "⏵⏸": 72, Ins: 73, Home: 74, PgUp: 75, Del: 76, End: 77, PgDn: 78,
    '▶': 79, '◀': 80, '▼': 81, '▲': 82, NumLk: 83, Menu: 101,
    Ctrl: 224, "🡅": 225, Alt: 226, Win: 227, RCtrl: 228, "R🡅": 229, RMenu: 230, RWin: 231, Fn: 1033,
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
                buildKey(new Key(keyID, label, parseInt((Math.random() * (parseInt(canvas.innerWidth * 0.7 / 72)))) * 72, snapGrid(window.innerHeight * 0.75) - 72 - parseInt((Math.random() * 2)) * 72, 1, "white"));
                saveState();
            }
        }
    }

    presetInput.value = localStorage.getItem("keys");
}

// Store list of keys and environment variables
getState();

var keySize = parseInt(getComputedStyle(document.body).getPropertyValue('--key-size'));
var keyboard = document.getElementById("keyboard");
var presetInput = document.getElementById("presetInput");

// builds a key given an object
function buildKey(curKey) {
    activeKeyIDs.push(curKey.keyCode);
    buildOptions();
}

// get locally stored key states for usage
function getState() {
    // localStorage.removeItem("keys");
    if (localStorage.getItem("keys") != null) { // retrieve locally stored keys
        var storedKeys = JSON.parse(localStorage.getItem("keys", storedKeys));
        storedKeys.forEach(element => {
            keys.push(new Key(element[0], element[1], element[2], element[3], element[4], element[5], element[6]));
            activeKeyIDs.push(element[0]);
        });

    } else { // default keys
        keys = [
            new Key(26, "W", 156, 0, 1, "white"), // W
            new Key(4, "A", 96, 72, 1, "white"), // A
            new Key(22, "S", 168, 72, 1, "white"), // S
            new Key(7, "D", 240, 72, 1, "white"), // D
            new Key(225, "🡅", 0, 0, 1.6, "white"), // Left Shift
            new Key(224, "Ctrl", 0, 72, 1.2, "white"), // Left Ctrl
            new Key(44, "__", 324, 72, 1.8, "white"), // Space
        ];
        activeKeyIDs = [26, 4, 22, 7, 225, 224, 44];
    }
}

// loads  an imported set of key JSON from the presetInput
function loadState() {
    var data = JSON.parse(presetInput.value);
    keys = [];
    data.forEach(element => {
        keys.push(new Key(element[0], element[1], element[2], element[3], element[4], element[5], element[6]));
        activeKeyIDs.push(element[0]);
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
    // var storedKeys = [];
    // activeKeyIDs = [];
    // var childKeys = document.getElementById('keyboard').getElementsByClassName('key');

    // // turn key elements into arrays for storage
    // for (i = 0; i < childKeys.length; i++) {
    //     var progress = childKeys[i].getElementsByClassName('progress')[0];
    //     var fillDir = progress.classList[1];
    //     var label = childKeys[i].getElementsByClassName('label')[0].textContent;
    //     let keyData = [
    //         parseInt(progress.id), label, parseInt(childKeys[i].style.left), parseInt(childKeys[i].style.top),
    //         childKeys[i].clientWidth / keySize, childKeys[i].clientHeight / keySize, fillDir
    //     ]
    //     storedKeys.push(keyData);
    //     activeKeyIDs.push(parseInt(progress.id));

    // }
    // // store updated keys in local storage
    // localStorage.setItem("keys", JSON.stringify(storedKeys));
    // buildOptions();
}



const canvasWidth = 1920;
const canvasHeight = 1400;

// create lines for key pressure history


var paused = false;

function draw() {
    if (!canvas.getContext) {
        return;
    }
    const ctx = canvas.getContext('2d');

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // get canvas physical dimensinos
    var canvasActualWidth = canvas.clientWidth;
    var canvasActualHeight = canvas.clientHeight;

    // clear canvasddd
    ctx.clearRect(0, 0, canvasActualWidth, canvasActualHeight);

    // draw lines
    // lines.forEach(element => {
    //     element.draw(ctx, canvasActualWidth, canvasActualHeight);
    //     element.update();
    // });

    

    ctx.strokeStyle = "red";
    ctx.lineWidth = "4";
    // draw keys
    keys.forEach(element => {
        element.draw(ctx, canvasActualWidth, canvasActualHeight); // draw key
    });
    keys.forEach(element => {
        // drawPressure(ctx, canvasActualWidth, canvasActualHeight, element); // draw pressure
        element.update(); // update pressures
        // if(element.pressure > 0) {
        //     lines.push(new Line(element.x + (element.width * keyScale)/2, element.y, element.pressure, element.color));
        // }
    });


}

async function drawPressure(ctx,key){
    if(key.prevPressures.length == 0){
        return;
    }

    // if(key.label != 'W'){
    //     return;
    // }
    // draw left side to top than right side.
    // draw rect
   

    // ctx.beginPath();
    ctx.strokeStyle = "green";
    // ctx.rect(key.x, 100, 400, 500);
    // ctx.stroke();


    // console.log(key.prevPressures);
    ctx.fillStyle = key.color;
    ctx.lineWidth = 0;
    ctx.beginPath();
    ctx.moveTo(key.x + (key.width * keyScale)/2 - key.prevPressures[0], key.y + key.height);
    test = [];
    test2= [];

    
    test.push({x: key.x + (key.width * keyScale)/2, y: key.y, f: 0});
    test2.push({x: key.x + (key.width * keyScale)/2, y: key.y, f: 0});
    for(i = 0; i < key.prevPressures.length; i++){
        // ctx.rect(key.x + (key.width * keyScale)/2, key.y - i, key.prevPressures[i]/2, 1);
        // ctx.lineTo(key.x + (key.width * keyScale)/2 - key.prevPressures[i]/2, key.y - i*2);
        test.push({x: key.x + (key.width * keyScale)/2 - key.prevPressures[i]/2, y: key.y - i*2, f: key.prevPressures[i]});
        test2.push({x: key.x + (key.width * keyScale)/2 + key.prevPressures[i]/2, y: key.y - i*2, f: key.prevPressures[i]});
    }
    test.push({x: key.x + (key.width * keyScale)/2, y: key.y - key.prevPressures.length*2, f: 0});
    test2.push({x: key.x + (key.width * keyScale)/2, y: key.y - key.prevPressures.length*2, f: 0});
    // for(i = key.prevPressures.length - 1; i >= 0; i--){
    //     // ctx.lineTo(key.x + (key.width * keyScale)/2 + key.prevPressures[i]/2, key.y - i*2);
    //     test.push({x: key.x + (key.width * keyScale)/2 + key.prevPressures[i]/2, y: key.y - i*2});
    // }
    bzCurve(ctx, test, 0.7, 0.6);
    bzCurve(ctx, test2, 0.7, 0.6);
    // ctx.fill();
}



function gradient(a, b) { 
    return (b.y-a.y)/(b.x-a.x);
}

function bzCurve(ctx, points, f, t) {
    //f = 0, will be straight line
    //t suppose to be 1, but changing the value can control the smoothness too
    if (typeof(f) == 'undefined') f = 0.3;
    if (typeof(t) == 'undefined') t = 0.6;

    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);

    var m = 0;
    var dx1 = 0;
    var dy1 = 0;

    var preP = points[1];
    for (var i = 2; i < points.length -1; i++) {
        var curP = points[i];
        nexP = points[i + 1];
        if (nexP && curP.f > 0) {
            m = gradient(preP, nexP);
            if(gradient == Infinity || gradient <= 2) {
                m = 1;
            }
            dx2 = (nexP.x - curP.x) * -f;
            dy2 = dx2 * m * t;
        } else {
            dx2 = 0;
            dy2 = 0;
        }
        ctx.bezierCurveTo(preP.x - dx1, preP.y - dy1, curP.x + dx2, curP.y + dy2, curP.x, curP.y);
        dx1 = dx2;
        dy1 = dy2;
        preP = curP;
    }
    ctx.lineTo(points[points.length-1].x, points[points.length-1].y);
    ctx.fill();
}



// constantly redraw canvas
function animate() {
    if (!paused) {
        draw();
    }
    setTimeout(animate);
}

buildOptions();
animate();