async function fetchQuestions() {
    return apiGet('/questions');
}

async function createQuestion(text) {
    return apiPost('/questions', { text });
}

async function deleteQuestionById(id) {
    return apiDelete(`/questions/${id}`);
}

const questionList = document.getElementById('question-list');
const newQuestionInput = document.getElementById('new-question');
const btnAdd = document.getElementById('btn-add');

async function renderList() {
    let questions = [];
    try {
        questions = await fetchQuestions();
    } catch (err) {
        console.error(err);
        alert('Failed to load questions.');
        return;
    }

    questionList.innerHTML = '';

    questions.forEach(function (question) {
        const li = document.createElement('li');

        const span = document.createElement('span');
        span.textContent = question.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function () {
            deleteQuestion(question.id);
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);
        questionList.appendChild(li);
    });
}

async function addQuestion() {
    const text = newQuestionInput.value.trim();
    if (text === '') {
        alert('Please enter a question.');
        return;
    }

    try {
        await createQuestion(text);
        newQuestionInput.value = '';
        await renderList();
    } catch (err) {
        console.error(err);
        alert('Failed to add question.');
    }
}

async function deleteQuestion(id) {
    try {
        await deleteQuestionById(id);
        await renderList();
    } catch (err) {
        console.error(err);
        alert('Failed to delete question.');
    }
}

btnAdd.addEventListener('click', addQuestion);

newQuestionInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addQuestion();
    }
});

renderList();

document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.querySelector('nav a[href="login.html"]');
    if (localStorage.getItem('currentUser') && loginLink) {
        loginLink.style.display = 'none';
    }
});
