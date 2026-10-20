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
    this.setupTheme();
    this.setupNavbar();
    this.updateNavBadges();
    this.setupToasts();
    this.setupModals();
    this.setupMobileMenu();
    this.setupCompareDock();

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
   * Initializes theme (light / dark) and mounts the toggle button.
   */
  setupTheme() {
    const savedTheme = localStorage.getItem("estatehub_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const navActions = document.querySelector(".nav-actions");
    if (navActions && !document.getElementById("themeToggleBtn")) {
      const toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
      toggleBtn.id = "themeToggleBtn";
      toggleBtn.className = "theme-toggle-btn";
      toggleBtn.setAttribute("aria-label", "Toggle dark or light mode");
      toggleBtn.setAttribute("title", savedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode");
      toggleBtn.innerHTML = this.getThemeIcon(savedTheme);

      toggleBtn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") || "light";
        const nextTheme = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", nextTheme);
        localStorage.setItem("estatehub_theme", nextTheme);
        toggleBtn.innerHTML = this.getThemeIcon(nextTheme);
        toggleBtn.setAttribute("title", nextTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode");
        this.showToast(nextTheme === "dark" ? "Dark Mode enabled 🌙" : "Light Mode enabled ☀️", "info", 2000);
      });

      // Insert before mobile hamburger button or at end
      const hamburger = navActions.querySelector(".hamburger-btn");
      if (hamburger) {
        navActions.insertBefore(toggleBtn, hamburger);
      } else {
        navActions.appendChild(toggleBtn);
      }
    }
  },

  /**
   * Returns SVG icon for theme toggle button.
   */
  getThemeIcon(theme) {
    if (theme === "dark") {
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>`;
    }
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>`;
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
    const isCompared = StorageManager.isCompared(prop.id);
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
            class="compare-card-btn ${isCompared ? 'active' : ''}" 
            data-id="${prop.id}" 
            title="${isCompared ? 'Remove from comparison' : 'Compare property'}"
            onclick="App.handleCompareClick(event, '${prop.id}')"
            aria-label="Compare property"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"></path>
            </svg>
            <span>${isCompared ? 'Added' : 'Compare'}</span>
          </button>

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
   * Handles compare button click on property cards.
   */
  handleCompareClick(event, id) {
    event.preventDefault();
    event.stopPropagation();
    const result = StorageManager.toggleCompare(id);
    if (!result.success && result.message) {
      this.showToast(result.message, "warning");
      return;
    }

    const buttons = document.querySelectorAll(`.compare-card-btn[data-id="${id}"]`);
    buttons.forEach(btn => {
      const span = btn.querySelector("span");
      if (result.isCompared) {
        btn.classList.add("active");
        btn.setAttribute("title", "Remove from comparison");
        if (span) span.textContent = "Added";
      } else {
        btn.classList.remove("active");
        btn.setAttribute("title", "Compare property");
        if (span) span.textContent = "Compare";
      }
    });

    if (result.isCompared) {
      this.showToast("Property added to comparison dock!", "success");
    } else {
      this.showToast("Property removed from comparison.", "info");
    }
  },

  /**
   * Sets up floating comparison dock and event listener.
   */
  setupCompareDock() {
    let dock = document.getElementById("compareFloatingDock");
    if (!dock) {
      dock = document.createElement("div");
      dock.id = "compareFloatingDock";
      dock.className = "compare-floating-dock";
      dock.style.display = "none";
      document.body.appendChild(dock);
    }

    this.renderCompareDock();

    window.addEventListener("comparisonUpdated", () => {
      this.renderCompareDock();
    });
  },

  /**
   * Renders the floating comparison bar at bottom of screen.
   */
  renderCompareDock() {
    const dock = document.getElementById("compareFloatingDock");
    if (!dock) return;

    const list = StorageManager.getComparedProperties();
    if (list.length === 0) {
      dock.style.display = "none";
      return;
    }

    dock.style.display = "block";
    dock.innerHTML = `
      <div class="compare-dock-inner">
        <div class="compare-dock-info">
          <strong>Compare (${list.length}/3)</strong>
          <span>Select up to 3 properties</span>
        </div>
        <div class="compare-dock-items">
          ${list.map(prop => `
            <div class="compare-dock-item" title="${prop.title}">
              <img src="${(prop.images && prop.images[0]) || this.getFallbackImage()}" alt="${prop.title}" onerror="this.onerror=null; this.src='${this.getFallbackImage()}';" />
              <button type="button" class="compare-dock-remove" onclick="App.removeCompareItem('${prop.id}')" title="Remove property">&times;</button>
            </div>
          `).join("")}
        </div>
        <div class="compare-dock-actions">
          <button type="button" class="btn btn-primary btn-sm" onclick="App.openCompareModal()">
            Compare Now (${list.length})
          </button>
          <button type="button" class="btn btn-outline btn-sm" onclick="App.clearCompare()" title="Clear queue">
            Clear
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Removes a single property from comparison queue.
   */
  removeCompareItem(id) {
    StorageManager.toggleCompare(id);
    const buttons = document.querySelectorAll(`.compare-card-btn[data-id="${id}"]`);
    buttons.forEach(btn => {
      btn.classList.remove("active");
      btn.setAttribute("title", "Compare property");
      const span = btn.querySelector("span");
      if (span) span.textContent = "Compare";
    });
    this.showToast("Removed from comparison", "info");
  },

  /**
   * Clears the entire comparison queue.
   */
  clearCompare() {
    StorageManager.clearComparison();
    const buttons = document.querySelectorAll(".compare-card-btn");
    buttons.forEach(btn => {
      btn.classList.remove("active");
      btn.setAttribute("title", "Compare property");
      const span = btn.querySelector("span");
      if (span) span.textContent = "Compare";
    });
    this.showToast("Comparison cleared", "info");
  },

  /**
   * Opens side-by-side modal comparison table.
   */
  openCompareModal() {
    const list = StorageManager.getComparedProperties();
    if (list.length < 2) {
      this.showToast("Please select at least 2 properties to compare side-by-side.", "warning");
      return;
    }

    let modal = document.getElementById("compareModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "compareModal";
      modal.className = "modal-backdrop";
      document.body.appendChild(modal);
    }

    const rows = [
      { label: "Preview", render: p => `<div class="compare-prop-thumb"><img src="${(p.images && p.images[0]) || this.getFallbackImage()}" alt="${p.title}" style="width:100%;height:110px;object-fit:cover;border-radius:var(--radius-md);" /><strong style="display:block;margin-top:0.4rem;font-size:0.85rem;">${p.title}</strong><a href="./property-details.html?id=${p.id}" class="btn btn-primary btn-xs mt-1" style="display:inline-block;padding:0.25rem 0.6rem;font-size:0.75rem;">View Listing</a></div>` },
      { label: "Price", render: p => `<strong style="color:var(--brand);">${this.formatPrice(p.price, p.listingType)}</strong>` },
      { label: "Type", render: p => `<span class="badge ${p.listingType === 'rent' ? 'badge-rent' : 'badge-sale'}">${p.listingType === 'rent' ? 'For Rent' : 'For Sale'}</span> - ${p.propertyType || 'Residential'}` },
      { label: "Location", render: p => `${p.city || ''}, ${p.state || ''}` },
      { label: "Bedrooms", render: p => `${p.bedrooms || 0} BHK` },
      { label: "Bathrooms", render: p => `${p.bathrooms || 0} Baths` },
      { label: "Area", render: p => `${p.area} sq.ft (${Math.round(p.price / (p.area || 1))}/sq.ft)` },
      { label: "Furnishing", render: p => p.furnishing || "Unfurnished" },
      { label: "Amenities", render: p => (p.amenities && p.amenities.length > 0) ? `<div style="display:flex;flex-wrap:wrap;gap:0.25rem;">${p.amenities.map(a => `<span class="badge" style="font-size:0.7rem;background:var(--bg-card);border:1px solid var(--border);">${a}</span>`).join('')}</div>` : "N/A" }
    ];

    modal.innerHTML = `
      <div class="modal-dialog modal-lg" style="max-width:960px;width:95%;">
        <div class="modal-header">
          <h3 class="modal-title">Property Comparison</h3>
          <button type="button" class="modal-close" onclick="App.closeCompareModal()">&times;</button>
        </div>
        <div class="modal-body" style="overflow-x:auto;">
          <table class="compare-table" style="width:100%;border-collapse:collapse;">
            <thead>
              <tr>
                <th style="width:140px;background:var(--bg-muted);">Features</th>
                ${list.map(p => `<th>${p.title}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${rows.map(row => `
                <tr>
                  <td style="font-weight:600;background:var(--bg-muted);">${row.label}</td>
                  ${list.map(p => `<td>${row.render(p)}</td>`).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <div class="modal-footer" style="display:flex;justify-content:space-between;">
          <button type="button" class="btn btn-outline" onclick="App.clearCompare(); App.closeCompareModal();">Clear All</button>
          <button type="button" class="btn btn-secondary" onclick="App.closeCompareModal()">Close</button>
        </div>
      </div>
    `;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  },

  /**
   * Closes compare modal dialog.
   */
  closeCompareModal() {
    const modal = document.getElementById("compareModal");
    if (modal) {
      modal.classList.remove("active");
    }
    document.body.style.overflow = "";
  },
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
