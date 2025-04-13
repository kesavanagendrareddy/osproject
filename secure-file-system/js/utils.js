// Utility functions
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.classList.remove('text-green-500');
        errorElement.classList.add('text-red-500');
    } else {
        console.error(message);
    }
}

function showSuccess(message) {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.classList.remove('text-red-500');
        errorElement.classList.add('text-green-500');
    } else {
        console.log(message);
    }
}

function hideError() {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Export utilities
window.utils = {
    showError,
    showSuccess,
    hideError
};
