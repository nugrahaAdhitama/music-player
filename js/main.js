const songList = document.querySelector(".song-list");
const playBtn = document.querySelector(".play-btn");
const pauseBtn = document.querySelector(".pause-btn");
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
const shuffleBtn = document.getElementById("shuffle-btn");
const repeatButton = document.getElementById("repeat");

playBtn.addEventListener("click", playSong);
pauseBtn.addEventListener("click", pauseSong);
showSongListBtn.addEventListener("click", showSongList);
progressBar.addEventListener("input", changeProgress);
volumeControl.addEventListener("input", changeVolume);
previousBtn.addEventListener("click", previousSong);
nextBtn.addEventListener("click", nextSong);
shuffleBtn.addEventListener("click", toggleShuffle);
repeatButton.addEventListener("click", toggleRepeat);

let currentSongIndex = 0;
let songsData = [];
let audio = null;
let shuffle = false;
let previousSongIndex;
let repeatState = 0;

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
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("ended", handleSongEnded);
        }

        const song = songsData[currentSongIndex];
        audio = new Audio(`assets/music/${song.filename}`);
        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("loadedmetadata", () => {
            totalDurationDisplay.textContent = formatTime(audio.duration);
        });
        audio.addEventListener("ended", handleSongEnded);
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
        if (repeatState === 2) {
            audio.currentTime = 0;
            audio.play();
        } else {
            if (audio.currentTime > 3 || currentSongIndex === 0) {
                audio.currentTime = 0;
            } else {
                if (shuffle && previousSongIndex !== undefined) {
                    currentSongIndex = previousSongIndex;
                    previousSongIndex = undefined;
                } else {
                    currentSongIndex = currentSongIndex - 1;
                }
                playSong();
            }
        }
    }
}

function nextSong() {
    if (audio) {
        if (repeatState === 2) {
            audio.currentTime = 0;
            audio.play();
        } else {
            if (currentSongIndex === songsData.lenth - 1 && repeatState !== 1) {
                audio.currentTime = audio.duration;
                pauseSong();
            } else {
                currentSongIndex = shuffle ? getRandomSongIndex() : (currentSongIndex + 1) % songsData.length;
                playSong();
            }
        }
    }
}

function toggleShuffle() {
    shuffle = !shuffle;
    if (shuffle) {
        previousSongIndex = currentSongIndex;
    }
    shuffleBtn.classList.toggle("active");
}

function getRandomSongIndex() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * songsData.length);
    } while (randomIndex === currentSongIndex);
    return randomIndex;
}

function toggleRepeat() {
    repeatState = (repeatState + 1) % 3;
    switch (repeatState) {
        case 0: //Tidak ada pengulangan
            repeatButton.classList.remove("active");
            repeatButton.innerHTML = '<i class="fas fa-redo"></i>';
            break;
        case 1: //Mengulang seluruh daftar lagu
            repeatButton.classList.add("active");
            repeatButton.innerHTML = '<i class="fas fa-redo"></i>';
            break;
        case 2: //Mengulang lagu yang sedang diputar
            repeatButton.classList.add("active");
            repeatButton.innerHTML = '<i class="fas fa-redo-alt"></i>';
            break;
    }
}

function handleSongEnded() {
    if (repeatState === 2) {
        audio.currentTime = 0;
        audio.play();
    } else {
        nextSong ();
    }
}

displaySongList();