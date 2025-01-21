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

var interval = null;
const speed = 2;

// canvas resolution settings
const canvasWidth = 800;
const canvasHeight = 400;
var scale = 8;
canvas.width = canvasWidth * scale;
canvas.height = canvasHeight * scale;

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

ctx.imageSmoothingEnabled = false;


function shiftCanvas(widthOfMove){
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(ctx.canvas,-widthOfMove, 0);
    // reset back to normal for subsequent operations.
    ctx.globalCompositeOperation = "source-over"
}

function drawCanvas(){
    // draw line at right hand side of canvas at zSettings.y + zLevel * zSettings.maxHeight
    if(zActive){
        ctx.strokeStyle = "green";
    } else {
        ctx.strokeStyle = "red";
    }

    ctx.beginPath();
    ctx.moveTo(canvasWidth - speed, (canvasHeight * zSettings.y) - (prevZLevel * zSettings.maxHeight * canvasHeight));
    ctx.lineTo(canvasWidth, (canvasHeight * zSettings.y) - (zLevel * zSettings.maxHeight * canvasHeight));
    ctx.stroke();

    // draw line at right hand side of canvas at xSettings.y + xLevel * xSettings.maxHeight
    if(xActive){
        ctx.strokeStyle = "green";
    } else {
        ctx.strokeStyle = "red";
    }
    ctx.beginPath();
    ctx.moveTo(canvasWidth - 1, (canvasHeight * xSettings.y) - (prevXLevel * xSettings.maxHeight * canvasHeight));
    ctx.lineTo(canvasWidth, (canvasHeight * xSettings.y) - (xLevel * xSettings.maxHeight * canvasHeight));
    ctx.stroke();

    prevZLevel = zLevel;
    prevXLevel = xLevel;
}

function startCanvas(){
    console.log("Starting canvas");
    runCanvas = true;
    interval = setInterval(() => {
        if(runCanvas){
            shiftCanvas(speed);
            drawCanvas();
        }
    }, 1000/120);
}

function stopCanvas(){
    if(interval == null) return;
    runCanvas = false;
    clearInterval(interval);
}






