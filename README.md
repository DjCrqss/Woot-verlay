![logo](https://github.com/DjCrqss/Woot-verlay/assets/25734612/d654f249-a332-493f-99d2-3837875cf767)

Pressure-sensitive display for the analogue values of your Wooting keyboard! Visit the page to mess around, or add it as a fully functional overlay to your streams.
[Check out a demonstration here](https://www.youtube.com/watch?v=62ZL6NmN-KM) 
<br><br>

# Features

<img src="https://github.com/DjCrqss/Woot-verlay/assets/25734612/8f93d8ac-c4e4-46c7-8a97-e1d58e331941" width="60%" align="right"/>

### Customisation and Presets
Woot-verlay is made to be extremely customisable. Right-click on keys to rename, change the fill direction or delete them.
Drag the keys to shift them around. Grab the green or orange dotted edges of a key to resize.  Shift click to multi-select.
<br>

Presets are available to save and import. They can be found [here in the project wiki!](https://github.com/DjCrqss/Woot-verlay/wiki/Presets)

<br clear="both"/><br><br>
<img src="https://github.com/user-attachments/assets/53f7b1ef-bba5-43d6-8f1e-b44bc58bc63f" width="60%" align="left"/>

### OSU-lay
A special mode for OSU! players that displays the Z and X keys with a histogram of the pressure values! View here and add to your streams using this link:
[OSU-lay page.](https://djcrqss.github.io/Woot-verlay/pages/osulay/)

Make sure to make the display size in OBS at least 1300x700.


<br clear="both"/><br><br>
<img src="https://github.com/DjCrqss/Woot-verlay/assets/25734612/dde0c084-6368-48a5-a633-597200856cd0" width="60%" align="right"/>

### OBS and LAN connections
The OBS plugin allows streaming to Twitch and other platforms with this as an overlay on top! View the running instructions in the section below.
Using LAN,  you can host the overlay on another PC that could be recording, or even on a mobile device as a mini external display!

<br clear="both"/><br><br>
<img src="https://github.com/DjCrqss/Woot-verlay/assets/25734612/2c203a0d-1ed8-428d-b648-8ec1ff22eb24" width="60%" align="left"/>

### Settings
When your mouse is on the page, a popup appears at the top middle of the screen.
Click + to add extra keys. Use the cog to change global settings, the bookmark icon to copy and paste new profiles, the WiFi/LAN icon to connect to your keyboard from an external device, and the eye to see extra stats below the keyboard.

<br clear="both"/><br>



# Running Woot-verlay
This application uses a local TCP server that must be kept running while using the website to display your values.
Download and run the exe file in the releases section. It should pop up in your system tray!
You may have to accept the warnings to run the program, as I can not afford a digital signature, but if you are worried, feel free to download the source code and build the program yourself! To accept the SmartScreen warning, click 'more info' at the top left, then 'run anyway'.

You may have to update to the .NET 6.0 framework if you aren't on Windows 11. However, this is a short one-time process with instructions upon launching the app. You will also need to have Wootility (from Wooting) installed.
<br>After running the system tray app, choose one of the following viewing methods:
### Option A: Website view
- [Open this link!](https://djcrqss.github.io/Woot-verlay/index.html)
- If the link above does not work, you may have to download the html and css file and open it manually,
- Right-click on the icon and click quit once you are done.

### Option B: OBS overlay
This uses a browser source.
- Add a new Browser Source to your scene and label it.
- Set the URL to `https://djcrqss.github.io/Woot-verlay/index.html`
- I recommend setting the width to 800 and height to 600 and leaving the next two options unticked.
- Configure your setup by right-clicking on the overlay/source and clicking 'Interact'.

If you want to setup multiple instances of the overlay with different layouts/settings you can add the `profile` parameter to the URL. `https://djcrqss.github.io/Woot-verlay/index.html?profile=p1` will be different from `https://djcrqss.github.io/Woot-verlay/index.html?profile=p2`. The `?profile=SOME_ID` will determine the profile using the saved names in the presets menu.

If it doesn't work after some time, open this menu back up and click 'Refresh cache of current page'. 
Note: customisations do not transfer across browsers or from browsers to OBS as they use their own local storage. You can go into presets and copy to clipboard, then paste it into your OBS in the same place.
<br><br>
## Using the LAN connector
To access the visuals across devices
Launch the Woot-verlay client and press 'Yes' on the first popup. Go into your system tray (bottom right) and right-click on Wootverlay, it should now show your local IP.
On another device, open the [site](https://djcrqss.github.io/Woot-verlay/index.html) and in the toolbar at the top, click on the WiFi icon and enter the IP then press connect. 








