// related to all the differnt menus and their functions in the toolbar

const activeColPicker = document.getElementById('activeColorPicker');
const inactiveColPicker = document.getElementById('inactiveColorPicker');
const accentPicker = document.getElementById('accentColorPicker');
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
    );
    // set colours on screen
    document.documentElement.style.setProperty('--active', colours[0]);
    document.documentElement.style.setProperty('--inactive', colours[1]);
    document.documentElement.style.setProperty('--prim-color', colours[2]);
} else {
    colours = new Array(
        getComputedStyle(document.body).getPropertyValue('--active'),
        getComputedStyle(document.body).getPropertyValue('--inactive'),
        getComputedStyle(document.body).getPropertyValue('--prim-color')
    )
}


// colour listeners
activeColPicker.value = getComputedStyle(document.body).getPropertyValue('--active');
activeColPicker.addEventListener('input', function () {
    colours[0] = activeColPicker.value;
    document.documentElement.style.setProperty('--active', activeColPicker.value);
    console.log(activeColPicker.value);
    saveColours();
});

inactiveColPicker.value = getComputedStyle(document.body).getPropertyValue('--inactive');
inactiveColPicker.addEventListener('input', function () {
    colours[1] = inactiveColPicker.value;
    document.documentElement.style.setProperty('--inactive', inactiveColPicker.value);
    saveColours()
});

accentPicker.value = getComputedStyle(document.body).getPropertyValue('--prim-color');
accentPicker.addEventListener('input', function () {
    colours[2] = accentPicker.value;
    document.documentElement.style.setProperty('--prim-color', accentPicker.value);
    saveColours()
});

// save colours to storage
function saveColours() {
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
        document.onkeydown = function(e) {return true;}
        activeColPicker.type = "text";
        inactiveColPicker.type = "text";
        accentPicker.type = "text";
    } else {
        document.onkeydown = function(e) {return false;}
        activeColPicker.type = "color";
        inactiveColPicker.type = "color";
        accentPicker.type = "color";
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


// CUSTOM LAN
function connectToExternalLan(){
    var ip = document.getElementById("lanInput").value;
    changeDefaultWSI(ip);
    console.log("Connecting to custom IP");
}
