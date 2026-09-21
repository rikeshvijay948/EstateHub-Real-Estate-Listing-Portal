/**
 * EstateHub - Core Application & Global UI Components
 * Provides shared utilities, dynamic navbar/footer behavior, toast notifications, modals, and property card generation.
 * Optimized for GitHub Pages & Localhost deployments.
 */

const App = {
  /**
   * Global initialization
   */
  init() {
    this.setupNavbar();
    this.updateNavBadges();
    this.setupToasts();
    this.setupModals();
    this.setupMobileMenu();

    // Listen to favorites update to update header badge dynamically
    window.addEventListener("favoritesUpdated", () => {
      this.updateNavBadges();
    });

    // Listen to auth changes
    window.addEventListener("authStateChanged", () => {
      this.setupNavbar();
    });
  },

  /**
   * Formats Indian Rupee (INR) prices elegantly.
   * e.g. ₹1.85 Cr, ₹88 Lac, ₹45,000 / mo
   * @param {number} amount
   * @param {string} listingType - 'sale' or 'rent'
   * @returns {string}
   */
  formatPrice(amount, listingType = "sale") {
    if (isNaN(amount) || amount === null || amount === undefined) return "Price on Request";
    const num = Number(amount);

    if (listingType === "rent") {
      return `₹${num.toLocaleString("en-IN")} <span class="price-unit">/ month</span>`;
    }

    if (num >= 10000000) {
      const cr = (num / 10000000).toFixed(2).replace(/\.00$/, "");
      return `₹${cr} Cr`;
    } else if (num >= 100000) {
      const lac = (num / 100000).toFixed(2).replace(/\.00$/, "");
      return `₹${lac} Lakhs`;
    } else {
      return `₹${num.toLocaleString("en-IN")}`;
    }
  },

  /**
   * Returns a fallback SVG placeholder image data URI when an image fails to load.
   */
  getFallbackImage() {
    return "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22600%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20600%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%231e293b%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%230f172a%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23g)%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20fill%3D%22%2394a3b8%22%20font-family%3D%22system-ui%22%20font-size%3D%2224%22%20font-weight%3D%22600%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EEstateHub%20Property%20Photo%3C%2Ftext%3E%3C%2Fsvg%3E";
  },

  /**
   * Generates a reusable Property Card HTML string with GitHub Pages compatible relative links.
   * @param {Object} prop
   * @param {Object} options
   * @returns {string} HTML string
   */
  createPropertyCard(prop, options = {}) {
    if (!prop) return "";

    const isFav = StorageManager.isFavorite(prop.id);
    const firstImage = (prop.images && prop.images.length > 0) ? prop.images[0] : this.getFallbackImage();
    const formattedPrice = this.formatPrice(prop.price, prop.listingType);
    const listingLabel = prop.listingType === "rent" ? "For Rent" : "For Sale";
    const listingBadgeClass = prop.listingType === "rent" ? "badge-rent" : "badge-sale";

    return `
      <article class="property-card" data-id="${prop.id}">
        <div class="card-image-wrap">
          <img 
            src="${firstImage}" 
            alt="${prop.title}" 
            class="card-img" 
            loading="lazy"
            onerror="this.onerror=null; this.src='${this.getFallbackImage()}';"
          />
          <div class="card-badges">
            <span class="badge ${listingBadgeClass}">${listingLabel}</span>
            ${prop.featured ? '<span class="badge badge-featured"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> Featured</span>' : ""}
          </div>
          
          <button 
            type="button" 
            class="fav-btn ${isFav ? 'active' : ''}" 
            data-id="${prop.id}" 
            title="${isFav ? 'Remove from favorites' : 'Save to favorites'}"
            onclick="App.handleFavoriteClick(event, '${prop.id}')"
            aria-label="Favorite property"
          >
            <svg class="heart-icon" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          
          <span class="property-type-tag">${prop.propertyType || "Residential"}</span>
        </div>

        <div class="card-body">
          <div class="card-price-row">
            <div class="card-price">${formattedPrice}</div>
          </div>
          
          <h3 class="card-title">
            <a href="./property-details.html?id=${prop.id}" title="${prop.title}">${prop.title}</a>
          </h3>

          <div class="card-location">
            <svg class="icon-location" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${prop.address || prop.city}, ${prop.city}</span>
          </div>

          <div class="card-specs">
            ${prop.bedrooms > 0 ? `
              <div class="spec-item" title="${prop.bedrooms} Bedrooms">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"></path>
                  <path d="M3 11h18"></path>
                  <path d="M7 11V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"></path>
                </svg>
                <span>${prop.bedrooms} Beds</span>
              </div>
            ` : ""}

            ${prop.bathrooms > 0 ? `
              <div class="spec-item" title="${prop.bathrooms} Bathrooms">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z"></path>
                  <path d="M6 12V5a2 2 0 0 1 2-2h3v9"></path>
                </svg>
                <span>${prop.bathrooms} Baths</span>
              </div>
            ` : ""}

            <div class="spec-item" title="${prop.area} Square Feet">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="3" y1="15" x2="21" y2="15"></line>
              </svg>
              <span>${prop.area} sq.ft</span>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <a href="./property-details.html?id=${prop.id}" class="btn btn-outline btn-sm btn-block">
            View Details
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </a>
          ${options.showRemoveFavorite ? `
            <button class="btn btn-danger-outline btn-sm btn-icon-only" onclick="App.removeFavoriteCard(event, '${prop.id}')" title="Remove from wishlist">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          ` : ""}
        </div>
      </article>
    `;
  },

  /**
   * Handles favorite click on property cards.
   */
  handleFavoriteClick(event, id) {
    event.preventDefault();
    event.stopPropagation();
    const btn = event.currentTarget;
    const isNowFav = StorageManager.toggleFavorite(id);

    if (isNowFav) {
      btn.classList.add("active");
      btn.setAttribute("title", "Remove from favorites");
      btn.querySelector(".heart-icon").setAttribute("fill", "currentColor");
      this.showToast("Property added to your Favorites! ❤️", "success");
    } else {
      btn.classList.remove("active");
      btn.setAttribute("title", "Save to favorites");
      btn.querySelector(".heart-icon").setAttribute("fill", "none");
      this.showToast("Property removed from Favorites.", "info");
    }
  },

  /**
   * Remove favorite helper from Favorites page.
   */
  removeFavoriteCard(event, id) {
    event.preventDefault();
    event.stopPropagation();
    StorageManager.removeFavorite(id);
    this.showToast("Property removed from wishlist.", "info");
    const card = document.querySelector(`.property-card[data-id="${id}"]`);
    if (card) {
      card.style.opacity = "0";
      card.style.transform = "scale(0.95)";
      setTimeout(() => {
        card.remove();
        if (typeof renderFavoritesGrid === "function") {
          renderFavoritesGrid();
        }
      }, 250);
    }
  },

  /**
   * Updates Favorites badge count in the navigation header.
   */
  updateNavBadges() {
    const favs = StorageManager.getFavorites();
    const badges = document.querySelectorAll(".nav-fav-badge");
    badges.forEach(badge => {
      badge.textContent = favs.length;
      badge.style.display = favs.length > 0 ? "inline-flex" : "none";
    });
  },

  /**
   * Sets up Navbar dynamic state (logged in user vs guest, active menu links).
   * Compatible with GitHub Pages repository subpaths.
   */
  setupNavbar() {
    const user = Auth.getUser();
    const authContainers = document.querySelectorAll(".nav-auth-container");

    authContainers.forEach(container => {
      if (user) {
        container.innerHTML = `
          <div class="user-profile-menu">
            <a href="./dashboard.html" class="user-pill" title="Go to Dashboard">
              <img src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}" alt="${user.fullName}" class="user-avatar-sm" />
              <span class="user-name-label">${user.fullName.split(" ")[0]}</span>
              <span class="user-role-badge">${user.role === 'agent' ? 'Agent' : 'Buyer'}</span>
            </a>
            <button class="btn btn-ghost btn-sm btn-logout" onclick="Auth.logout()" title="Logout">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="nav-guest-actions">
            <a href="./login.html" class="btn btn-ghost btn-sm">Log In</a>
            <a href="./register.html" class="btn btn-primary btn-sm">Register</a>
          </div>
        `;
      }
    });

    // Detect active page filename safely for localhost and GitHub Pages subpaths
    let currentPath = window.location.pathname.split("/").pop() || "index.html";
    if (!currentPath || currentPath.indexOf(".html") === -1) {
      currentPath = "index.html";
    }

    const navLinks = document.querySelectorAll(".nav-links a, .mobile-nav-links a");
    navLinks.forEach(link => {
      const rawHref = link.getAttribute("href") || "";
      const cleanHref = rawHref.replace(/^\.\//, "").split("?")[0];
      
      if (cleanHref === currentPath) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  },

  /**
   * Sets up Mobile Menu drawer toggle.
   */
  setupMobileMenu() {
    const hamburger = document.querySelector(".hamburger-btn");
    const mobileDrawer = document.querySelector(".mobile-drawer");
    const overlay = document.querySelector(".drawer-overlay");

    if (hamburger && mobileDrawer) {
      const toggleDrawer = () => {
        const isOpen = mobileDrawer.classList.toggle("open");
        hamburger.classList.toggle("active", isOpen);
        if (overlay) overlay.classList.toggle("active", isOpen);
        document.body.classList.toggle("no-scroll", isOpen);
      };

      hamburger.addEventListener("click", toggleDrawer);
      if (overlay) overlay.addEventListener("click", toggleDrawer);

      // Close on any mobile link click
      mobileDrawer.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", () => {
          mobileDrawer.classList.remove("open");
          hamburger.classList.remove("active");
          if (overlay) overlay.classList.remove("active");
          document.body.classList.remove("no-scroll");
        });
      });
    }
  },

  /**
   * Toast notification container setup.
   */
  setupToasts() {
    if (!document.getElementById("toast-container")) {
      const container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }
  },

  /**
   * Displays an animated toast notification.
   * @param {string} message
   * @param {'success'|'error'|'info'|'warning'} type
   * @param {number} duration
   */
  showToast(message, type = "info", duration = 3500) {
    this.setupToasts();
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let iconSvg = "";
    if (type === "success") {
      iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
    } else if (type === "error") {
      iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else if (type === "warning") {
      iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
    } else {
      iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-msg">${message}</div>
      <button class="toast-close" onclick="this.parentElement.remove()" aria-label="Close notification">&times;</button>
    `;

    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
      toast.classList.add("toast-fade-out");
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  /**
   * Modal handling logic
   */
  setupModals() {
    document.querySelectorAll("[data-close-modal]").forEach(btn => {
      btn.addEventListener("click", () => {
        const modal = btn.closest(".modal");
        if (modal) this.closeModal(modal.id);
      });
    });

    // Close on backdrop click
    document.querySelectorAll(".modal").forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const activeModal = document.querySelector(".modal.active");
        if (activeModal) this.closeModal(activeModal.id);
      }
    });
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
      document.body.classList.add("no-scroll");
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("active");
      document.body.classList.remove("no-scroll");
    }
  }
};

// Initialize shared app scripts when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
