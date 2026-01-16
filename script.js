        // ==============================================
        // PERMANENT OFFLINE STORAGE SOLUTION FOR AUDIO FILES
        // ==============================================
        /*
        PROBLEM with createObjectURL():
        --------------------------------
        URL.createObjectURL(file) creates a temporary URL that:
        1. Is tied to the current browser session
        2. Expires when the page is closed/refreshed
        3. Does NOT persist across browser restarts
        4. The actual file data is NOT stored anywhere
        
        SOLUTION: Store BLOB in IndexedDB
        ---------------------------------
        We need to:
        1. Read the audio file as an ArrayBuffer or Blob
        2. Store the complete binary data in IndexedDB
        3. When loading the app, retrieve the Blob from IndexedDB
        4. Create a new object URL from the stored Blob
        5. This URL will be valid as long as we keep the Blob reference
        */

        // Enhanced music library with 40 demo songs and image support
        let musicLibrary = [
{
id: 1,
title: "SLAVA FUNK",
artist: "DEVSQUAD",
duration: "3:12",
genre: "Funk",
color: "#7B61FF",
image: "https://i.scdn.co/image/ab67616d0000b273d11d4363c7a6cb9a2411565c",
file: "SLAVA FUNK!.mp3",
isDemo: true
},
{
id: 2,
title: "FUNK DE BELEZA",
artist: "DJ FURIA",
duration: "2:58",
genre: "Funk",
color: "#5D43E6",
image: "https://i1.sndcdn.com/artworks-qyUnxRdsw7vI1YlM-O6yGtQ-t1080x1080.png",
file: "FUNK DE BELEZA.mp3",
isDemo: true
},
{
id: 3,
title: "HANUMANHIND BIG DAWGS",
artist: "BIG DAWGS",
duration: "3:55",
genre: "Phonk",
color: "#FF6B6B",
image: "https://tse1.explicit.bing.net/th/id/OIP.tOat9wSVh6BAYkDRAwBKLQAAAA?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
file: "Hanumankind Big Dawgs.mp3",
isDemo: true
},
{
id: 4,
title: "MATUSHKA ULTRAFUNK",
artist: "ULTRA BEAT",
duration: "3:25",
genre: "Funk",
color: "#00E5A8",
image: "https://lh3.googleusercontent.com/a7-QDAb4c6BoAkxJmcOLYE4TvsQjrf-w-KwWIomzSd3a8F8Z3dMNhYg5ACMN5Ml5ZGg9VuvuTvYn33e4=w544-h544-l90-rj",
file: "Matushka Ultrafunk.mp3",
isDemo: true
},
{
id: 5,
title: "PASSO BEM SOLTO",
artist: "MC PASO",
duration: "2:48",
genre: "Brazil Funk",
color: "#FFB74D",
image: "https://i.ytimg.com/vi/OjQyMOS1CvE/maxresdefault.jpg",
file: "PASSO BEM SOLTO.mp3",
isDemo: true
},
{
id: 6,
title: "SAPPHIRE",
artist: "CRYSTAL FUNK",
duration: "3:35",
genre: "Phonk",
color: "#9D8AFF",
image: "https://i.ytimg.com/vi/JgDNFQ2RaLQ/maxresdefault.jpg",
file: "Sapphire.mp3",
isDemo: true
},
{
id: 7,
title: "FUNK SIGILO ULTRA SLOWED",
artist: "ULTRA SLOWED",
duration: "4:55",
genre: "Slow Funk",
color: "#2C2C2C",
image: "https://i.ytimg.com/vi/LPIc5deNcHM/maxresdefault.jpg",
file: "FUNK SIGILO (ULTRA SLOWED).mp3",
isDemo: true
},
{
id: 8,
title: "MORTALS FUNK SLOWED",
artist: "NCS FUNK",
duration: "4:42",
genre: "Slow Phonk",
color: "#1A1A1A",
image: "https://lh3.googleusercontent.com/Z2pUvTmPcvFi0hDCmGptsCkSUagLmgFReYBEgTt-IhSNmFiM1KlMs51-wof19UdZCvmjgRnrc06KtiDU",
file: "MORTALS FUNK SLOWED.mp3",
isDemo: true
},

{
id: 11,
title: "SMACK THAT (SLOWED + REVERB)",
artist: "AKON",
duration: "4:58",
genre: "Slowed",
color: "#333333",
image: "https://i.ytimg.com/vi/hvJk374NYCI/maxresdefault.jpg",
file: "SMACK THAT (SLOWED + REVERB).mp3",
isDemo: true
},
{
id: 12,
title: "SAKA SAKA SAKA",
artist: "MC SAKA",
duration: "2:55",
genre: "Brazil Funk",
color: "#FF6B9D",
image: "https://tse1.mm.bing.net/th/id/OIP.6R-xEclr--hqoPVtdNAlKQAAAA?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
file: "SAKA SAKA SAKA.mp3",
isDemo: true
},
{
id: 13,
title: "VILLAGE FUNK",
artist: "RUSTIC BEATZ",
duration: "3:40",
genre: "Funk",
color: "#5D43E6",
image: "https://lh3.googleusercontent.com/0vch5yix1yy6fFJW3xkUA-PggQjKRoH4dM1RiWaqmR6U_dKrSwKC9HPVrazTfXXkhr3RkBrZHMBvUOZP",
file: "VILLAGE FUNK.mp3",
isDemo: true
},
{
id: 14,
title: "SWEET DREAMS ULTRAFUNK",
artist: "ULTRA REMIX",
duration: "4:12",
genre: "Phonk",
color: "#7B61FF",
image: "https://i.ytimg.com/vi/19ktQrQyYnM/maxresdefault.jpg",
file: "SWEET DREAMS ULTRAFUNK.mp3",
isDemo: true
},
{
id: 15,
title: "ASCEND (SLOWED)",
artist: "NEWHOPE",
duration: "5:25",
genre: "Slowed",
color: "#1A1A1A",
image: "https://i.ytimg.com/vi/tx8iGleOODk/maxresdefault.jpg",
file: "ASCEND - Slowed.mp3",
isDemo: true
},
{
id: 16,
title: "BALKAN FUNK",
artist: "EAST GROOVE",
duration: "3:50",
genre: "Funk",
color: "#FFB74D",
image: "https://i1.sndcdn.com/artworks-ZyJ7eUzaR9bnqrOf-krHw5Q-t500x500.jpg",
file: "BALKAN FUNK.mp3",
isDemo: true
},
{
id: 17,
title: "VIOLENTO",
artist: "MC BRUTAL",
duration: "2:58",
genre: "Brazil Funk",
color: "#FF6B6B",
image: "https://i.ytimg.com/vi/VmsdXg_yRwo/oardefault.jpg?sqp=-oaymwEkCJUDENAFSFqQAgHyq4qpAxMIARUAAAAAJQAAyEI9AICiQ3gB&rs=AOn4CLCArgVpZDKc9brwL41zmbnLbLEt9g",
file: "VIOLENTO.mp3",
isDemo: true
},
{
id: 18,
title: "CANTO DE LUNA",
artist: "LUNA GROOVE",
duration: "3:44",
genre: "Phonk",
color: "#9D8AFF",
image: "https://lh3.googleusercontent.com/hQTqBY69g6ao-u_UqUXJFKfj0cPkLmNlNJ3fVBLcOzb6V0QosV_IZfE4xoIQWqSShN3DYDd5TZ_1YZM",
file: "CANTO DE LUNA.mp3",
isDemo: true
},
{
id: 19,
title: "AVANGARD (SLOWED)",
artist: "AVANGARD",
duration: "4:55",
genre: "Slowed",
color: "#2C2C2C",
image: "https://i.scdn.co/image/ab67616d0000b27389cad173e6b749ae9bd45f17",
file: "AVANGARD (Slowed  Reverb).mp3",
isDemo: true
},
{
id: 20,
title: "EL BEIBI FUNK",
artist: "MC BEIBI",
duration: "3:28",
genre: "Funk",
color: "#FF6B9D",
image: "https://lh3.googleusercontent.com/MuqlUlHOy8n1VCq5-P9m8WPYSRfjuBZUHczfyvIGTl8AOZgyvaXxYmdFRRy8Y6eAAiSzX3c1SIvtZwc",
file: "EL BEIBI FUNK.mp3",
isDemo: true
},
{
id: 21,
title: "LET'S GO GAMBLING",
artist: "NIGHT RUNNER",
duration: "3:52",
genre: "Phonk",
color: "#000000",
image: "https://i.ytimg.com/vi/ABhMstFO1zk/maxresdefault.jpg",
file: "LET'S GO GAMBLING.mp3",
isDemo: true
},
{
id: 22,
title: "CONFESS YOUR LOVE FUNK",
artist: "EDWARD MAYA (FUNK REMIX)",
duration: "4:05",
genre: "Funk",
color: "#5D43E6",
image: "https://i.ytimg.com/vi/-KBKEPOorVg/maxresdefault.jpg",
file: "CONFESS YOUR LOVE FUNK.mp3",
isDemo: true
},
{
id: 23,
title: "ODNOGO ULTRAFUNK (Slowed)",
artist: "ULTRA REMIX",
duration: "3:48",
genre: "Phonk",
color: "#7B61FF",
image: "https://i.ytimg.com/vi/96Xj47r-kE0/maxresdefault.jpg",
file: "ODNOGO ULTRAFUNK ULTRA SLOWED.mp3",
isDemo: true
},
{
id: 24,
title: "Vem Vem (Super Slowed)",
artist: "DJ NANDO",
duration: "2:42",
genre: "Brazil Funk",
color: "#FFB74D",
image: "https://i1.sndcdn.com/artworks-yBbJnsPbFwvhxZKD-DH1IOQ-t1080x1080.jpg",
file: "Vem Vem (Super Slowed).mp3",
isDemo: true
},
{
id: 25,
title: "NO ERA AMOR (Super Slowed)",
artist: "DJ LATINA",
duration: "3:35",
genre: "Latin Funk",
color: "#FF6B6B",
image: "https://i.scdn.co/image/ab67616d0000b273e7447c70e1953a8b8ca24e38",
file: "NO ERA AMOR (Super Slowed).mp3",
isDemo: true
},
{
id: 26,
title: "FUNK OSCURO (Super Slowed)",
artist: "DARK PHONK",
duration: "4:05",
genre: "Dark Phonk",
color: "#000000",
image: "https://c.saavncdn.com/443/FUNK-OSCURO-Unknown-2024-20241023124118-500x500.jpg",
file: "FUNK OSCURO (Super Slowed).mp3",
isDemo: true
},
{
id: 27,
title: "TAK TAK (Slowed)",
artist: "MC TAK",
duration: "2:58",
genre: "Brazil Funk",
color: "#FF8FB3",
image: "https://c.saavncdn.com/739/TAK-TAK-English-2025-20250306184720-500x500.jpg",
file: "TAK TAK (Slowed).mp3",
isDemo: true
},
{
id: 28,
title: "Shaitaan Theme",
artist: "AMIT TRIVEDI",
duration: "4:25",
genre: "Dark Orchestral",
color: "#2C2C2C",
image: "https://c.saavncdn.com/218/Shaitaan-Theme-From-Shaitaan-Hindi-2024-20240307120243-500x500.jpg",
file: "Shaitaan Theme.mp3",
isDemo: true
},
{
id: 29,
title: "UNSTOPPABLE",
artist: "SIA (PHONK REMIX)",
duration: "3:18",
genre: "Phonk",
color: "#5D43E6",
image: "https://c.saavncdn.com/203/This-Is-Acting-English-2016-500x500.jpg",
file: "Unstoppable.mp3",
isDemo: true
},
{
id: 30,
title: "BELIEVER",
artist: "IMAGINE DRAGONS (FUNK REMIX)",
duration: "3:25",
genre: "Funk",
color: "#FF6B6B",
image: "https://c.saavncdn.com/248/Evolve-English-2017-20180716230950-500x500.jpg",
file: "Believer.mp3",
isDemo: true
},
{
id: 31,
title: "ASTRONAUT IN THE OCEAN",
artist: "MASKED WOLF (PHONK REMIX)",
duration: "3:45",
genre: "Phonk",
color: "#7B61FF",
image: "https://c.saavncdn.com/102/Astronaut-In-The-Ocean-English-2021-20210825045729-500x500.jpg",
file: "Astronaut In The Ocean.mp3",
isDemo: true
},
{
id: 32,
title: "SMACK THAT (SLOWED)",
artist: "AKON",
duration: "4:40",
genre: "Slowed",
color: "#000000",
image: "https://c.saavncdn.com/126/smack-that-slowed-reverb-Unknown-2023-20230712103031-500x500.jpg",
file: "SMACK THAT (SLOWED).mp3",
isDemo: true
},
{
id: 33,
title: "BEGGIN'",
artist: "MÅNESKIN (FUNKO REMIX)",
duration: "3:28",
genre: "Funk",
color: "#FFB74D",
image: "https://c.saavncdn.com/755/Chosen-English-2017-20171204141141-500x500.jpg",
file: "Beggin'.mp3",
isDemo: true
},
{
id: 34,
title: "BELLY DANCER",
artist: "AKON (PHONK REMIX)",
duration: "3:52",
genre: "Phonk",
color: "#5D43E6",
image: "https://c.saavncdn.com/330/Belly-Dancer-English-2022-20250919224150-500x500.jpg",
file: "Belly Dancer.mp3",
isDemo: true
},
{
id: 39,
title: "PYTHON FUNK",
artist: "DEVBEAT",
duration: "3:15",
genre: "Tech Funk",
color: "#7B61FF",
image: "https://c.saavncdn.com/072/PYTHON-FUNK-English-2024-20240831070936-500x500.jpg",
file: "PYTHON FUNK.mp3",
isDemo: true
}
        ];

        // App State
        const state = {
            currentSong: null,
            isPlaying: false,
            isShuffle: false,
            isRepeat: false,
            volume: 0.7,
            currentTime: 0,
            queue: [],
            playHistory: [],
            currentPlaylist: null,
            recentSongs: [],
            songPlayCount: {},
            playlists: [
                { id: 1, name: "Favorites", songs: [1, 2, 3], color: "#FF6B9D" },
                { id: 2, name: "Workout", songs: [4, 5, 6], color: "#00E5A8" },
                { id: 3, name: "Chill Vibes", songs: [7, 8, 9], color: "#7B61FF" },
                { id: 4, name: "Focus Mode", songs: [10, 11, 12], color: "#FFB74D" }
            ],
            contextMenu: {
                songId: null,
                x: 0,
                y: 0
            },
            currentPage: 'home',
            blobURLs: new Map() // Store object URLs for blobs
        };

        // DOM Elements
        const audioPlayer = new Audio();
        const homeContent = document.getElementById('home-content');
        const playlistsContent = document.getElementById('playlists-content');
        const playlistDetail = document.getElementById('playlist-detail');
        const allSongsPage = document.getElementById('all-songs-page');
        const nowPlayingScreen = document.getElementById('now-playing');
        const miniPlayer = document.getElementById('mini-player');
        const searchResults = document.getElementById('search-results');
        const fileUploadContainer = document.getElementById('file-upload-container');

        // ==============================================
        // INDEXEDDB CONFIGURATION FOR PERMANENT STORAGE
        // ==============================================
        let db;
        const DB_NAME = 'NexusStreamDB';
        const DB_VERSION = 4; // Incremented version for schema update
        
        // Store names
        const STORE_NAMES = {
            AUDIO_BLOBS: 'audioBlobs',        // Store actual audio file Blobs
            SONG_METADATA: 'songMetadata',    // Store song info (title, artist, etc.)
            CACHE: 'musicCache',              // Store play counts and recent plays
            SETTINGS: 'settings',             // Store app settings
            PLAYLISTS: 'playlists'            // Store playlists
        };

        // ==============================================
        // INITIALIZE INDEXEDDB WITH BLOB SUPPORT
        // ==============================================
        function initDB() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, DB_VERSION);
                
                request.onerror = (event) => {
                    console.error("IndexedDB error:", event.target.error);
                    reject(event.target.error);
                };
                
                request.onsuccess = (event) => {
                    db = event.target.result;
                    console.log("IndexedDB initialized successfully");
                    resolve(db);
                };
                
                request.onupgradeneeded = (event) => {
                    console.log("Upgrading IndexedDB database...");
                    db = event.target.result;
                    
                    // Create object store for audio file Blobs
                    if (!db.objectStoreNames.contains(STORE_NAMES.AUDIO_BLOBS)) {
                        console.log("Creating audioBlobs store...");
                        const audioStore = db.createObjectStore(STORE_NAMES.AUDIO_BLOBS, { 
                            keyPath: 'id',
                            autoIncrement: false 
                        });
                        // Create index for faster lookups
                        audioStore.createIndex('songId', 'songId', { unique: true });
                    }
                    
                    // Create object store for song metadata
                    if (!db.objectStoreNames.contains(STORE_NAMES.SONG_METADATA)) {
                        console.log("Creating songMetadata store...");
                        const metadataStore = db.createObjectStore(STORE_NAMES.SONG_METADATA, { 
                            keyPath: 'id' 
                        });
                    }
                    
                    // Create other stores if they don't exist
                    if (!db.objectStoreNames.contains(STORE_NAMES.CACHE)) {
                        db.createObjectStore(STORE_NAMES.CACHE, { keyPath: 'id' });
                    }
                    
                    if (!db.objectStoreNames.contains(STORE_NAMES.SETTINGS)) {
                        db.createObjectStore(STORE_NAMES.SETTINGS, { keyPath: 'key' });
                    }
                    
                    if (!db.objectStoreNames.contains(STORE_NAMES.PLAYLISTS)) {
                        db.createObjectStore(STORE_NAMES.PLAYLISTS, { keyPath: 'id' });
                    }
                    
                    console.log("Database upgrade completed");
                };
            });
        }


        // ==============================================
        // LOAD AUDIO BLOB FROM INDEXEDDB AND CREATE PLAYABLE URL
        // ==============================================
        async function loadAudioBlobFromDB(songId) {
            return new Promise((resolve, reject) => {
                if (!db) {
                    reject(new Error("Database not initialized"));
                    return;
                }
                
                const transaction = db.transaction([STORE_NAMES.AUDIO_BLOBS], 'readonly');
                const audioStore = transaction.objectStore(STORE_NAMES.AUDIO_BLOBS);
                const index = audioStore.index('songId');
                const request = index.get(songId);
                
                request.onsuccess = (event) => {
                    const record = event.target.result;
                    
                    if (!record) {
                        resolve(null); // No blob found for this song
                        return;
                    }
                    
                    // Convert ArrayBuffer back to Blob
                    const blob = new Blob([record.fileBlob], { type: record.mimeType });
                    
                    // Create object URL from the Blob
                    const objectURL = URL.createObjectURL(blob);
                    
                    // Store the URL for later cleanup
                    state.blobURLs.set(songId, objectURL);
                    
                    console.log("Loaded audio blob from IndexedDB:", songId);
                    resolve(objectURL);
                };
                
                request.onerror = (event) => {
                    console.error("Error loading audio blob:", event.target.error);
                    reject(event.target.error);
                };
            });
        }

        // ==============================================
        // LOAD ALL SAVED SONGS FROM INDEXEDDB ON APP START
        // ==============================================
        async function loadAllSavedSongs() {
            return new Promise((resolve, reject) => {
                if (!db) {
                    resolve([]);
                    return;
                }
                
                const transaction = db.transaction([STORE_NAMES.SONG_METADATA], 'readonly');
                const metadataStore = transaction.objectStore(STORE_NAMES.SONG_METADATA);
                const request = metadataStore.getAll();
                
                request.onsuccess = async (event) => {
                    const savedSongs = event.target.result;
                    console.log("Found saved songs:", savedSongs.length);
                    
                    // For each saved song, load its audio blob URL
                    for (const songMetadata of savedSongs) {
                        // Check if we already have this song in memory (to avoid duplicates)
                        const existingIndex = musicLibrary.findIndex(s => s.id === songMetadata.id);
                        
                        if (existingIndex === -1) {
                            // Load the audio blob and get playable URL
                            const audioURL = await loadAudioBlobFromDB(songMetadata.id);
                            
                            if (audioURL) {
                                // Add the song to musicLibrary with the blob URL
                                musicLibrary.push({
                                    ...songMetadata,
                                    file: audioURL, // This is the blob-based URL
                                    isUploaded: true // Mark as uploaded song
                                });
                            }
                        }
                    }
                    
                    resolve(savedSongs.length);
                };
                
                request.onerror = (event) => {
                    console.error("Error loading saved songs:", event.target.error);
                    reject(event.target.error);
                };
            });
        }

        // ==============================================
        // LOAD CACHED DATA (PLAY COUNTS, RECENT SONGS)
        // ==============================================
        async function loadCachedData() {
            if (!db) return;
            
            try {
                const transaction = db.transaction([STORE_NAMES.CACHE], 'readonly');
                const store = transaction.objectStore(STORE_NAMES.CACHE);
                const request = store.getAll();
                
                request.onsuccess = (event) => {
                    const cachedSongs = event.target.result;
                    cachedSongs.forEach(cached => {
                        const song = musicLibrary.find(s => s.id === cached.id);
                        if (song) {
                            song.playCount = cached.playCount || 0;
                            song.lastPlayed = cached.lastPlayed;
                        }
                    });
                    
                    // Load recent songs
                    const recentSongs = cachedSongs
                        .filter(c => c.lastPlayed)
                        .sort((a, b) => new Date(b.lastPlayed) - new Date(a.lastPlayed))
                        .slice(0, 10)
                        .map(c => c.id);
                    
                    state.recentSongs = recentSongs.length > 0 ? recentSongs : [1, 2, 3, 4, 5];
                };
            } catch (error) {
                console.error("Error loading cached data:", error);
            }
        }

        // ==============================================
        // CACHE SONG PLAY DATA
        // ==============================================
        function cacheSongPlay(songId) {
            if (!db) return;
            
            const song = musicLibrary.find(s => s.id === songId);
            if (!song) return;
            
            song.playCount = (song.playCount || 0) + 1;
            song.lastPlayed = new Date().toISOString();
            
            const transaction = db.transaction([STORE_NAMES.CACHE], 'readwrite');
            const store = transaction.objectStore(STORE_NAMES.CACHE);
            
            store.put({
                id: song.id,
                playCount: song.playCount,
                lastPlayed: song.lastPlayed,
                title: song.title,
                artist: song.artist
            });
        }

        // ==============================================
        // CLEAN UP OBJECT URLs WHEN DONE (PREVENT MEMORY LEAKS)
        // ==============================================
        function cleanupBlobURLs() {
            for (const [songId, url] of state.blobURLs) {
                URL.revokeObjectURL(url);
            }
            state.blobURLs.clear();
        }

        // Helper function to get audio duration
        function getAudioDuration(file) {
            return new Promise((resolve, reject) => {
                const audio = new Audio();
                audio.preload = 'metadata';
                
                audio.onloadedmetadata = () => {
                    resolve(audio.duration);
                    URL.revokeObjectURL(audio.src); // Clean up
                };
                
                audio.onerror = () => {
                    reject(new Error("Could not load audio file"));
                    URL.revokeObjectURL(audio.src);
                };
                
                audio.src = URL.createObjectURL(file);
            });
        }

        // Helper function to format duration
        function formatDuration(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }

        // Navigation Functions
        function showPage(page) {
            homeContent.style.display = 'none';
            playlistsContent.classList.remove('active');
            playlistDetail.classList.remove('active');
            allSongsPage.classList.remove('active');
            
            state.currentPage = page;
            
            switch(page) {
                case 'home':
                    homeContent.style.display = 'block';
                    break;
                case 'playlists':
                    playlistsContent.classList.add('active');
                    break;
                case 'playlist-detail':
                    playlistDetail.classList.add('active');
                    break;
                case 'all-songs':
                    allSongsPage.classList.add('active');
                    break;
            }
            
            updateNavIcons(page === 'playlists' ? 'playlists' : 'home');
        }

        function updateNavIcons(active) {
            document.querySelectorAll('.nav-icons i').forEach(icon => {
                icon.classList.remove('active');
            });
            if (document.getElementById(`nav-${active}`)) {
                document.getElementById(`nav-${active}`).classList.add('active');
            }
        }

        // Navigation Event Listeners
        document.getElementById('nav-home').addEventListener('click', () => {
            showPage('home');
        });

        document.getElementById('nav-playlists').addEventListener('click', () => {
            showPage('playlists');
        });

        document.getElementById('playlist-detail-back').addEventListener('click', () => {
            showPage('playlists');
        });

        document.getElementById('all-songs-back').addEventListener('click', () => {
            showPage('home');
        });

        // Search Functionality
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', debounce(handleSearch, 300));
        
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim().length > 0) {
                searchResults.classList.add('active');
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchResults.classList.remove('active');
            }
        });

        function handleSearch(e) {
            const query = e.target.value.toLowerCase().trim();
            
            if (query.length === 0) {
                searchResults.classList.remove('active');
                return;
            }
            
            const filteredSongs = musicLibrary.filter(song => 
                song.title.toLowerCase().includes(query) ||
                song.artist.toLowerCase().includes(query) ||
                song.genre.toLowerCase().includes(query)
            );
            
            updateSearchResults(filteredSongs);
            searchResults.classList.add('active');
        }

        function updateSearchResults(songs) {
            const searchResultsContainer = document.getElementById('search-results');
            searchResultsContainer.innerHTML = '';
            
            if (songs.length === 0) {
                searchResultsContainer.innerHTML = `
                    <div style="padding: 30px 20px; text-align: center; color: var(--text-muted);">
                        <i class="fas fa-search" style="font-size: 40px; margin-bottom: 15px; opacity: 0.5;"></i>
                        <div style="font-size: 16px; font-weight: 600;">No songs found</div>
                        <div style="margin-top: 5px; font-size: 14px;">Try different keywords</div>
                    </div>
                `;
                return;
            }
            
            songs.forEach(song => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <div class="search-result-img">
                        ${song.image ? 
                            `<img src="${song.image}" alt="${song.title}" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\"fas fa-music\"></i>` : 
                            '<i class="fas fa-music"></i>'
                        }
                    </div>
                    <div class="search-result-info">
                        <div class="search-result-title">${song.title}</div>
                        <div class="search-result-artist">${song.artist} • ${song.genre}</div>
                    </div>
                    <div class="song-duration">${song.duration}</div>
                `;
                resultItem.addEventListener('click', () => {
                    playSong(song.id);
                    searchResults.classList.remove('active');
                    searchInput.value = '';
                });
                searchResultsContainer.appendChild(resultItem);
            });
        }

        // UI Functions
        function updateUI() {
            updateRecentSongs();
            updateMostPlayed();
            updateAllSongs();
            updatePlaylists();
        }

        function updateRecentSongs() {
            const recentContainer = document.getElementById('recent-songs');
            recentContainer.innerHTML = '';
            
            const recentSongIds = state.recentSongs.length > 0 ? 
                state.recentSongs : [1, 2, 3, 4, 5];
            
            recentSongIds.forEach(songId => {
                const song = musicLibrary.find(s => s.id === songId);
                if (song) {
                    const card = createSongCard(song);
                    recentContainer.appendChild(card);
                }
            });
        }

        function updateMostPlayed() {
            const mostPlayedContainer = document.getElementById('most-played');
            mostPlayedContainer.innerHTML = '';
            
            const sortedSongs = [...musicLibrary]
                .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
                .slice(0, 6);
            
            sortedSongs.forEach((song, index) => {
                const card = createSongCard(song);
                if (index < 3) {
                    const badge = document.createElement('div');
                    badge.className = 'card-badge';
                    badge.textContent = `#${index + 1}`;
                    card.querySelector('.card-img').appendChild(badge);
                }
                mostPlayedContainer.appendChild(card);
            });
        }

        function updateAllSongs() {
            const allSongsContainer = document.getElementById('all-songs');
            allSongsContainer.innerHTML = '';
            
            const displaySongs = musicLibrary.slice(0, 10);
            
            displaySongs.forEach((song, index) => {
                const songItem = createSongItem(song, index);
                allSongsContainer.appendChild(songItem);
            });
        }

        function createSongCard(song) {
            const card = document.createElement('div');
            card.className = 'scroll-card card';
            card.innerHTML = `
                <div class="card-img">
                    ${song.image ? 
                        `<img src="${song.image}" alt="${song.title}" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\"fas fa-music\"></i>` : 
                        '<i class="fas fa-music"></i>'
                    }
                </div>
                <div class="card-content">
                    <div class="card-title">${song.title}</div>
                    <div class="card-subtitle">${song.artist}</div>
                </div>
            `;
            card.addEventListener('click', (e) => handleSongClick(song.id, e));
            return card;
        }

        function createSongItem(song, index) {
            const songItem = document.createElement('div');
            songItem.className = `song-item ${state.currentSong === song.id ? 'active' : ''} ${state.currentSong === song.id && state.isPlaying ? 'playing' : ''}`;
            songItem.innerHTML = `
                <div class="song-img">
                    ${song.image ? 
                        `<img src="${song.image}" alt="${song.title}" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\"fas fa-music\"></i>` : 
                        '<i class="fas fa-music"></i>'
                    }
                </div>
                <div class="song-info">
                    <div class="song-name">${song.title}</div>
                    <div class="song-artist">${song.artist} • ${song.genre}</div>
                </div>
                <div class="song-duration">${song.duration}</div>
            `;
            songItem.addEventListener('click', (e) => handleSongClick(song.id, e));
            songItem.addEventListener('contextmenu', (e) => showContextMenu(e, song.id));
            return songItem;
        }

        function updatePlaylists() {
            const playlistsGrid = document.getElementById('playlists-grid');
            playlistsGrid.innerHTML = '';
            
            state.playlists.forEach(playlist => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div class="card-img" style="background: linear-gradient(135deg, ${playlist.color}, var(--dark-card))">
                        <i class="fas fa-list-music"></i>
                    </div>
                    <div class="card-content">
                        <div class="card-title">${playlist.name}</div>
                        <div class="card-subtitle">${playlist.songs.length} songs</div>
                    </div>
                `;
                card.addEventListener('click', () => openPlaylistDetail(playlist.id));
                playlistsGrid.appendChild(card);
            });
        }

        // Playlist Detail Functions
        function openPlaylistDetail(playlistId) {
            const playlist = state.playlists.find(p => p.id === playlistId);
            if (!playlist) return;
            
            state.currentPlaylist = playlistId;
            document.getElementById('playlist-detail-title').textContent = playlist.name;
            document.getElementById('playlist-detail-subtitle').textContent = `${playlist.songs.length} songs`;
            
            const playlistSongsContainer = document.getElementById('playlist-detail-songs');
            playlistSongsContainer.innerHTML = '';
            
            if (playlist.songs.length === 0) {
                playlistSongsContainer.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                        <i class="fas fa-music" style="font-size: 48px; margin-bottom: 20px;"></i>
                        <div style="font-size: 18px; font-weight: 600;">No songs in this playlist</div>
                        <div style="margin-top: 10px;">Add songs using the context menu</div>
                    </div>
                `;
            } else {
                playlist.songs.forEach(songId => {
                    const song = musicLibrary.find(s => s.id === songId);
                    if (song) {
                        const songItem = createSongItem(song, playlist.songs.indexOf(songId));
                        playlistSongsContainer.appendChild(songItem);
                    }
                });
            }
            
            showPage('playlist-detail');
        }

        // All Songs Page Functions
        function openAllSongsPage(title, songs) {
            document.getElementById('all-songs-title').textContent = title;
            const allSongsList = document.getElementById('all-songs-list');
            allSongsList.innerHTML = '';
            
            songs.forEach((song, index) => {
                const songItem = createSongItem(song, index);
                allSongsList.appendChild(songItem);
            });
            
            showPage('all-songs');
        }

        // View All Event Listeners
        document.getElementById('view-recent').addEventListener('click', () => {
            const recentSongs = state.recentSongs.map(id => musicLibrary.find(s => s.id === id));
            openAllSongsPage('Recently Played', recentSongs);
        });

        document.getElementById('view-charts').addEventListener('click', () => {
            const topSongs = [...musicLibrary]
                .sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
            openAllSongsPage('Top Charts', topSongs);
        });

        document.getElementById('view-library').addEventListener('click', () => {
            openAllSongsPage('All Songs', musicLibrary);
        });

        // Music Player Functions
        function handleSongClick(songId, e) {
            if (state.currentSong === songId) {
                togglePlayPause();
                
                if (!state.isPlaying) {
                    nowPlayingScreen.classList.add('active');
                }
            } else {
                playSong(songId);
            }
        }

        function playSong(songId) {
            const song = musicLibrary.find(s => s.id === songId);
            if (!song) return;
            
            if (state.currentSong !== null) {
                state.playHistory.push(state.currentSong);
            }
            
            state.currentSong = songId;
            
            document.getElementById('banner-song-title').textContent = `${song.title} • ${song.artist}`;
            
            // Play the song from the stored blob URL
            audioPlayer.src = song.file;
            audioPlayer.currentTime = 0;
            audioPlayer.play();
            state.isPlaying = true;
            
            updateNowPlayingInfo();
            updatePlayButtons();
            updateMiniPlayer();
            
            miniPlayer.classList.remove('hidden');
            
            cacheSongPlay(songId);
            
            if (!state.recentSongs.includes(songId)) {
                state.recentSongs.unshift(songId);
                state.recentSongs = state.recentSongs.slice(0, 10);
            }
            
            updateUI();
        }

        function updateNowPlayingInfo() {
            const song = musicLibrary.find(s => s.id === state.currentSong);
            if (!song) return;
            
            document.getElementById('now-playing-title').textContent = song.title;
            document.getElementById('now-playing-artist').textContent = song.artist;
            document.getElementById('mini-player-title').textContent = song.title;
            document.getElementById('mini-player-artist').textContent = song.artist;
            
            const albumArt = document.getElementById('album-art');
            if (song.image) {
                albumArt.innerHTML = `<img src="${song.image}" alt="${song.title}">`;
            } else {
                albumArt.innerHTML = '<i class="fas fa-music"></i>';
                albumArt.style.background = `linear-gradient(135deg, ${song.color || getRandomColor()}, ${getRandomColor()})`;
            }
            
            if (state.isPlaying) {
                albumArt.classList.add('playing');
            } else {
                albumArt.classList.remove('playing');
            }
        }

        function updatePlayButtons() {
            const playIcon = state.isPlaying ? 'fa-pause' : 'fa-play';
            document.getElementById('play-pause-btn').innerHTML = `<i class="fas ${playIcon}"></i>`;
            document.getElementById('mini-play-btn').innerHTML = `<i class="fas ${playIcon}"></i>`;
            
            // Update shuffle/repeat buttons with new style (just icon color change + indicator dot)
            document.getElementById('shuffle-btn').classList.toggle('active', state.isShuffle);
            document.getElementById('repeat-btn').classList.toggle('active', state.isRepeat);
        }

        function updateMiniPlayer() {
            const miniImg = document.getElementById('mini-player-img');
            const song = musicLibrary.find(s => s.id === state.currentSong);
            
            if (song) {
                if (song.image) {
                    miniImg.innerHTML = `<img src="${song.image}" alt="${song.title}">`;
                } else {
                    miniImg.innerHTML = '<i class="fas fa-music"></i>';
                    miniImg.style.background = `linear-gradient(135deg, ${song.color || getRandomColor()}, ${getRandomColor()})`;
                }
            }
        }

        // Player Controls
        function togglePlayPause() {
            if (state.currentSong) {
                if (state.isPlaying) {
                    audioPlayer.pause();
                } else {
                    audioPlayer.play();
                }
                state.isPlaying = !state.isPlaying;
                updatePlayButtons();
                
                const albumArt = document.getElementById('album-art');
                if (state.isPlaying) {
                    albumArt.classList.add('playing');
                } else {
                    albumArt.classList.remove('playing');
                }
            } else if (musicLibrary.length > 0) {
                playSong(musicLibrary[0].id);
            }
        }

        function playNextSong() {
            if (!state.currentSong) return;
            
            let currentIndex = musicLibrary.findIndex(s => s.id === state.currentSong);
            let nextIndex;
            
            if (state.isShuffle) {
                do {
                    nextIndex = Math.floor(Math.random() * musicLibrary.length);
                } while (nextIndex === currentIndex && musicLibrary.length > 1);
            } else {
                nextIndex = (currentIndex + 1) % musicLibrary.length;
            }
            
            playSong(musicLibrary[nextIndex].id);
        }

        function playPreviousSong() {
            if (!state.currentSong) return;
            
            if (audioPlayer.currentTime > 3) {
                audioPlayer.currentTime = 0;
                return;
            }
            
            if (state.playHistory.length > 0) {
                const prevSongId = state.playHistory.pop();
                playSong(prevSongId);
            } else {
                let currentIndex = musicLibrary.findIndex(s => s.id === state.currentSong);
                let prevIndex = (currentIndex - 1 + musicLibrary.length) % musicLibrary.length;
                playSong(musicLibrary[prevIndex].id);
            }
        }

        function toggleShuffle() {
            state.isShuffle = !state.isShuffle;
            // Only change icon color, not entire button
            document.getElementById('shuffle-btn').classList.toggle('active', state.isShuffle);
        }

        function toggleRepeat() {
            state.isRepeat = !state.isRepeat;
            // Only change icon color, not entire button
            document.getElementById('repeat-btn').classList.toggle('active', state.isRepeat);
        }

        // Event Listeners for Player Controls
        document.getElementById('play-pause-btn').addEventListener('click', togglePlayPause);
        document.getElementById('mini-play-btn').addEventListener('click', togglePlayPause);
        document.getElementById('next-btn').addEventListener('click', playNextSong);
        document.getElementById('mini-next-btn').addEventListener('click', playNextSong);
        document.getElementById('prev-btn').addEventListener('click', playPreviousSong);
        document.getElementById('mini-prev-btn').addEventListener('click', playPreviousSong);
        document.getElementById('shuffle-btn').addEventListener('click', toggleShuffle);
        document.getElementById('repeat-btn').addEventListener('click', toggleRepeat);
        document.getElementById('now-playing-back').addEventListener('click', () => {
            nowPlayingScreen.classList.remove('active');
        });
        document.getElementById('now-playing-menu').addEventListener('click', (e) => {
            showContextMenu(e, state.currentSong);
        });
        miniPlayer.addEventListener('click', () => {
            nowPlayingScreen.classList.add('active');
        });

        // Progress Bar
        const progressBar = document.getElementById('progress-bar');
        const progress = document.getElementById('progress');

        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audioPlayer.currentTime = percent * audioPlayer.duration;
        });

        audioPlayer.addEventListener('timeupdate', () => {
            if (audioPlayer.duration) {
                const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                progress.style.width = `${percent}%`;
                
                document.getElementById('current-time').textContent = 
                    formatTime(audioPlayer.currentTime);
                document.getElementById('total-time').textContent = 
                    formatTime(audioPlayer.duration);
                
                state.currentTime = audioPlayer.currentTime;
            }
        });

        audioPlayer.addEventListener('ended', () => {
            if (state.isRepeat) {
                audioPlayer.currentTime = 0;
                audioPlayer.play();
            } else {
                playNextSong();
            }
        });

        // Context Menu
        function showContextMenu(e, songId) {
            e.preventDefault();
            e.stopPropagation();
            
            state.contextMenu.songId = songId;
            
            const contextMenu = document.getElementById('context-menu');
            contextMenu.style.left = `${Math.min(e.clientX, window.innerWidth - 220)}px`;
            contextMenu.style.top = `${Math.min(e.clientY, window.innerHeight - 200)}px`;
            contextMenu.classList.add('active');
            
            setTimeout(() => {
                document.addEventListener('click', closeContextMenu);
            }, 10);
        }

        function closeContextMenu() {
            const contextMenu = document.getElementById('context-menu');
            contextMenu.classList.remove('active');
            document.removeEventListener('click', closeContextMenu);
        }

        // Context menu actions
        document.getElementById('context-add-playlist').addEventListener('click', () => {
            const songId = state.contextMenu.songId;
            if (!songId) return;
            
            const playlistNames = state.playlists.map(p => p.name);
            const playlistChoice = prompt(`Add to playlist:\n${playlistNames.join('\n')}\n\nEnter playlist name or create new:`);
            
            if (playlistChoice) {
                let playlist = state.playlists.find(p => p.name.toLowerCase() === playlistChoice.toLowerCase());
                
                if (!playlist) {
                    playlist = {
                        id: Date.now(),
                        name: playlistChoice,
                        songs: [songId],
                        color: getRandomColor()
                    };
                    state.playlists.push(playlist);
                } else if (!playlist.songs.includes(songId)) {
                    playlist.songs.push(songId);
                }
                
                updatePlaylists();
                alert(`Added to "${playlist.name}"`);
            }
            
            closeContextMenu();
        });

        // Playlist Management
        document.getElementById('create-playlist').addEventListener('click', () => {
            const playlistName = prompt('Enter playlist name:');
            if (playlistName && playlistName.trim()) {
                const newPlaylist = {
                    id: Date.now(),
                    name: playlistName.trim(),
                    songs: [],
                    color: getRandomColor()
                };
                state.playlists.push(newPlaylist);
                updatePlaylists();
            }
        });

        document.getElementById('shuffle-playlist').addEventListener('click', () => {
            state.isShuffle = true;
            document.getElementById('shuffle-btn').classList.add('active');
            
            if (musicLibrary.length > 0) {
                const randomIndex = Math.floor(Math.random() * musicLibrary.length);
                playSong(musicLibrary[randomIndex].id);
            }
        });

       

        // Utility Functions
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }

        function getRandomColor() {
            const colors = ['#7B61FF', '#00E5A8', '#FF6B9D', '#FFB74D', '#5D43E6', '#9D8AFF'];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // ==============================================
        // INITIALIZE THE APP WITH PERMANENT STORAGE
        // ==============================================
        async function initApp() {
            try {
                // 1. Initialize IndexedDB
                await initDB();
                
                // 2. Load all permanently saved songs from IndexedDB
                const savedCount = await loadAllSavedSongs();
                console.log(`Loaded ${savedCount} permanently saved songs from IndexedDB`);
                
                // 3. Load cached data (play counts, recent songs)
                await loadCachedData();
                
                // 4. Update UI with all songs (demo + uploaded)
                updateUI();
                
                // 5. Set initial volume
                audioPlayer.volume = state.volume;
                audioPlayer.autoplay = false;
                audioPlayer.preload = 'auto';
                
                // 6. Load last played song if available
                const lastSongId = localStorage.getItem('lastSongId');
                if (lastSongId && musicLibrary.find(s => s.id == lastSongId)) {
                    state.currentSong = parseInt(lastSongId);
                    updateNowPlayingInfo();
                    updateMiniPlayer();
                    miniPlayer.classList.remove('hidden');
                }
                
                // 7. Show home page by default
                showPage('home');
                
                console.log("App initialized successfully with permanent offline storage");
                
            } catch (error) {
                console.error("Failed to initialize app:", error);
                // Fallback: Initialize with demo songs only
                updateUI();
                showPage('home');
            }
        }

        // Save state on page unload
        window.addEventListener('beforeunload', () => {
            if (state.currentSong) {
                localStorage.setItem('lastSongId', state.currentSong);
                localStorage.setItem('lastPosition', audioPlayer.currentTime);
            }
        });

        // Clean up blob URLs when page is closed
        window.addEventListener('unload', () => {
            cleanupBlobURLs();
        });

        // Initialize when page loads
        window.addEventListener('DOMContentLoaded', initApp);

        // Prevent context menu on long press
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.song-item') || e.target.closest('.now-playing-menu')) {
                return;
            }
            e.preventDefault();
        });

        // Add swipe support for mobile
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        });

        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            handleSwipe(touchStartX, touchEndX, touchStartY, touchEndY);
        });

        function handleSwipe(startX, endX, startY, endY) {
            const swipeThreshold = 50;
            const verticalThreshold = 30;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            if (Math.abs(diffY) < verticalThreshold && Math.abs(diffX) > swipeThreshold) {
                if (diffX > 0 && nowPlayingScreen.classList.contains('active')) {
                    nowPlayingScreen.classList.remove('active');
                }
            }
        }

        // Add button press feedback
        document.querySelectorAll('.player-btn, .mini-player-btn, .action-btn, .file-upload-btn').forEach(btn => {
            btn.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            btn.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });

        

        if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', () => {
        togglePlayPause();
    });
    navigator.mediaSession.setActionHandler('pause', () => {
        togglePlayPause();
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
        playNextSong();
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => {
        playPreviousSong();
    });
}



