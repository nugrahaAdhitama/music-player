const songList = document.querySelector(".song-list");
const playBtn = document.querySelector(".play-btn");
const pauseBtn = document.querySelector(".pause-btn");
const stopBtn = document.querySelector(".stop-btn");
const albumCover = document.getElementById("album-cover");
const coverImage = document.getElementById("cover-image");
const songTitle = document.getElementById("song-title");
const artistName = document.getElementById("artist-name");
const songListContainer = document.getElementById("song-list-container");
const showSongListBtn = document.getElementById("show-song-list-btn");

playBtn.addEventListener("click", playSong);
pauseBtn.addEventListener("click", pauseSong);
stopBtn.addEventListener("click", stopSong);
showSongListBtn.addEventListener("click", showSongList);

let currentSongIndex = 0;
let songsData = [];
let audio = null;

async function fetchSongData() {
    const response = await fetch("assets/song.json");
    const data = await response.json();
    return data;
}

async function displaySongList() {
    const songs = await fetchSongData();
    songsData = songs;

    songs.forEach((song, index) => {
        const songItem = document.createElement("li");
        songItem.className = "song-item";
        songItem.textContent = `${song.title} - ${song.artist}`;
        songItem.addEventListener("click", () => {
            currentSongIndex = index;
            playSong();

            coverImage.classList.remove("hidden");
            songTitle.classList.remove("hidden");
            artistName.classList.remove("hidden");
            songListContainer.classList.add("hidden");
            showSongListBtn.classList.remove("hidden");
        });
        songList.appendChild(songItem);
    });
}

function playSong() {
    if (audio) {
        audio.pause();
    }

    const song = songsData[currentSongIndex];
    audio = new Audio(`assets/music/${song.filename}`);
    audio.play();

    updateSongInfo();
}

function pauseSong() {
    if (audio) {
        audio.pause();
    }
}

function stopSong() {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
}

function updateSongInfo() {
    const song = songsData[currentSongIndex];
    coverImage.src = song.cover;
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
}

function showSongList() {
    coverImage.classList.add("hidden");
    songListContainer.classList.remove("hidden");
    showSongListBtn.classList.add("hidden");
}

displaySongList();