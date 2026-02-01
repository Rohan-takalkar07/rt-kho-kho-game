let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let resetBtn = document.getElementById('reset');

let minutes = 0;
let seconds = 0;
let timer = null; // interval reference

startBtn.addEventListener("click", function() {
    if (timer === null) { // prevent multiple intervals
        timer = setInterval(stopWatch, 1000); // run every 1000 ms (1 second)
    }
});

stopBtn.addEventListener("click", function() {
    clearInterval(timer);
    timer = null;
});

resetBtn.addEventListener("click", function() {
    clearInterval(timer);
    timer = null;
    minutes = 0;
    seconds = 0;
    document.getElementById("minutes").innerHTML = "00";
    document.getElementById("seconds").innerHTML = "00";
});

function stopWatch() {
    seconds++;

    if (seconds === 60) {
        minutes++;
        seconds = 0;
    }

    let minString = minutes < 10 ? "0" + minutes : minutes;
    let secString = seconds < 10 ? "0" + seconds : seconds;

    document.getElementById("minutes").innerHTML = minString;
    document.getElementById("seconds").innerHTML = secString;
}
