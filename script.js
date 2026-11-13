// ================= CONFIGURATION =================
const FINAL_PASSWORD = "1612"; 

// Telegram Credentials
const TELEGRAM_BOT_TOKEN = "8758967760:AAH9NUtlmwWJdT8Sv_ysJd-bx345JLiHZxE"; 
const TELEGRAM_CHAT_ID = "8913385839";     

const HINTS = {
    1: "Hint 1: It's a special date or number.",
    2: "Hint 2: Think about the day we first met/started dating.",
    3: "Final Hint: Combined DD/MM format!"
};

let nextTargetScreen = '';

// ================= NAVIGATION LOGIC =================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
    }
}

function startGame() {
    showScreen('puzzle1');
}

// ================= LILY FLOWER POPUP LOGIC =================
function triggerFlowerReward(nextScreenId) {
    nextTargetScreen = nextScreenId;
    
    const modal = document.getElementById('flowerModal');
    modal.classList.remove('hidden');
    
    // Re-trigger blooming animation on SVG petals
    const svg = modal.querySelector('.lily-svg');
    if (svg) {
        const newSvg = svg.cloneNode(true);
        svg.parentNode.replaceChild(newSvg, svg);
    }
}

function closeFlowerModal() {
    document.getElementById('flowerModal').classList.add('hidden');
    if (nextTargetScreen) {
        showScreen(nextTargetScreen);
    }
}

// ================= PUZZLE 1 LOGIC =================
function answerPuzzle1(type) {
    const result = document.getElementById('puzzle1Result');
    if (type === 'correct') {
        result.textContent = '';
        triggerFlowerReward('puzzle2');
    } else {
        result.style.color = '#e74c3c';
        result.textContent = 'Hmm, that is not it! Try again 💕';
    }
}

// ================= PUZZLE 2 LOGIC =================
function answerPuzzle2(type) {
    const result = document.getElementById('puzzle2Result');
    if (type === 'correct') {
        result.textContent = '';
        triggerFlowerReward('puzzle3');
    } else {
        result.style.color = '#e74c3c';
        result.textContent = 'Nice try, but nope! Pick another 😜';
    }
}

// ================= PUZZLE 3 LOGIC (TELEGRAM SENDER) =================
function checkPuzzle3() {
    const val = document.getElementById('answer3').value.trim();
    const result = document.getElementById('puzzle3Result');
    
    if (val === '') {
        result.style.color = '#e74c3c';
        result.textContent = 'Type something in before submitting!';
        return;
    }

    // Message layout sent to Telegram
    const textMessage = `🌸 She answered Puzzle 3!\n\n"WHAT IS THE FAV THING YOU LOVE ABOUT ME?"\n👉 ${val}`;
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(textMessage)}`;

    // Send data to Telegram
    fetch(telegramUrl)
        .then(response => response.json())
        .then(data => {
            if (!data.ok) {
                alert("Telegram Error: " + data.description);
            }
        })
        .catch(err => {
            console.error("Telegram fetch error:", err);
        });

    result.textContent = '';
    triggerFlowerReward('found');
}

// ================= CARD LOGIC =================
function showCard() {
    showScreen('cardSection');
}

function openCard() {
    const card = document.getElementById('card');
    card.style.transform = 'rotateY(180deg)';
    
    setTimeout(() => {
        document.querySelector('.card-front').style.display = 'none';
        document.querySelector('.card-inside').style.display = 'block';
        card.style.transform = 'rotateY(0deg)';
    }, 300);
}

function showPassword() {
    showScreen('passwordSection');
}

// ================= PASSWORD LOGIC =================
function checkPassword() {
    const input = document.getElementById('passwordInput').value.trim().toLowerCase();
    const result = document.getElementById('passwordResult');
    
    if (input === FINAL_PASSWORD.toLowerCase()) {
        result.style.color = '#2ecc71';
        result.textContent = 'Unlocked!';
        setTimeout(() => {
            showScreen('blossomSection');
            createPetals();
        }, 800);
    } else {
        result.style.color = '#e74c3c';
        result.textContent = 'Incorrect password. Try a hint!';
    }
}

function showHint(num) {
    const hintText = document.getElementById('hintText');
    hintText.textContent = HINTS[num] || "No hint available.";
}

// ================= FLOWER PETALS ANIMATION =================
function createPetals() {
    const container = document.getElementById('flowers');
    if (!container) return;
    const petalCount = 20;
    
    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        const size = Math.random() * 10 + 10;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${Math.random() * 100}%`;
        petal.style.animationDuration = `${Math.random() * 3 + 4}s`;
        petal.style.animationDelay = `${Math.random() * 2}s`;
        
        container.appendChild(petal);
    }
}