/**
 * EstateHub - Dashboard Controller
 * Handles seller/agent statistics, listings management (View, Edit, Delete), and Inquiries inbox.
 * Optimized for GitHub Pages & Localhost deployments.
 */

const DashboardController = {
  activeTab: "properties",
  propertiesToDeleteId: null,

  init() {
    // Check if user is logged in; if not, automatically log in as Demo Agent for smooth portfolio evaluation
    if (!Auth.isLoggedIn()) {
      Auth.loginAsDemo("agent");
    }

    this.renderUserProfile();
    this.renderMetrics();
    this.renderPropertiesTable();
    this.renderInquiriesTable();
    this.renderToursTable();
    this.bindEvents();

    window.addEventListener("toursUpdated", () => {
      this.renderMetrics();
      this.renderToursTable();
    });
  },

  /**
   * Renders user info in sidebar.
   */
  renderUserProfile() {
    const user = Auth.getUser();
    if (!user) return;

    const avatarEl = document.getElementById("dashUserAvatar");
    const nameEl = document.getElementById("dashUserName");
    const roleEl = document.getElementById("dashUserRole");
    const emailEl = document.getElementById("dashUserEmail");

    if (avatarEl) avatarEl.src = user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80";
    if (nameEl) nameEl.textContent = user.fullName;
    if (roleEl) roleEl.textContent = user.role === "agent" ? "Verified Real Estate Agent" : "Registered Buyer";
    if (emailEl) emailEl.textContent = user.email;
  },

  /**
   * Renders Top Summary Metric Cards.
   */
  renderMetrics() {
    const properties = StorageManager.getProperties();
    const inquiries = StorageManager.getInquiries();
    const tours = StorageManager.getTours();

    const totalListingsEl = document.getElementById("metricTotalListings");
    const activeListingsEl = document.getElementById("metricActiveListings");
    const totalInquiriesEl = document.getElementById("metricTotalInquiries");
    const totalToursEl = document.getElementById("metricTotalTours");

    if (totalListingsEl) totalListingsEl.textContent = properties.length;
    if (activeListingsEl) activeListingsEl.textContent = properties.length;
    if (totalInquiriesEl) totalInquiriesEl.textContent = inquiries.length;
    if (totalToursEl) totalToursEl.textContent = tours.length;
  },

  /**
   * Renders My Properties Table.
   */
  renderPropertiesTable() {
    const tbody = document.getElementById("dashboardPropertiesTbody");
    if (!tbody) return;

    const properties = StorageManager.getProperties();

    if (properties.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center" style="padding: 2rem; text-align: center; color: var(--text-muted);">
            No properties listed yet. <a href="./add-property.html" class="btn btn-primary btn-sm" style="margin-left: 0.5rem;">+ Add New Property</a>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = properties.map((p) => {
      const firstImg = p.images && p.images.length > 0 ? p.images[0] : App.getFallbackImage();
      const formattedPrice = App.formatPrice(p.price, p.listingType);

      return `
        <tr>
          <td>
            <div class="table-prop-cell">
              <img src="${firstImg}" alt="${p.title}" class="table-prop-thumb" onerror="this.src='${App.getFallbackImage()}';" />
              <div>
                <a href="./property-details.html?id=${p.id}" style="font-weight: 700; color: var(--primary);" title="View Property">${p.title}</a>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${p.city}, ${p.state}</div>
              </div>
            </div>
          </td>
          <td><span class="badge ${p.listingType === 'rent' ? 'badge-rent' : 'badge-sale'}">${p.listingType === 'rent' ? 'Rent' : 'Sale'}</span></td>
          <td>${p.propertyType}</td>
          <td style="font-weight: 700; color: var(--brand);">${formattedPrice}</td>
          <td>
            <span class="badge badge-sale">Active</span>
          </td>
          <td>
            <div style="display: flex; gap: 0.4rem;">
              <a href="./property-details.html?id=${p.id}" class="btn btn-ghost btn-sm btn-icon-only" title="View Details">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </a>
              <a href="./add-property.html?edit=${p.id}" class="btn btn-outline btn-sm btn-icon-only" title="Edit Property">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </a>
              <button type="button" class="btn btn-danger-outline btn-sm btn-icon-only" title="Delete Property" onclick="DashboardController.promptDeleteProperty('${p.id}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  /**
   * Prompts user before deleting a property.
   */
  promptDeleteProperty(id) {
    this.propertiesToDeleteId = id;
    const prop = StorageManager.getPropertyById(id);
    const label = document.getElementById("deletePropName");
    if (label && prop) label.textContent = prop.title;
    App.openModal("deleteConfirmModal");
  },

  /**
   * Confirms and deletes property.
   */
  confirmDeleteProperty() {
    if (!this.propertiesToDeleteId) return;
    const success = StorageManager.deleteProperty(this.propertiesToDeleteId);
    App.closeModal("deleteConfirmModal");
    this.propertiesToDeleteId = null;

    if (success) {
      App.showToast("Property deleted successfully.", "info");
      this.renderMetrics();
      this.renderPropertiesTable();
    }
  },

  /**
   * Renders Inquiries Table.
   */
  renderInquiriesTable() {
    const tbody = document.getElementById("dashboardInquiriesTbody");
    if (!tbody) return;

    const inquiries = StorageManager.getInquiries();

    if (inquiries.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="padding: 2rem; text-align: center; color: var(--text-muted);">
            No customer inquiries received yet.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = inquiries.map(inq => `
      <tr>
        <td>
          <div style="font-weight: 700; color: var(--primary);">${inq.senderName}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${inq.senderEmail} | ${inq.senderPhone || 'No phone'}</div>
        </td>
        <td>
          <a href="./property-details.html?id=${inq.propertyId}" style="font-weight: 600; color: var(--brand);" title="View Property">
            ${inq.propertyTitle}
          </a>
        </td>
        <td style="max-width: 280px; font-size: 0.875rem; color: var(--text-muted);">
          "${inq.message}"
        </td>
        <td>
          <span class="badge ${inq.status === 'replied' ? 'badge-sale' : 'badge-featured'}">
            ${inq.status === 'replied' ? 'Replied' : 'New Lead'}
          </span>
        </td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            <a href="mailto:${inq.senderEmail}?subject=Re: Inquiry for ${encodeURIComponent(inq.propertyTitle)}" class="btn btn-primary btn-sm" title="Email Client" onclick="DashboardController.markInquiryReplied('${inq.id}')">
              Reply
            </a>
            <button class="btn btn-danger-outline btn-sm btn-icon-only" title="Delete Inquiry" onclick="DashboardController.deleteInquiry('${inq.id}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join("");
  },

  markInquiryReplied(id) {
    StorageManager.updateInquiryStatus(id, "replied");
    this.renderInquiriesTable();
  },

  deleteInquiry(id) {
    StorageManager.deleteInquiry(id);
    App.showToast("Inquiry deleted.", "info");
    this.renderMetrics();
    this.renderInquiriesTable();
  },

  /**
   * Renders Site Visits & Tours Table.
   */
  renderToursTable() {
    const tbody = document.getElementById("dashboardToursTbody");
    if (!tbody) return;

    const tours = StorageManager.getTours();

    if (tours.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="padding: 2.5rem 1rem; text-align: center; color: var(--text-muted);">
            <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">📅</div>
            <strong>No site visits scheduled yet.</strong>
            <p style="margin: 0.25rem 0 0; font-size: 0.85rem;">When buyers schedule an in-person or live video tour, they will appear here.</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = tours.map((t) => {
      const modeBadge = t.tourType === "video_call"
        ? `<span class="badge badge-rent">📹 Live Video Tour</span>`
        : `<span class="badge badge-sale">🏢 In-Person Visit</span>`;

      const statusBadge = t.status === "cancelled"
        ? `<span class="badge" style="background:#fee2e2;color:#b91c1c;border:1px solid #fca5a5;">Cancelled</span>`
        : `<span class="badge badge-featured">✓ Confirmed</span>`;

      const formattedDate = new Date(t.tourDate).toLocaleDateString("en-IN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
      });

      return `
        <tr>
          <td>
            <div style="font-weight: 700; color: var(--primary);">${t.clientName}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">
              <a href="tel:${t.clientPhone}" style="color: inherit;">${t.clientPhone}</a>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${t.clientEmail}</div>
          </td>
          <td>
            <a href="./property-details.html?id=${t.propertyId}" style="font-weight: 700; color: var(--primary);" title="View Property">
              ${t.propertyTitle}
            </a>
            ${t.notes ? `<div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem; max-width: 260px;">Note: "${t.notes}"</div>` : ""}
          </td>
          <td>${modeBadge}</td>
          <td>
            <strong style="display: block; font-size: 0.875rem;">${formattedDate}</strong>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${t.timeSlot}</span>
          </td>
          <td>${statusBadge}</td>
          <td>
            <div style="display: flex; gap: 0.4rem; align-items: center;">
              ${t.status !== "cancelled" ? `
                <button class="btn btn-outline btn-xs" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" title="Cancel appointment" onclick="DashboardController.cancelTour('${t.id}')">
                  Cancel
                </button>
              ` : `
                <button class="btn btn-primary btn-xs" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" title="Reconfirm appointment" onclick="DashboardController.confirmTour('${t.id}')">
                  Reconfirm
                </button>
              `}
              <button class="btn btn-danger-outline btn-xs btn-icon-only" title="Delete record" onclick="DashboardController.deleteTour('${t.id}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  cancelTour(id) {
    StorageManager.updateTourStatus(id, "cancelled");
    App.showToast("Site visit appointment cancelled.", "info");
    this.renderToursTable();
  },

  confirmTour(id) {
    StorageManager.updateTourStatus(id, "confirmed");
    App.showToast("Site visit reconfirmed with client.", "success");
    this.renderToursTable();
  },

  deleteTour(id) {
    StorageManager.deleteTour(id);
    App.showToast("Tour appointment deleted.", "info");
    this.renderMetrics();
    this.renderToursTable();
  },

  /**
   * Binds dashboard events.
   */
  bindEvents() {
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener("click", () => {
        this.confirmDeleteProperty();
      });
    }

    // Tab switching
    document.querySelectorAll(".dash-tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const tab = btn.dataset.tab;
        document.querySelectorAll(".dash-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        document.querySelectorAll(".dash-tab-pane").forEach(pane => {
          pane.style.display = pane.id === `tab-${tab}` ? "block" : "none";
        });
      });
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("dashboardContainer")) {
    DashboardController.init();
  }
});
