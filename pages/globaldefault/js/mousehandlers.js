
// function to hadnle elements that will be visbile when mouse is over the page
function mouseOverVisibility() {
    // find all elements with class of 'mouseOver' and add event listeners
    var mouseOverElements = document.getElementsByClassName("mouseOver");
    document.querySelector("body").addEventListener("mouseleave", function (event) {
        for (var i = 0; i < mouseOverElements.length; i++) {
            mouseOverElements[i].style.opacity = 0;
        }
    });
    document.querySelector("body").addEventListener("mouseenter", function (event) {
        for (var i = 0; i < mouseOverElements.length; i++) {
            mouseOverElements[i].style.opacity = 1;
        }
    });
}

// function to toggle visiblity of an element
function toggleVisiblity(elmnt, sender) {
    // remove toolbaritemactive class from all elements with class 'toolbaritem'
    var toolbarItemElements = document.getElementsByClassName("toolbaritem");
    for (var i = 0; i < toolbarItemElements.length; i++) {
        toolbarItemElements[i].classList.remove("toolbaritemactive");
    }

    var x = document.getElementById(elmnt);

    // find all elements with class 'tabmenu' and hide them
    var tabmenuElements = document.getElementsByClassName("tabmenu");
    for (var i = 0; i < tabmenuElements.length; i++) {
        if(tabmenuElements[i] != x) tabmenuElements[i].style.visibility = "hidden";
    }

    // toggle visibility of selected element
    if (x.style.visibility === "visible") {
        x.style.visibility = "hidden";
    } else {
        x.style.visibility = "visible";
        sender.classList.add("toolbaritemactive");
    }
}

mouseOverVisibility();