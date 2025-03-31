// https://stackoverflow.com/questions/8376534/shift-canvas-contents-to-the-left

const canvas = document.getElementById('osuCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
var runCanvas = false;
var interval = null;
var opacity = 1;

const maxKeys = 4;

templateKey = function (id, label) {
    let icon = document.createElement('div');
    icon.classList.add('keyIcon');
    icon.textContent = label.toLowerCase();

    let closeBtn = document.createElement('div');
    closeBtn.classList.add('closeBtn');
    closeBtn.classList.add('mouseOver');
    closeBtn.textContent = "x";
    closeBtn.onclick = function () {
        removeKey(id);
        saveState();
    }
    icon.appendChild(closeBtn);

    return {
        key: id,
        label: label,
        curLevel: 0,
        prevLevel: 0,
        active: false,
        targetLevel: 0,
        transitionProgress: 0,
        keyIcon: icon,
    }
}

const activeKeys = [];
var activeKeyIDs = [];

function registerKey(keyID, label){
    if(activeKeys.length >= maxKeys) return;
    activeKeys.push(templateKey(keyID, label));
    activeKeyIDs.push(keyID);
    resizeCanvas();
    buildOptions();
}

function removeKey(keyID){
    const index = activeKeys.findIndex(key => key.key == keyID);
    activeKeys[index].keyIcon.remove();
    activeKeys.splice(index, 1);
    activeKeyIDs.splice(index, 1);
    resizeCanvas();
    buildOptions();

}

function saveState(){
    // store keyID and label
    localStorage.setItem("keys", JSON.stringify(activeKeys.map(key => [key.key, key.label])));
}

async function loadState(){
    const keys = JSON.parse(localStorage.getItem("keys"));
    if(keys == null){
        activeKeys.push(templateKey(29, "z")); //z
        activeKeys.push(templateKey(27, "x")); //x
        activeKeys.push(templateKey(6, "c")); //c
    } else {
        keys.forEach(key => {
            activeKeys.push(templateKey(key[0], key[1]));
        });
    }
    activeKeyIDs = activeKeys.map(key => key.key);
    
    buildOptions();
    resizeCanvas();
}


// canvas resolution settings
var canvasWidth = 800;
var canvasHeight = 200;
const heightPerKey = 150;
var scale = 8;

function shiftCanvas(widthOfMove){
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(ctx.canvas,-widthOfMove, 0);
    // reset back to normal for subsequent operations.
    ctx.globalCompositeOperation = "source-over"
}

function resizeCanvas(){
    if(activeKeys.length == 0) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = canvasWidth * scale;
    canvas.height = canvasHeight * scale * activeKeys.length;
    canvasHeight = heightPerKey * activeKeys.length;

    // shift height of keypool
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

function showKeyIcons() {
    activeKeys.forEach(key => {
        document.body.appendChild(key.keyIcon);
    });
}

function hideKeyIcons() {
    activeKeys.forEach(key => {
        key.keyIcon.remove();
    });
}

function startCanvas(){
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

    showKeyIcons();
}

function stopCanvas(){
    if(interval == null) return;
    runCanvas = false;
    clearInterval(interval);
    hideKeyIcons();
    drawDisconnected();
}

function drawDisconnected() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Arial";
    ctx.fillStyle = "#ffffff20";
    ctx.fillText("Disconnected. Open Woot-verlay.", canvasWidth / 2 - 100, canvasHeight / 2);
}

loadState();
drawDisconnected();






