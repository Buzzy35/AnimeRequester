    const divCards = document.getElementById("cards");

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
        try {
            const response = await fetch(`https://anime-db.p.rapidapi.com/anime?page=1&size=10&search=${name}`, {
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

            divCards.innerHTML = ``;
            addAnime(data);

        } catch (error) {
            console.error("Erreur lors du fetch :", error);
        }
    }

    async function getByID(id) {
        try {
            const response = await fetch(`https://anime-db.p.rapidapi.com/anime/by-id/${id}`, {
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



    function themeChange() {
                const html = document.documentElement;
                if (html.getAttribute("data-bs-theme") === "dark") {
                    html.setAttribute("data-bs-theme", "light");
                } else {
                    html.setAttribute("data-bs-theme", "dark");
                }
            }




