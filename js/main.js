const songList = document.querySelector(".song-list");
const playBtn = document.querySelector(".play-btn");
const pauseBtn = document.querySelector(".pause-btn");
const stopBtn = document.querySelector(".stop-btn");

playBtn.addEventListener("click", playSong);
pauseBtn.addEventListener("click", pauseSong);
stopBtn.addEventListener("click", stopSong);

let currentSongIndex = 0;
let songsData = [];

async function fetchSongData() {
    const response = await fetch("assets/song.json");
    const data = await response.json();
    return data;
}

async function displaySongList() {
    const songs = await fetchSongData();
    songsData = songs;

    songs.forEach(song => {
        const songItem = document.createElement("li");
        songItem.className = "song-item";
        songItem.textContent = `${song.title} - ${song.artist}`;
        songItem.addEventListener("click", () => {
            currentSongIndex = index;
            playSong();
        })
        songList.appendChild(songItem);
    })
}

function playSong() {
    if (audio) {
        audio.pause();
    }

    const song = songsData[currentSongIndex];
    audio = new Audio(`assets/music/${song.filename}`);
    audio.play();
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

displaySongList();