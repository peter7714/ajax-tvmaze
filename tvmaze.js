"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $episodesList = $('#episodesList');
const img = 'https://tinyurl.com/tv-missing';


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(search) {
  // ADD: make request to TVMaze search shows API.
  const res = await axios(`https://api.tvmaze.com/search/shows?q=${search}`);
  return res.data.map(response => {
    const show = response.show;
    return {
    id: show.id,
    name: show.name,
    summary: show.summary,
    image: show.image ? show.image.medium : img,
    };
  });
}
/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) { 
  const epData = await axios(`https://api.tvmaze.com/seasons/${id}/episodes`);
  return epData.data.map(response => ({
      id: response.id,
      name: response.name,
      season: response.season,
      number: response.number
  }));
}
/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  $episodesList.empty();
  for(let episode of episodes){
    const $eps = $(
      `<li>${episode.name} 
      (Season: ${episode.season}, Episode: ${episode.number})
      </li>`
      );
     $episodesList.append($eps);
   }
  $episodesArea.show();
}

async function getEpsAndDisplay(evt){
  const id = $(evt.target).closest('.Show').data('show-id');
  const eps = await getEpisodesOfShow(id);
  populateEpisodes(eps);
}

$showsList.on('click', '.Show-getEpisodes', getEpsAndDisplay);
