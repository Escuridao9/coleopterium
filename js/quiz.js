import { getBeetles } from "./beetles.js";
import { getGameState, addPoints } from "./game-state.js";

const POINTS_PER_ANSWER = 10;
const QUESTIONS_PER_ROUND = 5;
const quizContent = document.getElementById("quiz-content");
const quizMessage = document.getElementById("quiz-message");
const questionSection = document.getElementById("quiz-question-section");
const questionTitle = document.getElementById("quiz-question");
const scientificName = document.getElementById("quiz-scientific-name");
const progress = document.getElementById("quiz-progress");
const options = document.getElementById("quiz-options");
const optionTemplate = document.getElementById("quiz-option-template");
const feedback = document.getElementById("quiz-feedback");
const entryLink = document.getElementById("quiz-entry-link");
const balanceValue = document.getElementById("quiz-balance");
const scoreValue = document.getElementById("quiz-score");
const earnedValue = document.getElementById("quiz-earned");
const nextButton = document.getElementById("quiz-next");
const retryButton = document.getElementById("quiz-retry");
const finishedSection = document.getElementById("quiz-finished");
const finishTitle = document.getElementById("quiz-finish-title");
const result = document.getElementById("quiz-result");
const restartButton = document.getElementById("quiz-restart");

let beetles = [];
let questions = [];
let questionIndex = 0;
let score = 0;
let earned = 0;
let answered = false;
let rewardPending = false;
let quizLoaded = false;

function shuffle(items) {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function refreshBalance() {
  try {
    balanceValue.textContent = String(getGameState().points);
    quizMessage.textContent = "";
  } catch (error) {
    balanceValue.textContent = "—";
    quizMessage.textContent = "Your saved points could not be read in this browser.";
    console.error("Could not read points:", error);
  }
}

function showQuestion() {
  const question = questions[questionIndex];
  answered = false;
  rewardPending = false;
  feedback.textContent = "";
  entryLink.hidden = true;
  nextButton.hidden = true;
  nextButton.disabled = false;
  retryButton.hidden = true;
  progress.textContent = `Question ${questionIndex + 1} of ${questions.length}`;
  scientificName.textContent = question.scientificName;
  options.replaceChildren();

  const alternatives = shuffle(beetles.filter(beetle => beetle.id !== question.id))
    .slice(0, 2);

  shuffle([question, ...alternatives]).forEach(beetle => {
    const option = optionTemplate.content.cloneNode(true);
    const button = option.querySelector("button");
    button.textContent = beetle.commonName;
    button.dataset.beetleId = beetle.id;
    button.addEventListener("click", () => answerQuestion(beetle.id));
    options.append(option);
  });

  questionTitle.focus();
}

function saveReward() {
  if (!rewardPending) return;

  let state;

  try {
    state = addPoints(POINTS_PER_ANSWER);
  } catch (error) {
    feedback.textContent = "Correct, but your points could not be saved. Retry saving to continue.";
    retryButton.hidden = false;
    nextButton.disabled = true;
    console.error("Could not save the quiz reward:", error);
    return;
  }

  rewardPending = false;
  earned += POINTS_PER_ANSWER;
  balanceValue.textContent = String(state.points);
  earnedValue.textContent = String(earned);
  quizMessage.textContent = "";
  feedback.textContent = `Correct! You earned ${POINTS_PER_ANSWER} points.`;
  retryButton.hidden = true;
  nextButton.disabled = false;
}

function answerQuestion(selectedId) {
  if (answered) return;
  answered = true;

  const question = questions[questionIndex];

  options.querySelectorAll("button").forEach(button => {
    button.disabled = true;
    if (button.dataset.beetleId === question.id) {
      button.classList.add("is-correct");
    } else if (button.dataset.beetleId === selectedId) {
      button.classList.add("is-incorrect");
    }
  });

  entryLink.textContent = `Read about ${question.commonName}`;
  entryLink.href = `entry.html?id=${encodeURIComponent(question.id)}`;
  entryLink.hidden = false;
  nextButton.textContent = questionIndex === questions.length - 1
    ? "Finish quiz"
    : "Next question";
  nextButton.hidden = false;

  if (selectedId === question.id) {
    score++;
    scoreValue.textContent = String(score);
    rewardPending = true;
    saveReward();
  } else {
    feedback.textContent = `The correct answer is ${question.commonName}.`;
  }
}

function startQuiz() {
  questions = shuffle(beetles).slice(0, QUESTIONS_PER_ROUND);
  questionIndex = 0;
  score = 0;
  earned = 0;
  scoreValue.textContent = "0";
  earnedValue.textContent = "0";
  finishedSection.hidden = true;
  questionSection.hidden = false;
  showQuestion();
  refreshBalance();
}

nextButton.addEventListener("click", () => {
  if (!answered || rewardPending) return;
  questionIndex++;

  if (questionIndex < questions.length) {
    showQuestion();
  } else {
    answered = false;
    questionSection.hidden = true;
    finishedSection.hidden = false;
    result.textContent = `You answered ${score} of ${questions.length} questions correctly and earned ${earned} points.`;
    finishTitle.focus();
  }
});

retryButton.addEventListener("click", saveReward);
restartButton.addEventListener("click", startQuiz);
window.addEventListener("pageshow", () => {
  if (quizLoaded) refreshBalance();
});

async function loadQuiz() {
  try {
    beetles = await getBeetles();

    if (!Array.isArray(beetles) || beetles.length < 2) {
      throw new Error("The quiz needs at least two species.");
    }

    quizContent.hidden = false;
    startQuiz();
    quizLoaded = true;
  } catch (error) {
    quizContent.hidden = true;
    quizMessage.textContent = "The quiz could not be loaded. Please reload the page.";
    console.error("Could not load the quiz:", error);
  }
}

loadQuiz();
