let questions = [];
let currentIndex = 0;

const questionText = document.getElementById('question-text');
const questionArea = document.getElementById('question-area');
const feedbackArea = document.getElementById('feedback-area');
const completeArea = document.getElementById('complete-area');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const btnConfirm = document.getElementById('btn-confirm');
const btnRestart = document.getElementById('btn-restart');
const discomfortInput = document.getElementById('discomfort');
const actionInput = document.getElementById('action');

async function loadQuestions() {
    questions = await apiGet('/questions');
}

function showQuestion() {
    if (currentIndex >= questions.length) {
        showComplete();
        return;
    }

    questionText.textContent = questions[currentIndex].text || '';

    questionArea.classList.remove('hidden');
    feedbackArea.classList.add('hidden');
    completeArea.classList.add('hidden');
}

function nextQuestion() {
    currentIndex++;
    showQuestion();
}

function showFeedback() {
    questionArea.classList.add('hidden');
    feedbackArea.classList.remove('hidden');

    discomfortInput.value = '';
    actionInput.value = '';
}

function showComplete() {
    questionArea.classList.add('hidden');
    feedbackArea.classList.add('hidden');
    completeArea.classList.remove('hidden');
}

async function restart() {
    currentIndex = 0;
    await loadQuestions();
    showQuestion();
}

btnYes.addEventListener('click', function () {
    nextQuestion();
});

btnNo.addEventListener('click', function () {
    showFeedback();
});

btnConfirm.addEventListener('click', function () {
    nextQuestion();
});

btnRestart.addEventListener('click', function () {
    restart();
});

(async function init() {
    try {
        await loadQuestions();
        showQuestion();
    } catch (err) {
        console.error(err);
        questionText.textContent = 'Failed to load questions.';
    }

    const loginLink = document.querySelector('nav a[href="login.html"]');
    if (localStorage.getItem('currentUser') && loginLink) {
        loginLink.style.display = 'none';
    }
})();
