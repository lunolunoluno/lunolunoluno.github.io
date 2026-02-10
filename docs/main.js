"use strict";

const pages = new Map([
    ["work", loadWorkPage],
    ["about", loadAboutPage],
]);
const defaultPage = pages.keys().next().value;
const contentDiv = document.getElementById("content");

window.onload = function () {
    // generate menu bar
    const menuBar = document.getElementById("menu-bar");
    for (const page of pages.keys()) {
        const menuBtn = document.createElement("li");
        const menuLink = document.createElement("a");
        menuLink.href = "#".concat(page);
        menuLink.innerText = page;
        menuBtn.appendChild(menuLink);
        menuBar.appendChild(menuBtn);
    }

    // load content
    loadContent();
}
window.addEventListener("hashchange", loadContent);

function loadContent() {
    contentDiv.innerHTML = ""; // remove old content

    let pageKey = location.hash.slice(1);

    if (!location.hash || !pages.has(pageKey)) {
        location.hash = defaultPage;
        pageKey = defaultPage;
    }

    const loader = pages.get(pageKey);
    loader(); // load new content
}

function loadWorkPage() {
    contentDiv.innerText = "Here will be a list of my projects :D";
}

function loadAboutPage() {
    contentDiv.innerText = "Here will be some info about me :D";
}
