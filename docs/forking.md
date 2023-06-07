# Looking to create your own visuals?
You can clone this code or even use one file to start on your own.

## How this code works:
The websocket.js handles all the communication between this page (the client) and the server (Woot-verlay desktop app). When the server is running in your system tray, it sends constant updates when the keyboard is pressed. The websocket.js file listens for these updates and calls an `update()` function to handle them.

The `update()` function is where you can add your own code to handle the keyboard presses. The `update()` function is called with a `message` object which was sent to the server in a compressed format. It decodes it into an array of values labelled `keydata` for each key in a loop. The format of `keydata` will be:
`[key id, key pressure (0-1), key active (0 or 1)]`. 
If you want to see the raw data, it looks like this `(4:1:1)(7:1:1)(26:0.18039216:0)`

In the code you will see that key pressure has ` var pressure = parseFloat(keydata[1].replace(',', '.') * 100);` which is because the server sends the pressure as a string with a comma instead of a decimal point in some countries. This also converts it into a percentage which can be used in CSS.

Where the code says to REPLACEME, is where you can choose to add your own code to handle the key presses!

Finally, there is an optional function called `resetKeys()` which is called when no keys are pressed. This is useful for any lags in the connection or if you want to reset the visuals when no keys are pressed.

I have left a template txt in this folder for you to add your own code.




### Extras
The template and actual code have two ports, default and 32312. This is because the legacy code used the default, but I have changed it to 32312 to avoid conflicts with other programs. It is a good idea in the future to only use 32312 or your chosen ports so it does not have to check both every time.

The Woot-verlay desktop app is coded to send a empty message once after all keys have been to let go which allows us to call the resetKeys() function.