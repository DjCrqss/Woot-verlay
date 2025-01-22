// colour stored as rgb array to allow opacity change 
var activeColour = [126, 212, 83] //#7ed453 #00ff95; 
var inactiveColour = [226, 65, 65]; //#e24141 or #ff0000 or #e2ab41
var accentColour = '#e0dede';
var backgroundColour = '#18171C';
var thickness = 2;

var colours = [activeColour, inactiveColour, accentColour, backgroundColour];

// for faster access
var activeColourString = `rgb(${activeColour[0]}, ${activeColour[1]}, ${activeColour[2]})`;
var inactiveColourString = `rgb(${inactiveColour[0]}, ${inactiveColour[1]}, ${inactiveColour[2]})`;

var speed = 2;
var refreshrate = 120; // 

var smoothness = 0.8;

var density; // not used yet but will determine spacing of items
var maxHeight; // not used yet but will determine height of items
var transitionTime; // not used yet but will determine interpolation of colour change for line and icons
var endFade = true; // will determine if lines will fade out at the end of the canvas

var inactiveFading = true; // will determine if lines will fade out after inactivity
var inactiveTime = 300; // will determine time before lines fade out


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


// load from localstorage
if (localStorage.getItem("osu-colours")) {
    var data = JSON.parse(localStorage.getItem("osu-colours"));
    colours = new Array(
        data[0], // active
        data[1], // inactive
        data[2], // accent
        data[3], // background
    );

    // console.log(colours);

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
updateColourPickers();

function updateColourPickers() {
    activeColPicker.value = rgbToHex(activeColour);
    inactiveColPicker.value = rgbToHex(inactiveColour);
    accentPicker.value = accentColour;
    backgroundColPicker.value = backgroundColour;
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


// canvas settings
scrollSpeedPicker.addEventListener('input', function () {
    speed = parseInt(scrollSpeedPicker.value);
});

endfadeCheckbox.addEventListener('input', function () {
    endFade = endfadeCheckbox.checked;
});