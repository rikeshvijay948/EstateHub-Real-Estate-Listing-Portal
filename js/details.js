/**
 * EstateHub - Property Details Controller
 * Handles URL ID parsing, image gallery carousel, specs rendering, EMI calculator, inquiry modal, and similar listings.
 * Optimized for GitHub Pages & Localhost deployments.
 */

const PropertyDetailsController = {
  property: null,
  currentImageIndex: 0,

  init() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
      this.renderNotFound("No Property Selected", "Please select a valid property from our listings.");
      return;
    }

    this.property = StorageManager.getPropertyById(id);

    if (!this.property) {
      this.renderNotFound("Property Not Found", "The property listing you are looking for does not exist or has been removed.");
      return;
    }

    // Update Page Title
    document.title = `${this.property.title} | EstateHub`;

    this.renderDetails();
    this.initGallery();
    this.initEmiCalculator();
    this.initInquiryForm();
    this.renderSimilarProperties();
  },

  /**
   * Renders fallback not found container.
   */
  renderNotFound(title, desc) {
    const container = document.getElementById("propertyDetailsContainer");
    if (container) {
      container.innerHTML = `
        <div class="container section">
          <div class="empty-state">
            <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h2 class="empty-title">${title}</h2>
            <p class="empty-desc">${desc}</p>
            <a href="./properties.html" class="btn btn-primary">Browse All Properties</a>
          </div>
        </div>
      `;
    }
  },

  /**
   * Renders the complete property details structure.
   */
  renderDetails() {
    const p = this.property;
    const isFav = StorageManager.isFavorite(p.id);
    const listingLabel = p.listingType === "rent" ? "For Rent" : "For Sale";
    const listingBadgeClass = p.listingType === "rent" ? "badge-rent" : "badge-sale";

    // Set Breadcrumbs
    const breadcrumbCity = document.getElementById("breadcrumbCity");
    const breadcrumbTitle = document.getElementById("breadcrumbTitle");
    if (breadcrumbCity) breadcrumbCity.textContent = p.city;
    if (breadcrumbTitle) breadcrumbTitle.textContent = p.title;

    // Header Details
    const headerTitle = document.getElementById("propertyTitle");
    const headerAddress = document.getElementById("propertyAddress");
    const headerPrice = document.getElementById("propertyPrice");
    const headerBadges = document.getElementById("propertyBadges");

    if (headerTitle) headerTitle.textContent = p.title;
    if (headerAddress) headerAddress.textContent = `${p.address}, ${p.city}, ${p.state} - ${p.pincode || ""}`;
    if (headerPrice) headerPrice.innerHTML = App.formatPrice(p.price, p.listingType);
    if (headerBadges) {
      headerBadges.innerHTML = `
        <span class="badge ${listingBadgeClass}">${listingLabel}</span>
        <span class="badge badge-sale">${p.propertyType}</span>
        ${p.featured ? '<span class="badge badge-featured">★ Featured</span>' : ""}
      `;
    }

    // Favorite Button in Header
    const favBtn = document.getElementById("detailFavBtn");
    if (favBtn) {
      if (isFav) favBtn.classList.add("active");
      favBtn.onclick = (e) => App.handleFavoriteClick(e, p.id);
    }

    // Specifications Grid (8 Items)
    const specsGrid = document.getElementById("specsGrid");
    if (specsGrid) {
      specsGrid.innerHTML = `
        <div class="spec-box-card">
          <span class="spec-label">Property Type</span>
          <span class="spec-value">${p.propertyType}</span>
        </div>
        <div class="spec-box-card">
          <span class="spec-label">Listing Type</span>
          <span class="spec-value">${p.listingType === "rent" ? "Rental" : "For Sale"}</span>
        </div>
        <div class="spec-box-card">
          <span class="spec-label">Bedrooms</span>
          <span class="spec-value">${p.bedrooms > 0 ? p.bedrooms + " BHK" : "Studio / Plot"}</span>
        </div>
        <div class="spec-box-card">
          <span class="spec-label">Bathrooms</span>
          <span class="spec-value">${p.bathrooms || "N/A"}</span>
        </div>
        <div class="spec-box-card">
          <span class="spec-label">Super Area</span>
          <span class="spec-value">${p.area} sq.ft</span>
        </div>
        <div class="spec-box-card">
          <span class="spec-label">Year Built</span>
          <span class="spec-value">${p.yearBuilt || "2024"}</span>
        </div>
        <div class="spec-box-card">
          <span class="spec-label">Parking</span>
          <span class="spec-value">${p.parking || "Available"}</span>
        </div>
        <div class="spec-box-card">
          <span class="spec-label">Furnishing</span>
          <span class="spec-value">${p.furnishedStatus || "Semi-Furnished"}</span>
        </div>
      `;
    }

    // Description
    const descEl = document.getElementById("propertyDescription");
    if (descEl) descEl.textContent = p.description;

    // Features
    const featuresList = document.getElementById("propertyFeaturesList");
    if (featuresList && p.features && p.features.length > 0) {
      featuresList.innerHTML = p.features.map(f => `
        <div class="feature-check-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>${f}</span>
        </div>
      `).join("");
    }

    // Amenities
    const amenitiesList = document.getElementById("propertyAmenitiesList");
    if (amenitiesList && p.amenities && p.amenities.length > 0) {
      amenitiesList.innerHTML = p.amenities.map(a => `
        <div class="amenity-pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>${a}</span>
        </div>
      `).join("");
    }

    // Agent Profile Card
    const agent = p.agent || {
      name: "Rohit Malhotra",
      role: "Luxury Property Consultant",
      phone: "+91 98201 54321",
      email: "rohit.malhotra@estatehub.com",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80",
      rating: 4.9,
      reviewsCount: 38
    };

    const agentAvatar = document.getElementById("agentAvatar");
    const agentName = document.getElementById("agentName");
    const agentRole = document.getElementById("agentRole");
    const agentRating = document.getElementById("agentRating");
    const agentCallBtn = document.getElementById("agentCallBtn");

    if (agentAvatar) agentAvatar.src = agent.avatar;
    if (agentName) agentName.textContent = agent.name;
    if (agentRole) agentRole.textContent = agent.role;
    if (agentRating) agentRating.innerHTML = `★ ${agent.rating || 4.9} (${agent.reviewsCount || 25} Reviews)`;
    if (agentCallBtn) agentCallBtn.href = `tel:${(agent.phone || "").replace(/\s+/g, "")}`;
  },

  /**
   * Initializes interactive image gallery.
   */
  initGallery() {
    const images = (this.property.images && this.property.images.length > 0) 
      ? this.property.images 
      : [App.getFallbackImage()];

    const mainImg = document.getElementById("galleryMainImg");
    const thumbsContainer = document.getElementById("galleryThumbs");
    const counter = document.getElementById("galleryCounter");
    const prevBtn = document.getElementById("galleryPrev");
    const nextBtn = document.getElementById("galleryNext");

    const updateImage = (index) => {
      if (index < 0) index = images.length - 1;
      if (index >= images.length) index = 0;
      this.currentImageIndex = index;

      if (mainImg) {
        mainImg.style.opacity = "0.7";
        setTimeout(() => {
          mainImg.src = images[this.currentImageIndex];
          mainImg.style.opacity = "1";
        }, 150);
      }

      if (counter) {
        counter.textContent = `${this.currentImageIndex + 1} / ${images.length}`;
      }

      // Update active thumbnail
      if (thumbsContainer) {
        thumbsContainer.querySelectorAll(".gallery-thumb").forEach((thumb, i) => {
          thumb.classList.toggle("active", i === this.currentImageIndex);
        });
      }
    };

    // Render Thumbnails
    if (thumbsContainer) {
      thumbsContainer.innerHTML = images.map((imgUrl, i) => `
        <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}" onclick="PropertyDetailsController.setGalleryIndex(${i})">
          <img src="${imgUrl}" alt="Thumbnail ${i + 1}" onerror="this.src='${App.getFallbackImage()}';" />
        </div>
      `).join("");
    }

    if (prevBtn) prevBtn.onclick = () => updateImage(this.currentImageIndex - 1);
    if (nextBtn) nextBtn.onclick = () => updateImage(this.currentImageIndex + 1);

    // Initial state
    updateImage(0);

    // Keyboard support
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") updateImage(this.currentImageIndex - 1);
      if (e.key === "ArrowRight") updateImage(this.currentImageIndex + 1);
    });
  },

  setGalleryIndex(index) {
    const images = this.property.images || [];
    const mainImg = document.getElementById("galleryMainImg");
    const counter = document.getElementById("galleryCounter");
    const thumbsContainer = document.getElementById("galleryThumbs");

    this.currentImageIndex = index;
    if (mainImg) mainImg.src = images[index] || App.getFallbackImage();
    if (counter) counter.textContent = `${index + 1} / ${images.length}`;

    if (thumbsContainer) {
      thumbsContainer.querySelectorAll(".gallery-thumb").forEach((thumb, i) => {
        thumb.classList.toggle("active", i === index);
      });
    }
  },

  /**
   * Initializes Real-Time EMI / Loan Calculator.
   */
  initEmiCalculator() {
    const p = this.property;
    if (p.listingType === "rent") {
      // Hide EMI calculator for rentals
      const calcCard = document.getElementById("emiCalculatorCard");
      if (calcCard) calcCard.style.display = "none";
      return;
    }

    const loanAmountInput = document.getElementById("calcLoanAmount");
    const interestRateInput = document.getElementById("calcInterestRate");
    const tenureInput = document.getElementById("calcTenure");

    const loanDisplay = document.getElementById("calcLoanAmountVal");
    const rateDisplay = document.getElementById("calcInterestRateVal");
    const tenureDisplay = document.getElementById("calcTenureVal");
    const emiOutput = document.getElementById("calcMonthlyEmi");
    const totalInterestOutput = document.getElementById("calcTotalInterest");

    // Set Default Loan Amount to 80% of Property Value
    const defaultPrincipal = Math.round(p.price * 0.8);
    if (loanAmountInput) {
      loanAmountInput.max = p.price;
      loanAmountInput.value = defaultPrincipal;
    }

    const calculate = () => {
      const P = Number(loanAmountInput ? loanAmountInput.value : defaultPrincipal);
      const r = Number(interestRateInput ? interestRateInput.value : 8.5) / 12 / 100;
      const n = Number(tenureInput ? tenureInput.value : 20) * 12;

      // EMI Formula = P * r * (1 + r)^n / ((1 + r)^n - 1)
      const emi = Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
      const totalAmount = emi * n;
      const totalInterest = totalAmount - P;

      if (loanDisplay) loanDisplay.textContent = `₹${P.toLocaleString("en-IN")}`;
      if (rateDisplay) rateDisplay.textContent = `${interestRateInput.value}%`;
      if (tenureDisplay) tenureDisplay.textContent = `${tenureInput.value} Years`;

      if (emiOutput) emiOutput.textContent = `₹${emi.toLocaleString("en-IN")}`;
      if (totalInterestOutput) totalInterestOutput.textContent = `₹${totalInterest.toLocaleString("en-IN")}`;
    };

    if (loanAmountInput) loanAmountInput.addEventListener("input", calculate);
    if (interestRateInput) interestRateInput.addEventListener("input", calculate);
    if (tenureInput) tenureInput.addEventListener("input", calculate);

    calculate();
  },

  /**
   * Initializes Contact Agent Modal & Inquiry Submission.
   */
  initInquiryForm() {
    const openModalBtn = document.getElementById("openInquiryModalBtn");
    const modalPropTitle = document.getElementById("inquiryModalPropTitle");
    const form = document.getElementById("propertyInquiryForm");

    if (openModalBtn) {
      openModalBtn.addEventListener("click", () => {
        if (modalPropTitle) modalPropTitle.textContent = this.property.title;
        App.openModal("inquiryModal");
      });
    }

    if (form) {
      // Auto-fill logged in user info if available
      const user = Auth.getUser();
      if (user) {
        const nameInput = form.querySelector("input[name='senderName']");
        const emailInput = form.querySelector("input[name='senderEmail']");
        const phoneInput = form.querySelector("input[name='senderPhone']");
        if (nameInput) nameInput.value = user.fullName;
        if (emailInput) emailInput.value = user.email;
        if (phoneInput && user.phone) phoneInput.value = user.phone;
      }

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        const inquiry = {
          propertyId: this.property.id,
          propertyTitle: this.property.title,
          propertyPrice: this.property.price,
          propertyImage: this.property.images && this.property.images[0] ? this.property.images[0] : "",
          senderName: formData.get("senderName"),
          senderEmail: formData.get("senderEmail"),
          senderPhone: formData.get("senderPhone"),
          message: formData.get("message")
        };

        StorageManager.addInquiry(inquiry);
        App.closeModal("inquiryModal");
        form.reset();
        App.showToast("Inquiry sent successfully! The agent will contact you soon.", "success", 4500);
      });
    }
  },

  /**
   * Renders similar properties recommendation cards.
   */
  renderSimilarProperties() {
    const container = document.getElementById("similarPropertiesGrid");
    if (!container) return;

    const all = StorageManager.getProperties();
    // Filter similar by same city OR same property type, excluding self
    const similar = all.filter(p => p.id !== this.property.id && (p.city === this.property.city || p.propertyType === this.property.propertyType)).slice(0, 3);

    if (similar.length === 0) {
      container.parentElement.style.display = "none";
      return;
    }

    container.innerHTML = similar.map(p => App.createPropertyCard(p)).join("");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("propertyDetailsContainer")) {
    PropertyDetailsController.init();
  }
});
