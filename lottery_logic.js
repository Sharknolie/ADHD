// Blind Box Lottery Logic (API version)

let rewardPool = [
    "看一场电影",
    "喝一杯奶茶",
    "休息 1 小时",
    "免做家务一次",
    "购买一个小礼物",
    "获得 100 金币",
    "再来一次",
    "吃顿好的",
    "睡个懒觉"
];

async function updateRewardPool() {
    try {
        const customRewards = await apiGet('/rewards');
        if (customRewards && customRewards.length > 0) {
            // Store full objects, ensure weight exists
            rewardPool = customRewards.map(r => (typeof r === 'object' ? { ...r, weight: r.weight || 10 } : { text: r, weight: 10 }));
        }
    } catch (e) {
        console.warn("Failed to fetch custom rewards, using default.", e);
        // Ensure default pool is also objects for consistency
        if (rewardPool[0] && typeof rewardPool[0] === 'string') {
            rewardPool = rewardPool.map(r => ({ text: r, weight: 10 }));
        }
    }
}

const lotteryGame = {
    isAnimating: false,
    currentDrawParams: { drawCount: 0, keepCount: 0 },
    currentRewards: [],
    selectedIndices: new Set(),
    activeReward: null,

    async getCoins() {
        const data = await apiGet('/coins');
        return data.coins || 0;
    },

    async adjustCoins(delta) {
        const data = await apiPost('/coins/adjust', { delta });
        const display = document.getElementById('total-coins');
        if (display) display.textContent = data.coins;
        return data.coins;
    },

    async checkBalance(cost) {
        const coins = await this.getCoins();
        return coins >= cost;
    },

    async saveToHistory(results) {
        await apiPost('/rewards/history', { rewards: results });
    },

    async getHistory() {
        return apiGet('/rewards/history');
    },

    async draw(drawCount, keepCount, cost) {
        if (this.isAnimating) return;

        const ok = await this.checkBalance(cost);
        if (!ok) {
            alert('Not enough coins. Complete tasks to earn more.');
            return;
        }

        this.currentDrawParams = { drawCount, keepCount };
        this.currentRewards = [];
        this.selectedIndices.clear();

        await this.adjustCoins(-cost);

        // Refresh pool before drawing
        await updateRewardPool();

        this.playAnimation(() => {
            const results = [];
            // Calculate total weight
            // Handle case where rewardPool elements might be strings (initial default)
            // But updateRewardPool should have fixed it. If not, fallback.

            const pool = rewardPool.map(r => (typeof r === 'string' ? { text: r, weight: 10 } : r));

            for (let i = 0; i < drawCount; i++) {
                const totalWeight = pool.reduce((sum, item) => sum + (item.weight || 10), 0);
                let random = Math.random() * totalWeight;
                let selected = pool[pool.length - 1]; // Default to last

                for (const item of pool) {
                    random -= (item.weight || 10);
                    if (random < 0) {
                        selected = item;
                        break;
                    }
                }

                // Store just the text string for simplicity in history/display if downstream expects strings?
                // Actually `showResults` expects whatever is in `currentRewards`.
                // Let's store the full object to keep context, or just text?
                // `saveToHistory` receives finalRewards.

                // Let's check `getRewardIcon(text)`. It expects a string.
                // It's safer to push strings here IF we don't need weight later.
                // BUT, user might want to know they won a "Rare" item?
                // Let's push text for minimal friction with existing code, OR update showResults.
                // The previous code pushed `rewardPool[randomIndex]` which was text (mostly).
                // Let's push the TEXT to maintain compatibility with `saveToHistory` which likely expects strings or simple objects.
                // Wait, `saveToHistory` calls API. The API might handle strings or objects.
                // Looking at `saveToHistory`, it sends `{ rewards: results }`.

                // Let's just push the text to be safe and consistent with previous "default" array of strings.
                results.push(selected.text || selected);
            }
            this.currentRewards = results;

            if (keepCount === drawCount) {
                results.forEach((_, idx) => this.selectedIndices.add(idx));
            }

            this.showResults();
        });
    },

    playAnimation(callback) {
        this.isAnimating = true;
        const box = document.getElementById('loot-box');
        const img = document.getElementById('loot-box-img');

        box.classList.remove('idle');
        box.classList.add('shake');

        setTimeout(() => {
            box.classList.remove('shake');
            box.classList.add('open');
            if (img) img.src = 'assets/loot_box_open.png';

            setTimeout(() => {
                callback();
                this.isAnimating = false;
            }, 1000);
        }, 500);
    },

    getRewardIcon(text) {
        const lower = text.toLowerCase();

        if (lower.match(/电影|剧|watch|movie/)) return '🎬';
        if (lower.match(/奶茶|喝|饮料|水|drink|tea/)) return '🥤';
        if (lower.match(/吃|饭|餐|美食|eat|food/)) return '🍔';
        if (lower.match(/睡|觉|休息|sleep|rest|nap/)) return '🛌';
        if (lower.match(/游戏|玩|game|play|steam/)) return '🎮';
        if (lower.match(/书|读|学习|read|book|study/)) return '📚';
        if (lower.match(/钱|金币|money|coin/)) return '💰';
        if (lower.match(/ai|聊|chat|gpt|gemini/)) return '🤖';
        if (lower.match(/色色|涩涩/)) return '😳';
        if (lower.match(/买|购|gift|buy/)) return '🎁';
        if (lower.match(/家务|扫|chore/)) return '🧹';
        if (lower.match(/旅行|去|go|travel/)) return '✈️';
        if (lower.match(/再来|try again/)) return '🔄';

        // Consistent random fallback based on text hash
        const fallbacks = ['✨', '🌟', '🎉', '🎁', '💎', '🌈', '💖', '🍀', '🦄', '🔥'];
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = text.charCodeAt(i) + ((hash << 5) - hash);
        }
        return fallbacks[Math.abs(hash) % fallbacks.length];
    },

    showResults() {
        const modal = document.getElementById('reward-modal');
        const list = document.getElementById('reward-list');
        const instruction = document.getElementById('modal-instruction');
        const btn = document.getElementById('btn-confirm-reward');

        const { drawCount, keepCount } = this.currentDrawParams;
        const isSelectionMode = keepCount < drawCount;

        if (isSelectionMode) {
            instruction.textContent = `Pick ${keepCount} of ${drawCount} rewards:`;
            btn.textContent = `Confirm (${this.selectedIndices.size}/${keepCount})`;
            btn.disabled = this.selectedIndices.size !== keepCount;
        } else {
            instruction.textContent = '';
            btn.textContent = 'Keep rewards';
            btn.disabled = false;
        }

        list.innerHTML = '';
        this.currentRewards.forEach((reward, index) => {
            const div = document.createElement('div');
            div.className = 'reward-item';

            const icon = document.createElement('div');
            icon.className = 'reward-icon';
            icon.textContent = this.getRewardIcon(reward);
            div.appendChild(icon);

            const text = document.createElement('div');
            text.className = 'reward-text';
            text.textContent = reward;
            div.appendChild(text);

            div.style.animationDelay = `${index * 0.1}s`;

            if (isSelectionMode) {
                div.classList.add('selectable');
                if (this.selectedIndices.has(index)) {
                    div.classList.add('selected');
                }
                div.onclick = () => this.toggleSelection(index);
            }

            list.appendChild(div);
        });

        modal.classList.remove('hidden');
        requestAnimationFrame(() => {
            modal.classList.add('visible');
        });
    },

    toggleSelection(index) {
        const { keepCount } = this.currentDrawParams;

        if (this.selectedIndices.has(index)) {
            this.selectedIndices.delete(index);
        } else if (this.selectedIndices.size < keepCount) {
            this.selectedIndices.add(index);
        }
        this.showResults();
    },

    async confirmSelection() {
        if (this.currentDrawParams.keepCount < this.currentDrawParams.drawCount &&
            this.selectedIndices.size !== this.currentDrawParams.keepCount) {
            return;
        }

        const finalRewards = this.currentRewards.filter((_, idx) => this.selectedIndices.has(idx));
        await this.saveToHistory(finalRewards);
        this.closeModal();
    },

    closeModal() {
        const modal = document.getElementById('reward-modal');
        const img = document.getElementById('loot-box-img');
        modal.classList.remove('visible');

        setTimeout(() => {
            modal.classList.add('hidden');
            const box = document.getElementById('loot-box');
            box.classList.remove('open');
            box.classList.add('idle');
            if (img) img.src = 'assets/loot_box_closed.png';
        }, 300);
    },

    async showHistory() {
        const modal = document.getElementById('history-modal');
        const list = document.getElementById('history-list');

        let history = [];
        try {
            history = await this.getHistory();
        } catch (err) {
            console.error(err);
            alert('Failed to load history.');
            return;
        }

        list.innerHTML = '';
        if (history.length === 0) {
            list.innerHTML = '<div style="color: #888; padding: 20px;">No history</div>';
        } else {
            history.forEach((entry, entryIndex) => {
                const entryDiv = document.createElement('div');
                entryDiv.className = 'history-entry';

                const dateHeader = document.createElement('div');
                dateHeader.className = 'history-date';
                dateHeader.textContent = entry.date;
                entryDiv.appendChild(dateHeader);

                const rewardsDiv = document.createElement('div');
                rewardsDiv.className = 'history-rewards';

                entry.rewards.forEach((reward, rewardIndex) => {
                    const tag = document.createElement('span');
                    tag.className = 'history-tag';
                    tag.textContent = reward.text;
                    tag.style.cursor = 'pointer';
                    tag.onclick = () => this.openRewardDetail(entryIndex, rewardIndex, reward.id, reward.text);
                    rewardsDiv.appendChild(tag);
                });

                entryDiv.appendChild(rewardsDiv);
                list.appendChild(entryDiv);
            });
        }

        modal.classList.remove('hidden');
        requestAnimationFrame(() => {
            modal.classList.add('visible');
        });
    },

    openRewardDetail(entryIndex, rewardIndex, rewardId, rewardText) {
        this.activeReward = { entryIndex, rewardIndex, id: rewardId, text: rewardText };

        const modal = document.getElementById('reward-detail-modal');
        const container = document.getElementById('detail-card-container');

        container.innerHTML = '';
        const card = document.createElement('div');
        card.className = 'reward-item';
        card.style.width = '200px';
        card.style.height = '260px';
        card.style.margin = '0 auto';

        const icon = document.createElement('div');
        icon.className = 'reward-icon';
        icon.textContent = this.getRewardIcon(rewardText);

        const text = document.createElement('div');
        text.className = 'reward-text';
        text.textContent = rewardText;
        text.style.fontSize = '1.5rem';

        card.appendChild(icon);
        card.appendChild(text);
        container.appendChild(card);

        document.getElementById('btn-use-reward').onclick = () => this.consumeReward('used');
        document.getElementById('btn-delete-reward').onclick = () => this.consumeReward('deleted');

        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('visible'), 10);
    },

    async consumeReward(action) {
        if (!this.activeReward) return;
        try {
            await apiPost(`/rewards/${this.activeReward.id}/consume`, { action });
            this.closeDetailModal();
            await this.showHistory();
        } catch (err) {
            console.error(err);
            alert('Failed to update reward.');
        }
    },

    closeDetailModal() {
        const modal = document.getElementById('reward-detail-modal');
        modal.classList.remove('visible');
        setTimeout(() => modal.classList.add('hidden'), 300);
    },

    closeHistoryModal() {
        const modal = document.getElementById('history-modal');
        modal.classList.remove('visible');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    },

    async clearHistory() {
        if (!confirm('Clear all history?')) return;
        try {
            await apiDelete('/rewards/history');
            await this.showHistory();
        } catch (err) {
            console.error(err);
            alert('Failed to clear history.');
        }
    }
};

window.lotteryGame = lotteryGame;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const coins = await lotteryGame.getCoins();
        const display = document.getElementById('total-coins');
        if (display) display.textContent = coins;
    } catch (err) {
        console.error(err);
    }

    const loginLink = document.querySelector('nav a[href="login.html"]');
    if (localStorage.getItem('currentUser') && loginLink) {
        loginLink.style.display = 'none';
    }
});
