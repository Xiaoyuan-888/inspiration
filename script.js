// ========== 配置区：可自行修改密码 ==========
const QUESTION_PASSWORD = "2026";
// ==========================================

let isQuestionsUnlocked = false;
let isTopicListRendered = false;
let isTipsRendered = false;

// 标签切换功能
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        
        // 如果点击问答库且未解锁，拦截切换
        if (tab === 'questions' && !isQuestionsUnlocked) {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`${tab}-tab`).classList.add('active');
            return;
        }
        
        // 正常切换
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(`${tab}-tab`).classList.add('active');

        // 切换到录制宝典时渲染内容
        if (tab === 'tips' && !isTipsRendered) {
            renderTips();
            isTipsRendered = true;
        }
    });
});

// 密码解锁逻辑
const unlockBtn = document.getElementById('unlock-btn');
const passwordInput = document.getElementById('password-input');
const lockError = document.getElementById('lock-error');
const passwordLock = document.getElementById('password-lock');
const questionsContent = document.getElementById('questions-content');

function unlockQuestions() {
    const input = passwordInput.value;
    if (input === QUESTION_PASSWORD) {
        isQuestionsUnlocked = true;
        passwordLock.style.display = 'none';
        questionsContent.style.display = 'block';
        // 解锁后渲染问题列表
        if (document.getElementById('question-list').children.length === 0) {
            renderQuestions();
        }
    } else {
        lockError.style.display = 'block';
    }
}

unlockBtn.addEventListener('click', unlockQuestions);
passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        unlockQuestions();
    }
});

// 随机抽取函数（仅抽签功能使用）
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// 抽签逻辑
const drawBtn = document.getElementById('draw-btn');
const refreshBtn = document.getElementById('refresh-btn');
const toggleListBtn = document.getElementById('toggle-list-btn');
const cards = document.querySelectorAll('.card');

function drawCards() {
    // 从三个池子各取一个
    const soloItem = getRandomItem(window.topicsData.solo);
    const multiItem = getRandomItem(window.topicsData.multi);
    const challengeItem = getRandomItem(window.topicsData.challenge);
    
    const results = {
        solo: soloItem,
        multi: multiItem,
        challenge: challengeItem
    };
    
    // 先翻回背面
    cards.forEach(card => card.classList.remove('flipped'));
    
    // 延迟填充内容并依次翻转
    setTimeout(() => {
        cards.forEach((card, index) => {
            const type = card.dataset.type;
            const data = results[type];
            
            card.querySelector('.card-title').textContent = data.title;
            card.querySelector('.card-desc').textContent = data.desc;
            
            setTimeout(() => {
                card.classList.add('flipped');
            }, index * 200);
        });
        
        // 抽取后显示两个按钮
        refreshBtn.style.display = 'block';
        toggleListBtn.style.display = 'block';
    }, 300);
}

drawBtn.addEventListener('click', drawCards);
refreshBtn.addEventListener('click', drawCards);

/* 并列按钮组 */
.btn-group {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 16px;
    flex-wrap: wrap;
}

.btn-group .secondary-btn {
    margin: 0;
    flex: 1;
    max-width: 170px;
    width: auto;
}

// 主题列表切换
const topicList = document.getElementById('topic-list');

toggleListBtn.addEventListener('click', () => {
    if (topicList.style.display === 'none') {
        // 首次点击渲染列表
        if (!isTopicListRendered) {
            renderTopicList();
            isTopicListRendered = true;
        }
        topicList.style.display = 'block';
        toggleListBtn.textContent = '收起灵感列表 ↑';
    } else {
        topicList.style.display = 'none';
        toggleListBtn.textContent = '点这里看全部灵感 📋';
    }
});

// 渲染主题列表
function renderTopicList() {
    const container = document.getElementById('topic-list');
    const categories = [
        { key: 'solo', name: '🧑 单人就能拍', data: window.topicsData.solo },
        { key: 'multi', name: '👥 需要小伙伴', data: window.topicsData.multi },
        { key: 'challenge', name: '🔥 挑战一下！', data: window.topicsData.challenge }
    ];
    
    categories.forEach(cate => {
        const item = document.createElement('div');
        item.className = 'topic-item';
        
        item.innerHTML = `
            <div class="topic-header">
                <h3>${cate.name}</h3>
            </div>
            <div class="topic-body">
                <ul>
                    ${cate.data.map(t => `
                        <li>
                            <div class="topic-title">${t.title}</div>
                            <div class="topic-desc">${t.desc}</div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        
        container.appendChild(item);
        
        // 折叠展开
        item.querySelector('.topic-header').addEventListener('click', () => {
            item.querySelector('.topic-body').classList.toggle('open');
        });
    });
}

// 渲染录制宝典列表
function renderTips() {
    const container = document.getElementById('tip-list');
    const data = window.tipsData;
    
    data.forEach((tip) => {
        const item = document.createElement('div');
        item.className = 'tip-item';
        
        item.innerHTML = `
            <div class="tip-header">
                <h3>${tip.title}</h3>
            </div>
            <div class="tip-body">
                <div class="tip-content">${tip.content}</div>
            </div>
        `;
        
        container.appendChild(item);
        
        // 折叠展开
        item.querySelector('.tip-header').addEventListener('click', () => {
            item.querySelector('.tip-body').classList.toggle('open');
        });
    });
}

// 渲染问题列表（纯浏览，无抽取功能）
function renderQuestions() {
    const container = document.getElementById('question-list');
    const data = window.questionsData;
    
    data.forEach((category) => {
        const item = document.createElement('div');
        item.className = 'question-item';
        
        item.innerHTML = `
            <div class="question-header">
                <h3>${category.name}</h3>
            </div>
            <div class="question-body">
                <ul>
                    ${category.questions.map(q => `<li>${q}</li>`).join('')}
                </ul>
            </div>
        `;
        
        container.appendChild(item);
        
        // 折叠展开
        item.querySelector('.question-header').addEventListener('click', () => {
            item.querySelector('.question-body').classList.toggle('open');
        });
    });
}
