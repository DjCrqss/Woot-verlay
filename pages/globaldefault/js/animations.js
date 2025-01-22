function connectedAnim(){
    // create div coverintg the whole screen
    var cover = document.createElement('div');
    cover.style.position = "fixed";
    cover.style.bottom = "-250vmax";
    cover.style.right = "calc(-250vmax + 10vw)";
    cover.style.width = "0";
    cover.style.height = "0";
    cover.style.pointerEvents = "none";
    cover.style.opacity = 0.5;
    cover.style.zIndex = "99";
    cover.style.background = 'radial-gradient(circle, rgba(122,255,100,0) 0%, rgba(60,219,107,1) 30%, rgba(122,255,100,0) 67%)';
    
    setTimeout(() => {
        cover.style.transition = "opacity 1.5s, width 1.5s, height 1.5s";
        cover.style.width = "500vmax";
        cover.style.height = "500vmax";;
    }, 50);

    setTimeout(() => {
        cover.style.opacity = 0;
        setTimeout(() => {
            document.body.removeChild(cover);
        }, 2000);
    }, 750);

    displayToast("Connected to client.", "rgb(50, 101, 66)");

    // display onscreen
    document.body.appendChild(cover);
}

function disconnectedAnim(optionalText){
    // create div coverintg the whole screen
    var cover1 = document.createElement('div');
    cover1.style.position = "fixed";
    cover1.style.bottom = "-250vmax";
    cover1.style.right = "calc(-250vmax + 10vw)";
    cover1.style.width = "500vmax";
    cover1.style.height = "500vmax";;
    cover1.style.pointerEvents = "none";
    cover1.style.opacity = 0.5;
    cover1.style.zIndex = "99";
    cover1.style.background = 'radial-gradient(circle, rgba(122,255,100,0) 0%, rgb(219, 60, 60) 30%, rgba(122,255,100,0) 67%)';
    
    setTimeout(() => {
        cover1.style.transition = "opacity 1s, width 1s cubic-bezier(.26,.35,.84,.05), height 1s cubic-bezier(.26,.35,.84,.05)";
        cover1.style.width = "0";
        cover1.style.height = "0";
    }, 50);

    setTimeout(() => {
        cover1.style.opacity = 0;
        setTimeout(() => {
            document.body.removeChild(cover1);
        }, 2500);
    }, 750);

    displayToast(optionalText || "Disconnected from client.", "rgb(101, 50, 50)");

    // display onscreen
    document.body.appendChild(cover1);
}

function displayToast(content, colour){
    // connected message
    var message = document.createElement('span');
    message.style.position = "absolute";
    message.style.opacity = 0;
    message.style.bottom = "0.5em";
    message.style.right = "1em";
    message.style.color = "white";
    message.style.fontFamily = "sans-serif";
    message.style.fontSize = "1.3em";
    message.textContent = content;
    message.style.backgroundColor = colour;
    message.style.padding = "0.65em 1.15em";
    message.style.borderRadius = "0.35em";
    message.style.transition = "opacity 0.3s, bottom 0.3s";
    message.style.zIndex = "100";

    // display animation
    setTimeout(() => {
        message.style.opacity = 1;
        message.style.bottom = "1em";
    }, 400);

    // removal animation
    setTimeout(() => {
        message.style.opacity = 0;
        message.style.bottom = "1.5em";
        setTimeout(() => {
            document.body.removeChild(message);
        }, 300);
    }, 3000);

    // display onscreen
    document.body.appendChild(message);
}