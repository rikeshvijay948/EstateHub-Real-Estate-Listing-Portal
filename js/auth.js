/**
 * EstateHub - Authentication Module
 * Handles simulated login, registration, logout, session persistence, and route protection.
 * Optimized for GitHub Pages & Localhost deployments.
 */

const Auth = {
  /**
   * Checks if a user is currently logged in.
   * @returns {boolean}
   */
  isLoggedIn() {
    return StorageManager.getCurrentUser() !== null;
  },

  /**
   * Gets the currently logged-in user object.
   * @returns {Object|null}
   */
  getUser() {
    return StorageManager.getCurrentUser();
  },

  /**
   * Simulates user login with email and password.
   * @param {string} email
   * @param {string} password
   * @returns {{ success: boolean, message: string, user?: Object }}
   */
  login(email, password) {
    if (!email || !password) {
      return { success: false, message: "Please fill in all credentials." };
    }

    const user = StorageManager.getUserByEmail(email);
    if (!user) {
      return { success: false, message: "No account found with this email address." };
    }

    if (user.password !== password) {
      return { success: false, message: "Incorrect password. Please try again." };
    }

    StorageManager.setCurrentUser(user);
    return { success: true, message: `Welcome back, ${user.fullName}!`, user };
  },

  /**
   * Registers a new user account.
   * @param {Object} data { fullName, email, phone, password, role }
   * @returns {{ success: boolean, message: string, user?: Object }}
   */
  register(data) {
    const { fullName, email, phone, password, role } = data;

    if (!fullName || !email || !password) {
      return { success: false, message: "Please fill in all required fields." };
    }

    if (password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters long." };
    }

    const existingUser = StorageManager.getUserByEmail(email);
    if (existingUser) {
      return { success: false, message: "An account with this email already exists." };
    }

    const newUser = StorageManager.addUser({
      fullName,
      email,
      phone,
      password,
      role: role || "buyer"
    });

    // Auto-login after registration
    StorageManager.setCurrentUser(newUser);
    return { success: true, message: "Account created successfully! Logging you in...", user: newUser };
  },

  /**
   * One-click demo login helper for portfolio testing.
   * @param {'agent'|'buyer'} role
   */
  loginAsDemo(role = "agent") {
    const users = StorageManager.getUsers();
    const demoUser = users.find(u => u.role === role) || users[0];
    if (demoUser) {
      StorageManager.setCurrentUser(demoUser);
      return { success: true, message: `Logged in as Demo ${role.toUpperCase()} (${demoUser.fullName})`, user: demoUser };
    }
    return { success: false, message: "Demo user not found." };
  },

  /**
   * Logs out current user.
   */
  logout() {
    StorageManager.clearCurrentUser();
    window.location.href = "./login.html";
  },

  /**
   * Protects a page requiring authentication.
   * Redirects to login.html if not authenticated.
   */
  requireAuth(redirectBack = true) {
    if (!this.isLoggedIn()) {
      let filename = window.location.pathname.split("/").pop();
      if (!filename || filename.indexOf(".html") === -1) filename = "index.html";
      const returnUrl = encodeURIComponent(filename + window.location.search);
      const target = redirectBack ? `./login.html?redirect=${returnUrl}` : "./login.html";
      window.location.href = target;
      return false;
    }
    return true;
  }
};
