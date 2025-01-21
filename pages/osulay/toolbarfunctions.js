var activeColour = [126, 212, 83] //#7ed453 #00ff95; 
var inactiveColour = [226, 65, 65]; //#e24141 or #ff0000 or #e2ab41
var transparentColour = [224, 222, 222]; //#e0dede #39393976
var thickness = 2;

// for speed
var activeColourString = `rgb(${activeColour[0]}, ${activeColour[1]}, ${activeColour[2]})`;
var inactiveColourString = `rgb(${inactiveColour[0]}, ${inactiveColour[1]}, ${inactiveColour[2]})`;
var transparentColourString = `rgb(${transparentColour[0]}, ${transparentColour[1]}, ${transparentColour[2]})`;

var speed = 2;
var refreshrate = 120;

var smoothness = 0.8;

var density; // not used yet but will determine spacing of items
var maxHeight; // not used yet but will determine height of items
var transitionTime; // not used yet but will determine interpolation of colour change for line and icons
var endFade = true; // will determine if lines will fade out at the end of the canvas

var inactiveFading = true; // will determine if lines will fade out after inactivity
var inactiveTime = 300; // will determine time before lines fade out