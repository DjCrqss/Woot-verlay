// https://stackoverflow.com/questions/8376534/shift-canvas-contents-to-the-left

const canvas = document.getElementById('osuCanvas');
const ctx = canvas.getContext('2d');
var runCanvas = false;

var zLevel = 0;
var prevZLevel = 0;
var zActive = false;
var xLevel = 0;
var prevXLevel = 0;
var xActive = false;

const activeColour = "#00ff95";
const inactiveColour = "#ff0000";
const transparentColour = "#39393976";

// interpolation variables
var targetZLevel = 0;
var targetXLevel = 0;
const lerpFactor = 0.8; // Adjust this to control the speed of interpolation (closer to 1 = faster)

var interval = null;
const speed = 2;

// canvas resolution settings
const canvasWidth = 800;
const canvasHeight = 400;
var scale = 8;
canvas.width = canvasWidth * scale;
canvas.height = canvasHeight * scale;

// key display settings
const zSettings = {
    key: "Z",
    y: 0.33,
    maxHeight: 0.2
}

const xSettings = {
    key: "X",
    y: 0.66,
    maxHeight: 0.2
}

// key icon settings
const zKeyIcon = document.getElementById('zKey');
const xKeyIcon = document.getElementById('xKey');

ctx.imageSmoothingEnabled = false;


function shiftCanvas(widthOfMove){
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(ctx.canvas,-widthOfMove, 0);
    // reset back to normal for subsequent operations.
    ctx.globalCompositeOperation = "source-over"
}

function drawCanvas(){
    // Smoothly interpolate zLevel and xLevel towards their targets
    zLevel += (targetZLevel - zLevel) * lerpFactor;
    xLevel += (targetXLevel - xLevel) * lerpFactor;

    // Draw line for zLevel
    if(zActive){
        ctx.strokeStyle = activeColour;
    } else {
        ctx.strokeStyle = inactiveColour;
    }
    ctx.beginPath();
    ctx.moveTo(canvasWidth - speed, (canvasHeight * zSettings.y) - (prevZLevel * zSettings.maxHeight * canvasHeight));
    ctx.lineTo(canvasWidth, (canvasHeight * zSettings.y) - (zLevel * zSettings.maxHeight * canvasHeight));
    ctx.stroke();

    // Draw line for xLevel
    if(xActive){
        ctx.strokeStyle = activeColour;
    } else {
        ctx.strokeStyle = inactiveColour;
    }
    ctx.beginPath();
    ctx.moveTo(canvasWidth - speed, (canvasHeight * xSettings.y) - (prevXLevel * xSettings.maxHeight * canvasHeight));
    ctx.lineTo(canvasWidth, (canvasHeight * xSettings.y) - (xLevel * xSettings.maxHeight * canvasHeight));
    ctx.stroke();

    // Update previous levels
    prevZLevel = zLevel;
    prevXLevel = xLevel;
}

function updateKeyIcons(){
    // style as a gradient background: linear-gradient(0deg, #00ff95 50%, #39393976 50%);
    zKeyIcon.style.background = `linear-gradient(0deg, ${zActive ? activeColour : inactiveColour} ${zLevel * 100}%, ${transparentColour} ${zLevel * 100}%)`;
    xKeyIcon.style.background = `linear-gradient(0deg, ${xActive ? activeColour : inactiveColour} ${xLevel * 100}%, ${transparentColour} ${xLevel * 100}%)`;
}

function startCanvas(){
    console.log("Starting canvas");
    runCanvas = true;
    interval = setInterval(() => {
        if(runCanvas){
            shiftCanvas(speed);
            drawCanvas();
            updateKeyIcons();
        }
    }, 1000/120);
}

function stopCanvas(){
    if(interval == null) return;
    runCanvas = false;
    clearInterval(interval);
}






