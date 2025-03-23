// https://stackoverflow.com/questions/8376534/shift-canvas-contents-to-the-left

const canvas = document.getElementById('osuCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
var runCanvas = false;
var interval = null;
var opacity = 1;

templateKey = function (letter) {
    const value = keyPairs[letter.toUpperCase()];

    if (value === undefined) {
        console.warn(`Key "${letter}" not found in keyPairs.`);
        return null; // Handle missing keys gracefully
    }

    let icon = document.createElement('div');
    icon.classList.add('keyIcon');
    icon.textContent = letter.toLowerCase();
    // append to the body
    document.body.appendChild(icon);

    return {
        key: value,
        curLevel: 0,
        prevLevel: 0,
        active: false,
        targetLevel: 0,
        transitionProgress: 0,
        keyIcon: icon,
    }
}

const activeKeys = [];
activeKeys.push(templateKey("Z"));
activeKeys.push(templateKey("X"));
activeKeys.push(templateKey("C"));


// canvas resolution settings
var canvasWidth = 800;
var canvasHeight = 400;
var scale = 8;
resizeCanvas();


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

function drawCanvas() {
    ctx.lineWidth = settings.thickness;
    
    let count = 0;
    activeKeys.forEach(key => {
        count++;
        // Smooth interpolation
        key.curLevel += (key.targetLevel - key.curLevel) * settings.smoothness;

        // Set stroke style based on active state
        ctx.strokeStyle = key.active ? activeColourString : 
            `rgba(${inactiveColour[0]}, ${inactiveColour[1]}, ${inactiveColour[2]}, ${opacity})`;
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(canvasWidth - settings.speed, (canvasHeight  * (count / activeKeys.length)) - (key.prevLevel * settings.maxHeight * canvasHeight));
        ctx.lineTo(canvasWidth, (canvasHeight * (count / activeKeys.length)) - (key.curLevel * settings.maxHeight * canvasHeight));
        ctx.stroke();
        
        // Update previous level
        key.prevLevel = key.curLevel;
    });
    
    // Add fading effect to end
    if (settings.endFade) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, canvasWidth / 10, canvasHeight);
        ctx.globalCompositeOperation = "source-over";
    }
}

function interpolateColour(colour1, colour2, t) {
    return [
        Math.round(colour1[0] + (colour2[0] - colour1[0]) * t),
        Math.round(colour1[1] + (colour2[1] - colour1[1]) * t),
        Math.round(colour1[2] + (colour2[2] - colour1[2]) * t)
    ];
}

const transitionSpeed = 0.075;

function updateKeyIcons() {
    let count = 0;
    activeKeys.forEach(key => {
        count++;
        const { keyIcon, active, curLevel, transitionProgress } = key;

        // location (canvasHeight  * (count / activeKeys.length))
        keyIcon.style.top = `calc(${canvasHeight * (count / activeKeys.length)}px - 0.9em)`;
        console.log(canvasHeight * (count / activeKeys.length));
        

        // Colouring
        if (settings.instantTransitions) {
            keyIcon.style.backgroundImage = `linear-gradient(0deg, ${active ? activeColourString : inactiveColourString} ${curLevel * 100}%, ${accentColour} ${curLevel * 100}%)`;
        } else {
            if (active) {
                key.transitionProgress = Math.min(transitionProgress + transitionSpeed, 1);
            } else {
                key.transitionProgress = Math.max(transitionProgress - transitionSpeed, 0);
            }

            const currentColour = interpolateColour(inactiveColour, activeColour, transitionProgress);
            keyIcon.style.backgroundImage = `linear-gradient(0deg, rgb(${currentColour[0]}, ${currentColour[1]}, ${currentColour[2]}) ${curLevel * 100}%, ${accentColour} ${curLevel * 100}%)`;
        }

        // Transformations
        keyIcon.style.transform = `scale(${1 - curLevel * settings.shrink})`;
        keyIcon.style.transform += ` rotate(${curLevel * (count % 2 == 0 ? settings.rotate : -settings.rotate)}deg)`;

        // Fading
        if (!active && timer > settings.inactiveTime) {
            keyIcon.style.opacity = opacity + 0.35;
        } else {
            keyIcon.style.opacity = 1;
        }
    });
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






