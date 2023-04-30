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
const progressBar = document.querySelector(".song-progress"); 
const volumeControl = document.querySelector(".volume-control");
const previousBtn = document.querySelector(".previous-btn");
const nextBtn = document.querySelector(".next-btn");
const playIconBtn = document.getElementById("play-btn");
const pauseIconBtn = document.getElementById("pause-btn");

playBtn.addEventListener("click", playSong);
pauseBtn.addEventListener("click", pauseSong);
stopBtn.addEventListener("click", stopSong);
showSongListBtn.addEventListener("click", showSongList);
progressBar.addEventListener("input", changeProgress);
volumeControl.addEventListener("input", changeVolume);
previousBtn.addEventListener("click", previousSong);
nextBtn.addEventListener("click", nextSong);

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

    playIconBtn.classList.remove("hidden");
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
    playIconBtn.classList.add("hidden");
    pauseIconBtn.classList.remove("hidden");
}

function pauseSong() {
    if (audio) {
        audio.pause();
        playIconBtn.classList.remove("hidden");
        pauseIconBtn.classList.add("hidden");
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
    progressBar.value = (audio.currentTime / audio.duration) * 100;
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
}

function changeProgress(event) {
    if (audio) {
        const newProgress = event.target.value;
        audio.currentTime = (newProgress / 100) * audio.duration;
    }
}

function changeVolume(event) {
    if (audio) {
        const newVolume = event.target.value;
        audio.volume = newVolume / 100;
    }
}

function previousSong() {
    if (audio) {
        if (audio.currentTime > 3 || currentSongIndex === 0) {
            audio.currentTime = 0;
        } else {
            currentSongIndex--;
            playSong();
        }
    }
}

function nextSong() {
    if (audio) {
        if (currentSongIndex === songsData.length - 1) {
            audio.currentTime = audio.duration;
        } else {
            currentSongIndex++;
            playSong();
        }
    }
}

displaySongList();