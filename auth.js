// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const toggleButtons = document.querySelectorAll('.toggle-btn');

// Form Toggle
toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const formType = button.dataset.form;
        
        // Toggle active class on buttons
        toggleButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Toggle forms
        if (formType === 'login') {
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        } else {
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    });
});

// Form Validation and Submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;
    
    try {
        // Here you would typically make an API call to your backend
        const response = await mockLoginAPI(email, password);
        if (response.success) {
            localStorage.setItem('user', JSON.stringify(response.user));
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = signupForm.querySelector('input[type="text"]').value;
    const email = signupForm.querySelector('input[type="email"]').value;
    const password = signupForm.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = signupForm.querySelectorAll('input[type="password"]')[1].value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    try {
        // Here you would typically make an API call to your backend
        const response = await mockSignupAPI(name, email, password);
        if (response.success) {
            showNotification('Account created successfully! Please log in.', 'success');
            toggleButtons[0].click(); // Switch to login form
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
});

// Social Login Handlers
document.querySelectorAll('.social-btn').forEach(button => {
    button.addEventListener('click', () => {
        const provider = button.classList[1]; // google, facebook, or github
        handleSocialLogin(provider);
    });
});

// Mock API Functions (Replace these with real API calls)
async function mockLoginAPI(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email === 'demo@example.com' && password === 'password') {
                resolve({
                    success: true,
                    user: {
                        name: 'Demo User',
                        email: email
                    }
                });
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 1000);
    });
}

async function mockSignupAPI(name, email, password) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: 'Account created successfully'
            });
        }, 1000);
    });
}

async function handleSocialLogin(provider) {
    showNotification(`${provider} login coming soon!`, 'info');
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Add styles dynamically
    const styles = document.createElement('style');
    styles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            animation: slideIn 0.3s ease-out forwards;
            z-index: 1000;
        }
        
        .notification.success { background-color: #10B981; }
        .notification.error { background-color: #EF4444; }
        .notification.info { background-color: #3B82F6; }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(styles);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
