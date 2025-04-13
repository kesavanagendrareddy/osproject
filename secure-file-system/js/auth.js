// Authentication logic
async function login(username, password) {
    try {
        // Mock authentication for testing
        if (username === "testuser@example.com" && password === "TestPassword123!") {
            localStorage.setItem('token', 'mock-jwt-token');
            return { requiresTwoFactor: true };
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        throw new Error('Login failed: ' + error.message);
    }
}

async function verifyTwoFactor(code) {
    try {
        // Mock 2FA verification
        if (code === '123456') {
            return { verified: true };
        }
        return { verified: false };
    } catch (error) {
        throw new Error('2FA verification failed: ' + error.message);
    }
}

async function updateSettings(newPassword, twoFactorSetting) {
    try {
        // Mock settings update
        console.log('Settings updated:', { newPassword, twoFactorSetting });
        return { success: true, message: 'Settings updated successfully' };
    } catch (error) {
        throw new Error('Settings update failed: ' + error.message);
    }
}

// Add event listener for settings form submission if on settings page
document.addEventListener('DOMContentLoaded', function() {
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            try {
                const newPassword = document.getElementById('newPassword').value;
                const twoFactorSetting = document.getElementById('twoFactorSetting').checked;
                const result = await updateSettings(newPassword, twoFactorSetting);
                window.utils.showSuccess(result.message);
            } catch (error) {
                window.utils.showError(error.message);
            }
        });
    }
});
