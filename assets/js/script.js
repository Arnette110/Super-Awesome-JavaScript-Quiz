// variables
var startBtn = document.getElementById("start-btn");

var questionContainer = document.getElementById("questions-container");

var endGame = document.getElementById("end");

var questionEl = document.getElementById("question");

var answerBtnA = document.getElementById("a");

var answerBtnB = document.getElementById("b");

var answerBtnC = document.getElementById("c");

var answerBtnD = document.getElementById("d");

var answerBtns = document.getElementById("answer-buttons");

var timerEl = document.getElementById("timer");

var scoreDiv = document.getElementById("score");

var saveBtn = document.getElementById("save-btn");

var restartBtn = document.getElementById("restart-btn");

var inputEl = document.getElementById("input");

var viewScoresBtn = document.getElementById("view-high-scores");

var scoresContainer = document.getElementById("scores-container");

var resetBtn = document.getElementById("reset-btn");

// tracking variables
var questionTracker = 0;
var score = 0;
var timeLeft = 50;
var quizEnd = false;
var highScores = [];

// save button - when clicked saves users score and the initials/name typed in the text input box into highscores array then stores it in local storage as a string
saveBtn.addEventListener("click", function() {
  var inputData = inputEl.value;
  var finalScore = +score + +timeLeft + 1;
  var scoresObject = { name: `${inputData}`, score: `${finalScore}` };
  highScores.push(scoresObject);
  localStorage.setItem("High Scores", JSON.stringify(highScores));
  alert("Your score was saved!");
});

// when "Enter" is pressed saves(pushes to local storage) users score and the initials/name typed in the text input box into high scores array then stores it in local storage as a string
inputEl.addEventListener("keypress", function(e) {
  if (e.which === 13) {
    var inputData = inputEl.value;
    var finalScore = +score + +timeLeft + 1;
    var scoresObject = { name: `${inputData}`, score: `${finalScore}` };
    highScores.push(scoresObject);
    localStorage.setItem("High Scores", JSON.stringify(highScores));
    alert("Your score was saved!");
  }
});

// if High Scores data has been stored in local storage then parse it back into an object array that will be displayed on view high scores screen
if (localStorage.getItem("High Scores")) {
  highScores = JSON.parse(localStorage.getItem("High Scores"));
};

// sorts high scores list in descending order with highest score at the top
highScores.sort(function(a, b){
    return b.score - a.score;
}
);

// when clicked, loops through data in highscores array and appends the data items to a new div to be displayed. hides other divs so only the highscores div is displayed.
viewScoresBtn.addEventListener("click", function() {
  while (scoresContainer.firstChild) {
    scoresContainer.removeChild(scoresContainer.firstChild);
  }
  for (i = 0; i < highScores.length; i++) {
    var scoreEntries = document.createElement("div");
    scoreEntries.innerText = `${highScores[i].name} : ${highScores[i].score}`;
    // sortScores();
    scoresContainer.appendChild(scoreEntries);
  }
  
  startBtn.classList.add("hide");
  endGame.classList.add("hide");
  scoresContainer.classList.remove("hide");
});

// when clicked, hides all divs except for the startBtn div and resets quiz/tracker/score/timeLeft
resetBtn.addEventListener("click", function() {
  startBtn.classList.remove("hide");
  scoresContainer.classList.add("hide");
  questionContainer.classList.add("hide");
  endGame.classList.add("hide");
  questionTracker = 0;
  score = 0;
  timeLeft = 50;
  quizEnd = false;
});

// start game, when clicked runs the startGame function and timer function
startBtn.addEventListener("click", function() {
  startGame();
  timer();
});

// function to start the game, hides startBtn, displays the questions container and runs loadNextQuestion function
function startGame() {
  startBtn.classList.add("hide");
  questionContainer.classList.remove("hide");
  loadNextQuestion();
};

// function to load next question in questions array, checks if last question has been displayed, if so it hides the question container and displays the end game screen, sets the quizEnd to true and totals the users score
function loadNextQuestion() {
  if (questionTracker === questions.length) {
    questionContainer.classList.add("hide");
    endGame.classList.remove("hide");
    quizEnd = true;
    var finalScore = +score + +timeLeft;
    scoreDiv.innerText = `Your Score: ${finalScore}`;
    return;
  }
  //   delegates which question to display and its corresponding choices
  var q = questions[questionTracker];
  questionEl.innerText = q.title;
  answerBtnA.innerText = q.choices[0];
  answerBtnB.innerText = q.choices[1];
  answerBtnC.innerText = q.choices[2];
  answerBtnD.innerText = q.choices[3];
};

// when clicked, checks the text of the button clicked against the answer associated with the current question that is displayed. If correct answer is selected then alert "correct", increment the questionTracker and increment the score by 1 and run loadNextQuestion, otherwise alert "wrong", still advance tracker but decrease timer by 10 seconds then load next question.
answerBtns.addEventListener("click", function(event) {
  if (event.target.innerText == questions[questionTracker].answer) {
    alert("correct");
    questionTracker++;
    score++;
    loadNextQuestion();
  } else if (event.target.innerText !== questions[questionTracker].answer) {
    alert("wrong");
    questionTracker++;
    timeLeft -= 10;
    loadNextQuestion();
  }
});

// runs countdown timer, displays timeleft on screen
function timer() {
  console.log(timeLeft);
  var timeInterval = setInterval(function() {
    timerEl.textContent = "Timer: " + timeLeft;
    timeLeft--;

    // when timer reaches 0 game ends - questions container hides and end game screen displays
    if (timeLeft <= 0 || quizEnd === true) {
      timerEl.textContent = "";
      clearInterval(timeInterval);
      questionContainer.classList.add("hide");
      endGame.classList.remove("hide");
    }
  }, 1000);
}
