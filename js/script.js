const divCards = document.getElementById("cards");
const divCategorie = document.getElementById("categories");

function getKey() {
    const cookies = document.cookie.split("; ");
    let cookieValue = null;

    for (let c of cookies) {
        const [key, value] = c.split("=");
        if (key === "KEY") {
            cookieValue = decodeURIComponent(value);
            break;
        }
    }
    if (cookieValue) {
        return cookieValue;
    } else {
        const cookieValue = prompt("Quelle est votre cle d'API");

        let date = new Date();
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + date.toUTCString();

        document.cookie = `KEY=${cookieValue}; ${expires}; path=/`;
    }
    return cookieValue;
}

const KEY = getKey();
console.log(KEY);

async function getByName(name) {

    const categories = Array.from(document.querySelectorAll("#categories input[type='checkbox']:checked"))
        .map(checkbox => checkbox.id);

    const cat = "&genres=" + categories.join("%2C").replace(" ", "%20");

    try {
        const response = await fetch(`https://anime-db.p.rapidapi.com/anime?page=1&size=10&search=${name + cat}`, {
            method: "GET", headers: {
                'x-rapidapi-key': KEY, 'x-rapidapi-host': 'anime-db.p.rapidapi.com'
            }
        });
        if (!response.ok) {
            throw new Error("Erreur HTTP : " + response.status);
        }

        const data = await response.json();

        divCards.innerHTML = ``;

        data.data.forEach(anime => {
            addAnime(anime);
        });

    } catch (error) {
        console.error("Erreur lors du fetch :", error);
    }
}

async function getByClassement(rank) {
    try {
        const response = await fetch(`https://anime-db.p.rapidapi.com/anime/by-ranking/${rank}`, {
            method: "GET", headers: {
                'x-rapidapi-key': KEY, 'x-rapidapi-host': 'anime-db.p.rapidapi.com'
            }
        });
        if (!response.ok) {
            throw new Error("Erreur HTTP : " + response.status);
        }

        const data = await response.json();

        divCards.innerHTML = ``;
        addAnime(data);

    } catch (error) {
        console.error("Erreur lors du fetch :", error);
    }
}

async function getByID(id) {
    try {
        const response = await fetch(`https://anime-db.p.rapidapi.com/anime/by-id/${id}`, {
            method: "GET", headers: {
                'x-rapidapi-key': KEY, 'x-rapidapi-host': 'anime-db.p.rapidapi.com'
            }
        });
        if (!response.ok) {
            throw new Error("Erreur HTTP : " + response.status);
        }

        const data = await response.json();

        divCards.innerHTML = ``;
        addAnime(data);

    } catch (error) {
        console.error("Erreur lors du fetch :", error);
    }
}

function onRecherche(e) {
    e.preventDefault();

    const data = new FormData(e.target);

    switch (data.get("rechercheType")) {
        case "animeName":
            getByName(data.get("text"));
            break;
        case "classement":
            getByClassement(data.get("text"));
            break;
        case "animeID":
            getByID(data.get("text"));
            break;
        default:
            console.error("Type de recherche invalide");
            break;
    }
}

function addAnime(anime) {
    divCards.innerHTML += `
        <div class="card" style="width: 18rem; margin: 10px;">
            <img src="${anime.image}" class="card-img-top" alt="${anime.title}">
            <div class="card-body">
                <h5 class="card-title">${anime.title}</h5>
                <p class="card-text">${anime.synopsis.slice(0, 100)}...</p>
                <a href="${anime.link}" target="_blank" class="btn btn-primary">Voir sur MAL</a>
            </div>
        </div>
    `;
}

async function addCategorie() {

    try {
        const response = await fetch(`https://anime-db.p.rapidapi.com/genre`, {
            method: "GET", headers: {
                'x-rapidapi-key': KEY, 'x-rapidapi-host': 'anime-db.p.rapidapi.com'
            }
        });
        if (!response.ok) {
            throw new Error("Erreur HTTP : " + response.status);
        }

        const data = await response.json();

        divCategorie.innerHTML = ``;

        data.forEach((c) => {
            divCategorie.innerHTML += `
        <input type="checkbox" class="btn-check" value="${c._id}" id="${c._id}" autocomplete="off">
        <label class="btn btn-outline-primary" for="${c._id}">${c._id}</label>
    `;
        });

    } catch (error) {
        console.error("Erreur lors du fetch :", error);
    }
}

addCategorie();








