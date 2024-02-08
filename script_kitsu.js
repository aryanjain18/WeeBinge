const API_URL = "https://kitsu.io/api/edge/anime";
const SEARCH_API = "https://kitsu.io/api/edge/anime?filter[text]=";
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
    const { canonicalTitle, averageRating, synopsis, posterImage, youtubeVideoId } = attributes;

    const animeElement = document.createElement("div");

    if (index < 6) {
      animeElement.classList.add("movie-l");
      animeElement.innerHTML = `
      <img src="${
        posterImage?.original || "https://via.placeholder.com/150"
      }" alt="${canonicalTitle}">
      <div class="movie-info">
        <h3>${canonicalTitle}</h3>
      </div>
      <div class="overview" ${index >= 6 ? "hidden" : "visible"}">
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
       <div class="overview ${index >= 6 ? "hidden" : "visible"}">
       <h3>${canonicalTitle}</h3> 
           <p>${synopsis}</p>
           <div class="buttons">
               <button class="watch-now">Watch now</button>
               <button class="watch-later">+</button>
           </div>
       </div>
  `;
    // Add event listener to the "Watch now" button
    const watchNowButton = animeElement.querySelector('.watch-now');
    watchNowButton.addEventListener('click', () => {
        if (youtubeVideoId) {
            window.location.href = 'https://www.youtube.com/watch?v=' + youtubeVideoId;
          } else {
            console.error('No YouTube video ID available.');
          }
    });
    }
    if (index < 6) {
      horizontalLine.appendChild(animeElement);
    } else {
      recommendedAnime.appendChild(animeElement);
    }
  });
}

function searchAnime(animeList) {
    main.innerHTML = "";
    const searchedAnime = document.createElement("div");
    searchedAnime.classList.add("searched");
    main.appendChild(searchedAnime);
  
    animeList.forEach((anime) => {
      const { attributes } = anime; // Destructure attributes directly from anime
      const { canonicalTitle, averageRating, synopsis, posterImage, youtubeVideoId } = attributes;
  
      const animeElement = document.createElement("div");
      animeElement.classList.add("movie-s");
      animeElement.innerHTML = ` 
        <img src="${posterImage?.original || "https://via.placeholder.com/150"}" alt="${canonicalTitle}">
        <div class="movie-info">
          <h3>${canonicalTitle}</h3>
          <span class="vote">★ ${averageRating}</span>
        </div>
        <div class="overview hidden">
          <h3>${canonicalTitle}</h3> 
          <p>${synopsis}</p>
          <div class="buttons">
            <button class="watch-now">Watch now</button>
            <button class="watch-later">+</button>
          </div>
        </div>
      `;
      // Add event listener to the "Watch now" button
      const watchNowButton = animeElement.querySelector('.watch-now');
      watchNowButton.addEventListener('click', () => {
        window.location.href = 'https://www.youtube.com/watch?v='+youtubeVideoId;
      });
  
      searchedAnime.appendChild(animeElement); // Append animeElement, not movieElement
    });
  }
  


form.addEventListener("submit", (e) => {
    e.preventDefault();
  
    const searchTerm = search.value;
    if (searchTerm && searchTerm !== "") {
      getAnime(SEARCH_API + searchTerm);
    } else {
      window.location.reload();
    }
  });