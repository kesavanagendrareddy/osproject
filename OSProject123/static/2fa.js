// 2FA Page Modern JS

document.addEventListener('DOMContentLoaded', function() {
    // 1. Handle digit input focus and auto-advance
    const digits = Array.from(document.querySelectorAll('.twofa-digit'));
    const codeInput = document.getElementById('code');
    digits.forEach((input, idx) => {
        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value && idx < digits.length - 1) {
                digits[idx + 1].focus();
            }
            updateHiddenCode();
        });
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && idx > 0) {
                digits[idx - 1].focus();
            }
        });
    });
    function updateHiddenCode() {
        codeInput.value = digits.map(i => i.value || '').join('');
    }

    // 2. Timer bar logic (15 seconds)
    let timeLeft = 15;
    const timerLabel = document.getElementById('timer-label');
    const timerBar = document.getElementById('timer-bar-fill');
    const form = document.getElementById('twofa-form');
    const expiredMsg = document.getElementById('expired-message');
    function setBarWidth(percent) {
        // Animate bar width using CSS for smooth progress
        timerBar.style.transition = 'width 0.2s linear';
        timerBar.style.width = percent + '%';
        // For SVG rect: fallback for SVG attribute
        if (timerBar.tagName === 'rect') {
            timerBar.setAttribute('width', (percent) + '%');
        }
    }
    setBarWidth(100);
    let timerInterval = setInterval(() => {
        timeLeft--;
        timerLabel.textContent = timeLeft + 's';
        setBarWidth((timeLeft / 15) * 100);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerLabel.textContent = '0s';
            form.style.display = 'none';
            expiredMsg.style.display = 'block';
            digits.forEach(d => d.disabled = true);
        }
    }, 1000);

    // 3. On submit, join digits into code
    form.addEventListener('submit', function(e) {
        updateHiddenCode();
        if (codeInput.value.length !== 6) {
            e.preventDefault();
            digits.forEach(d => d.classList.add('shake'));
            setTimeout(() => digits.forEach(d => d.classList.remove('shake')), 350);
        }
    });

    // 4. Autofocus first digit
    if (digits[0]) digits[0].focus();
});
