// convert key ID's to readable names
const keyPairs = {
    A: 4, B: 5, C: 6, D: 7, E: 8, F: 9, G: 10, H: 11, I: 12, J: 13, K: 14, L: 15, M: 16, N: 17, O: 18, P: 19, Q: 20, R: 21, S: 22, T: 23, U: 24, V: 25, W: 26, X: 27, Y: 28, Z: 29,
    1: 30, 2: 31, 3: 32, 4: 33, 5: 34, 6: 35, 7: 36, 8: 37, 9: 38, 0: 39,
    Enter: 40, Esc: 41, Back: 42, Tab: 43, __: 44, '-': 45, '+': 46, '[': 47, ']': 48, '\\': 49,
    '; :': 51, '\' "': 52, '~': 53, ',': 54, '.': 55, '/ ?': 56, Caps: 57,
    F1: 58, F2: 59, F3: 60, F4: 61, F5: 62, F6: 63, F7: 64, F8: 65, F9: 66, F10: 67, F11: 68, F12: 69,
    PrtSc: 70, ScrLk: 71, "⏵⏸": 72, Ins: 73, Home: 74, PgUp: 75, Del: 76, End: 77, PgDn: 78,
    '▶': 79, '◀': 80, '▼': 81, '▲': 82, NumLk: 83, 
    'N/': 84, 'N*': 85, 'N-': 86, 'N+': 87, Enter: 88, 'N1': 89, 'N2': 90, 'N3': 91, 'N4': 92, 'N5': 93, 'N6': 94, 'N7': 95, 'N8': 96, 'N9': 97, 'N0': 98, '.': 99,
    Menu: 101,
    F13: 104, F14: 105, F15: 106, F16: 107, F17: 108, F18: 109, F19: 110, F20: 111, F21: 112, F22: 113, F23: 114, F24: 115,
    Ctrl: 224, "🡅": 225, Alt: 226, Win: 227, RCtrl: 228, "R🡅": 229, RAlt: 230, RWin: 231, Fn: 1033,
    A1: 1027, A2: 1028, A3: 1029, Mode: 1030,
};

const keyPool = document.getElementById("keyPoolOptions");
const keyFilter = document.getElementById("keyPoolInput");
// build keyPool options based on available keys
function buildOptions() {
    // clear existing options
    while (keyPool.firstChild) {
        keyPool.removeChild(keyPool.firstChild);
    }
    // add all options
    for (const [label, keyID] of Object.entries(keyPairs)) {
        if (!activeKeyIDs.includes(keyID) && label.toLowerCase().includes(keyFilter.value.toLowerCase())) {
            var curDiv = document.createElement('span');
            curDiv.className = "keyOption";
            curDiv.textContent = label;
            keyPool.append(curDiv);
            // attach onclick listener
            curDiv.onclick = function () {
                buildKey(new Key(keyID, label, parseInt((Math.random() * (parseInt(window.innerWidth * 0.7 / 72)))) * 72, snapGrid(window.innerHeight * 0.75) - 72 - parseInt((Math.random() * 2)) * 72, 1, 1, "bottom"));
                saveState();
            }
        }
    }

    // update copy to clipboard preset input 
    let savedLayout = JSON.parse(localStorage.getItem("keys"));
    let savedColours = JSON.parse(localStorage.getItem("colours"));
    let savedSettings = {
        "instantTransition": JSON.parse(localStorage.getItem("instantTransition")),
        "isRounded":  JSON.parse(localStorage.getItem("isRounded")),
    }

    presetInput.value = JSON.stringify({
        "layout": savedLayout,
        "colours": savedColours,
        "settings": savedSettings
    });
}