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
    aac: "AAC (ffmpeg 256kbit/s)",
    mp3: "MP3 (ffmpeg 256kbit/s)",
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
        document.querySelector(`#track${i} audio`).src = `./songs/${songName}/song.${order[i - 1]}`;
        document.querySelector(`#track${i} button`).format = order[i - 1];
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
    if (window.sendResponse) {
        await window.sendResponse(SONGS);
    }
    document.querySelector("#song_info").hidden = true;
    document.querySelector(".track_container").hidden = true;
    document.querySelectorAll("audio").forEach(a => a.pause());
    const table = document.querySelector("table");
    table.hidden = false;
    for (const songId of Object.keys(SONGS)) {
        const row = document.createElement("tr");
        const songIdCell = document.createElement("td");
        const choiceCell = document.createElement("td");
        const flacCell = document.createElement("td");
        const aacCell = document.createElement("td");
        const mp3Cell = document.createElement("td");
        const nCell = document.createElement("td");

        songIdCell.innerText = songId;
        choiceCell.innerText = FORMAT_DICT[SONGS[songId]];
        flacCell.innerText = "?";
        aacCell.innerText = "?";
        mp3Cell.innerText = "?";
        nCell.innerText = "?";
        row.appendChild(songIdCell);
        row.appendChild(choiceCell);
        row.appendChild(flacCell);
        row.appendChild(aacCell);
        row.appendChild(mp3Cell);
        row.appendChild(nCell);

        if (window.getStatsForSong) {
            const stats = await window.getStatsForSong(songId);
            const total = Object.keys(stats).reduce((acc, cur) => acc + stats[cur], 0);
            nCell.innerText = total.toString();
            flacCell.innerText = (100.0*(stats["flac"]||0)/(1.0*total)).toFixed(2);
            aacCell.innerText = (100.0*(stats["aac"]||0)/(1.0*total)).toFixed(2);
            mp3Cell.innerText = (100.0*(stats["mp3"]||0)/(1.0*total)).toFixed(2);
        }

        table.appendChild(row);
    };
}

async function showResultsPage() {
    const table = document.querySelector("table");
    for (const songId of Object.keys(SONGS)) {
        const row = document.createElement("tr");
        const songIdCell = document.createElement("td");
        const flacCell = document.createElement("td");
        const aacCell = document.createElement("td");
        const mp3Cell = document.createElement("td");
        const nCell = document.createElement("td");

        songIdCell.innerText = songId;
        flacCell.innerText = "?";
        aacCell.innerText = "?";
        mp3Cell.innerText = "?";
        nCell.innerText = "?";
        row.appendChild(songIdCell);
        row.appendChild(flacCell);
        row.appendChild(aacCell);
        row.appendChild(mp3Cell);
        row.appendChild(nCell);

        if (window.getStatsForSong) {
            const stats = await window.getStatsForSong(songId);
            const total = Object.keys(stats).reduce((acc, cur) => acc + stats[cur], 0);
            nCell.innerText = total.toString();
            flacCell.innerText = (100.0*(stats["flac"]||0)/(1.0*total)).toFixed(2);
            aacCell.innerText = (100.0*(stats["aac"]||0)/(1.0*total)).toFixed(2);
            mp3Cell.innerText = (100.0*(stats["mp3"]||0)/(1.0*total)).toFixed(2);
        }

        table.appendChild(row);
    };
}

window.onload = async () => {
    if (window.location.href.includes("results.html")) {
        const delay = (delayInms) => {
            return new Promise(resolve => setTimeout(resolve, delayInms));
          };

        await delay(200);
        await showResultsPage();
    } else {
        songOrder = Object.keys(SONGS);
        shuffle(songOrder);
        const songName = songOrder.pop();
        await selectSong(songName);
        document.querySelector("#select_track1").onclick = handleSelection;
        document.querySelector("#select_track2").onclick = handleSelection;
        document.querySelector("#select_track3").onclick = handleSelection;
    }
}

