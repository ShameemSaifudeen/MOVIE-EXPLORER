
const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');


async function loadMovies(searchTerm) {
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=516b5391`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if (data.Response == "True") displayMovieList(data.Search);
}

function findMovies() {
    let searchTerm = (movieSearchBox.value).trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies) {
    searchList.innerHTML = "";
    for (let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID;
        movieListItem.classList.add('search-list-item');
        if (movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else
            moviePoster = "image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=516b5391`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details) {
    console.log(details);
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
        <button type="button" class="btn btn-primary" id="publicPlaylistButton" data-toggle="modal" data-target="#playlistModal">
          Add to Public Playlist
        </button>
        <button type="button" class="btn btn-secondary" id="privatePlaylistButton" data-toggle="modal" data-target="#playlistModal">
          Add to Private Playlist
        </button>

        <!-- Playlist selection modal -->
        <div class="modal fade" id="playlistModal" tabindex="-1" role="dialog" aria-labelledby="playlistModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="playlistModalLabel">Add Movie to Playlist</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <label for="playlistSelect">Select a playlist:</label>
                <select id="playlistSelect" class="form-control"></select>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>
    </div>
    `;
    document.querySelector('#publicPlaylistButton').addEventListener('click', async function () {
        const playlists = await fetchPublicPlaylists();
        populatePlaylistSelect(playlists);
        document.querySelector('#playlistModal').dataset.playlistType = 'public';
    });

    document.querySelector('#privatePlaylistButton').addEventListener('click', async function () {
        const playlists = await fetchPrivatePlaylists();
        populatePlaylistSelect(playlists);
        document.querySelector('#playlistModal').dataset.playlistType = 'private';
    });

    function populatePlaylistSelect(playlists) {
        const select = document.getElementById('playlistSelect');
        select.innerHTML = '';
        playlists.forEach(playlist => {
            const option = document.createElement('option');
            option.text = playlist.name;
            option.value = playlist.name;
            select.add(option);
        });
    }

    document.querySelector('#playlistModal .btn-primary').addEventListener('click', async function () {
        const playlistId = document.querySelector('#playlistSelect').value;
        const playlistType = document.querySelector('#playlistModal').dataset.playlistType;
        const movieId = details.imdbID;
        const title = details.Title;
        const poster = details.Poster

        let response;
        try {
            if (playlistType === 'public') {
                response = await axios.post(`http://localhost:3000/public-playlists/${playlistId}`, { movieId, title, poster });
            } else {
                response = await axios.post(`http://localhost:3000/private-playlists/${playlistId}`, { movieId, title, poster });
            }
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Movie added to playlist successfully!',
                }).then(() => {
                    window.location.reload()
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Error adding movie to playlist: ${error.message}`,
            });
        }
    });
}

async function fetchPublicPlaylists() {
    try {
        const response = await axios.get('http://localhost:3000/public-playlists');
        return response.data;
    } catch (error) {
        console.error(`Error fetching public playlists: ${error.message}`);
    }
}

async function fetchPrivatePlaylists() {
    try {
        const response = await axios.get('http://localhost:3000/private-playlists');
        return response.data;
    } catch (error) {
        console.error(`Error fetching private playlists: ${error.message}`);
    }
}
window.addEventListener('click', (event) => {
    if (event.target.className != "form-control") {
        searchList.classList.add('hide-search-list');
    }
});

$(document).ready(function () {
    $('#createPlaylistModal .btn-primary').click(function (e) {
        e.preventDefault();

        const playlistName = $('#playlist-name').val();
        const isPublic = $('#isPublicCheckbox').is(':checked');
        if (!playlistName || playlistName[0] === ' ' || !playlistName.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Invalid input. Playlist name cannot be empty or start with a space.',
            });
            return; 
        }

        axios.post('http://localhost:3000/CreatePlaylist', {
            name: playlistName,
            publicPlaylist: isPublic
        })
            .then(function (response) {
                console.log(response);

                $('#playlist-name').val('');
                $('#isPublicCheckbox').prop('checked', false);

                $('#createPlaylistModal').modal('hide');
                window.location.reload()

            })
            .catch(function (error) {
                console.log(error);
            });
    });
});


function createPlaylistContainer(playlist) {
    let playlistDiv = document.createElement('div');
    playlistDiv.className = 'playlist';

    let title = document.createElement('h3');
    title.className = 'playlist-title';
    title.textContent = playlist.name;
    playlistDiv.appendChild(title);

    let contentDiv = document.createElement('div');
    contentDiv.className = 'playlist-content';

    playlist.movies.forEach(movie => {
        contentDiv.appendChild(createMovieElement(movie));
    });

    playlistDiv.appendChild(contentDiv);

    return playlistDiv;
}

function createMovieElement(movie) {
    let movieDiv = document.createElement('div');
    movieDiv.className = 'movie';

    let movieImg = document.createElement('img');
    movieImg.src = movie.poster;
    movieImg.alt = 'Movie Poster';
    movieDiv.appendChild(movieImg);

    let movieTitle = document.createElement('h4');
    movieTitle.className = 'movie-title';
    movieTitle.textContent = movie.title;
    movieDiv.appendChild(movieTitle);

    return movieDiv;
}

function appendPlaylistsToContainer(playlists, containerId) {
    const container = document.getElementById(containerId);
    playlists.forEach(playlist => {
        container.appendChild(createPlaylistContainer(playlist));
    });
}

axios.get('http://localhost:3000/public-playlists')
    .then(response => {
        appendPlaylistsToContainer(response.data, 'playlists');
    })
    .catch(error => {
        console.error(`Error fetching public playlists: ${error.message}`);
    });

axios.get('http://localhost:3000/private-playlists')
    .then(response => {
        appendPlaylistsToContainer(response.data, 'private-playlists');
    })
    .catch(error => {
        console.error(`Error fetching private playlists: ${error.message}`);
    });
async function logout() {
    try {
        const response = await axios.post('http://localhost:3000/logout');

        if (response.status === 200) {
            window.location.href = '/login';
        } else {
            console.error('Logout failed:', response);
        }
    } catch (error) {
        console.error('An error occurred while logging out:', error);
    }
}
