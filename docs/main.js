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
    loadContentFromHash();
}
window.addEventListener("hashchange", loadContentFromHash);

function loadContentFromHash() {
    contentDiv.innerHTML = ""; // remove old content

    let pageKey = location.hash.slice(1);
    if (!location.hash || !pages.has(pageKey)) {
        location.hash = defaultPage;
        pageKey = defaultPage;
    }
    // load content
    loadContent(pageKey);
}

function loadContent(pageKey){
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
    const projectsList = document.getElementById("projectsList");
    fetch("./projects/projects.json")
        .then(response => response.json())
        .then(projects => {
            projectsList.innerHTML = "";

            // sort projects from newest to oldest
            projects.sort((a, b) => new Date(b.date) - new Date(a.date));

            // load projects in projects list
            projects.forEach(project => {
                appendProjectTile(project.name, project.date, project.path);
            });
        })
        .catch(error => {
            projectsList.innerText = "ERROR LOADING PROJECTS :(";
            console.error(error);
        });
}

function appendProjectTile(name, date, projectPage) {
    const projectsList = document.getElementById("projectsList");

    const tile = document.createElement("div");
    tile.innerText = name.concat(" - ", date);
    tile.onclick = () => loadProjectPage(projectPage);

    projectsList.appendChild(tile);
}

function loadProjectPage(projectPage) {
    fetch(projectPage)
        .then(response => response.text())
        .then(project => {
            contentDiv.innerHTML = "<button onclick='loadContent(`projects`)'>Back</button><hr>";
            contentDiv.innerHTML += project;
        })
        .catch(error => alert("Couldn't load project page for the following reason:".concat(error)));
}

function loadAboutPage() {
    console.log("about page loaded :D");
}
