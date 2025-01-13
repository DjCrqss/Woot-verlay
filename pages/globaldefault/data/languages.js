var english = {
    menus: {
        // addkeys
        addkeys: {
            title: "Add Keys",
        },

        // customise
        customise: {
            title: "Customise",
            active: "Active",
            inactive: "Inactive",
            accent: "Accent",
            keybackground: "Key Background",
            keyopacity: "Key Opacity",
            background: "Background",
            accessiblitymode: "Accessiblity Mode",
            roundprogress: "Rounded Progress",
            instanttransitions: "Instant Transitions",
        },

        // presets
        presets: {
            title: "Presets",
            save: "Save",
            loadclipboard: "Load from Clipboard",
            copytoclipboard: "Copy to Clipboard",
            saved: "Saved",
            wootinglayouts: "Wooting Layouts",
            communitypresets: "Community Presets",
        },

        // lanconnection
        lanconnection: {
            title: "LAN Connection",
            desc: "Connect to an external client.<br>Please connect and wait ~3 seconds.",
            connect: "Connect",
        },

        //extra info
        extrainfo: {
            title: "Toggle Info",
            initialhint: "Start typing!",
            acitvekeys: "Active Keys",
        },

        // edit right click
        edit: {
            rename: "Rename",
            filldir: "Fill dir.",
            remove: "Remove",
        }
    }

}

var chinese = {
    menus: {
        addkeys: {
            title: "添加键",
        }
    }
}

var translator = new Translator({
    defaultLanguage: 'en',
    detectLanguage: true,
    persist : true,
    persistKey: 'userLanguage',
});
translator.add('en', english);
translator.add('zh', chinese);

// translate the page to the detected language
translator.translatePageTo();

for (let button of document.querySelectorAll('button')) {
    button.addEventListener('click', (evt) => {
      translator.translatePageTo(evt.target.dataset.lang);
    });
  }
