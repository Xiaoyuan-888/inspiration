// ========== 配置区：可自行修改密码 ==========
const QUESTION_PASSWORD = "2026";
// ==========================================

let isQuestionsUnlocked = false;

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

// 随机抽取函数
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// 抽签逻辑
const drawBtn = document.getElementById('draw-btn');
const refreshBtn = document.getElementById('refresh-btn');
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
        
        refreshBtn.style.display = 'block';
    }, 300);
}

drawBtn.addEventListener('click', drawCards);
refreshBtn.addEventListener('click', drawCards);

// 渲染采访问题列表
function renderQuestions() {
    const container = document.getElementById('question-list');
    const data = window.questionsData;
    
    data.forEach((category, idx) => {
        const item = document.createElement('div');
        item.className = 'question-item';
        
        item.innerHTML = `
            <div class="question-header">
                <h3>${category.name}</h3>
                <button class="random-btn" data-idx="${idx}">随机抽一个</button>
            </div>
            <div class="question-body">
                <ul>
                    ${category.questions.map(q => `<li>${q}</li>`).join('')}
                </ul>
                <div class="random-result" id="random-${idx}" style="display: none;"></div>
            </div>
        `;
        
        container.appendChild(item);
        
        // 折叠展开
        item.querySelector('.question-header').addEventListener('click', (e) => {
            if (e.target.classList.contains('random-btn')) return;
            item.querySelector('.question-body').classList.toggle('open');
        });
        
        // 随机抽问题
        item.querySelector('.random-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const body = item.querySelector('.question-body');
            const resultBox = document.getElementById(`random-${idx}`);
            
            body.classList.add('open');
            const randomQ = getRandomItem(category.questions);
            resultBox.textContent = `🎯 随机问题：${randomQ}`;
            resultBox.style.display = 'block';
        });
    });
}
