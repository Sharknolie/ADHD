// Data access
async function fetchTasks() {
    return apiGet('/tasks');
}

async function fetchCoins() {
    const data = await apiGet('/coins');
    return data.coins || 0;
}

async function updateCoinsDisplay() {
    totalCoinsDisplay.textContent = await fetchCoins();
}

// DOM
const taskContent = document.getElementById('task-content');
const taskCoins = document.getElementById('task-coins');
const btnCreate = document.getElementById('btn-create');
const taskList = document.getElementById('task-list');
const totalCoinsDisplay = document.getElementById('total-coins');
const filterButtons = document.querySelectorAll('.filter-btn');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabView = document.getElementById('tab-view');
const tabCreate = document.getElementById('tab-create');

let currentFilter = 'all';

function getSelectedRadio(name) {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    return selected ? selected.value : null;
}

async function createTask() {
    const content = taskContent.value.trim();
    const category = getSelectedRadio('category');
    const energy = parseInt(getSelectedRadio('energy'), 10);
    const coins = parseInt(taskCoins.value, 10);

    if (content === '') {
        alert('Please enter task content.');
        return;
    }

    if (isNaN(coins) || coins < 1) {
        alert('Please enter a valid coin amount.');
        return;
    }

    try {
        await apiPost('/tasks', { content, category, energy, coins });
        taskContent.value = '';
        taskCoins.value = '10';
        await renderTaskList();
    } catch (err) {
        console.error(err);
        alert('Failed to create task.');
    }
}

async function completeTask(taskId) {
    try {
        const res = await apiPost(`/tasks/${taskId}/complete`, {});
        totalCoinsDisplay.textContent = res.coins;
        await renderTaskList();
    } catch (err) {
        console.error(err);
        alert('Failed to complete task.');
    }
}

async function deleteTask(taskId) {
    try {
        await apiDelete(`/tasks/${taskId}`);
        await renderTaskList();
    } catch (err) {
        console.error(err);
        alert('Failed to delete task.');
    }
}

async function renderTaskList() {
    let tasks = [];
    try {
        tasks = await fetchTasks();
    } catch (err) {
        console.error(err);
        alert('Failed to load tasks.');
        return;
    }

    const filteredTasks = currentFilter === 'all'
        ? tasks
        : tasks.filter(t => t.category === currentFilter);

    taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<li class="empty-message">No tasks</li>';
        return;
    }

    filteredTasks.forEach(function (task) {
        const li = document.createElement('li');
        li.className = 'task-item';

        let energyDisplay = '';
        for (let i = 0; i < task.energy; i++) {
            energyDisplay += '⚡';
        }

        li.innerHTML = `
            <div class="task-main">
                <span class="task-content">${task.content}</span>
                <div class="task-meta">
                    <span class="task-category">${task.category || ''}</span>
                    <span class="task-energy">${energyDisplay}</span>
                </div>
            </div>
            <div class="task-right-side">
                <span class="task-coins">🪙 ${task.coins}</span>
                <div class="task-actions">
                    <button class="btn-complete" data-id="${task.id}" aria-label="Complete"></button>
                    <button class="btn-delete" data-id="${task.id}">Delete</button>
                </div>
            </div>
        `;

        taskList.appendChild(li);
    });

    document.querySelectorAll('.btn-complete').forEach(btn => {
        btn.addEventListener('click', function () {
            const taskId = parseInt(this.dataset.id, 10);
            completeTask(taskId);
        });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function () {
            const taskId = parseInt(this.dataset.id, 10);
            deleteTask(taskId);
        });
    });
}

function setFilter(filter) {
    currentFilter = filter;

    filterButtons.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    renderTaskList();
}

function switchTab(tabName) {
    tabButtons.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    if (tabName === 'view') {
        tabView.classList.remove('hidden');
        tabCreate.classList.add('hidden');
    } else {
        tabView.classList.add('hidden');
        tabCreate.classList.remove('hidden');
    }
}

btnCreate.addEventListener('click', createTask);

taskContent.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        createTask();
    }
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
        setFilter(this.dataset.filter);
    });
});

tabButtons.forEach(btn => {
    btn.addEventListener('click', function () {
        switchTab(this.dataset.tab);
    });
});

updateCoinsDisplay();
renderTaskList();

document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.querySelector('nav a[href="login.html"]');
    if (localStorage.getItem('currentUser') && loginLink) {
        loginLink.style.display = 'none';
    }
});
