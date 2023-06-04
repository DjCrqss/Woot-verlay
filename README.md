# Woot-verlay
Pressure sensitive display for the analog values of your Wooting keyboard! Visit the page to mess around, or add it as a fully functional overlay to your streams.
[Check out a demonstration here](https://www.youtube.com/watch?v=62ZL6NmN-KM)

## Running the app
This application uses a localTCP server that must be kept running while using the website to display your values.
Download and run the exe file in the releases section. It should pop up in your system tray!
You may have to accept the warnings to run the program, as I can not afford a digital signature, but if you are worried, feel free to download the source code and build the program yourself! To accept the smartscreen warning, click 'more info' at the top left, then 'run anyway'.

You may have to update to the DotNet6 framework if you are not on Windows 11. However this is a short one-time process with instructions upon launching the app. You will also need to have Wootility (from Wooting) installed.


### Website view
- [Open this link!](https://djcrqss.github.io/Woot-verlay/index.html)
- If the link above does not work, you may have to download the html and css file and open it manually,
- Right click on the icon and click quit once you are done.

### OBS overlay
This uses a browser source.
- Add a new Browser Source to your scene and label it.
- Set the URL to `https://djcrqss.github.io/Woot-verlay/index.html`
- I recommend setting width to 800 and height to 600, and leave the next two options unticked
If it doesn't work after some time, open this menu back up and click 'Refresh cache of current page'

Configure your setup by right clicking on the overlay and clicking 'Interact'.

## Configuring your settings
When your mouse is on the page, a popup appears at the top middle of the screen.
- Click + to bring the key sidebar out where you can add extra keys by clicking on them
- Click the cog to change global settings
- Click the eye to see extra stats below the keyboard.

Right click on a key to open a menu to change fill direction or delete the key.
Click and drag on the keys to shift them around, and hover, then drag the green or orange dotted handles on the edges of a key to resize it.




---

## Planned features
- Preset configurations
- Export and import profiles to send to others
- Showing actuation points
- Mouse support with keys and velocity
- Custom key names

- Possibly add screen overlay that gets rendered on top of your games and apps




