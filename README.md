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

Configure your setup by right-clicking on the overlay and clicking 'Interact'.

## Configuring your settings
When your mouse is on the page, a popup appears at the top middle of the screen.
- Click + to bring the key sidebar out where you can add extra keys by clicking on them
- Click the cog to change global settings
- Click the eye to see extra stats below the keyboard.

Right-click on a key to open a menu to change the fill direction or delete the key.
Click and drag on the keys to shift them around, and hover, then drag the green or orange dotted handles on the edges of a key to resize it.

----
## Profile presets
Here are example profile presets. To use them, copy the text, then click the presets option in the toolbar (looks like bookmarks) and paste it in the box that appears. Then click save to apply it.


### Default gaming
```
[[4,"A",96,72,1,1,"bottom"],[22,"S",168,72,1,1,"bottom"],[7,"D",240,72,1,1,"bottom"],[225,"🡅",0,0,1.6,1,"bottomRight"],[224,"Ctrl",0,72,1.2,1,"topRight"],[44,"__",324,72,8.8,1,"bottom"],[26,"W",144,0,1,1,"bottom"]]
```

### TKL Keyboard
```
[[26,"W",204,144,1,1,"bottom"],[4,"A",156,216,1,1,"bottom"],[22,"S",228,216,1,1,"bottom"],[7,"D",300,216,1,1,"bottom"],[225,"🡅",24,288,2.6,1,"centre"],[224,"Ctrl",24,360,1.4,1,"centre"],[44,"__",312,360,6.6,1,"bottom"],[41,"Esc",24,72,1,1,"centre"],[30,"1",96,72,1,1,"horizontal"],[31,"2",168,72,1,1,"horizontal"],[33,"4",312,72,1,1,"horizontal"],[32,"3",240,72,1,1,"horizontal"],[34,"5",384,72,1,1,"horizontal"],[35,"6",456,72,1,1,"horizontal"],[36,"7",528,72,1,1,"horizontal"],[37,"8",600,72,1,1,"horizontal"],[38,"9",672,72,1,1,"horizontal"],[39,"0",744,72,1,1,"horizontal"],[45,"-",816,72,1,1,"centre"],[46,"+",888,72,1,1,"centre"],[42,"Back",960,72,2.2,1,"centre"],[43,"Tab",24,144,1.6,1,"centre"],[20,"Q",132,144,1,1,"bottomRight"],[8,"E",276,144,1,1,"bottomLeft"],[21,"R",348,144,1,1,"centre"],[23,"T",420,144,1,1,"centre"],[28,"Y",492,144,1,1,"centre"],[24,"U",564,144,1,1,"centre"],[12,"I",636,144,1,1,"centre"],[18,"O",708,144,1,1,"centre"],[19,"P",780,144,1,1,"centre"],[47,"[",852,144,1,1,"vertical"],[48,"]",924,144,1,1,"vertical"],[49,"\\",996,144,1.6,1,"centre"],[57,"Caps",24,216,2,1,"centre"],[9,"F",372,216,1,1,"left"],[10,"G",444,216,1,1,"centre"],[11,"H",516,216,1,1,"centre"],[13,"J",588,216,1,1,"centre"],[14,"K",660,216,1,1,"centre"],[15,"L",732,216,1,1,"centre"],[51,"; :",804,216,1,1,"centre"],[52,"' \"",876,216,1,1,"centre"],[40,"Enter",948,216,2.4,1,"centre"],[25,"V",408,288,1,1,"topLeft"],[27,"X",264,288,1,1,"top"],[6,"C",336,288,1,1,"topLeft"],[29,"Z",192,288,1,1,"topRight"],[5,"B",480,288,1,1,"centre"],[16,"M",624,288,1,1,"centre"],[17,"N",552,288,1,1,"centre"],[54,",",696,288,1,1,"centre"],[55,".",768,288,1,1,"centre"],[56,"/ ?",840,288,1,1,"centre"],[82,"▲",912,288,3,1,"bottom"],[227,"Win",120,360,1.4,1,"centre"],[226,"Alt",216,360,1.4,1,"centre"],[1033,"Fn",720,360,1.4,1,"centre"],[79,"▶",1008,360,1.4,1,"left"],[80,"◀",816,360,1.4,1,"right"],[81,"▼",912,360,1.4,1,"top"]]
```

### DPAD
```
[[4,"A",12,84,1,1,"right"],[22,"S",84,156,1,1,"top"],[225,"🡅",456,96,1.6,1,"bottomRight"],[44,"__",84,84,1,1,"centre"],[26,"W",84,12,1,1,"bottom"],[7,"D",156,84,1,1,"left"],[79,"▶",564,84,1,1,"left"],[80,"◀",420,84,1,1,"right"],[81,"▼",492,156,1,1,"top"],[82,"▲",492,12,1,1,"bottom"],[56,"/ ?",492,84,1,1,"undefined"]]
```

### OSU
```
[[29,"Z",48,84,3.4,1,"bottom"],[27,"X",804,84,3.4,1,"bottom"]]
```
```
[[9,"F",120,60,1.2,1.8,"left"],[7,"D",60,36,1.2,2.6,"right"],[13,"J",324,60,1.2,1.8,"right"],[14,"K",384,36,1.2,2.6,"left"]]
```

Please feel free to send in your own ones and I will update this list!
<br><br>

---

## Planned features
- Preset configurations as buttons and ability to save and load colour scheme too
- Showing actuation points
- Custom key names
- Rewrite code to be less spaghetti




