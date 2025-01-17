// related to all the differnt menus, settings, and their functions in the toolbar
const customProfileCount = 3;

const activeColPicker = document.getElementById('activeColorPicker');
const inactiveColPicker = document.getElementById('inactiveColorPicker');
const accentPicker = document.getElementById('accentColorPicker');
const keyBgColPicker = document.getElementById('keyBgColorPicker');
const keyBgOpacityPicker = document.getElementById('keyBgOpacityPicker');
const backgroundColPicker = document.getElementById('backgroundColorPicker');
const inputCheckbox = document.getElementById('inputCheckbox'); /* accessiblity mode */
const transitionCheckbox = document.getElementById('transitionCheckbox');

var urlParams = new URLSearchParams(window.location.search);
var profile = urlParams.get('profile') || urlParams.get('p') || urlParams.get('preset');

// COLOURS
var colours;

// check if url points to a valid profile
var urlProfile = -1;
if (profile) {
    // check all the presetXName to see if the profile exists
    for (let i = 0; i < customProfileCount; i++) {
        let presetName = localStorage.getItem("preset" + i + "Name");
        if (presetName.toLowerCase().replace(/\s+/g, '') == profile.toLowerCase().replace(/\s+/g, '')) {
            loadPreset(i);
            break;
        }
    }
}

// if url points to valid profile, load it
if(urlProfile != -1) {
    loadPreset(urlProfile);
}
// get colours from storage
else if (localStorage.getItem("colours")) {
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
function updateColours(optionalColours) {
    if(optionalColours){
        colours = optionalColours;
    }
    document.documentElement.style.setProperty('--active', colours[0]);
    document.documentElement.style.setProperty('--inactive', colours[1]);
    document.documentElement.style.setProperty('--prim-color', colours[2]);
    document.documentElement.style.setProperty('--key-color', colours[3]);
    document.documentElement.style.setProperty('--app-bg', colours[4]);
    localStorage.setItem("colours", JSON.stringify(colours));
    if(optionalColours){
        updateColourPickers();
    }
}

// CHECKBOXES
// if transition checkbox is checked set transitions to 0.02 seconds
var instantTransition = JSON.parse(localStorage.getItem("instantTransition")) || false;
if (instantTransition) {
    document.documentElement.style.setProperty('--col-transition', '0.01s');
    document.documentElement.style.setProperty('--transform-transition', '0.01s');
} else {
    document.documentElement.style.setProperty('--col-transition', '0.05s');
    document.documentElement.style.setProperty('--transform-transition', '0.15s');
}
transitionCheckbox.addEventListener('change', function () {
    instantTransition = this.checked;
    if (this.checked) {
        document.documentElement.style.setProperty('--col-transition', '0.01s');
        document.documentElement.style.setProperty('--transform-transition', '0.01s');
    } else {
        document.documentElement.style.setProperty('--col-transition', '0.05s');
        document.documentElement.style.setProperty('--transform-transition', '0.15s');
    }
    localStorage.setItem("instantTransition", this.checked);
});
transitionCheckbox.checked = instantTransition;

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
    copyText.blur();
}

async function pasteFromClipboard() {
    var pasteText = document.getElementById("presetInput");
    pasteText.focus();
    const text = await navigator.clipboard.readText();
    pasteText.value = text;
    loadState();
    pasteText.blur();
}

// custom presets 
for (let i = 0; i < customProfileCount; i++) {
    let presetName = localStorage.getItem("preset" + i + "Name");
    if (presetName != null) {
        document.getElementById("preset" + i + "Name").innerHTML = presetName;
    }
}

function loadPreset(presetNum) {
    // load from localstorage
    let preset = localStorage.getItem("preset" + presetNum);
    if (preset != null) {
        // load colours
        if(localStorage.getItem("preset" + presetNum + "Colours") != null) {
            var storedColours = JSON.parse(localStorage.getItem("preset" + presetNum + "Colours"));
        }
        // load settings
        if(localStorage.getItem("preset" + presetNum + "Settings") != null) {
            var storedSettings = JSON.parse(localStorage.getItem("preset" + presetNum + "Settings"));
        }
        loadState(preset, storedColours, storedSettings);
    } else {
        alert("No preset saved in this slot!");
    }
}

function loadSettings(settings) {
    // Check if properties exist and fallback to defaults only if undefined
    instantTransition = "instantTransition" in settings ? settings.instantTransition : false;
    document.getElementById("transitionCheckbox").checked = instantTransition;

    isRounded = "isRounded" in settings ? settings.isRounded : false;
    document.getElementById("roundingCheckbox").checked = isRounded;

    // Synchronise with localStorage
    localStorage.setItem("instantTransition", instantTransition);
    localStorage.setItem("isRounded", isRounded);
}

function savePreset(presetNum) {
    // save to localstorage
    if (localStorage.getItem("preset" + presetNum) != null) {
        if (!confirm("There is already a preset saved in this slot. Do you want to overwrite it?")) {
            return;
        }
    }
    
    let presetName = prompt("Please enter a preset name:");

    let presetExists = false;
    for (let i = 0; i < customProfileCount; i++) {
        // Skip the current preset (for overwriting)
        if (i === presetNum) continue;
        if (presetName.toLowerCase().replace(/\s+/g, '') === localStorage.getItem("preset" + i + "Name").toLowerCase().replace(/\s+/g, '')) {
            console.log("Preset name already exists!" + presetName);
            presetExists = true;
            break;
        }
    }

    if (presetName == null) {
        return;
    } else if (presetExists) {
        alert("Preset name already exists!");
        return;
    }
    
    else if (presetName.length > 10) {
        presetName = presetName.substring(0, 16);
    }
    // set name on screen
    document.getElementById("preset" + presetNum + "Name").innerHTML = presetName;
    localStorage.setItem("preset" + presetNum, localStorage.getItem("keys"));
    localStorage.setItem("preset" + presetNum + "Colours", JSON.stringify(colours));
    localStorage.setItem("preset" + presetNum + "Name", presetName);
    localStorage.setItem("preset" + presetNum + "Settings", JSON.stringify({
        "instantTransition": instantTransition,
        "isRounded": isRounded
    }));
}

// default presets
// data taken from ../data/wootingLayouts.js
var defaultPresetsContainer = document.getElementById("defaultPresets");
defaultPresetsData.forEach(element => {
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
