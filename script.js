const statusMessage = document.getElementById('status-message');
const buttons = document.querySelectorAll('.focus-button');
const resetButton = document.getElementById('reset-button');
const catDisplay = document.getElementById('cat-display');
const timerNumbers = document.getElementById('timer-numbers');

let countdownInterval;
let isTimerRunning = false;

const MINIMUM_REST_TIME_SECONDS = 1800;
let restTimeRemaining = 0;
let restInterval;

// Format seconds as "MM:SS"
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const displayMinutes = String(minutes).padStart(2, '0');
    const displaySeconds = String(seconds).padStart(2, '0');
    return `${displayMinutes}:${displaySeconds}`;
}

// Update the Reset button during mandatory rest
function updateResetButton() {
    if (restTimeRemaining > 0) {
        const minutes = Math.floor(restTimeRemaining / 60);
        const seconds = restTimeRemaining % 60;
        const displayTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        resetButton.disabled = true;
        resetButton.textContent = `Resting for: ${displayTime}`;
        resetButton.style.backgroundColor = '#cc0000';
    } else {
        resetButton.disabled = false;
        resetButton.textContent = "RESET";
        resetButton.style.backgroundColor = '#00cc00';
    }
}

// Reset the entire app
function resetApp() {
    clearInterval(countdownInterval);
    clearInterval(restInterval);
    isTimerRunning = false;
    restTimeRemaining = 0; 
    timerNumbers.textContent = "00:00";
    statusMessage.textContent = "Choose your preferred focus time!";
    catDisplay.className = 'cat-display state-default';
    resetButton.disabled = false;
    resetButton.textContent = "RESET";
    resetButton.style.backgroundColor = '#00cc00';
}

// Update the cat image based on time percentage
function updateCatState(timeRemaining, totalDuration) {
    catDisplay.className = 'cat-display'; // reset class
    const percentage = timeRemaining / totalDuration;
    if (percentage > 0.66) {
        catDisplay.classList.add('state-happy');
    } else if (percentage > 0.33) {
        catDisplay.classList.add('state-focused');
    } else if (percentage > 0) {
        catDisplay.classList.add('state-tired');
    }
}

// Main timer logic
function startTimer(duration) {
    if (isTimerRunning) clearInterval(countdownInterval);
    
    isTimerRunning = true;
    let timeRemaining = duration;
    const totalDuration = duration;
    catDisplay.className = 'cat-display state-happy';

    statusMessage.textContent = "Session started! Stay focused and take a break soon! 💻";
    timerNumbers.textContent = formatTime(timeRemaining);
    
    countdownInterval = setInterval(() => {
        timeRemaining--;
        timerNumbers.textContent = formatTime(timeRemaining);
        updateCatState(timeRemaining, totalDuration);

        if (timeRemaining < 0) {
            clearInterval(countdownInterval);
            isTimerRunning = false;
            
            catDisplay.className = 'cat-display state-break';
            timerNumbers.textContent = "BREAK TIME!";
            statusMessage.textContent = "The Cat is at peace! Give it (and yourself) 30 min of rest! ❤️";
            
            restTimeRemaining = MINIMUM_REST_TIME_SECONDS;
            updateResetButton();

            restInterval = setInterval(() => {
                restTimeRemaining--;
                updateResetButton();
                if (restTimeRemaining <= 0) {
                    clearInterval(restInterval);
                    updateResetButton();
                }
            }, 1000);
        }
    }, 1000);
}

// On load: show the default cat
window.onload = () => {
    catDisplay.className = 'cat-display state-default';
};

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const duration = parseInt(button.getAttribute('data-time'), 10);
        statusMessage.textContent = `Starting a timer for ${duration / 60} minutes...`;
        startTimer(duration);
    });
});

resetButton.addEventListener('click', resetApp);







