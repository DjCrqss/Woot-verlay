// colour stored as rgb array to allow opacity change 
var activeColour = [126, 212, 83] //#7ed453 #00ff95; 
var inactiveColour = [226, 65, 65]; //#e24141 or #ff0000 or #e2ab41
var accentColour = '#e0dede';
var backgroundColour = '#18171C';

var colours = [activeColour, inactiveColour, accentColour, backgroundColour];

// for faster access
var activeColourString = `rgb(${activeColour[0]}, ${activeColour[1]}, ${activeColour[2]})`;
var inactiveColourString = `rgb(${inactiveColour[0]}, ${inactiveColour[1]}, ${inactiveColour[2]})`;


var settings = {
    speed: 2,
    refreshrate: 120,
    
    smoothness: 0.8,
    thickness: 2,
    
    density: 0.8, // not used yet but will determine spacing of items
    maxHeight: 0.2, // not used yet but will determine height of items
    transitionTime: 0.8, // not used yet but will determine interpolation of colour change for line and icons
    endFade: true, // will determine if lines will fade out at the end of the canvas
    
    inactiveFading: true,
    inactiveTime: 300,
    intantTransitions: false
}

// on-screen elements
const activeColPicker = document.getElementById('activeColorPicker');
const inactiveColPicker = document.getElementById('inactiveColorPicker');
const accentPicker = document.getElementById('accentColorPicker');
const backgroundColPicker = document.getElementById('backgroundColorPicker');

const scrollSpeedPicker = document.getElementById('scrollSpeedPicker');
const endfadeCheckbox = document.getElementById('endFadeCheckbox');

const smoothingPicker = document.getElementById('smoothingPicker');
const thicknessPicker = document.getElementById('thicknessPicker');

const inactiveFadeCheckbox = document.getElementById('inactiveFadeCheckbox');
const inputCheckbox = document.getElementById('inputCheckbox'); // accessibility
const instantTransitionsCheckbox = document.getElementById('instantTransitionsCheckbox');


// load from localstorage
if (localStorage.getItem("osu-colours")) {
    var data = JSON.parse(localStorage.getItem("osu-colours"));
    colours = new Array(
        data[0], // active
        data[1], // inactive
        data[2], // accent
        data[3], // background
    );

    activeColour = colours[0];
    inactiveColour = colours[1];
    accentColour = colours[2];
    backgroundColour = colours[3];
    activeColourString = `rgb(${activeColour[0]}, ${activeColour[1]}, ${activeColour[2]})`;
    inactiveColourString = `rgb(${inactiveColour[0]}, ${inactiveColour[1]}, ${inactiveColour[2]})`;
    saveColours();
} else {
    // save default colours
    saveColours();
}

if (localStorage.getItem("osu-settings")) {
    var data = JSON.parse(localStorage.getItem("osu-settings"));
    settings = {
        speed: data.speed,
        refreshrate: data.refreshrate,
        
        smoothness: data.smoothness,
        thickness: data.thickness,
        
        density: data.density,
        maxHeight: data.maxHeight,
        transitionTime: data.transitionTime,
        endFade: data.endFade,
        
        inactiveFading: data.inactiveFading,
        inactiveTime: data.inactiveTime,
        instantTransitions: data.instantTransitions
    }
    saveSettings();
} else {
    // save default settings
    saveSettings();
}

updatePickers();

function updatePickers() {
    activeColPicker.value = rgbToHex(activeColour);
    inactiveColPicker.value = rgbToHex(inactiveColour);
    accentPicker.value = accentColour;
    backgroundColPicker.value = backgroundColour;
    scrollSpeedPicker.value = settings.speed;
    endfadeCheckbox.checked = settings.endFade;
    smoothingPicker.value = settings.smoothness;
    thicknessPicker.value = settings.thickness;
    inactiveFadeCheckbox.checked = settings.inactiveFading;
    instantTransitionsCheckbox.checked = settings.instantTransitions;
}

function rgbToHex(rgb) {
    return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
}

function hexToRgb(hex) {
    return ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0];
}

function saveColours() {
    localStorage.setItem("osu-colours", JSON.stringify(colours));
    document.documentElement.style.setProperty('--app-bg', colours[3]);
}

activeColPicker.addEventListener('input', function () {
    activeColour = hexToRgb(activeColPicker.value);
    activeColourString = `rgb(${activeColour[0]}, ${activeColour[1]}, ${activeColour[2]})`;
    colours[0] = activeColour;
    saveColours();
});

inactiveColPicker.addEventListener('input', function () {
    inactiveColour = hexToRgb(inactiveColPicker.value);
    inactiveColourString = `rgb(${inactiveColour[0]}, ${inactiveColour[1]}, ${inactiveColour[2]})`;
    colours[1] = inactiveColour;
    saveColours();
});

accentPicker.addEventListener('input', function () {
    accentColour = accentPicker.value;
    colours[2] = accentColour;
    saveColours();
});

backgroundColPicker.addEventListener('input', function () {
    backgroundColour = backgroundColPicker.value;
    colours[3] = backgroundColour;
    saveColours();
});

function saveSettings() {
    localStorage.setItem("osu-settings", JSON.stringify(settings));
}

// canvas settings
scrollSpeedPicker.addEventListener('input', function () {
    settings.speed = parseInt(scrollSpeedPicker.value);
    saveSettings();
});

endfadeCheckbox.addEventListener('input', function () {
    settings.endFade = endfadeCheckbox.checked;
    saveSettings();
});

smoothingPicker.addEventListener('input', function () {
    settings.smoothness = parseFloat(smoothingPicker.value);
    saveSettings();
});

thicknessPicker.addEventListener('input', function () {
    settings.thickness = parseInt(thicknessPicker.value);
    saveSettings();
});

inactiveFadeCheckbox.addEventListener('input', function () {
    settings.inactiveFading = inactiveFadeCheckbox.checked;
    if(!settings.inactiveFading) opacity = 1;
    saveSettings();
});


// if input checkbox is checked then replace the color pickers with text inputs
// document.onkeydown = function(e) {return false;}
inputCheckbox.addEventListener('change', function () {
    if (this.checked) {
        document.onkeydown = function (e) { return true; }
        activeColPicker.type = "text";
        inactiveColPicker.type = "text";
        accentPicker.type = "text";
        backgroundColPicker.type = "text";
    } else {
        document.onkeydown = function (e) { return false; }
        activeColPicker.type = "color";
        inactiveColPicker.type = "color";
        accentPicker.type = "color";
        backgroundColPicker.type = "color";
    }
});

instantTransitionsCheckbox.addEventListener('input', function () {
    settings.instantTransitions = instantTransitionsCheckbox.checked;
    saveSettings();
});

function resetSettings(){
    colours = [
        [126, 212, 83],
        [226, 65, 65],
        '#e0dede',
        '#18171C'
    ];
    settings = {
        speed: 2,
        refreshrate: 120,
        
        smoothness: 0.8,
        thickness: 2,
        
        density: 0.8,
        maxHeight: 0.2,
        transitionTime: 0.8,
        endFade: true,
        
        inactiveFading: true,
        inactiveTime: 300,
        intantTransitions: false
    }
    activeColour = colours[0];
    inactiveColour = colours[1];
    accentColour = colours[2];
    backgroundColour = colours[3];
    activeColourString = `rgb(${activeColour[0]}, ${activeColour[1]}, ${activeColour[2]})`;
    inactiveColourString = `rgb(${inactiveColour[0]}, ${inactiveColour[1]}, ${inactiveColour[2]})`;
    saveColours();
    saveSettings();
    updatePickers();
}

