// configuration 
const APIKey = "4584fd97b0a992aaa88c94e61e90e09a";
const imgAPI = "https://image.tmdb.org/t/p/w1280";
const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&
query=`;

//connect html elemnts and bring them inside js
const form = document.querySelector("#search-form");
const query = document.querySelector("#search-input");
const result = document.querySelector("#result");

// functions for logic processing 
let page = 1;
let isSearching = false;

// get the JSON data to be displayed on initial load 
async function fetchData(url) {
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error("Oops. Something went wrong.");
        }
        return await response.json();
    } catch(err) {
        return null;
    }
}

// show results based on fetch 
async function fetchAndShowResult(url){
    const data = await fetchData(url);
    if (data && data.results){
        showResults(data.results); // have to define this function 
    }
}

// movie cards 
function createMovieCard(movie){
  //destructure movie object so object name doesn't have to be called everytime
  //certain paramter is called
  const { poster_path, original_title, release_date, overview } = movie;

  //image path as ternary operator
  const imagePath = poster_path ? imgAPI + poster_path : "./img-01.jpeg";

  //reduces size of movie title if too big
  const truncatedTitle = original_title.length > 15 ? original_title.slice(0, 15)
  + "..." : original_title;

  //check for a release date 
  const formattedDate = release_date || "No release date available";

  //movie card html 
  const cardTemplate = `
  <div class="column"> 
      <div class="card"> 
         <a class="card-media" href="./img-01.jpeg">
          <img src="${imagePath}" alt="${original_title}" width="100%" />
         </a>
         <div class="card-content">
           <div class="card-header">
            <div class="left-content">
              <h3 style="font-weight: 600">${truncatedTitle}</h3>
              <span style="color: #12efec">${formattedDate}</span>
            </div> 
            <div class="right-content">
               <a href="${imagePath}" target="_blank" class="card-btn">
               See Cover </a>
            </div> 
        </div>
        <div class="info">
         ${overview || "No overview available"}
         </div>
        </div>
       </div> 
  `;
  return cardTemplate;
}

//clear content for search purposes 
function clearResults(){
    result.innerHTML = "";
}

 
//disppaly results on page 
function showResults(item){
    const newContent = item.map(createMovieCard).join("");
    result.innerHTML += content || "<p> No results found. Search again. </p>";
}