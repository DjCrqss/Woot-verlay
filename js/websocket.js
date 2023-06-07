// values
const output = document.querySelector("#output");
const values = document.querySelector("#values");

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
        useDefault = !useDefault;
        resetKeys();
        // reset key input values
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

    var content = "";

    // split message into key tuples
    const keys = message.split(/[()]/);
    keys.filter(element => element.length != 0).forEach(element => {
        // split key into seperate values
        var values = element.split(':');
        content += "(" + values[0] + " " + values[1].substring(0, 4) + " " + values[2] + ") ";
        // draw key with values
        var activeKey;
        // find div on keyboard with id of key pressed down and customise its CSS
        if (activeKey = document.getElementById(values[0])) {
            // draw height of key
            var pressure = parseFloat(values[1].replace(',', '.') * 100);
            activeKey.style.height = pressure + "%";
            activeKey.style.width = pressure + "%";
            // draw rounding
            if (this.isRounded) { activeKey.style.borderRadius = (100 - pressure) + "px"; }
            else { activeKey.style.borderRadius = 0; }
            // draw active state of key
            activeKey.style.backgroundColor = values[2] == 1 ? "var(--active)" : null;
        }
    })

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

// reset keys to unpressed state
function resetKeys() {
    var childKeys = document.getElementById('keyboard').getElementsByClassName('key');
    for (i = 0; i < childKeys.length; i++) childKeys[i].getElementsByClassName('progress')[0].style.height = "0";
}

// attempt connection
connect();