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

### LAN connections
If you want to use the overlay on a different computer to the one running the server, you will need to connect them to the same network. This will allow you to host the overlay on another PC that could be recording, or even on a mobile device as a mini external display!

Unfortunately, due to the way web security works, I would have to purchase and distribute a digital certificate to allow you to connect to the server. This is not something I can afford to do, so you will have to download this repository. Above the code, click on the green 'Code' button, then click 'Download ZIP'. Extract the files and double-click on the html file. 

When launching Woot-verlay client, make sure to press 'Yes' on the first popup. Go into your system tray (bottom right) and right-click on Wootverlay, it should now show your local IP.
On another device, open the [site](https://djcrqss.github.io/Woot-verlay/index.html) and in the toolbar at the top, click on the WiFi icon and enter the IP then press connect. It will take a few seconds, but after a while, try pressing a key on your keyboard and it should show up on the site!


## Configuring your settings
When your mouse is on the page, a popup appears at the top middle of the screen.
- Click + to bring the key sidebar out where you can add extra keys by clicking on them
- Click the cog to change global settings
    - You can change colours, rounding, and transition speed.
- Click the bookmark icon to copy and paste new profiles.
- Click the WiFi/LAN icon to connect to your keyboard from an external device.
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
[[26,"W",204,144,1,1,"bottom"],[4,"A",156,216,1,1,"bottom"],[22,"S",228,216,1,1,"bottom"],[7,"D",300,216,1,1,"bottom"],[225,"🡅",24,288,2.6,1,"centre"],[224,"Ctrl",24,360,1.3,1,"centre"],[44,"__",294,360,7.3,1,"bottom"],[41,"Esc",24,72,1,1,"centre"],[30,"1",96,72,1,1,"horizontal"],[31,"2",168,72,1,1,"horizontal"],[33,"4",312,72,1,1,"horizontal"],[32,"3",240,72,1,1,"horizontal"],[34,"5",384,72,1,1,"horizontal"],[35,"6",456,72,1,1,"horizontal"],[36,"7",528,72,1,1,"horizontal"],[37,"8",600,72,1,1,"horizontal"],[38,"9",672,72,1,1,"horizontal"],[39,"0",744,72,1,1,"horizontal"],[45,"-",816,72,1,1,"centre"],[46,"+",888,72,1,1,"centre"],[42,"Back",960,72,2.2,1,"centre"],[43,"Tab",24,144,1.6,1,"centre"],[20,"Q",132,144,1,1,"bottomRight"],[8,"E",276,144,1,1,"bottomLeft"],[21,"R",348,144,1,1,"centre"],[23,"T",420,144,1,1,"centre"],[28,"Y",492,144,1,1,"centre"],[24,"U",564,144,1,1,"centre"],[12,"I",636,144,1,1,"centre"],[18,"O",708,144,1,1,"centre"],[19,"P",780,144,1,1,"centre"],[47,"[",852,144,1,1,"vertical"],[48,"]",924,144,1,1,"vertical"],[49,"\\",996,144,1.6,1,"centre"],[57,"Caps",24,216,2,1,"centre"],[9,"F",372,216,1,1,"left"],[10,"G",444,216,1,1,"centre"],[11,"H",516,216,1,1,"centre"],[13,"J",588,216,1,1,"centre"],[14,"K",660,216,1,1,"centre"],[15,"L",732,216,1,1,"centre"],[51,"; :",804,216,1,1,"centre"],[52,"' \"",876,216,1,1,"centre"],[40,"Enter",948,216,2.4,1,"centre"],[25,"V",408,288,1,1,"topLeft"],[27,"X",264,288,1,1,"top"],[6,"C",336,288,1,1,"topLeft"],[29,"Z",192,288,1,1,"topRight"],[5,"B",480,288,1,1,"centre"],[16,"M",624,288,1,1,"centre"],[17,"N",552,288,1,1,"centre"],[54,",",696,288,1,1,"centre"],[55,".",768,288,1,1,"centre"],[56,"/ ?",840,288,1,1,"centre"],[82,"▲",912,288,3,1,"bottom"],[227,"Win",114,360,1.3,1,"centre"],[226,"Alt",204,360,1.3,1,"centre"],[1033,"Fn",744,360,1.3,1,"centre"],[79,"▶",1014,360,1.3,1,"left"],[80,"◀",834,360,1.3,1,"right"],[81,"▼",924,360,1.3,1,"top"]]
```

### TWOHE (Thanks mr._n)
```
[[26,"W",204,324,1,1,"bottom"],[4,"A",156,396,1,1,"bottom"],[22,"S",228,396,1,1,"bottom"],[7,"D",300,396,1,1,"bottom"],[225,"🡅",24,468,2.6,1,"bottom"],[44,"__",294,540,7.3,1,"bottom"],[41,"Esc",24,156,1,1,"bottom"],[30,"1",96,252,1,1,"bottom"],[31,"2",168,252,1,1,"bottom"],[33,"4",312,252,1,1,"bottom"],[32,"3",240,252,1,1,"bottom"],[34,"5",384,252,1,1,"bottom"],[35,"6",456,252,1,1,"bottom"],[36,"7",528,252,1,1,"bottom"],[37,"8",600,252,1,1,"bottom"],[38,"9",672,252,1,1,"bottom"],[39,"0",744,252,1,1,"bottom"],[45,"-",816,252,1,1,"bottom"],[46,"+",888,252,1,1,"bottom"],[42,"Back",960,252,2.2,1,"bottom"],[43,"Tab",24,324,1.6,1,"bottom"],[20,"Q",132,324,1,1,"bottom"],[8,"E",276,324,1,1,"bottom"],[21,"R",348,324,1,1,"bottom"],[23,"T",420,324,1,1,"bottom"],[28,"Y",492,324,1,1,"bottom"],[24,"U",564,324,1,1,"bottom"],[12,"I",636,324,1,1,"bottom"],[18,"O",708,324,1,1,"bottom"],[19,"P",780,324,1,1,"bottom"],[47,"[",852,324,1,1,"bottom"],[48,"]",924,324,1,1,"bottom"],[49,"\\",996,324,1.6,1,"bottom"],[57,"Caps",24,396,2,1,"bottom"],[9,"F",372,396,1,1,"left"],[10,"G",444,396,1,1,"bottom"],[11,"H",516,396,1,1,"bottom"],[13,"J",588,396,1,1,"bottom"],[14,"K",660,396,1,1,"bottom"],[15,"L",732,396,1,1,"bottom"],[51,"; :",804,396,1,1,"bottom"],[52,"' \"",876,396,1,1,"bottom"],[40,"Enter",948,396,2.4,1,"bottom"],[25,"V",408,468,1,1,"bottom"],[27,"X",264,468,1,1,"bottom"],[6,"C",336,468,1,1,"bottom"],[29,"Z",192,468,1,1,"bottom"],[5,"B",480,468,1,1,"bottom"],[16,"M",624,468,1,1,"bottom"],[17,"N",552,468,1,1,"bottom"],[54,",",696,468,1,1,"bottom"],[55,".",768,468,1,1,"bottom"],[56,"/ ?",840,468,1,1,"bottom"],[82,"▲",1224,468,1,1,"bottom"],[227,"Win",114,540,1.3,1,"bottom"],[226,"Alt",204,540,1.3,1,"bottom"],[79,"▶",1296,540,1,1,"left"],[80,"◀",1152,540,1,1,"right"],[81,"▼",1224,540,1,1,"top"],[229,"🡅",912,468,3,1,"bottom"],[53,"~",24,252,1,1,"bottom"],[60,"F3",312,156,1,1,"bottom"],[59,"F2",240,156,1,1,"bottom"],[62,"F5",492,156,1,1,"bottom"],[61,"F4",384,156,1,1,"bottom"],[63,"F6",564,156,1,1,"bottom"],[64,"F7",636,156,1,1,"bottom"],[65,"F8",708,156,1,1,"bottom"],[66,"F9",816,156,1,1,"bottom"],[67,"F10",888,156,1,1,"bottom"],[68,"F11",960,156,1,1,"bottom"],[69,"F12",1032,156,1,1,"bottom"],[70,"PrtSc",1152,156,1,1,"bottom"],[71,"ScrLk",1296,156,1,1,"bottom"],[73,"Ins",1152,252,1,1,"bottom"],[74,"Home",1224,252,1,1,"bottom"],[75,"PgUp",1296,252,1,1,"bottom"],[76,"Del",1152,324,1,1,"bottom"],[77,"End",1224,324,1,1,"bottom"],[78,"PgDn",1296,324,1,1,"bottom"],[83,"NumLk",1416,252,1,1,"bottom"],[230,"Alt",744,540,1.3,1,"bottom"],[101,"Menu",834,540,1.3,1,"bottom"],[1033,"Fn",924,540,1.3,1,"centre"],[228,"Ctrl",1014,540,1.3,1,"bottom"],[58,"F1",168,156,1,1,"bottom"],[85,"*",1560,252,1,1,"bottom"],[84,"/",1488,252,1,1,"bottom"],[86,"-",1632,252,1,1,"bottom"],[89,"1",1416,468,1,1,"bottom"],[90,"2",1488,468,1,1,"bottom"],[91,"3",1560,468,1,1,"bottom"],[92,"4",1560,396,1,1,"bottom"],[93,"5",1488,396,1,1,"bottom"],[94,"6",1416,396,1,1,"bottom"],[95,"7",1416,324,1,1,"bottom"],[96,"8",1488,324,1,1,"bottom"],[97,"9",1560,324,1,1,"bottom"],[87,"+",1632,324,1,2.2,"bottom"],[88,"Enter",1632,468,1,2.2,"bottom"],[99,".",1560,540,1,1,"bottom"],[98,"0",1416,540,2.2,1,"bottom"],[72,"Pau",1224,156,1,1,"bottom"],[1027,"A1",1416,156,1,1,"bottom"],[1028,"A2",1488,156,1,1,"bottom"],[1029,"A3",1560,156,1,1,"bottom"],[1030,"Mode",1632,156,1,1,"bottom"],[224,"Ctrl",24,540,1.3,1,"bottom"]]
```

### DPAD
```
[[4,"A",12,84,1,1,"right"],[22,"S",84,156,1,1,"top"],[44,"__",84,84,1,1,"centre"],[26,"W",84,12,1,1,"bottom"],[7,"D",156,84,1,1,"left"],[79,"▶",564,84,1,1,"left"],[80,"◀",420,84,1,1,"right"],[81,"▼",492,156,1,1,"top"],[82,"▲",492,12,1,1,"bottom"],[56,"/ ?",492,84,1,1,"bottom"]]
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



