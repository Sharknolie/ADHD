document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const loginBtn = document.getElementById('btn-login');

    // Auto-focus username
    usernameInput.focus();

    // Check if user is already logged in (optional: auto-fill)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        usernameInput.value = savedUser;
    }

    loginBtn.addEventListener('click', handleLogin);

    // Allow pressing Enter to login
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });

    function handleLogin() {
        const username = usernameInput.value.trim();

        if (!username) {
            alert('请输入用户名');
            return;
        }

        // Save user to localStorage
        localStorage.setItem('currentUser', username);

        // Redirect to index or previous page
        window.location.href = 'welcome.html';
    }
});
