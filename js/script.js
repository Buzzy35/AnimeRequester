const divCards = document.getElementById("cards");
const divCategorie = document.getElementById("categories");
const selectRecherche = document.getElementById('rechercheType');
const inputText = document.getElementById('text');
const buttonEffacer = document.getElementById('effacer');
const afficheCategorie = document.getElementById("checkNativeSwitch");

/**
 * add event for change thecheckbox to activate or desactivate the categories
 */
afficheCategorie.addEventListener("change", (e) => {
    if (e.target.checked) {
        addCategorie();
    } else {
        divCategorie.innerHTML = ``;
    }
});

/**
 * function to get the API key in the local storage or in a prompt
 */
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

/**
 * function search anime by name into the API
 * @param name name of the anime
 * @returns {Promise<void>}
 */
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
        if (data.data.length === 0) {
            divCards.innerHTML = `
            <div class="card" style="width: 18rem; margin: 10px;">
                <img src="img/notfind.jpg" class="card-img-top" alt="notfind">
                <div class="card-body">
                    <h5 class="card-title">pas resultat trouvé</h5>
                    <p class="card-text"></p>
                </div>
            </div>
            `;
        } else {
            data.data.forEach(anime => {
                addAnime(anime);
            });
        }

    } catch (error) {
        console.error("Erreur lors du fetch :", error);
    }
}

/**
 * function to search anime by casement into the API
 * @param rank rank of the anime
 * @returns {Promise<void>}
 */
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
        divCards.innerHTML = `
        <div class="card" style="width: 18rem; margin: 10px;">
            <img src="img/notfind.jpg" class="card-img-top" alt="notfind">
            <div class="card-body">
                <h5 class="card-title">pas resultat trouvé</h5>
                <p class="card-text"></p>
            </div>
        </div>
        `;
    }
}

/**
 * funtion to search anime by id into the API
 * @param id id of the anime
 * @returns {Promise<void>}
 */
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
        divCards.innerHTML = `
        <div class="card" style="width: 18rem; margin: 10px;">
            <img src="img/notfind.jpg" class="card-img-top" alt="notfind">
            <div class="card-body">
                <h5 class="card-title">pas resultat trouvé</h5>
                <p class="card-text"></p>
            </div>
        </div>
        `;
    }
}

/**
 * function run by the search button
 * @param e event of the button
 */
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

/**
 * funtion to add a card with the anime
 * @param anime anime to add
 */
function addAnime(anime) {
    divCards.innerHTML += `
        <div class="card" style="width: 18rem; margin: 10px;">
            <img src="${anime.image}" class="card-img-top" alt="${anime.title}">
            <div class="card-body">
                <h5 class="card-title">${anime.title}</h5>
                <p class="card-text">Id : ${anime._id}</p>
                <p class="card-text">Classement : ${anime.ranking}</p>
                <p class="card-text">Categories : ${anime.genres}</p>
                <p class="card-text">Nb d'episode : ${anime.episodes}</p>
                <p class="card-text">${anime.synopsis.slice(0, 100)}...</p>
                <a href="${anime.link}" target="_blank" class="btn btn-primary">Voir sur MAL</a>
            </div>
        </div>
    `;
}

/**
 * funtion to add the categories to check into the form
 * @returns {Promise<void>}
 */
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
        <label class="btn btn-outline-primary me-1 mb-1" for="${c._id}">${c._id}</label>
    `;
        });

    } catch (error) {
        console.error("Erreur lors du fetch :", error);
    }
}

/**
 * function to change the theme
 */
function themeChange() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-bs-theme");

    if (currentTheme === "dark") {
        html.setAttribute("data-bs-theme", "light");
        sessionStorage.setItem("theme", "light");
    } else {
        html.setAttribute("data-bs-theme", "dark");
        sessionStorage.setItem("theme", "dark");
    }
}

/**
 * funtion to load a theme saved in the session storage
 */
window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = sessionStorage.getItem("theme");
    if (savedTheme) {
        document.documentElement.setAttribute("data-bs-theme", savedTheme);
        document.getElementById("theme-switch").checked = (savedTheme === "dark");
    }
});

/**
 * funtion to change the type of the input where switch the type of the search
 */
selectRecherche.addEventListener("change", (e) => {
    const valeur = e.target.value;

    switch (valeur) {
        case 'animeName':
            inputText.type = "text";
            break;
        case 'classement':
            inputText.type = "number";
            break;
        case 'animeID':
            inputText.type = "number";
            break;
    }
});

/**
 * button to clear the input and the cards
 */
buttonEffacer.addEventListener("click", () => {
    inputText.value = ``;
    divCards.innerHTML = ``;
});
