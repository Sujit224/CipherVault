// State Management
let currentTab = 'all';
let masterPassword = null;
let passwords = [];
let editingId = null;

// DOM Elements
const lockScreen = document.getElementById('lock-screen');
const lockTitle = document.getElementById('lock-title');
const lockDescription = document.getElementById('lock-description');
const lockForm = document.getElementById('lock-form');
const masterPasswordInput = document.getElementById('master-password-input');
const toggleMasterVisibility = document.getElementById('toggle-master-visibility');
const lockSubmitBtn = document.getElementById('lock-submit-btn');

const appContainer = document.getElementById('app-container');
const sidebarNav = document.querySelector('.sidebar-nav');
const searchInput = document.getElementById('search-input');
const addPasswordBtn = document.getElementById('add-password-btn');
const emptyAddBtn = document.getElementById('empty-add-btn');
const lockVaultBtn = document.getElementById('lock-vault-btn');
const currentDivisionTitle = document.getElementById('current-division-title');
const currentDivisionSubtitle = document.getElementById('current-division-subtitle');
const passwordsGrid = document.getElementById('passwords-grid');
const emptyState = document.getElementById('empty-state');

// Modal Elements
const modalContainer = document.getElementById('modal-container');
const modalTitle = document.getElementById('modal-title');
const passwordForm = document.getElementById('password-form');
const entryId = document.getElementById('entry-id');
const entryTitle = document.getElementById('entry-title');
const entryDivision = document.getElementById('entry-division');
const entryUsername = document.getElementById('entry-username');
const entryUrl = document.getElementById('entry-url');
const entryPassword = document.getElementById('entry-password');
const entryNotes = document.getElementById('entry-notes');
const toggleEntryPasswordVisibility = document.getElementById('toggle-entry-password-visibility');
const generateSuggestedPassword = document.getElementById('generate-suggested-password');
const cancelModalBtn = document.getElementById('cancel-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');

// Generator Modal Elements
const generatorModal = document.getElementById('generator-modal');
const toolGeneratorBtn = document.getElementById('tool-generator');
const closeGeneratorBtn = document.getElementById('close-generator-btn');
const genPasswordDisplay = document.getElementById('gen-password-display');
const refreshGenPassword = document.getElementById('refresh-gen-password');
const copyGenPassword = document.getElementById('copy-gen-password');
const genLength = document.getElementById('gen-length');
const lengthVal = document.getElementById('length-val');
const genUppercase = document.getElementById('gen-uppercase');
const genLowercase = document.getElementById('gen-lowercase');
const genNumbers = document.getElementById('gen-numbers');
const genSymbols = document.getElementById('gen-symbols');
const useGenPasswordBtn = document.getElementById('use-gen-password-btn');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    checkMasterPasswordSetup();
    lucide.createIcons();
    setupEventListeners();
});

// Master Password & Auth Functions
function checkMasterPasswordSetup() {
    const storedHash = localStorage.getItem('vault_hash');
    if (!storedHash) {
        lockTitle.textContent = "Secure Vault Setup";
        lockDescription.textContent = "Create a Master Password to encrypt and secure your vault locally.";
        lockSubmitBtn.querySelector('span').textContent = "Set Master Password";
    } else {
        lockTitle.textContent = "Vault Locked";
        lockDescription.textContent = "Enter your Master Password to decrypt your credentials.";
        lockSubmitBtn.querySelector('span').textContent = "Unlock Vault";
    }
}

function handleLockSubmit(e) {
    e.preventDefault();
    const enteredPass = masterPasswordInput.value;
    if (!enteredPass) return;

    const storedHash = localStorage.getItem('vault_hash');
    
    if (!storedHash) {
        // Setup flow
        localStorage.setItem('vault_hash', hashString(enteredPass));
        masterPassword = enteredPass;
        showToast('Vault created and configured successfully!', 'success');
        
        // Add default sample passwords for a rich aesthetic on first load
        loadInitialMockData();
        unlockVault();
    } else {
        // Unlock flow
        if (hashString(enteredPass) === storedHash) {
            masterPassword = enteredPass;
            showToast('Access granted. Vault unlocked!', 'success');
            unlockVault();
        } else {
            showToast('Invalid Master Password!', 'danger');
            masterPasswordInput.classList.add('error');
            setTimeout(() => masterPasswordInput.classList.remove('error'), 500);
        }
    }
    masterPasswordInput.value = '';
}

function hashString(str) {
    // Simple mock hash for demonstration/frontend security
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; 
    }
    return hash.toString();
}

function unlockVault() {
    lockScreen.classList.remove('active');
    appContainer.classList.remove('hidden');
    loadPasswords();
    renderApp();
}

function lockVault() {
    masterPassword = null;
    appContainer.classList.add('hidden');
    lockScreen.classList.add('active');
    checkMasterPasswordSetup();
    showToast('Vault locked successfully', 'warning');
}

// Data Handling (localStorage)
function loadPasswords() {
    const rawData = localStorage.getItem('vault_passwords');
    if (rawData) {
        try {
            // In a real application, you would decrypt rawData here using masterPassword
            passwords = JSON.parse(rawData);
        } catch (e) {
            passwords = [];
        }
    } else {
        passwords = [];
    }
}

function savePasswords() {
    // In a real application, you would encrypt before saving to localStorage
    localStorage.setItem('vault_passwords', JSON.stringify(passwords));
    updateBadges();
}

function loadInitialMockData() {
    const mock = [
        {
            id: 'mock-1',
            title: 'Personal Gmail',
            division: 'Sai Sujit',
            username: 'saisujit@gmail.com',
            password: 'SujitSuperSecurePass2026!',
            url: 'https://gmail.com',
            notes: 'Main email account. Recovery email set to backup.'
        },
        {
            id: 'mock-2',
            title: 'Netflix Premium',
            division: 'General',
            username: 'familynetflix@outlook.com',
            password: 'N3tflix_F4m1ly_Pass',
            url: 'https://netflix.com',
            notes: 'Shared account with family.'
        },
        {
            id: 'mock-3',
            title: 'Office Cloud Access',
            division: 'Prasad',
            username: 'prasad.workspace@company.com',
            password: 'PrasadWorkCloud2026*',
            url: 'https://portal.office.com',
            notes: 'Require VPN connection before login.'
        },
        {
            id: 'mock-4',
            title: 'Online Banking',
            division: 'SreeLakshmi',
            username: 'sree.lakshmi99',
            password: 'SreeBankSecurePass!',
            url: 'https://icicibank.com',
            notes: 'Transfers require OTP on registered mobile number.'
        },
        {
            id: 'mock-5',
            title: 'E-learning Hub',
            division: 'Sunandamma',
            username: 'sunandamma.edu',
            password: 'SunandaLearn#2026',
            url: 'https://coursera.org',
            notes: 'Used for online literature classes.'
        }
    ];
    passwords = mock;
    savePasswords();
}

// Rendering UI
function renderApp() {
    // Update Subtitles
    const divisionSubtitles = {
        'all': 'Manage and access all credentials stored in your secure vault',
        'Sai Sujit': "Sai Sujit's personal credentials and logins",
        'Prasad': "Prasad's secure login credentials",
        'SreeLakshmi': "SreeLakshmi's personal credentials",
        'Sunandamma': "Sunandamma's secure credentials",
        'General': 'General credentials, subscriptions, and accounts'
    };

    currentDivisionTitle.textContent = currentTab === 'all' ? 'All Passwords' : currentTab;
    currentDivisionSubtitle.textContent = divisionSubtitles[currentTab] || 'Secure Credentials';

    // Clear Grid
    passwordsGrid.innerHTML = '';
    
    // Filter
    const searchQuery = searchInput.value.toLowerCase().trim();
    const filtered = passwords.filter(item => {
        const matchesTab = currentTab === 'all' || item.division === currentTab;
        const matchesSearch = !searchQuery || 
            item.title.toLowerCase().includes(searchQuery) ||
            item.username.toLowerCase().includes(searchQuery) ||
            (item.url && item.url.toLowerCase().includes(searchQuery));
        return matchesTab && matchesSearch;
    });

    if (filtered.length === 0) {
        passwordsGrid.classList.add('hidden');
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        passwordsGrid.classList.remove('hidden');

        filtered.forEach(item => {
            const card = createPasswordCard(item);
            passwordsGrid.appendChild(card);
        });
    }

    updateBadges();
    lucide.createIcons();
}

function createPasswordCard(item) {
    const card = document.createElement('div');
    card.className = 'password-card glass';
    card.id = `card-${item.id}`;

    // Map divisions to specific badge classes
    const divisionClass = `badge-${item.division.toLowerCase().replace(/\s+/g, '-')}`;

    card.innerHTML = `
        <div class="card-identity">
            <div class="card-logo">
                <i data-lucide="${getIconForTitle(item.title)}"></i>
            </div>
            <div class="card-identity-text">
                <h4 class="card-title">${escapeHTML(item.title)}</h4>
                <span class="card-division-badge ${divisionClass}">${escapeHTML(item.division)}</span>
            </div>
        </div>
        <div class="card-details-row">
            <div class="card-detail-item">
                <span class="detail-label">Username</span>
                <div class="detail-action-group">
                    <span class="detail-value" title="${item.username ? escapeHTML(item.username) : 'None'}">${item.username ? escapeHTML(item.username) : '—'}</span>
                    ${item.username ? `
                    <button class="icon-btn tiny-btn" onclick="copyText('${escapeHTML(item.username)}', 'Username')" title="Copy Username">
                        <i data-lucide="copy"></i>
                    </button>
                    ` : ''}
                </div>
            </div>
            <div class="card-detail-item">
                <span class="detail-label">Password</span>
                <div class="detail-action-group">
                    <span class="detail-value detail-password-value" id="pass-display-${item.id}">••••••••</span>
                    <button class="icon-btn tiny-btn" onclick="toggleCardPassword('${item.id}', '${escapeHTML(item.password)}')" title="Toggle Visibility">
                        <i data-lucide="eye" id="pass-eye-${item.id}"></i>
                    </button>
                    <button class="icon-btn tiny-btn" onclick="copyText('${escapeHTML(item.password)}', 'Password')" title="Copy Password">
                        <i data-lucide="copy"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="card-actions-right-row">
            <button class="icon-btn" onclick="openEditModal('${item.id}')" title="Edit">
                <i data-lucide="edit-3"></i>
            </button>
            <button class="icon-btn" style="color: var(--danger);" onclick="deleteEntry('${item.id}')" title="Delete">
                <i data-lucide="trash-2"></i>
            </button>
        </div>
    `;
    return card;
}

function getIconForTitle(title) {
    const lower = title.toLowerCase();
    if (lower.includes('google') || lower.includes('gmail')) return 'chrome';
    if (lower.includes('netflix')) return 'tv';
    if (lower.includes('bank') || lower.includes('card')) return 'credit-card';
    if (lower.includes('work') || lower.includes('office')) return 'briefcase';
    if (lower.includes('amazon') || lower.includes('shop')) return 'shopping-bag';
    if (lower.includes('social') || lower.includes('facebook') || lower.includes('twitter') || lower.includes('instagram')) return 'share-2';
    return 'key';
}

function toggleCardPassword(id, realPassword) {
    const display = document.getElementById(`pass-display-${id}`);
    const eyeIcon = document.getElementById(`pass-eye-${id}`);
    
    if (display.textContent === '••••••••') {
        display.textContent = realPassword;
        display.classList.remove('detail-password-value');
        eyeIcon.setAttribute('data-lucide', 'eye-off');
    } else {
        display.textContent = '••••••••';
        display.classList.add('detail-password-value');
        eyeIcon.setAttribute('data-lucide', 'eye');
    }
    lucide.createIcons();
}

// Helpers
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

function updateBadges() {
    const badgeAll = document.getElementById('badge-all');
    badgeAll.textContent = passwords.length;

    const divisions = ['Sai Sujit', 'Prasad', 'SreeLakshmi', 'Sunandamma', 'General'];
    divisions.forEach(div => {
        const count = passwords.filter(item => item.division === div).length;
        const elementId = `badge-${div.toLowerCase().replace(/\s+/g, '-')}`;
        const element = document.getElementById(elementId);
        if (element) element.textContent = count;
    });
}

function copyText(text, label) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`${label} copied to clipboard!`, 'success');
    }).catch(err => {
        showToast('Failed to copy text', 'danger');
    });
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'check-circle';
    if (type === 'danger') icon = 'alert-triangle';
    if (type === 'warning') icon = 'alert-circle';

    toast.innerHTML = `
        <i data-lucide="${icon}" style="width: 18px; height: 18px;"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Modal Form Actions
function openAddModal() {
    modalTitle.textContent = "Add New Password";
    editingId = null;
    passwordForm.reset();
    entryId.value = '';
    
    // Default to current division if on one of division tabs
    if (currentTab !== 'all') {
        entryDivision.value = currentTab;
    } else {
        entryDivision.value = 'General';
    }

    modalContainer.classList.remove('hidden');
}

window.openEditModal = function(id) {
    const item = passwords.find(p => p.id === id);
    if (!item) return;

    modalTitle.textContent = "Edit Credential";
    editingId = id;
    
    entryId.value = item.id;
    entryTitle.value = item.title;
    entryDivision.value = item.division;
    entryUsername.value = item.username;
    entryUrl.value = item.url || '';
    entryPassword.value = item.password;
    entryNotes.value = item.notes || '';

    modalContainer.classList.remove('hidden');
};

function closeFormModal() {
    modalContainer.classList.add('hidden');
    passwordForm.reset();
}

function handleFormSubmit(e) {
    e.preventDefault();

    const data = {
        id: editingId || 'id-' + Date.now() + Math.random().toString(36).substr(2, 9),
        title: entryTitle.value.trim(),
        division: entryDivision.value,
        username: entryUsername.value.trim(),
        url: entryUrl.value.trim(),
        password: entryPassword.value,
        notes: entryNotes.value.trim()
    };

    if (editingId) {
        const index = passwords.findIndex(p => p.id === editingId);
        if (index !== -1) {
            passwords[index] = data;
            showToast('Credential updated successfully', 'success');
        }
    } else {
        passwords.push(data);
        showToast('New credential added successfully', 'success');
    }

    savePasswords();
    closeFormModal();
    renderApp();
}

window.deleteEntry = function(id) {
    if (confirm('Are you sure you want to delete this credential?')) {
        passwords = passwords.filter(p => p.id !== id);
        savePasswords();
        renderApp();
        showToast('Credential deleted', 'warning');
    }
};

// Password Generator Tool functions
function generatePassword() {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=\\';

    let allowedChars = '';
    if (genUppercase.checked) allowedChars += uppercaseChars;
    if (genLowercase.checked) allowedChars += lowercaseChars;
    if (genNumbers.checked) allowedChars += numberChars;
    if (genSymbols.checked) allowedChars += symbolChars;

    if (!allowedChars) {
        genPasswordDisplay.textContent = 'Select at least one checkbox!';
        genPasswordDisplay.style.color = 'var(--danger)';
        return;
    }

    genPasswordDisplay.style.color = 'var(--text-primary)';
    
    let generated = '';
    const length = parseInt(genLength.value);
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allowedChars.length);
        generated += allowedChars[randomIndex];
    }

    genPasswordDisplay.textContent = generated;
    updateStrengthMeter(generated);
}

function updateStrengthMeter(pass) {
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    strengthBar.className = 'strength-bar';
    strengthText.className = 'strength-text';

    if (score <= 2) {
        strengthBar.classList.add('weak');
        strengthText.textContent = 'Weak';
        strengthText.classList.add('weak');
    } else if (score <= 4) {
        strengthBar.classList.add('medium');
        strengthText.textContent = 'Medium';
        strengthText.classList.add('medium');
    } else {
        strengthBar.classList.add('strong');
        strengthText.textContent = 'Strong';
        strengthText.classList.add('strong');
    }
}

// Event Listeners Registration
function setupEventListeners() {
    // Lock submit
    lockForm.addEventListener('submit', handleLockSubmit);
    toggleMasterVisibility.addEventListener('click', () => {
        const type = masterPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        masterPasswordInput.setAttribute('type', type);
        toggleMasterVisibility.querySelector('i').setAttribute('data-lucide', type === 'password' ? 'eye' : 'eye-off');
        lucide.createIcons();
    });

    // Navigation Tab Switching
    sidebarNav.addEventListener('click', (e) => {
        const item = e.target.closest('.nav-item');
        if (item) {
            document.querySelectorAll('.nav-list .nav-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            currentTab = item.getAttribute('data-tab');
            renderApp();
        }
    });

    // Search
    searchInput.addEventListener('input', renderApp);

    // Modal Triggers
    addPasswordBtn.addEventListener('click', openAddModal);
    emptyAddBtn.addEventListener('click', openAddModal);
    cancelModalBtn.addEventListener('click', closeFormModal);
    closeModalBtn.addEventListener('click', closeFormModal);
    passwordForm.addEventListener('submit', handleFormSubmit);

    lockVaultBtn.addEventListener('click', lockVault);

    // Visibility togglers inside Modal Form
    toggleEntryPasswordVisibility.addEventListener('click', () => {
        const type = entryPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        entryPassword.setAttribute('type', type);
        toggleEntryPasswordVisibility.querySelector('i').setAttribute('data-lucide', type === 'password' ? 'eye' : 'eye-off');
        lucide.createIcons();
    });

    generateSuggestedPassword.addEventListener('click', () => {
        openGeneratorModal();
    });

    // Password Generator modal actions
    toolGeneratorBtn.addEventListener('click', () => openGeneratorModal());
    closeGeneratorBtn.addEventListener('click', () => generatorModal.classList.add('hidden'));
    
    genLength.addEventListener('input', (e) => {
        lengthVal.textContent = e.target.value;
        generatePassword();
    });

    [genUppercase, genLowercase, genNumbers, genSymbols].forEach(cb => {
        cb.addEventListener('change', generatePassword);
    });

    refreshGenPassword.addEventListener('click', generatePassword);
    
    copyGenPassword.addEventListener('click', () => {
        const pass = genPasswordDisplay.textContent;
        if (pass && pass !== 'Select at least one checkbox!') {
            copyText(pass, 'Generated Password');
        }
    });

    useGenPasswordBtn.addEventListener('click', () => {
        const pass = genPasswordDisplay.textContent;
        if (pass && pass !== 'Select at least one checkbox!') {
            entryPassword.value = pass;
            generatorModal.classList.add('hidden');
            // If the modal was hidden, ensure we make it visible for standard flow
            if (modalContainer.classList.contains('hidden')) {
                openAddModal();
                entryPassword.value = pass;
            }
            showToast('Suggested password applied!', 'success');
        }
    });
}

function openGeneratorModal() {
    generatorModal.classList.remove('hidden');
    generatePassword();
}
