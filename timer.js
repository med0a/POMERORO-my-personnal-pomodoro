// Durées par défaut en minutes
let pomodoroDuration = 25;
let breakDuration = 5;
let timer;
let timeLeft = pomodoroDuration * 60;
let isPaused = false;

//pomodoroMusic.loop = true;
// Éléments DOM
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("RestartButton");
const pomodoroMusic = document.getElementById("pomodoroMusic");
const pomodoro = document.getElementById("pomodoro");
const breakTime = document.getElementById("break");
const pauseButton = document.getElementById("pauseButton");

// Modal Parameters
const parametersBtn = document.getElementById("parameters");
const modal = document.getElementById("parametersModal");
const closeBtn = modal.querySelector(".close");
const saveBtn = document.getElementById("saveParameters");
const pomodoroInput = document.getElementById("pomodoroInput");
const breakInput = document.getElementById("breakInput");
const musicInput = document.getElementById("musicInput");

// Ouvrir modal
parametersBtn.addEventListener("click", () => {
    pomodoroInput.value = pomodoroDuration;
    breakInput.value = breakDuration;
    musicInput.value = pomodoroMusic.src || "";
    modal.style.display = "block";
});

// Fermer modal
closeBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
});

// Sauvegarder paramètres
saveBtn.addEventListener("click", () => {
    const newPomodoro = parseInt(pomodoroInput.value);
    const newBreak = parseInt(breakInput.value);
    const newMusic = musicInput.value;

    if (!isNaN(newPomodoro)) pomodoroDuration = newPomodoro;
    if (!isNaN(newBreak)) breakDuration = newBreak;
    if (newMusic) pomodoroMusic.src = newMusic;

    // Mettre à jour le timer actif
    timeLeft = pomodoro.classList.contains("active") ? pomodoroDuration * 60 : breakDuration * 60;

    updateTimerDisplay();
    modal.style.display = "none";
});

// Mettre à jour l'affichage du timer
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

// Démarrer le timer
function startTimer(){
    if (!timer){
        if (pomodoro.classList.contains("active") && pomodoroMusic.src && !isPaused){
             pomodoroMusic.loop = true;
            pomodoroMusic.play();

        }
        timer=setInterval(() => {
            if (timeLeft >0 && !isPaused){
                timeLeft--;
                updateTimerDisplay();
            }else if(timeLeft<=0){
                clearInterval(timer);
                timer=null;
                alert("time's up !!!");
                if (pomodoroMusic.src) pomodoroMusic.pause();
            }
        },1000);
    }
}
// the pause button event : 
pauseButton.addEventListener("click", () => {
    if (!timer) return;  

    isPaused = !isPaused; 
    if (isPaused) {
        pauseButton.textContent = "Resume";
        if (pomodoroMusic.src) pomodoroMusic.pause();
    } else {
        pauseButton.textContent = "Pause";
        if (pomodoro.classList.contains("active") && pomodoroMusic.src) pomodoroMusic.play();
    }
});
// Redémarrer le timer
function restartTimer() {
    clearInterval(timer);
    timer = null;
    isPaused = false;
    pauseButton.textContent = "Pause"; // reset bouton

    timeLeft = pomodoro.classList.contains("active") ? pomodoroDuration * 60 : breakDuration * 60;

    updateTimerDisplay();

    // arrêter la musique et remettre à zéro
    if (pomodoroMusic.src) {
        pomodoroMusic.pause();
        pomodoroMusic.currentTime = 0;
        pomodoroMusic.loop = false;
    }
}

// Changer le mode (Pomodoro / Break)
function setTimer(type) {
    clearInterval(timer);
    timer = null;
    if (type === "pomodoro") {
        timeLeft = pomodoroDuration * 60;
        pomodoro.classList.add("active");
        breakTime.classList.remove("active");
    } else {
        timeLeft = breakDuration * 60;
        breakTime.classList.add("active");
        pomodoro.classList.remove("active");
    }
    updateTimerDisplay();
}

// Listeners des boutons
startButton.addEventListener("click", startTimer);
restartButton.addEventListener("click", restartTimer);
pomodoro.addEventListener("click", () => setTimer("pomodoro"));
breakTime.addEventListener("click", () => setTimer("break"));

// Initialiser l'affichage
updateTimerDisplay();
