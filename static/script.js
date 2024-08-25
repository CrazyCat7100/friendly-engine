let mole = document.getElementsByClassName("mole");
let scoreDiv = document.getElementsByClassName("counter")[0];
let timerDiv = document.getElementsByClassName("timer")[0];
let holes = document.getElementsByClassName("holes")[0];
let leaderboard = document.getElementsByClassName("leaderboard")[0];
let openLeaderboardButton = document.getElementsByClassName("open-leaderboard")[0];
let closeLeaderboardButton = document.getElementsByClassName("close-leaderboard")[0];
let saveBtn = document.getElementsByClassName("savebtn")[0];
let input = document.querySelector(".savescore input");
let saveScorePopup = document.querySelector(".savescore");
let score = 0;
let timer = 30;
let timerInterval;
let timerStarted = false;
let gameEnded = false;

if (localStorage.getItem('checkedIn?') === null) {
  localStorage.setItem('checkedIn?', false)
}


openLeaderboardButton.addEventListener("click", function () {
    leaderboard.classList.remove("hidden");
});

closeLeaderboardButton.addEventListener("click", function () {
    leaderboard.classList.add("hidden");
});

function hideAllMoles() {
    for (let i = 0; i < mole.length; i++) {
        mole[i].style.display = "none";
    }
}

function moleSpawn() {
    if (gameEnded) return;
    hideAllMoles();
    let randomNum = Math.floor(Math.random() * 9);
    mole[randomNum].style.display = "flex";
}

function updateScore() {
    if (gameEnded) return;
    scoreDiv.innerText = "Score: " + ++score;
}

function startTimer() {
    timerInterval = setInterval(function () {
        timer--;
        timerDiv.innerText = "Time: " + timer;
        if (timer <= 0) {
            clearInterval(timerInterval);
            timerDiv.innerText = "Time: 0";
            endGame();
        }
    }, 1000);
}


function addMoleClickListeners() {
    [...mole].forEach(function (el) {
        el.addEventListener("click", function () {
            if (!timerStarted) {
                startTimer();
                timerStarted = true;
            }
            moleSpawn();
            updateScore();
        });
    });
}

let username = ''

saveBtn.addEventListener("click", function () {
    username = input.value.trim();
    if (username === "") {
        alert("Please enter a username.");
        return;
    }
    localStorage.setItem('name', username)


    let data = {
        username: username,
        score: score
    };

    fetch("/score", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
      .then(result => {
          if (result.success) {
              input.value = "";
              saveScorePopup.style.display = 'none'
          } else {

          }
      }).catch(error => {
          console.error("Error:", error);

      });
});

function endGame() {
  gameEnded = true;
  hideAllMoles();
  
  if (localStorage.getItem('checkedIn?') === 'false') {
    saveScorePopup.style.display = 'flex'
    localStorage.setItem('checkedIn?', 'true')
  }
  
  else {
    let userName = localStorage.getItem('name')

    let data = {
      username: userName,
      score: score
  };

    fetch("/score", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
  }).then(response => response.json())
    .then(result => {
        if (result.success) {
            input.value = "";
            saveScorePopup.style.display = 'none'
        } else {

        }
    }).catch(error => {
        console.error("Error:", error);
    });

  }
}


moleSpawn();
addMoleClickListeners();
