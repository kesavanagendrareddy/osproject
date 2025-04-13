class FileOperations {
    constructor() {
        // Initialize files array first
        this.files = [];
        this.loadFiles();  // Load files immediately

        // Initialize event listeners
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeEventListeners();
            this.updateFileList();
        });
    }

    loadFiles() {
        const storedFiles = localStorage.getItem('files');
        if (storedFiles) {
            this.files = JSON.parse(storedFiles);
        }
    }

    saveFiles() {
        localStorage.setItem('files', JSON.stringify(this.files));
    }

    initializeEventListeners() {
        const fileList = document.getElementById('fileList');
        if (!fileList) return;

        fileList.addEventListener('click', async (event) => {
            const target = event.target.closest('button');
            if (!target) return;

            const fileCard = target.closest('.file-card');
            if (!fileCard) return;

            const fileId = parseInt(fileCard.dataset.fileId);
            const file = this.files.find(f => f.id === fileId);
            if (!file) return;

            try {
                if (target.classList.contains('view-btn')) {
                    const contentDiv = fileCard.querySelector('.file-content');
                    if (contentDiv) {
                        contentDiv.classList.toggle('hidden');
                    }
                } else if (target.classList.contains('download-btn')) {
                    this.downloadFile(file);
                } else if (target.classList.contains('delete-btn')) {
                    if (confirm('Are you sure you want to delete this file?')) {
                        this.deleteFile(fileId);
                    }
                }
            } catch (error) {
                this.showError(error.message);
            }
        });

        // Handle file upload form
        const uploadForm = document.getElementById('uploadForm');
        if (uploadForm) {
            uploadForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                try {
                    await this.handleFileUpload();
                } catch (error) {
                    console.error('Upload failed:', error);
                }
            });
        }
    }

    async handleFileUpload() {
        try {
            const fileInput = document.getElementById('fileInput');
            const fileNameInput = document.getElementById('fileName');
            const fileContentInput = document.getElementById('fileContent');
            
            let newFile;
            
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const content = await this.readFileContent(file);
                newFile = {
                    id: Date.now(),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: new Date().toLocaleDateString(),
                    content: content
                };
            } else if (fileNameInput.value && fileContentInput.value) {
                newFile = {
                    id: Date.now(),
                    name: fileNameInput.value,
                    size: fileContentInput.value.length,
                    type: 'text/plain',
                    lastModified: new Date().toLocaleDateString(),
                    content: fileContentInput.value
                };
            } else {
                throw new Error('Please either select a file or enter file content');
            }

            this.files.push(newFile);
            this.saveFiles();
            this.showSuccess('File uploaded successfully');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (error) {
            this.showError(error.message);
            throw error;
        }
    }

    downloadFile(file) {
        const blob = new Blob([file.content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    deleteFile(fileId) {
        this.files = this.files.filter(f => f.id !== fileId);
        this.saveFiles();
        this.updateFileList();
        this.showSuccess('File deleted successfully');
    }

    readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Error reading file'));
            reader.readAsText(file);
        });
    }

    showSuccess(message) {
        const container = document.getElementById('messageContainer');
        if (!container) return;
        container.innerHTML = `
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                <span class="block sm:inline">${message}</span>
            </div>
        `;
        setTimeout(() => container.innerHTML = '', 3000);
    }

    showError(message) {
        const container = document.getElementById('messageContainer');
        if (!container) return;
        container.innerHTML = `
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <span class="block sm:inline">${message}</span>
            </div>
        `;
        setTimeout(() => container.innerHTML = '', 3000);
    }

    updateFileList() {
        const fileList = document.getElementById('fileList');
        if (!fileList) return;

        if (this.files.length === 0) {
            fileList.innerHTML = `
                <div class="col-span-full bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                    <i class="fas fa-folder-open text-4xl mb-2"></i>
                    <p>No files uploaded yet</p>
                </div>
            `;
            return;
        }

        fileList.innerHTML = this.files.map(file => `
            <div class="file-card bg-white overflow-hidden shadow rounded-lg" data-file-id="${file.id}">
                <div class="px-4 py-5 sm:p-6">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <i class="fas fa-file-alt text-4xl text-blue-500 mr-3"></i>
                            <div>
                                <h3 class="text-lg font-medium text-gray-900">${file.name}</h3>
                                <p class="text-sm text-gray-500">Last modified: ${file.lastModified}</p>
                            </div>
                        </div>
                        <div class="flex space-x-2">
                            <button class="view-btn bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded" title="View">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="download-btn bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded" title="Download">
                                <i class="fas fa-download"></i>
                            </button>
                            <button class="delete-btn bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="file-content mt-4 hidden">
                        <textarea class="w-full h-32 p-2 border rounded-md bg-gray-50" readonly>${file.content}</textarea>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Initialize file operations
window.fileOps = new FileOperations();
