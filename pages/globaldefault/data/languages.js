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
        // language
        language: {
            title: "Language",
        }
    },
    // edit right click
    edit: {
        rename: "Rename",
        filldir: "Fill dir.",
        remove: "Remove",
        selectionhint: "[Shift click] to select multiple keys.&emsp;&emsp;|&emsp;&emsp;[CTRL + A] to select all keys."
    },

}

var chinese = {
    menus: {
        addkeys: {
            title: "添加键",
        },
         // customise
         customise: {
            title: "定制",
            active: "积极的",
            inactive: "不活跃",
            accent: "口音",
            keybackground: "主要背景",
            keyopacity: "键不透明度",
            background: "背景",
            accessiblitymode: "无障碍模式",
            roundprogress: "全面进展",
            instanttransitions: "即时转换",
        },
        // presets
        presets: {
            title: "预设",
            save: "保存",
            loadclipboard: "从剪贴板加载",
            copytoclipboard: "复制到剪贴板",
            saved: "保存的布局",
            wootinglayouts: "Wooting 布局",
            communitypresets: "社区布局",
        },
        // lanconnection
        lanconnection: {
            title: "LAN 联系",
            desc: "连接到外部客户端。<br>请连接并等待约 3 秒",
            connect: "连接",
        },
        //extra info
        extrainfo: {
            title: "切换信息",
            initialhint: "开始打字!",
            acitvekeys: "活动键",
        },
        // language
        language: {
            title: "改变语言",
        }
    },
    // edit right click
    edit: {
        rename: "重命名",
        filldir: "填充方向",
        remove: "消除",
        selectionhint: "[Shift 单击] 选择多个键。&emsp;&emsp;|&emsp;&emsp;[CTRL + A] 选择所有键。"
    },
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
