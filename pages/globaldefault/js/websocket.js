// values
const allowDebug = true; // disable on your own project unless you add the same elements to your page
const output = document.querySelector("#output");
const values = document.querySelector("#values");

var latestInputs = new Array(); // logs inputs of keys
var defaultWSI = "ws://127.0.0.1:32312/";
var knownWSI = "ws://127.0.0.1/"
var useDefault = true;
var firstDisconnect = false;


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
    };

    // action if websocket closes
    websocket.onclose = (e) => {
        console.log("Socket is closed. Reconnect will be attempted in 3 seconds.");
        if (firstDisconnect) {
            disconnectedAnim();
            firstDisconnect = false;
        }
        // swap websocket address to handle older versions of the server
        useDefault = !useDefault;
        // reset key input values
        resetKeys();
        connect();
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
        resetKeys();
        return;
    }

    var content = "";
    // split message into key tuples
    const keys = message.split(/[()]/);
    keys.filter(element => element.length != 0).forEach(element => {
        // split key into seperate values
        var keydata = element.split(':');
        content += "(" + keydata[0] + " " + keydata[1].substring(0, 4) + " " + keydata[2] + ") ";

        // REPLACE THIS SECTION WITH YOUR KEY OBJECTS TO CUSTOMISE
        // find div on keyboard with id of key pressed down and customise its CSS
        var activeKey;
        if (activeKey = document.getElementById(keydata[0])) {
            // draw height of key
            var pressure = parseFloat(keydata[1].replace(',', '.') * 100);
            activeKey.style.height = pressure + "%";
            activeKey.style.width = pressure + "%";
            // draw rounding if enabled
            if (this.isRounded) { activeKey.style.borderRadius = (100 - pressure) + "px"; }
            else { activeKey.style.borderRadius = 0; }
            // draw active state of key
            activeKey.style.backgroundColor = keydata[2] == 1 ? "var(--active)" : null;
        }

    })

    if(allowDebug){
        // write active keys
        values.innerHTML = "Active keys: " + content;

        // append to top key log and print
        latestInputs.unshift(content);
        if (latestInputs.length > 30) latestInputs.pop();
        if (document.getElementById("optionalInfo").style.visibility === "visible") {
            var keyLog = "";
            latestInputs.forEach(element => keyLog += element + "<br>");
            output.innerHTML = keyLog;
        }
    }
}

// reset keys to unpressed state if screen should be cleared upon all keys released
function resetKeys() {
    // REPLACE THIS SECTION WITH YOUR KEY OBJECTS TO CUSTOMISE
    var childKeys = document.getElementById('keyboard').getElementsByClassName('key');
    for (i = 0; i < childKeys.length; i++) childKeys[i].getElementsByClassName('progress')[0].style.height = "0";
    if (allowDebug) values.innerHTML = "Active keys: ";
}

// attempt connection
connect();