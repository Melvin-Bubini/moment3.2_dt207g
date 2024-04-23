"use strict";
let url = "http://127.0.0.1:3000/jobs";
let cvArticle = document.getElementById("cvArticle");
getData(); // Hämta datan när sidan laddas
async function getData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.length > 0) {
            cvArticle.style.display = "block";
            displayCvData(data); // Visa datan när den har hämtats
        } else cvArticle.style.display = "none"; // Dölj cvArticle om det inte finns någon data
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
async function createCv(companyname, jobtitle, location) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                companyname,
                jobtitle,
                location
            })
        });
        const data = await response.json();
        console.log(data);
        getData(); // Uppdatera datan på skärmen efter tillägg
    } catch (error) {
        console.error("Error creating CV:", error);
    }
}
function displayCvData(cvData) {
    cvArticle.innerHTML = ""; // Rensa tidigare data
    cvData.forEach((cv)=>{
        let cvElement = document.createElement("div");
        cvElement.classList.add("cv");
        let companyNameElement = document.createElement("h2");
        companyNameElement.textContent = cv.companyname;
        let jobTitleElement = document.createElement("p");
        jobTitleElement.textContent = "Jobbtitel: " + cv.jobtitle;
        let locationElement = document.createElement("p");
        locationElement.textContent = "Plats: " + cv.location;
        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Ta bort";
        deleteButton.addEventListener("click", async ()=>{
            await deleteCv(cv._id); // Anropa funktionen för att ta bort CV-informationen
        });
        cvElement.appendChild(companyNameElement);
        cvElement.appendChild(jobTitleElement);
        cvElement.appendChild(locationElement);
        cvElement.appendChild(deleteButton); // Lägg till knappen för att ta bort
        cvArticle.appendChild(cvElement);
    });
}
async function deleteCv(cvId) {
    try {
        const response = await fetch(`${url}/${cvId}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Kunde inte ta bort CV fr\xe5n servern.");
        getData(); // Uppdatera datan på skärmen efter borttagning
    } catch (error) {
        console.error("Ett fel uppstod vid borttagning av CV:", error);
    }
}
document.getElementById("cvForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Förhindra standardformulärinsändning
    let companyname = document.getElementById("companynameInput").value;
    let jobtitle = document.getElementById("jobtitleInput").value;
    let location = document.getElementById("locationInput").value;
    createCv(companyname, jobtitle, location);
    // Rensa inputfälten efter att CV-informationen har skickats
    document.getElementById("companynameInput").value = "";
    document.getElementById("jobtitleInput").value = "";
    document.getElementById("locationInput").value = "";
});

//# sourceMappingURL=index.aa69868b.js.map
