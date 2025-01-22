// https://stackoverflow.com/questions/8376534/shift-canvas-contents-to-the-left

const canvas = document.getElementById('osuCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
var runCanvas = false;
var interval = null;

// canvas variables
var zLevel = 0;
var prevZLevel = 0;
var zActive = false;
var xLevel = 0;
var prevXLevel = 0;
var xActive = false;
var opacity = 1;

// interpolation variables
var targetZLevel = 0;
var targetXLevel = 0;

// canvas resolution settings
var canvasWidth = 800;
var canvasHeight = 400;
var scale = 8;
resizeCanvas();

// key display settings
const zSettings = {
    key: "Z",
    y: 0.33,
}

const xSettings = {
    key: "X",
    y: 0.66,
}

// key icon settings
const zKeyIcon = document.getElementById('zKey');
const xKeyIcon = document.getElementById('xKey');

function shiftCanvas(widthOfMove){
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(ctx.canvas,-widthOfMove, 0);
    // reset back to normal for subsequent operations.
    ctx.globalCompositeOperation = "source-over"
}

function resizeCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = canvasWidth * scale;
    canvas.height = canvasHeight * scale;
}

function drawCanvas(){
    // Smoothly interpolate zLevel and xLevel towards their targets
    zLevel += (targetZLevel - zLevel) * settings.smoothness;
    xLevel += (targetXLevel - xLevel) * settings.smoothness;

    // change stroke width
    ctx.lineWidth = settings.thickness;

    // Draw line for zLevel
    if(zActive){
        // colour stored as [r, g, b] in activecolour, turn into rgba
        ctx.strokeStyle = activeColourString;
    } else {
        // include opacity level in inactive colour
        ctx.strokeStyle = `rgba(${inactiveColour[0]}, ${inactiveColour[1]}, ${inactiveColour[2]}, ${opacity})`;
    }
    ctx.beginPath();
    ctx.moveTo(canvasWidth - settings.speed, (canvasHeight * zSettings.y) - (prevZLevel * settings.maxHeight * canvasHeight));
    ctx.lineTo(canvasWidth, (canvasHeight * zSettings.y) - (zLevel * settings.maxHeight * canvasHeight));
    ctx.stroke();

    // Draw line for xLevel
    if(xActive){
        ctx.strokeStyle = activeColourString;
    } else {
        ctx.strokeStyle = `rgba(${inactiveColour[0]}, ${inactiveColour[1]}, ${inactiveColour[2]}, ${opacity})`;
    }
    ctx.beginPath();
    ctx.moveTo(canvasWidth - settings.speed, (canvasHeight * xSettings.y) - (prevXLevel * settings.maxHeight * canvasHeight));
    ctx.lineTo(canvasWidth, (canvasHeight * xSettings.y) - (xLevel * settings.maxHeight * canvasHeight));
    ctx.stroke();

    // Update previous levels
    prevZLevel = zLevel;
    prevXLevel = xLevel;

    // add fading effect to end
    if(settings.endFade){
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, (canvas.width/scale)/10, canvas.height);
    }
}

function updateKeyIcons(){
    // console.log(activeColourString);
    zKeyIcon.style.background = `linear-gradient(0deg, ${zActive ? activeColourString : inactiveColourString} ${zLevel * 100}%, ${accentColour} ${zLevel * 100}%)`;
    xKeyIcon.style.background = `linear-gradient(0deg, ${xActive ? activeColourString : inactiveColourString} ${xLevel * 100}%, ${accentColour} ${xLevel * 100}%)`;
    if(!active && timer > settings.inactiveTime) {
        zKeyIcon.style.opacity = opacity + 0.35;
        xKeyIcon.style.opacity = opacity + 0.35;

    } else {
        zKeyIcon.style.opacity = 1;
        xKeyIcon.style.opacity = 1;
    }
}

function startCanvas(){
    console.log("Starting canvas");
    runCanvas = true;
    interval = setInterval(() => {
        if(runCanvas){
            shiftCanvas(settings.speed);
            drawCanvas();
            updateKeyIcons();
            if(settings.inactiveFading) updateOpacity();
        }
    }, 1000/settings.refreshrate);
}

function stopCanvas(){
    if(interval == null) return;
    runCanvas = false;
    clearInterval(interval);
}






