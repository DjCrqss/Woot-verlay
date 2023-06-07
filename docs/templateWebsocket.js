var latestInputs = new Array(); // logs inputs of keys
var defaultWSI = "ws://127.0.0.1:32312/";
var knownWSI = "ws://127.0.0.1/"
var useDefault = true;


// function to bind to server
function connect() {
    // websocket
    const wsUri = useDefault ? defaultWSI : knownWSI;
    const websocket = new WebSocket(wsUri);

    // action when websocket connects
    websocket.onopen = (e) => { console.log("Connected to server."); };

    // action if websocket closes
    websocket.onclose = (e) => {
        console.log("Socket is closed. Reconnect will be attempted in 3 seconds.");
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
    websocket.onerror = (e) => { console.log("Error.  " + e.data); };
}

// function to update the display on the screen
function update(message) {
    // check for key reset
    if (message == "") {
        resetKeys();
        return;
    }
    
    // split message into key tuples
    const keys = message.split(/[()]/);
    keys.filter(element => element.length != 0).forEach(element => {
        // split key into seperate values
        var keydata = element.split(':');
        // e.g. keydata = [26, 0.055, 0] = [key, pressure, state]

        // INSERT INTO THIS SECTION WITH YOUR KEY OBJECTS TO CUSTOMISE
    })
}

// reset keys to unpressed state if screen should be cleared upon all keys released
function resetKeys() {
  // possibly loop through all keys and reset them here.
}

// attempt connection
connect();