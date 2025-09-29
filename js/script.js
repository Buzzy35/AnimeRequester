
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
        const key = cookieValue;
    } else {
        const key = prompt("Quelle est votre cle d'API");

        let date = new Date();
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + date.toUTCString();

        document.cookie = `KEY=${KEY}; ${expires}; path=/`;
    }
    return key;
}

const KEY = getKey();
console.log(KEY);


const rechercheType = document.getElementById("rechercheType");
const btnRechercher = document.getElementById("Rechercher");    
const btnEffacer = document.getElementById("Effacer");
let text = document.getElementById("text");

const URL = `https://anime-db.p.rapidapi.com/anime?page=1&size=10&search=Fullmetal`;

function Effacer() {
    text.value = "";
}

function Recherche() {
    switch (rechercheType.value) {
        case "animeName":
            let animeName = text.value;
            console.log(animeName);
            break;
        case "classement":
            let classement = text.value;
            console.log(classement);
            break;
        case "animeID":
            let animeID = text.value;
            console.log(animeID);
            break;
        default:
            console.error("Type de recherche inconnu :", rechercheType.value);
            return;
    }
}

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





