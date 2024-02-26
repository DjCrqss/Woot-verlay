// related to all the differnt menus and their functions in the toolbar

const activeColPicker = document.getElementById('activeColorPicker');
const inactiveColPicker = document.getElementById('inactiveColorPicker');
const accentPicker = document.getElementById('accentColorPicker');
const keyBgColPicker = document.getElementById('keyBgColorPicker');
const keyBgOpacityPicker = document.getElementById('keyBgOpacityPicker');
const backgroundColPicker = document.getElementById('backgroundColorPicker');
const inputCheckbox = document.getElementById('inputCheckbox');
const transitionCheckbox = document.getElementById('transitionCheckbox');


// COLOURS
var colours;
// get colours from storage
if (localStorage.getItem("colours")) {
    colours = new Array(
        JSON.parse(localStorage.getItem("colours"))[0],
        JSON.parse(localStorage.getItem("colours"))[1],
        JSON.parse(localStorage.getItem("colours"))[2],
        JSON.parse(localStorage.getItem("colours"))[3],
        JSON.parse(localStorage.getItem("colours"))[4]
    );
    // set colours on screen
    document.documentElement.style.setProperty('--active', colours[0]);
    document.documentElement.style.setProperty('--inactive', colours[1]);
    document.documentElement.style.setProperty('--prim-color', colours[2]);
    document.documentElement.style.setProperty('--key-color', colours[3]);
    document.documentElement.style.setProperty('--app-bg', colours[4]);
} else {
    colours = new Array(
        getComputedStyle(document.body).getPropertyValue('--active'),
        getComputedStyle(document.body).getPropertyValue('--inactive'),
        getComputedStyle(document.body).getPropertyValue('--prim-color'),
        getComputedStyle(document.body).getPropertyValue('--key-color'),
        getComputedStyle(document.body).getPropertyValue('--app-bg')
    )
}
updateColourPickers();


function updateColourPickers() {
    activeColPicker.value = getComputedStyle(document.body).getPropertyValue('--active');
    inactiveColPicker.value = getComputedStyle(document.body).getPropertyValue('--inactive');
    accentPicker.value = getComputedStyle(document.body).getPropertyValue('--prim-color');
    keyBgColPicker.value = getComputedStyle(document.body).getPropertyValue('--key-color').substring(0, 7);
    let stringOpacity = getComputedStyle(document.body).getPropertyValue('--key-color').substring(7, 10);
    keyBgOpacityPicker.value = parseInt(stringOpacity, 16) / 255;
    backgroundColPicker.value = getComputedStyle(document.body).getPropertyValue('--app-bg');
    
}
// colour listeners

activeColPicker.addEventListener('input', function () {
    colours[0] = activeColPicker.value;
    updateColours();
});

inactiveColPicker.addEventListener('input', function () {
    colours[1] = inactiveColPicker.value;
    updateColours();
});

accentPicker.addEventListener('input', function () {
    colours[2] = accentPicker.value;
    updateColours();
});

keyBgColPicker.addEventListener('input', function () {
    var opacity = Math.round(keyBgOpacityPicker.value * 255).toString(16);
    if (opacity.length == 1) {
        opacity = "0" + opacity;
    }
    colours[3] = keyBgColPicker.value + opacity;
    updateColours();
});

keyBgOpacityPicker.addEventListener('input', function () {
    // convert 0 to 1 to 00 to ff
    var opacity = Math.round(keyBgOpacityPicker.value * 255).toString(16);
    if (opacity.length == 1) {
        opacity = "0" + opacity;
    }
    colours[3] = keyBgColPicker.value + opacity;
    updateColours();
});

backgroundColPicker.addEventListener('input', function () {
    colours[4] = backgroundColPicker.value;
    updateColours();
});



// save colours to storage and update values
function updateColours() {
    document.documentElement.style.setProperty('--active', colours[0]);
    document.documentElement.style.setProperty('--inactive', colours[1]);
    document.documentElement.style.setProperty('--prim-color', colours[2]);
    document.documentElement.style.setProperty('--key-color', colours[3]);
    document.documentElement.style.setProperty('--app-bg', colours[4]);
    localStorage.setItem("colours", JSON.stringify(colours));
}



// CHECKBOXES

// if transition checkbox is checked set transitinos to 0.02 seconds
transitionCheckbox.addEventListener('change', function () {
    if (this.checked) {
        document.documentElement.style.setProperty('--col-transition', '0.02s');
        document.documentElement.style.setProperty('--transform-transition', '0.02s');
    } else {
        document.documentElement.style.setProperty('--col-transition', '0.05s');
        document.documentElement.style.setProperty('--transform-transition', '0.15s');
    }
});

// if input checkbox is checked then replace the color pickers with text inputs
// document.onkeydown = function(e) {return false;}
inputCheckbox.addEventListener('change', function () {
    if (this.checked) {
        document.onkeydown = function (e) { return true; }
        activeColPicker.type = "text";
        inactiveColPicker.type = "text";
        accentPicker.type = "text";
        keyBgColPicker.type = "text";
        backgroundColPicker.type = "text";
    } else {
        document.onkeydown = function (e) { return false; }
        activeColPicker.type = "color";
        inactiveColPicker.type = "color";
        accentPicker.type = "color";
        keyBgColPicker.type = "color";
        backgroundColPicker.type = "color";
    }
});


// rounding
var isRounded = JSON.parse(localStorage.getItem("isRounded")) || false;
document.getElementById("roundingCheckbox").onclick = function () {
    isRounded = this.checked;
    localStorage.setItem("isRounded", this.checked);
};
document.getElementById("roundingCheckbox").checked = isRounded;


// PRESETS
function copyToClipboard() {
    var copyText = document.getElementById("presetInput");
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand("copy");
}

async function pasteFromClipboard() {
    var pasteText = document.getElementById("presetInput");
    pasteText.focus();
    const text = await navigator.clipboard.readText();
    pasteText.value = text;
    loadState();
}

// custom presets 
for (let i = 0; i < 3; i++) {
    let presetName = localStorage.getItem("preset" + i + "Name");
    if (presetName != null) {
        document.getElementById("preset" + i + "Name").innerHTML = presetName;
    }
}

function loadPreset(presetNum) {
    // load from localstorage
    let preset = localStorage.getItem("preset" + presetNum);
    if (preset != null) {
        loadState(preset);
        if(localStorage.getItem("preset" + presetNum + "Colours") != null) {
            colours = JSON.parse(localStorage.getItem("preset" + presetNum + "Colours"));
            updateColours();
            updateColourPickers();
        }
        
    } else {
        alert("No preset saved in this slot!");
    }
}

function savePreset(presetNum) {
    // save to localstorage
    if (localStorage.getItem("preset" + presetNum) != null) {
        if (!confirm("There is already a preset saved in this slot. Do you want to overwrite it?")) {
            return;
        }
    }
    let presetName = prompt("Please enter a preset name:");
    if (presetName == null) {
        return;
    } else if (presetName.length > 10) {
        presetName = presetName.substring(0, 16);
    }
    // set name on screen
    document.getElementById("preset" + presetNum + "Name").innerHTML = presetName;
    localStorage.setItem("preset" + presetNum, localStorage.getItem("keys"));
    localStorage.setItem("preset" + presetNum + "Colours", JSON.stringify(colours));
    localStorage.setItem("preset" + presetNum + "Name", presetName);
}

// default presets
// data taken from ../data/wootingLayouts.js
var defaultPresetsContainer = document.getElementById("defaultPresets");
defaultPresetsData.forEach(element => {
    // create template  <button onclick="loadPreset(0)" id="preset0Name">Empty</button>
    let preset = document.createElement("button");
    preset.innerHTML = element.id;
    preset.onclick = function () {
        loadDefaultPreset(element.id);
    };
    defaultPresetsContainer.appendChild(preset);
});

function loadDefaultPreset(presetName) {
    defaultPresetsData.forEach(element => {
        if (element.id == presetName) {
            loadState(JSON.stringify(element.keys));
        }
    });
}


// CUSTOM LAN
function connectToExternalLan() {
    // check if page is from github
    if (window.location.href.includes("djcrqss.github.io")) {
        alert("You can't connect to a custom IP from the github page. Please download the project and run it locally. \n There are instructions on the readme.");
    }

    var ip = document.getElementById("lanInput").value;
    changeDefaultWSI(ip);
    console.log("Connecting to custom IP");
}
