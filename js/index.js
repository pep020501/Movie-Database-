// configuration 
const APIKey = "4584fd97b0a992aaa88c94e61e90e09a"; 
const imgAPI = "https://image.tmdb.org/t/p/w1280";
const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&
query=`;

//connect html elements and bring them inside js
const form = document.querySelector("#search-form");
const query = document.querySelector("#search-input");
const result = document.querySelector("#result");

// functions for logic processing 
let page = 1;
let isSearching = false; //user typing in searchbox 

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
        showResults(data.results); //defined at bottom 
    }
}

// movie card function 
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

  //movie card html format
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

 
//display results on page 
function showResults(item){
    const newContent = item.map(createMovieCard).join("");
    result.innerHTML += newContent || "<p> No results found. Search again. </p>";
}

// load results 
async function loadMoreResults(){
    if(isSearching){
     return;
    }
    page++;
    const searchTerm = query.value; 
    const url = searchTerm ? `${searchUrl} ${searchTerm}&page=${page}`: 
    `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${APIKey}&page=${page}`;

    await fetchAndShowResult(url);
}

// function that detects the end of a page 
function detectEnd() {
    const {scrollTop, clientHeight, scrollHeight} = document.documentElement;
    if(scrollTop + clientHeight >= scrollHeight - 20) {
        loadMoreResults();
    }
}

//handle the search operation itself 
//the form element --- this is an endpoint to the server side operations 
//e is the event parameter 
async function handleSearch(e){
    console.log('Debug: inside the handleSearch function');
    //what to do when form is submitted 
    e.preventDefault();
    const searchTerm = query.value.trim();
    console.log(`input term by user ${searchTerm}`);

    if(searchTerm) {
        isSearching = true;
        clearResults();
        const newUrl = `${searchUrl}${searchTerm}&page=${page}`;
        await fetchAndShowResult(newUrl);
        query.value = "";
    }
}

// function calls
form.addEventListener("submit", handleSearch);
window.addEventListener("scroll", detectEnd);
window.addEventListener("resize", detectEnd);

// init functions for whole UI 
async function init(){
    clearResults();
    const url=`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${APIKey}&page=${page}`;
    isSearching = false;
    await fetchAndShowResult(url);
}

init();