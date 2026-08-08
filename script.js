const playButton = document.getElementById("playButton");
const music = document.getElementById("music");
const progress = document.getElementById("progress");

let playing = false;

playButton.addEventListener("click", () => {

    if (playing) {
        music.pause();
        playButton.textContent = "▶";
    } else {
        music.play();
        playButton.textContent = "Ⅱ";
    }

    playing = !playing;
});

music.addEventListener("timeupdate", () => {

    if (!music.duration) return;

    const percent =
        (music.currentTime / music.duration) * 100;

    progress.style.width = percent + "%";
});

music.addEventListener("ended", () => {
    playing = false;
    playButton.textContent = "▶";
});


// Besucherzähler
let views = localStorage.getItem("profileViews");

if (!views) {
    views = 1;
} else {
    views++;
}

localStorage.setItem("profileViews", views);

document.getElementById("views").textContent = views;


// Discord OAuth
document.getElementById("discordButton").addEventListener("click", () => {

    window.location.href = "/auth/discord";

});
