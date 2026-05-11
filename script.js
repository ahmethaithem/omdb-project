/**
 * CinePulse Application
 * 
 * This file handles the logic for querying the OMDb API, 
 * updating the DOM, managing URL parameters (SPA routing),
 * and utilizing LocalStorage for persistence.
 */

const API_KEY = 'decc891b';
const API_URL = 'https://www.omdbapi.com/';

// DOM Elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const typeFilter = document.getElementById('type-filter');
const yearFilter = document.getElementById('year-filter');
const loadingDiv = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const movieResult = document.getElementById('movie-result');
const welcomeState = document.getElementById('welcome-state');

/**
 * Initialization: Runs when the DOM is fully loaded.
 * It checks URL parameters first (preferred for SPA),
 * then falls back to LocalStorage to retain the last search.
 */
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlQuery = urlParams.get('q');
    const urlType = urlParams.get('type') || '';
    const urlYear = urlParams.get('year') || '';

    if (urlQuery) {
        // If URL has search parameters, populate fields and fetch
        searchInput.value = urlQuery;
        typeFilter.value = urlType;
        yearFilter.value = urlYear;
        fetchMovie(urlQuery, urlType, urlYear);
    } else {
        // Fallback to LocalStorage if no URL params exist
        const lastSearched = localStorage.getItem('lastMovieSearch');
        if (lastSearched) {
            try {
                const searchData = JSON.parse(lastSearched);
                searchInput.value = searchData.q;
                typeFilter.value = searchData.type || '';
                yearFilter.value = searchData.year || '';
                fetchMovie(searchData.q, searchData.type, searchData.year);
            } catch (e) {
                // Handle legacy local storage format
                searchInput.value = lastSearched;
                fetchMovie(lastSearched, '', '');
            }
        }
    }
});

/**
 * Handle browser back/forward buttons seamlessly
 */
window.addEventListener('popstate', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlQuery = urlParams.get('q');
    
    if (urlQuery) {
        searchInput.value = urlQuery;
        typeFilter.value = urlParams.get('type') || '';
        yearFilter.value = urlParams.get('year') || '';
        fetchMovie(urlQuery, typeFilter.value, yearFilter.value, false);
    } else {
        hideAll();
        welcomeState.classList.remove('hidden');
        searchInput.value = '';
        typeFilter.value = '';
        yearFilter.value = '';
    }
});

/**
 * Form Submission handler
 */
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    const type = typeFilter.value;
    const year = yearFilter.value.trim();
    
    if (query) {
        fetchMovie(query, type, year, true);
    }
});

/**
 * Fetches movie data from the OMDb API.
 * 
 * @param {string} query - The movie title to search for.
 * @param {string} type - Optional filter (movie, series, episode).
 * @param {string} year - Optional release year filter.
 * @param {boolean} updateHistory - Whether to push a new state to browser history.
 */
async function fetchMovie(query, type = '', year = '', updateHistory = false) {
    // UI State: Hide everything, show Loading spinner
    hideAll();
    loadingDiv.classList.remove('hidden');

    try {
        // Construct API URL with parameters
        let requestUrl = `${API_URL}?t=${encodeURIComponent(query)}&apikey=${API_KEY}`;
        if (type) requestUrl += `&type=${type}`;
        if (year) requestUrl += `&y=${year}`;

        const response = await fetch(requestUrl);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // UI State: Hide Loading spinner
        loadingDiv.classList.add('hidden');

        if (data.Response === 'False') {
            showError(`Movie not found! Try another title. (${data.Error})`);
            return;
        }

        displayMovie(data);
        
        // Update URL to make it a true SPA and shareable link
        if (updateHistory) {
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('q', query);
            if (type) newUrl.searchParams.set('type', type);
            else newUrl.searchParams.delete('type');
            if (year) newUrl.searchParams.set('year', year);
            else newUrl.searchParams.delete('year');
            
            window.history.pushState({path: newUrl.href}, '', newUrl.href);
        }

        // Save the successful search to localStorage (Object stringified)
        localStorage.setItem('lastMovieSearch', JSON.stringify({ q: query, type, year }));

    } catch (error) {
        loadingDiv.classList.add('hidden');
        showError('A network error occurred. Please try again later.');
        console.error('Error fetching movie:', error);
    }
}

/**
 * Injects the fetched movie data into the DOM.
 * 
 * @param {Object} movie - The parsed JSON data from the API.
 */
function displayMovie(movie) {
    // Determine poster image (fallback if N/A)
    const posterSrc = movie.Poster !== 'N/A' 
        ? movie.Poster 
        : 'https://via.placeholder.com/350x500?text=No+Poster+Available';

    // Build the movie card HTML securely
    movieResult.innerHTML = `
        <div class="movie-poster">
            <img src="${posterSrc}" alt="${movie.Title} Poster">
        </div>
        <div class="movie-info">
            <h2 class="movie-title">${movie.Title}</h2>
            <div class="movie-meta">
                <span>${movie.Year}</span>
                <span>${movie.Rated}</span>
                <span>${movie.Runtime}</span>
                <span class="imdb-rating">★ ${movie.imdbRating}</span>
                <span>${movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)}</span>
            </div>
            <p class="movie-detail"><strong>Genre:</strong> ${movie.Genre}</p>
            <p class="movie-detail"><strong>Director:</strong> ${movie.Director}</p>
            <p class="movie-detail"><strong>Actors:</strong> ${movie.Actors}</p>
            <p class="movie-detail plot">${movie.Plot}</p>
        </div>
    `;
    
    // Show the movie result container
    movieResult.classList.remove('hidden');
}

/**
 * Displays an error message to the user.
 * 
 * @param {string} message - The error message to display.
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

/**
 * Utility function to hide all dynamic UI elements.
 */
function hideAll() {
    welcomeState.classList.add('hidden');
    loadingDiv.classList.add('hidden');
    errorMessage.classList.add('hidden');
    movieResult.classList.add('hidden');
}
