"use strict";

const pages = new Map([
    ["projects", loadProjectsPage],
    ["about", loadAboutPage],
]);
const defaultPage = pages.keys().next().value;
const contentDiv = document.getElementById("content");

window.onload = function () {
    // generate menu bar
    const menuBar = document.getElementById("menuBar");
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

    fetch("./".concat(pageKey, ".html"))
        .then(response => response.text())
        .then(html => {
            contentDiv.innerHTML = html;
            pages.get(pageKey)(); // load new content
        })
        .catch(error => {
            contentDiv.innerText = "ERROR LOADING PAGE :(";
            console.error(error);
        });
}

function loadProjectsPage() {
    console.log("projects page loaded :D");
}

function loadAboutPage() {
    console.log("about page loaded :D");
}
