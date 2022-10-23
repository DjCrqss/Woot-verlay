# Woot-verlay
Pressure sensitive display for the analog values of your Wooting keyboard! Visit the page to mess around, or add it as a fully functional overlay to your streams.

## Running the site
### Website view
This application uses a localTCP server that must be kept running while using the website to display your values.
- Download/clone the repository locally.
- Open a terminal inside the folder.
- Type 'dotnet run'. It should say 'Server has started on xxx, Waiting for a connection'.
- Open PressureClient.html in your favourite browser :)

### OBS overlay
This uses a browser source.
- Follow the steps above first
- Add a new Browser Source to your scene and label it.
- Set the URL to the address of the PressureClient loaded in your webpage (it should look something like file:///C:/Users....../Woot-verlay/PressureClient.html)
- I recommend setting width to 800 and height to 200, and leave the next two options unticked
- In Custom CSS, add the line `.optionalInfo{ display: none;}` below the first pre-added line
If it doesn't work after some time, open this menu back up and click 'Refresh cache of current page'

---

## Planned features
- UI to allow showing/hiding any key.
- Theming with custom shapes and colours
- Preset configurations
- Showing actuation points




