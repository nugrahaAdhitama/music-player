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
const currentTimeDisplay = document.querySelector(".current-time");
const totalDurationDisplay = document.querySelector(".total-duration");

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

function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function playSong() {
    const isNewSong = !audio || (audio && songsData[currentSongIndex].filename !== audio.src.split('/').pop());
    if (isNewSong) {
        if (audio) {
            audio.pause();
            audio.addEventListener("timeupdate", updateProgress);
        }

        const song = songsData[currentSongIndex];
        audio = new Audio(`assets/music/${song.filename}`);
        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("loadedmetadata", () => {
            totalDurationDisplay.textContent = formatTime(audio.duration);
        });
    }

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
        audio.removeEventListener("timeupdate", updateProgress);
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

function updateProgress() {
    const progressBar = document.querySelector(".song-progress");
    progressBar.value = (audio.currentTime / audio.duration) * 100;
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
}

displaySongList();