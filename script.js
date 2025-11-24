

// ===========================
// API Configuration
// ===========================
const GUTENDEX_API = 'https://gutendex.com';

// ===========================
// Helper Functions
// ===========================

// Get book cover URL
function getCoverUrl(formats) {
    if (!formats) return 'https://via.placeholder.com/200x300?text=Geen+Cover';
    
    // Gutendex provides image URLs in formats object
    return formats['image/jpeg'] || 
           formats['image/png'] || 
           'https://via.placeholder.com/200x300?text=Geen+Cover';
}

// Format author names from Gutendex format
function formatAuthors(authors) {
    if (!authors || authors.length === 0) return 'Onbekende auteur';
    return authors.map(author => author.name).slice(0, 2).join(', ');
}

// Format languages
function formatLanguages(languages) {
    if (!languages || languages.length === 0) return 'Onbekend';
    
    const langMap = {
        'en': 'Engels',
        'nl': 'Nederlands',
        'fr': 'Frans',
        'de': 'Duits',
        'es': 'Spaans',
        'it': 'Italiaans',
        'pt': 'Portugees',
        'la': 'Latijn',
        'el': 'Grieks',
        'fi': 'Fins',
        'sv': 'Zweeds',
        'da': 'Deens',
        'no': 'Noors'
    };
    
    return languages.map(lang => langMap[lang] || lang.toUpperCase()).join(', ');
}

// Get download count formatted
function formatDownloads(count) {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
}

// Get localStorage data
function getStorageData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return [];
    }
}

// Set localStorage data
function setStorageData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Error writing to localStorage:', e);
    }
}

// Check if book is in list
function isBookInList(bookId, listName) {
    const books = getStorageData(listName);
    return books.some(book => book.id === bookId);
}

// Add book to list
function addBookToList(book, listName) {
    const books = getStorageData(listName);
    if (!books.some(b => b.id === book.id)) {
        books.push(book);
        setStorageData(listName, books);
        return true;
    }
    return false;
}

// Convert Gutendex book to our format
function convertBookData(book) {
    const birthYear = book.authors?.[0]?.birth_year;
    const deathYear = book.authors?.[0]?.death_year;
    let authorLifespan = '';
    if (birthYear || deathYear) {
        authorLifespan = ` (${birthYear || '?'} - ${deathYear || '?'})`;
    }
    
    return {
        id: book.id.toString(),
        title: book.title || 'Onbekende titel',
        author: formatAuthors(book.authors) + authorLifespan,
        authorName: formatAuthors(book.authors), // Without lifespan
        cover: getCoverUrl(book.formats),
        year: birthYear || 'Onbekend',
        languages: formatLanguages(book.languages),
        subjects: book.subjects?.slice(0, 5) || [],
        bookshelves: book.bookshelves || [],
        topics: book.topics || [],
        description: book.subjects?.[0] || 'Klassiek literair werk uit het publieke domein.',
        downloads: book.download_count || 0,
        downloadsFormatted: formatDownloads(book.download_count),
        copyright: book.copyright || false,
        mediaType: book.media_type || 'Text',
        formats: book.formats || {},
        rating: 0,
        notes: ''
    };
}

// ===========================
// API Function - ONLY SEARCH
// ===========================

// Search books by title or author using Gutendex API
async function searchBooks(query) {
    try {
        const response = await fetch(
            `${GUTENDEX_API}/books/?search=${encodeURIComponent(query)}`
        );
        
        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        console.log(data.count);
        console.log(data);
        writePimd(data.results);
        return data.results.map(convertBookData);
    } catch (error) {
        console.error('Error searching books:', error);
        throw error;
    }
}

function writePimd(data){
    console.log('WritePimD function');
    console.log(data);
}

// ===========================
// UI Functions
// ===========================

// Create book card HTML
function createBookCard(book, showActions = false) {
    const inWantToRead = isBookInList(book.id, 'wantToRead');
    const inRead = isBookInList(book.id, 'read');
    
    return `
        <div class="book-card-trending" data-book-id="${book.id}">
            <div class="book-cover-wrapper">
                <img src="${book.cover}" alt="${book.title}" class="book-cover" onerror="this.src='https://via.placeholder.com/200x300?text=Geen+Cover'">
                ${book.downloads > 0 ? `
                    <div class="book-badge">
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        ${book.downloadsFormatted}
                    </div>
                ` : ''}
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.authorName}</p>
                ${book.languages ? `<p class="book-language">${book.languages}</p>` : ''}
                ${showActions ? `
                    <div class="book-actions">
                        <button class="book-action-btn ${inWantToRead ? 'active' : ''}" data-action="want-to-read" title="Wil ik lezen">
                            <svg width="16" height="16" fill="${inWantToRead ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                            </svg>
                        </button>
                        <button class="book-action-btn ${inRead ? 'active' : ''}" data-action="read" title="Gelezen">
                            <svg width="16" height="16" fill="${inRead ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function displaySearchResults(books, query) {
    const resultsSection = document.getElementById('search-results-section');
    const resultsGrid = document.getElementById('search-results-grid');
    const resultsTitle = document.getElementById('search-results-title');
    // const loadingEl = document.getElementById('search-loading');
    // const errorEl = document.getElementById('search-error');

    // loadingEl.style.display = 'none';
    // errorEl.style.display = 'none';

    if (books.length === 0) {
        resultsTitle.textContent = `Geen resultaten voor "${query}"`;
        resultsGrid.innerHTML = '<p class="empty-text">Probeer een andere zoekopdracht.</p>';
    } else {
        resultsTitle.textContent = `${books.length} resultaten voor "${query}"`;
        resultsGrid.innerHTML = '';

        // Gebruik van for-loop om de resultaten in te voegen
        for (let i = 0; i < books.length; i++) {
            const book = books[i];
            const bookCardHTML = createBookCard(book);
            resultsGrid.insertAdjacentHTML('beforeend', bookCardHTML);

            // Voeg click event toe aan elke kaart
            const cardEl = resultsGrid.querySelector(`.book-card-trending[data-book-id="${book.id}"]`);
            cardEl.addEventListener('click', () => {
                sessionStorage.setItem('currentBook', JSON.stringify(book));
                window.location.href = `boek-detail.html?id=${book.id}`;
            });
        }
    }

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({behavior:'smooth'});
}

// Handle book actions (add to lists)
function handleBookAction(book, action, btn) {
    const listName = action === 'want-to-read' ? 'wantToRead' : 'read';
    const isActive = btn.classList.contains('active');
    
    if (isActive) {
        // Remove from list
        const books = getStorageData(listName);
        const filtered = books.filter(b => b.id !== book.id);
        setStorageData(listName, filtered);
        btn.classList.remove('active');
        
        // Update icon fill
        const svg = btn.querySelector('svg');
        svg.setAttribute('fill', 'none');
    } else {
        // Add to list
        addBookToList(book, listName);
        btn.classList.add('active');
        
        // Update icon fill
        const svg = btn.querySelector('svg');
        svg.setAttribute('fill', 'currentColor');
        
        // Show feedback
        showNotification(`Toegevoegd aan ${listName === 'wantToRead' ? 'Wil ik lezen' : 'Gelezen'}!`);
    }
}

// Save book data for detail page
function saveBookData(book) {
    sessionStorage.setItem('currentBook', JSON.stringify(book));
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}




// Search functionaliteit
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const clearButton = document.getElementById('clear-search');
    const popularLinks = document.querySelectorAll('.popular-link');
    const loadingEl = document.getElementById('search-loading');
    const errorEl = document.getElementById('search-error');
    const resultsSection = document.getElementById('search-results-section');
    
    async function performSearch(query) {
        if (!query.trim()) return;
        
        if (loadingEl) loadingEl.style.display = 'block';
        if (errorEl) errorEl.style.display = 'none';
        if (resultsSection) resultsSection.style.display = 'block';
        const resultsGrid = document.getElementById('search-results-grid');
        if (resultsGrid) resultsGrid.innerHTML = '';
        
        try {
            // API call
            document.getElementById("trending-section").style.display = "none";
            const books = await searchBooks(query);
            displaySearchResults(books, query);
        } catch (error) {
            console.error('Fout bij zoeken:', error);
            // loadingEl.style.display = 'none';
            // errorEl.style.display = 'block';
        }
    }
    
    searchButton?.addEventListener('click', () => {
        performSearch(searchInput.value);
    });
    
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
    
    clearButton?.addEventListener('click', () => {
        resultsSection.style.display = 'none';
        searchInput.value = '';
    });
    
    popularLinks.forEach(link => {
        link.addEventListener('click', () => {
            const query = link.dataset.search;
            searchInput.value = query;
            performSearch(query);
        });
    });
}

// Haal willekeurige boeken op uit Gutendex
async function loadRandomBooks() {
    const container = document.getElementById('trending-books');
    if (!container) return; // Pagina heeft geen trending-sectie



    // Random pagina tussen 1 en 100 (Gutendex heeft duizenden boeken)
    const randomPage = Math.floor(Math.random() * 100) + 1;

    try {
        const response = await fetch(`https://gutendex.com/books/?page=${randomPage}`);
        const data = await response.json();


        const randomBooks = data.results.slice(0, 5).map(convertBookData);



        container.innerHTML = randomBooks
            .map(book => createBookCard(book, false)) // geen acties
            .join('');



        // (detailpagina, als ik er aan toe kom)
        container.querySelectorAll('.book-card-trending').forEach(card => {
            const bookId = card.dataset.bookId;
            const book = randomBooks.find(b => b.id === bookId);

            card.addEventListener('click', () => {
                saveBookData(book);
                window.location.href = `boek-detail.html?id=${bookId}`;
            });
        });

    } catch (error) {
        console.error("Fout bij laden van trending boeken:", error);
        container.innerHTML = "<p>Er ging iets mis bij het laden van boeken.</p>";
    }
}


document.addEventListener('DOMContentLoaded', () => {



    initSearch();
    

    loadRandomBooks();
    const trendingSection = document.querySelector('.trending-section');
    const categoriesSection = document.querySelector('.categories-section');


});
