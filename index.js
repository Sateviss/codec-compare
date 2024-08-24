const SONGS = {
    deutschland: "",
    hurt: "",
    andrew_eldritch: "",
    king_of_carrot_flowers: "",
    moskau: "",
    souljacker: "",
    take_me_to_church: "",
    the_man_comes_around: "",
    youll_never_walk_alone: ""    
}

const FORMAT_DICT = {
    aac: "AAC (ffmpeg 320kbit/s)",
    mp3: "MP3 (ffmpeg 320kbit/s)",
    flac: "FLAC (original)"
}

let songOrder = [];


function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

async function selectSong(songName) {
    if (!songName || !(songName in SONGS)) {
        console.error("Unknown songName", songName);
        return;
    }
    console.log("Selecting song", songName);
    const songInfo = await (await fetch(`./songs/${songName}/info.txt`)).text();
    document.querySelector("#song_img").src = `./songs/${songName}/cover.jpg`;
    document.querySelector("#song_img").alt = `Cover for ${songName}`;
    document.querySelector("#song_id").innerText = songName;
    document.querySelector("#song_data").innerText = songInfo;
    
    let order = ["flac", "mp3", "aac"]
    shuffle(order);
    for (let i = 1; i <= 3; i++) {
        document.querySelector(`#track${i} audio`).src = `./songs/${songName}/song.${order[i-1]}`;
        document.querySelector(`#track${i} button`).format = FORMAT_DICT[order[i-1]];
    }
}

async function handleSelection(event) {
    const selection = event.target.format;
    SONGS[document.querySelector("#song_id").innerText] = selection;
    const songName = songOrder.pop();
    if (!songName) {
        await showResults();
    } else {
        await selectSong(songName);
    }
}

async function showResults() {
    console.log(SONGS);
    document.querySelector("#song_info").hidden = true;
    document.querySelector(".track_container").hidden = true;
    const table = document.querySelector("table");
    table.hidden = false;
    Object.keys(SONGS).forEach(songId => {
        const row = document.createElement("tr");
        const songIdCell = document.createElement("td");
        const choiceCell = document.createElement("td");
        songIdCell.innerText = songId;
        choiceCell.innerText = SONGS[songId];
        row.appendChild(songIdCell);
        row.appendChild(choiceCell);
        table.appendChild(row);
    })
}

window.onload = async () => {
    songOrder = Object.keys(SONGS);
    shuffle(songOrder);
    const songName = songOrder.pop();
    await selectSong(songName);
    document.querySelector("#select_track1").onclick = handleSelection;
    document.querySelector("#select_track2").onclick = handleSelection;
    document.querySelector("#select_track3").onclick = handleSelection;
}

