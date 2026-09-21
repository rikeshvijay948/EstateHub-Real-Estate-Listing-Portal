/**
 * EstateHub - Storage Manager
 * Handles all CRUD operations and data synchronization using JavaScript localStorage.
 */

const STORAGE_KEYS = {
  PROPERTIES: "estatehub_properties",
  USERS: "estatehub_users",
  CURRENT_USER: "estatehub_current_user",
  FAVORITES: "estatehub_favorites",
  INQUIRIES: "estatehub_inquiries"
};

const StorageManager = {
  /**
   * Initializes local storage with sample data if not already present.
   */
  init() {
    try {
      if (!localStorage.getItem(STORAGE_KEYS.PROPERTIES)) {
        localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(INITIAL_PROPERTIES));
      }
      if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(INITIAL_FAVORITES));
      }
      if (!localStorage.getItem(STORAGE_KEYS.INQUIRIES)) {
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
      }
    } catch (e) {
      console.error("Error initializing EstateHub Storage:", e);
    }
  },

  /* ==========================================================
     PROPERTIES CRUD
     ========================================================== */

  /**
   * Retrieves all properties from localStorage.
   * @returns {Array} Array of property objects
   */
  getProperties() {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading properties from storage:", e);
      return INITIAL_PROPERTIES || [];
    }
  },

  /**
   * Retrieves a single property by its unique ID.
   * @param {string} id
   * @returns {Object|null}
   */
  getPropertyById(id) {
    if (!id) return null;
    const properties = this.getProperties();
    return properties.find(p => String(p.id) === String(id)) || null;
  },

  /**
   * Saves a new property.
   * @param {Object} propertyData
   * @returns {Object} Created property
   */
  addProperty(propertyData) {
    const properties = this.getProperties();
    const newProperty = {
      ...propertyData,
      id: "prop-" + Date.now(),
      createdAt: new Date().toISOString()
    };
    properties.unshift(newProperty);
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
    return newProperty;
  },

  /**
   * Updates an existing property.
   * @param {string} id
   * @param {Object} updatedData
   * @returns {Object|null}
   */
  updateProperty(id, updatedData) {
    const properties = this.getProperties();
    const index = properties.findIndex(p => String(p.id) === String(id));
    if (index === -1) return null;

    properties[index] = {
      ...properties[index],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
    return properties[index];
  },

  /**
   * Deletes a property by ID.
   * @param {string} id
   * @returns {boolean}
   */
  deleteProperty(id) {
    const properties = this.getProperties();
    const filtered = properties.filter(p => String(p.id) !== String(id));
    if (filtered.length === properties.length) return false;

    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(filtered));
    // Also remove from favorites if present
    this.removeFavorite(id);
    return true;
  },

  /* ==========================================================
     FAVORITES MANAGEMENT
     ========================================================== */

  /**
   * Returns list of favorite property IDs.
   * @returns {Array<string>}
   */
  getFavorites() {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading favorites:", e);
      return [];
    }
  },

  /**
   * Checks if a property ID is in favorites.
   * @param {string} id
   * @returns {boolean}
   */
  isFavorite(id) {
    const favs = this.getFavorites();
    return favs.includes(String(id));
  },

  /**
   * Toggles favorite state of a property.
   * @param {string} id
   * @returns {boolean} true if now favorited, false if removed
   */
  toggleFavorite(id) {
    const favs = this.getFavorites();
    const strId = String(id);
    const index = favs.indexOf(strId);
    let isFav = false;

    if (index > -1) {
      favs.splice(index, 1);
      isFav = false;
    } else {
      favs.push(strId);
      isFav = true;
    }

    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    // Dispatch custom event for cross-component reactive updates
    window.dispatchEvent(new CustomEvent("favoritesUpdated", { detail: { id: strId, isFavorite: isFav } }));
    return isFav;
  },

  /**
   * Removes a property from favorites.
   * @param {string} id
   */
  removeFavorite(id) {
    const favs = this.getFavorites();
    const filtered = favs.filter(favId => String(favId) !== String(id));
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent("favoritesUpdated", { detail: { id, isFavorite: false } }));
  },

  /**
   * Returns full property objects of all favorited items.
   * @returns {Array<Object>}
   */
  getFavoriteProperties() {
    const favIds = this.getFavorites();
    const properties = this.getProperties();
    return properties.filter(p => favIds.includes(String(p.id)));
  },

  /* ==========================================================
     USERS & AUTHENTICATION
     ========================================================== */

  /**
   * Returns all registered users.
   * @returns {Array}
   */
  getUsers() {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Finds a user by email.
   * @param {string} email
   * @returns {Object|null}
   */
  getUserByEmail(email) {
    if (!email) return null;
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
  },

  /**
   * Adds a new user.
   * @param {Object} userData
   * @returns {Object}
   */
  addUser(userData) {
    const users = this.getUsers();
    const newUser = {
      id: "user-" + Date.now(),
      fullName: userData.fullName,
      email: userData.email.trim().toLowerCase(),
      phone: userData.phone || "",
      password: userData.password,
      role: userData.role || "buyer",
      avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=2563eb&color=fff`,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
  },

  /**
   * Returns the currently logged in user or null.
   * @returns {Object|null}
   */
  getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Sets current active user session.
   * @param {Object} user
   */
  setCurrentUser(user) {
    if (user) {
      const safeUser = { ...user };
      delete safeUser.password; // Do not keep raw password in session object
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    window.dispatchEvent(new CustomEvent("authStateChanged", { detail: { user } }));
  },

  /**
   * Clears logged in session.
   */
  clearCurrentUser() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    window.dispatchEvent(new CustomEvent("authStateChanged", { detail: { user: null } }));
  },

  /* ==========================================================
     INQUIRIES / LEADS MANAGEMENT
     ========================================================== */

  /**
   * Returns all property inquiries.
   * @returns {Array}
   */
  getInquiries() {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Adds an inquiry to storage.
   * @param {Object} inquiry
   * @returns {Object}
   */
  addInquiry(inquiry) {
    const inquiries = this.getInquiries();
    const newInquiry = {
      id: "inq-" + Date.now(),
      propertyId: inquiry.propertyId || "",
      propertyTitle: inquiry.propertyTitle || "General Inquiry",
      propertyPrice: inquiry.propertyPrice || 0,
      propertyImage: inquiry.propertyImage || "",
      senderName: inquiry.senderName,
      senderEmail: inquiry.senderEmail,
      senderPhone: inquiry.senderPhone || "",
      message: inquiry.message,
      status: "new",
      createdAt: new Date().toISOString()
    };
    inquiries.unshift(newInquiry);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    return newInquiry;
  },

  /**
   * Deletes an inquiry by ID.
   * @param {string} id
   * @returns {boolean}
   */
  deleteInquiry(id) {
    const inquiries = this.getInquiries();
    const filtered = inquiries.filter(i => String(i.id) !== String(id));
    if (filtered.length === inquiries.length) return false;
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(filtered));
    return true;
  },

  /**
   * Marks inquiry status (e.g., 'new', 'contacted', 'resolved').
   */
  updateInquiryStatus(id, status) {
    const inquiries = this.getInquiries();
    const index = inquiries.findIndex(i => String(i.id) === String(id));
    if (index === -1) return false;
    inquiries[index].status = status;
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    return true;
  },

  /* ==========================================================
     DATA RESET & REFRESH
     ========================================================== */

  /**
   * Resets local storage to default initial dataset.
   */
  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(INITIAL_PROPERTIES));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(INITIAL_FAVORITES));
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
    window.location.reload();
  }
};

// Auto-run storage initialization when script loads
StorageManager.init();
