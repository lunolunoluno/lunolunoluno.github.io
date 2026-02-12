"use strict";

const pages = new Map([
    ["projects", loadProjectsPage],
    ["about", loadAboutPage],
]);
const defaultPage = pages.keys().next().value;
const contentDiv = document.getElementById("content");
const subPageDivider = '#';

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

    let pageKey = location.hash.slice(1); // remove '#' character in the beginning
    pageKey = pageKey.split(subPageDivider)[0]; // remove everything after the sub page divider

    if (!location.hash || !pages.has(pageKey)) {
        location.hash = defaultPage;
        pageKey = defaultPage;
    }
    // load content
    loadContent(pageKey);
}

function loadContent(pageKey) {
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
            const hasASubPage = location.hash.slice(1).split(subPageDivider).length > 1;
            const foundProject = projects.find(project => project.name === location.hash.slice(1).split(subPageDivider)[1]);
            if (hasASubPage && foundProject) { // load specific project
                console.log(foundProject);
                loadProjectPage(foundProject.name, foundProject.path);
            } else { // show the list of projects
                // sort projects from newest to oldest
                projects.sort((a, b) => new Date(b.date) - new Date(a.date));

                // load projects in projects list
                projects.forEach(project => {
                    // create a tile for each project
                    const tile = document.createElement("div");
                    tile.innerText = project.name.concat(" - ", project.date);
                    tile.onclick = () => loadProjectPage(project.name, project.path);

                    projectsList.appendChild(tile);
                });
            }
        })
        .catch(error => {
            projectsList.innerText = "ERROR LOADING PROJECTS :(";
            console.error(error);
        });
}

function loadProjectPage(projectName, projectPage) {
    fetch(projectPage)
        .then(response => response.text())
        .then(project => {
            history.pushState(null, null, location.hash.concat("#", projectName)); // update the hash without triggering the hashchange event
            contentDiv.innerHTML = project;
        })
        .catch(error => alert("Couldn't load project page for the following reason:".concat(error)));
}

function loadAboutPage() {
    console.log("about page loaded :D");
}
