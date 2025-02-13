const buttonColours = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userClickedPattern = [];
let attempts = [];
let started = false;
let level = 0;
let isAnimating = false;

// Variáveis de dificuldade
let isHardMode = false;
const baseSpeed = 700;
const baseHardSpeed = 600;
const minSpeed = 235;
let currentHardSpeed = baseHardSpeed;

$(document).keypress(function () {
  if (!started) {
    updateScoreboard();
    $("#level-title").text("Level " + level + (isHardMode ? " | Velocidade: " + currentHardSpeed + "ms" : ""));
    nextSequence();
    started = true;
  }
});

$(".btn").click(function () {
  if (isAnimating) return;
  let userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);
  animatePress(userChosenColour);
  checkAnswer(userClickedPattern.length - 1);
});

$("#quit-btn").click(function () {
  if (started) {
    attempts.push({
      attempt: attempts.length + 1,
      level: level
    });
    updateScoreboard();
  }
  startOver();
});

function updateScoreboard() {
  $("#score-list").empty();
  const maxAttempts = $(window).width() < 1230 ? 4 : 9;
  const recentAttempts = attempts.slice(-maxAttempts);
  recentAttempts.forEach(function (attempt) {
    $("#score-list").append(
      `<li>Tentativa ${attempt.attempt}: Nível ${attempt.level}</li>`
    );
  });
}

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    attempts.push({
      attempt: attempts.length + 1,
      level: level
    });
    updateScoreboard();
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 300);
    $("#level-title").text("Game Over, Press Any Key to Restart");
    startOver();
  }
}

function nextSequence() {
  userClickedPattern = [];
  level++;

  if (isHardMode) {
    currentHardSpeed = Math.max(baseHardSpeed * Math.pow(0.9, level - 1), minSpeed);
  }

  $("#level-title").text("Level " + level + (isHardMode ? " | Velocidade: " + Math.round(currentHardSpeed) + "ms" : ""));
  let randomNumber = Math.floor(Math.random() * 4);
  let randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);
  playGamePattern();
}

function playGamePattern() {
  isAnimating = true;
  const speed = isHardMode ? currentHardSpeed : baseSpeed;

  gamePattern.forEach((color, index) => {
    setTimeout(() => {
      $("#" + color).fadeIn(100).fadeOut(100).fadeIn(100);
      playSound(color);
    }, index * speed);
  });

  setTimeout(() => {
    isAnimating = false;
  }, gamePattern.length * speed);
}

function playSound(name) {
  let audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
  userClickedPattern = [];
  isAnimating = false;
  if (isHardMode) currentHardSpeed = baseHardSpeed;
  $("#level-title").text("Pressione uma tecla para começar!");
}

$("#difficulty-btn").click(function () {
  isHardMode = !isHardMode;
  $(this).toggleClass("active");

  if (isHardMode) {
    currentHardSpeed = baseHardSpeed;
    console.log("Dificuldade progressiva ativada!");
    $("body").addClass("hard");
  } else {
    console.log("Dificuldade normal");
    $("body").removeClass("hard");
  }

  $(this).html(isHardMode ? "Modo Difícil" : "Modo Normal");
});