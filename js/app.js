let isWatching = false;
let timeLeft = 30;
const timerElement = document.getElementById('timer');
const watchButton = document.getElementById('watchButton');
const coinBalance = document.getElementById('coinBalance');
let currentBalance = parseInt(localStorage.getItem('balance') || '0');

// Başlangıç bakiyesini göster
coinBalance.textContent = currentBalance;

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function startAd() {
    if (isWatching) return;
    
    isWatching = true;
    timeLeft = 30;
    timerElement.style.display = 'block';
    watchButton.classList.add('disabled');
    watchButton.textContent = 'İzleniyor...';

    const countdown = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(countdown);
            completeAd();
        }
    }, 1000);
}

function completeAd() {
    currentBalance += 10;
    localStorage.setItem('balance', currentBalance.toString());
    coinBalance.textContent = currentBalance;
    showNotification('🎉 Tebrikler! 10 coin kazandınız!');
    
    // Reset UI
    isWatching = false;
    timerElement.style.display = 'none';
    watchButton.classList.remove('disabled');
    watchButton.textContent = 'REKLAM İZLE\n+10 COIN';
    updateWithdrawButton();
}

function withdrawCoins() {
    if (currentBalance < 1000) {
        showNotification('❌ En az 1000 coin gerekli!');
        return;
    }

    currentBalance = 0;
    localStorage.setItem('balance', '0');
    coinBalance.textContent = '0';
    showNotification('✅ Para çekme talebi alındı!');
    updateWithdrawButton();
}

function updateWithdrawButton() {
    const withdrawButton = document.getElementById('withdrawButton');
    if (currentBalance < 1000) {
        withdrawButton.classList.add('disabled');
    } else {
        withdrawButton.classList.remove('disabled');
    }
}

// Sayfa yüklendiğinde withdraw butonunu güncelle
updateWithdrawButton();

// Her coin değişiminde withdraw butonunu güncelle
setInterval(() => {
    updateWithdrawButton();
}, 1000);

function inviteFriend() {
    // Paylaşım URL'si
    const shareUrl = "https://t.me/share/url?url=" + encodeURIComponent(window.location.href) + "&text=" + encodeURIComponent("Gel beraber coin kazanalım! 🎮💰");
    
    // Yeni pencerede paylaşım sayfasını aç
    window.open(shareUrl, '_blank');
    
    // Coin ekle
    currentBalance += 10;
    localStorage.setItem('balance', currentBalance.toString());
    coinBalance.textContent = currentBalance;
    
    showNotification('🎉 Arkadaşını davet ettiğin için 10 coin kazandın!');
    updateWithdrawButton();
} 