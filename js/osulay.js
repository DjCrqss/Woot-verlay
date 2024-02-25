const canvas = document.getElementById('keyboardCanvas');
const ctx = canvas.getContext('2d');


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
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    // draw rectangle in middle
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(keys[keys.length-1].x + 3, keys[keys.length-1].y + 3, keySize, keySize);

}
