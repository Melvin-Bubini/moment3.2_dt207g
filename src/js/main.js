"use strict";

let url = "http://127.0.0.1:3001/jobs";

let cvArticle = document.getElementById('cvArticle')

// Lägg till en referens till felmeddelande-spanet
const errorSpan = document.getElementById('errorSpan');

getData(); // Hämta datan när sidan laddas


async function getData() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.length > 0) {
            cvArticle.style.display = "block";
            displayCvData(data); // Visa datan när den har hämtats
        } else {
            cvArticle.style.display = "none"; // Dölj cvArticle om det inte finns någon data
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function createCv(companyname, jobtitle, location) {
    try {
        // Validera inputfälten
        if (!companyname || !jobtitle || !location) {
            errorSpan.textContent = "Alla fält är obligatoriska.";
            return;
        }

        // Ta bort eventuellt tidigare felmeddelande
        errorSpan.textContent = "";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ companyname, jobtitle, location })
        });

        const data = await response.json();
        console.log(data);
        getData(); // Uppdatera datan på skärmen efter tillägg
    } catch (error) {
        console.error("Error creating CV:", error);
    }
}

async function editCv(cvId, currentData) {
    // Skapa ett redigeringsformulär
    const form = document.createElement("form");

    const companynameInput = document.createElement("input");
    companynameInput.type = "text";
    companynameInput.value = currentData.companyname;

    const jobtitleInput = document.createElement("input");
    jobtitleInput.type = "text";
    jobtitleInput.value = currentData.jobtitle;

    const locationInput = document.createElement("input");
    locationInput.type = "text";
    locationInput.value = currentData.location;

    const updateButton = document.createElement("button");
    updateButton.textContent = "Uppdatera";

    // Lyssna på uppdateringsknappen
    updateButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const updatedData = {
            companyname: companynameInput.value,
            jobtitle: jobtitleInput.value,
            location: locationInput.value
        };

        await updateCvData(cvId, updatedData);
    });

    form.appendChild(companynameInput);
    form.appendChild(jobtitleInput);
    form.appendChild(locationInput);
    form.appendChild(updateButton);

    cvArticle.innerHTML = ""; // Rensa CV-artikeln
    cvArticle.appendChild(form);
}

async function updateCvData(cvId, updates) {
    try {
        const response = await fetch(`${url}/${cvId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updates)
        });

        const data = await response.json();
        console.log(data);
        getData(); // Uppdatera datan på skärmen efter uppdatering
    } catch (error) {
        console.error("Error updating CV:", error);
    }
}

function displayCvData(cvData) {
    cvArticle.innerHTML = ""; // Rensa tidigare data

    cvData.forEach(cv => {
        let cvElement = document.createElement("div");
        cvElement.classList.add("cv");

        let companyNameElement = document.createElement("h2");
        companyNameElement.textContent = cv.companyname;

        let jobTitleElement = document.createElement("p");
        jobTitleElement.textContent = "Jobbtitel: " + cv.jobtitle;

        let locationElement = document.createElement("p");
        locationElement.textContent = "Plats: " + cv.location;

        let editButton = document.createElement("button");
        editButton.textContent = "Uppdatera";
        editButton.classList.add("edit-button"); // Lägg till klassen för redigeringsknappen
        editButton.addEventListener("click", async () => {
            await editCv(cv._id, cv); // Anropa funktionen för att redigera CV-informationen
        });

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Ta bort";
        deleteButton.classList.add("delete-button"); // Lägg till klassen för borttagn
        deleteButton.addEventListener("click", async () => {
            await deleteCv(cv._id); // Anropa funktionen för att ta bort CV-informationen
        });

        cvElement.appendChild(companyNameElement);
        cvElement.appendChild(jobTitleElement);
        cvElement.appendChild(locationElement);
        cvElement.appendChild(deleteButton); // Lägg till knappen för att ta bort
        cvElement.appendChild(editButton); // Lägg till knappen för att redigera

        cvArticle.appendChild(cvElement);
    });
}

async function deleteCv(cvId) {
    try {
        const response = await fetch(`${url}/${cvId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Kunde inte ta bort CV från servern.");
        }

        getData(); // Uppdatera datan på skärmen efter borttagning
    } catch (error) {
        console.error("Ett fel uppstod vid borttagning av CV:", error);
    }
}

document.getElementById('cvForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Förhindra standardformulärinsändning

    let companyname = document.getElementById('companynameInput').value;
    let jobtitle = document.getElementById('jobtitleInput').value;
    let location = document.getElementById('locationInput').value;

    createCv(companyname, jobtitle, location);

    // Rensa inputfälten efter att CV-informationen har skickats
    document.getElementById('companynameInput').value = "";
    document.getElementById('jobtitleInput').value = "";
    document.getElementById('locationInput').value = "";
});
