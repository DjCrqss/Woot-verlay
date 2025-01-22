// values
const allowDebug = true; // disable on your own project unless you add the same elements to your page
const output = document.querySelector("#output");
const values = document.querySelector("#values");

var latestInputs = new Array(); // logs inputs of keys
var defaultWSI = "ws://127.0.0.1:32312/";
var knownWSI = "ws://127.0.0.1/"
var useDefault = true;
var firstDisconnect = false;
var active = false;
var timer = 0;


function changeDefaultWSI(optionalCustomWSI) {
    newWSI = "ws://" + optionalCustomWSI + ":32312/";
    knownWSI = newWSI;
    defaultWSI = newWSI;
}


// function to bind to server
function connect() {
    // websocket
    const wsUri = useDefault ? defaultWSI : knownWSI;
    
    const websocket = new WebSocket(wsUri);
    

    // action when websocket connects
    websocket.onopen = (e) => { 
        console.log("Connected to server."); 
        if (Date.now() - performance.timing.navigationStart > 3000) {
            // stops the animation playing every refresh
            connectedAnim();
        } else {
            displayToast("Connected to client.", "rgb(50, 101, 66)");
        }
        firstDisconnect = true;

        startCanvas();
    };

    // action if websocket closes
    websocket.onclose = (e) => {
        console.log("Socket is closed. Reconnect will be attempted in 3 seconds.");
        if (firstDisconnect) {
            disconnectedAnim("See you next time!");
            firstDisconnect = false;
        }
        // swap websocket address to handle older versions of the server
        useDefault = !useDefault;
        // reset key input values
        resetKeys();
        connect();

        stopCanvas();
        return;
    };

    // action when websocket recieves data
    websocket.onmessage = (e) => { update(`${e.data}`); };

    // when websocket recieves an error
    websocket.onerror = (e) => { if(firstDisconnect) console.log("Error.  " + e.data); };
}

// function to update the display on the screen
function update(message) {
    // check for key reset
    if (message == "") {
        active = false;
        resetKeys();
        return;
    }

    active = false;
    // split message into key tuples
    const keys = message.split(/[()]/);
    // TODO: filter to make sure keys are Z or X!!!!! z = 29, x = 27
    keys.filter(element => element.length != 0).forEach(element => {
        // split key into seperate values
        var keydata = element.split(':');
        if(keydata[0] == "29"){
            targetZLevel = parseFloat(keydata[1]);
            zActive = parseFloat(keydata[2]) == 1;
            zColInterpol = 0;
            active = true;
        } else if(keydata[0] == "27"){
            targetXLevel = parseFloat(keydata[1]);
            xActive = parseFloat(keydata[2]) == 1;
            xColInterpol = 0;
            active = true;
        }
    })
}

function updateOpacity(){
    if(active){
        timer = 0;
        opacity = 1;
    } else {
        timer += 1;
        if(timer > settings.inactiveTime && opacity > 0){
            // make the next 100 steps fade out
            opacity -= 0.01;
        }
    }
}


// reset keys to unpressed state if screen should be cleared upon all keys released
function resetKeys() {
    // REPLACE THIS SECTION WITH YOUR KEY OBJECTS TO CUSTOMISE
    // var childKeys = document.getElementById('keyboard').getElementsByClassName('key');
    // for (i = 0; i < childKeys.length; i++) childKeys[i].getElementsByClassName('progress')[0].style.height = "0";
    // if (allowDebug) values.innerHTML = "Active keys: ";
}

// attempt connection
connect();


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
