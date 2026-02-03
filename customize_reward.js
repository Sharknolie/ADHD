const rewardList = document.getElementById('reward-pool-list');
const newRewardInput = document.getElementById('new-reward');
const newRewardWeight = document.getElementById('new-reward-weight');
const btnAddReward = document.getElementById('btn-add-reward');

async function fetchRewards() {
    return apiGet('/rewards');
}

async function createReward(text, weight) {
    return apiPost('/rewards', { text, weight: parseInt(weight) || 10 });
}

async function deleteRewardById(id) {
    return apiDelete(`/rewards/${id}`);
}

async function renderRewardList() {
    let rewards = [];
    try {
        rewards = await fetchRewards();
    } catch (err) {
        console.error(err);
        return;
    }

    rewardList.innerHTML = '';

    if (rewards.length === 0) {
        rewardList.innerHTML = '<li class="empty-message" style="color: #888;">暂无自定义奖品</li>';
        return;
    }

    rewards.forEach(function (reward) {
        const li = document.createElement('li');
        li.className = 'reward-list-item';

        const infoDiv = document.createElement('div');
        infoDiv.style.display = 'flex';
        infoDiv.style.alignItems = 'center';
        infoDiv.style.gap = '15px';

        const span = document.createElement('span');
        span.textContent = reward.text || reward;
        span.className = 'reward-list-text';

        const weightBadge = document.createElement('span');
        const weight = reward.weight || 10;
        weightBadge.textContent = `权重: ${weight}`;
        weightBadge.style.fontSize = '0.8rem';
        weightBadge.style.background = 'rgba(255,255,255,0.1)';
        weightBadge.style.padding = '2px 8px';
        weightBadge.style.borderRadius = '10px';
        weightBadge.style.color = '#aaa';

        infoDiv.appendChild(span);
        infoDiv.appendChild(weightBadge);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✕';
        deleteBtn.className = 'btn-icon-delete';
        deleteBtn.title = '删除';
        deleteBtn.addEventListener('click', function () {
            deleteReward(reward.id);
        });

        li.appendChild(infoDiv);
        li.appendChild(deleteBtn);
        rewardList.appendChild(li);
    });
}

async function addReward() {
    const text = newRewardInput.value.trim();
    const weight = newRewardWeight.value;

    if (text === '') {
        alert('请输入奖品内容');
        return;
    }

    try {
        await createReward(text, weight);
        newRewardInput.value = '';
        newRewardWeight.value = '10'; // reset to default
        await renderRewardList();
    } catch (err) {
        console.error(err);
        alert('添加奖品失败');
    }
}

async function deleteReward(id) {
    if (!confirm('确定要删除这个奖品吗？')) return;

    try {
        await deleteRewardById(id);
        await renderRewardList();
    } catch (err) {
        console.error(err);
        alert('删除奖品失败');
    }
}

btnAddReward.addEventListener('click', addReward);

newRewardInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addReward();
    }
});

// Hide login link if logged in
document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.querySelector('nav a[href="login.html"]');
    if (localStorage.getItem('currentUser') && loginLink) {
        loginLink.style.display = 'none';
    }
    renderRewardList();
});
