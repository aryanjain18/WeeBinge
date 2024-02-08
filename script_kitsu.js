const API_URL = "https://kitsu.io/api/edge/anime";
const IMG_PATH = "https://media.kitsu.io/anime/poster_images/";
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

getAnime(API_URL);

async function getAnime(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (search.value && search.value !== "") {
      searchAnime(data.data);
    } else {
      showRecommendedAnime(data.data);
    }
  } catch (error) {
    console.error("Error fetching anime:", error);
  }
}

function showRecommendedAnime(animeList) {
  main.innerHTML = "";
  const popularAnime = document.createElement("div");
  const recommendedAnime = document.createElement("div");
  recommendedAnime.innerHTML = "<h2>Recommended Anime for you</h2>";
  const horizontalLine = document.createElement("div");

  popularAnime.classList.add("most-popular");
  recommendedAnime.classList.add("recommended");
  horizontalLine.classList.add("horizontal-list");

  popularAnime.appendChild(horizontalLine);
  main.appendChild(popularAnime);
  main.appendChild(recommendedAnime);

  animeList.forEach((anime, index) => {
    const { attributes } = anime;
    const { canonicalTitle, averageRating, synopsis, posterImage } = attributes;

    const animeElement = document.createElement("div");

    if (index < 5) {
      animeElement.classList.add("movie-l");
      animeElement.innerHTML = `
      <img src="${
        posterImage?.original || "https://via.placeholder.com/150"
      }" alt="${canonicalTitle}">
      <div class="movie-info">
        <h3>${canonicalTitle}</h3>
      </div>
      <div class="overview" ${index >= 5 ? "hidden" : "visible"}">
      <p>${synopsis}</p>
      <div class="buttons">
          <button class="watch-now">Watch now</button>
          <button class="watch-later">+</button>
      </div>
  </div>
    `;
    } else {
      animeElement.classList.add("movie-s");
      animeElement.innerHTML = `
      <img src="${
        posterImage?.original || "https://via.placeholder.com/150"
      }" alt="${canonicalTitle}">
      <div class="movie-info">
           <h3>${canonicalTitle}</h3>
           <span class="vote">★ ${averageRating}</span>
       </div>
       <div class="overview ${index >= 5 ? "hidden" : "visible"}">
       <h3>${canonicalTitle}</h3> 
           <p>${synopsis}</p>
           <div class="buttons">
               <button class="watch-now">Watch now</button>
               <button class="watch-later">+</button>
           </div>
       </div>
  `;
    }
    if (index < 5) {
      horizontalLine.appendChild(animeElement);
    } else {
      recommendedAnime.appendChild(animeElement);
    }
  });
}

function searchAnime(animeList) {
  main.innerHTML = "";
  const searchedMovies = document.createElement("div");
  searchedMovies.innerHTML = "<h2>Search Results</h2>";

  animeList.forEach((anime) => {
    const { attributes } = anime;
    const { canonicalTitle, averageRating, synopsis, posterImage } = attributes;

    const animeElement = createAnimeElement(
      canonicalTitle,
      averageRating,
      synopsis,
      posterImage
    );
    animeElement.classList.add("anime-s");

    searchedMovies.appendChild(animeElement);
  });

  main.appendChild(searchedMovies);
}

function createAnimeElement(title, rating, synopsis, poster) {
  const animeElement = document.createElement("div");
  animeElement.classList.add("anime");

  animeElement.innerHTML = `
    <img src="${
      poster ? IMG_PATH + poster?.original : "https://via.placeholder.com/150"
    }" alt="${title}">
    <div class="anime-info">
      <h3>${title}</h3>
      <span class="rating">Rating: ${rating || "N/A"}</span>
    </div>
    <div class="synopsis">
      <p>${synopsis || "No synopsis available"}</p>
      <div class="buttons">
        <button class="watch-now">Watch now</button>
        <button class="watch-later">+</button>
      </div>
    </div>
  `;

  return animeElement;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const searchTerm = search.value.trim();
  if (searchTerm !== "") {
    const searchUrl = `${API_URL}?filter[text]=${encodeURIComponent(
      searchTerm
    )}`;
    await getAnime(searchUrl);
  } else {
    await getAnime(API_URL);
  }
});