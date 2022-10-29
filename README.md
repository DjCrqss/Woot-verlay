# Woot-verlay
Pressure sensitive display for the analog values of your Wooting keyboard! Visit the page to mess around, or add it as a fully functional overlay to your streams.
[Check out a demonstration here](https://www.youtube.com/watch?v=62ZL6NmN-KM)

## Running the app
### Website view
This application uses a localTCP server that must be kept running while using the website to display your values.
- Download and run the exe file in the releases section. It should pop up in your system tray!
- Open PressureClient.html in your favourite browser :)
- Right click on the icon and click quit once you are done.

### OBS overlay
This uses a browser source.
- Follow the steps above first
- Add a new Browser Source to your scene and label it.
- Set the URL to the address of the PressureClient loaded in your webpage (it should look something like file:///C:/Users....../Downloads/PressureClient.html)
- I recommend setting width to 800 and height to 200, and leave the next two options unticked
- In Custom CSS, add the line `.optionalInfo{ display: none;}` below the first pre-added line
- Once you have added all the keys, then add the line `#keyPool{display: none;}` which hides the sidebar
If it doesn't work after some time, open this menu back up and click 'Refresh cache of current page'

## Configuring your settings
Using the sidebar, you can add extra keys to the view. 
Click and drag on the keys to shift them around, and hover then drag over the green or orange handles on the edges of a key to resize it.
Right click on any key to remove it.



---

## Planned features
- Theming with custom shapes and colours
- Preset configurations
- Export and import profiles to send to others
- Showing actuation points
- Buttons to show/hide sidebar and log elements
- Support for non-wooting keyboards as a regular overlay
- Mouse support with keys and velocity
- Custom key names

- Possibly add screen overlay that gets rendered on top of your games and apps




