const canvas = document.getElementById('keyboardCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

const shiftAmount = 10;


// constantly redraw the canvas
setInterval(draw, 10);

const scale = window.devicePixelRatio;
// Set canvas size based on device pixel ratio
canvas.width = window.innerWidth * scale;
canvas.height = window.innerHeight * scale;
ctx.scale(scale, scale);


// draw the canvas
function draw() {
    // clear the canvas
    const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.putImageData(originalImageData, 0, -shiftAmount);
    // draw full size rect with slight opacity
    ctx.fillStyle = "#21212120";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);


    // draw rectangle in middle
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(320, 600, keySize, keySize);

}
