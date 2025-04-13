document.addEventListener('DOMContentLoaded', function() {
    // Get the current page path
    const currentPath = window.location.pathname;
    console.log('Current path:', currentPath);

    // Handle login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found, adding event listener');
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const username = document.getElementById('username');
            const password = document.getElementById('password');

            if (!username || !password) {
                window.utils.showError('Form fields not found');
                return;
            }

            try {
                if (username.value && password.value) {
                    window.utils.hideError();
                    const response = await login(username.value, password.value);
                    if (response.requiresTwoFactor) {
                        window.location.href = './pages/two-factor.html';
                    } else {
                        window.location.href = './pages/dashboard.html';
                    }
                } else {
                    window.utils.showError('Please enter both username and password');
                }
            } catch (error) {
                window.utils.showError(error.message);
            }
        });

        // Add input event listeners to login form inputs
        const inputs = loginForm.getElementsByTagName('input');
        Array.from(inputs).forEach(input => {
            input.addEventListener('input', function() {
                window.utils.hideError();
            });
        });
    }

    // Handle two-factor form
    const twoFactorForm = document.getElementById('twoFactorForm');
    if (twoFactorForm) {
        console.log('Two-factor form found, adding event listener');
        twoFactorForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const code = document.getElementById('twoFactorCode');
            
            if (!code) {
                window.utils.showError('Verification code field not found');
                return;
            }

            try {
                const response = await verifyTwoFactor(code.value);
                if (response.verified) {
                    window.location.href = 'dashboard.html';
                } else {
                    window.utils.showError('Invalid verification code');
                }
            } catch (error) {
                window.utils.showError(error.message);
            }
        });
    }

    // Handle file operations on dashboard
    const fileList = document.getElementById('fileList');
    if (fileList) {
        console.log('File list found, initializing file operations');
        // Create a new instance of FileOperations
        const fileOps = new FileOperations();
        window.fileOps = fileOps;

        // Add click event listeners for file operations
        fileList.addEventListener('click', async (event) => {
            const target = event.target.closest('button');
            if (!target) return;

            const fileCard = target.closest('.file-card');
            if (!fileCard) return;

            const fileId = parseInt(fileCard.dataset.fileId);
            
            try {
                // Handle download button click
                if (target.classList.contains('download-btn')) {
                    event.preventDefault();
                    await fileOps.downloadFile(fileId);
                }
                
                // Handle share button click
                else if (target.classList.contains('share-btn')) {
                    event.preventDefault();
                    window.location.href = `share.html?fileId=${fileId}`;
                }
                
                // Handle delete button click
                else if (target.classList.contains('delete-btn')) {
                    event.preventDefault();
                    if (confirm('Are you sure you want to delete this file?')) {
                        await fileOps.deleteFile(fileId);
                        fileOps.updateFileList(); // Refresh the file list
                    }
                }
            } catch (error) {
                console.error('Operation error:', error);
                window.utils.showError(error.message);
            }
        });

        // Initialize file list
        fileOps.updateFileList();
    }

    console.log('DOM Content Loaded, forms initialized');
});
