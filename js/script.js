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

const URL = `https://anime-db.p.rapidapi.com/anime?page=1&size=10&search=Fullmetal`;

async function getData() {
    try {
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                'x-rapidapi-key': KEY,
                'x-rapidapi-host': 'anime-db.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            throw new Error("Erreur HTTP : " + response.status);
        }

        const data = await response.json();
        console.log("Données reçues :", data);

    } catch (error) {
        console.error("Erreur lors du fetch :", error);
    }
}

function getByName(name) {

}

function getByClassement() {

}

function getByID(id) {

}


function onRecherche(e) {
    e.preventDefault();

    const data = new FormData(e.target);

    switch (data.get("rechercheType")) {
        case "animeName":
            getByName(data.get("text"));
            break;
        case "classement":
            getByClassement();
            break;
        case "animeID":
            getByID(data.get("text"));
            break;
        default:
            console.error("Type de recherche invalide");
            break;
    }
}







