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
    this.initReviews();
    this.initNeighborhood();
    this.renderSimilarProperties();

    // Record viewing & render recently viewed
    StorageManager.addRecentlyViewed(this.property.id);
    this.renderRecentlyViewed();

    window.addEventListener("priceAlertsUpdated", () => {
      this.updatePriceAlertBtnState();
    });
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
    if (typeof this.recalculateEmi === "function") this.recalculateEmi();
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

    // Price Drop Alert Button State
    this.updatePriceAlertBtnState();

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
          <span class="spec-value">${App.formatArea(p.area)}</span>
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

    // Mobile Action Bar Setup
    const mobilePrice = document.getElementById("mobileActionPrice");
    const mobileType = document.getElementById("mobileActionType");
    const mobileWaBtn = document.getElementById("mobileActionWaBtn");
    const mobileCallBtn = document.getElementById("mobileActionCallBtn");
    const mobileFavBtn = document.getElementById("mobileActionFavBtn");

    if (mobilePrice) mobilePrice.innerHTML = App.formatPrice(p.price, p.listingType);
    if (mobileType) mobileType.textContent = p.listingType === "rent" ? "For Rent" : "For Sale";

    const cleanPhone = (agent.phone || "+919820154321").replace(/\D/g, "");
    const waText = encodeURIComponent(`Hi ${agent.name}, I am interested in "${p.title}" (${p.city}) on EstateHub.`);
    if (mobileWaBtn) mobileWaBtn.href = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${waText}`;
    if (mobileCallBtn) mobileCallBtn.href = `tel:${cleanPhone}`;

    if (mobileFavBtn) {
      mobileFavBtn.classList.toggle("active", isFav);
      mobileFavBtn.onclick = (e) => {
        App.handleFavoriteClick(e, p.id);
        const nowFav = StorageManager.isFavorite(p.id);
        mobileFavBtn.classList.toggle("active", nowFav);
        if (favBtn) favBtn.classList.toggle("active", nowFav);
      };
    }
  },

  isLightboxOpen: false,

  /**
   * Returns current property images or fallback.
   */
  getImages() {
    return (this.property && this.property.images && this.property.images.length > 0)
      ? this.property.images
      : [App.getFallbackImage()];
  },

  /**
   * Initializes interactive image gallery.
   */
  initGallery() {
    const images = this.getImages();
    const thumbsContainer = document.getElementById("galleryThumbs");
    const prevBtn = document.getElementById("galleryPrev");
    const nextBtn = document.getElementById("galleryNext");

    // Render Main Thumbnails
    if (thumbsContainer) {
      thumbsContainer.innerHTML = images.map((imgUrl, i) => `
        <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}" onclick="PropertyDetailsController.setGalleryIndex(${i})">
          <img src="${imgUrl}" alt="Thumbnail ${i + 1}" onerror="this.src='${App.getFallbackImage()}';" />
        </div>
      `).join("");
    }

    if (prevBtn) prevBtn.onclick = (e) => { e.stopPropagation(); this.galleryPrev(); };
    if (nextBtn) nextBtn.onclick = (e) => { e.stopPropagation(); this.galleryNext(); };

    // Initial state
    this.updateGalleryUI();

    // Keyboard support (Escape, ArrowLeft, ArrowRight)
    document.addEventListener("keydown", (e) => {
      if (this.isLightboxOpen) {
        if (e.key === "Escape") this.closeLightbox();
        if (e.key === "ArrowLeft") this.lightboxPrev();
        if (e.key === "ArrowRight") this.lightboxNext();
      } else {
        if (e.key === "ArrowLeft") this.galleryPrev();
        if (e.key === "ArrowRight") this.galleryNext();
      }
    });
  },

  /**
   * Updates main page gallery image, counter, and active thumbnail.
   */
  updateGalleryUI() {
    const images = this.getImages();
    const mainImg = document.getElementById("galleryMainImg");
    const counter = document.getElementById("galleryCounter");
    const thumbsContainer = document.getElementById("galleryThumbs");

    if (mainImg) {
      mainImg.style.opacity = "0.7";
      setTimeout(() => {
        mainImg.src = images[this.currentImageIndex] || App.getFallbackImage();
        mainImg.style.opacity = "1";
      }, 100);
    }

    if (counter) {
      counter.textContent = `${this.currentImageIndex + 1} / ${images.length}`;
    }

    if (thumbsContainer) {
      thumbsContainer.querySelectorAll(".gallery-thumb").forEach((thumb, i) => {
        thumb.classList.toggle("active", i === this.currentImageIndex);
      });
    }
  },

  /**
   * Updates lightbox image, counter, and active thumbnail strip.
   */
  updateLightboxUI() {
    const images = this.getImages();
    const lbImg = document.getElementById("lightboxMainImg");
    const lbCounter = document.getElementById("lightboxCounter");
    const lbThumbs = document.getElementById("lightboxThumbs");

    if (lbImg) {
      lbImg.style.opacity = "0.7";
      setTimeout(() => {
        lbImg.src = images[this.currentImageIndex] || App.getFallbackImage();
        lbImg.style.opacity = "1";
      }, 100);
    }

    if (lbCounter) {
      lbCounter.textContent = `${this.currentImageIndex + 1} / ${images.length}`;
    }

    if (lbThumbs) {
      lbThumbs.querySelectorAll(".lightbox-thumb").forEach((thumb, i) => {
        const isActive = i === this.currentImageIndex;
        thumb.classList.toggle("active", isActive);
        if (isActive) {
          thumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
      });
    }
  },

  /**
   * Renders lightbox thumbnail strip.
   */
  renderLightboxThumbs() {
    const strip = document.getElementById("lightboxThumbs");
    if (!strip) return;
    const images = this.getImages();
    strip.innerHTML = images.map((imgUrl, i) => `
      <div class="lightbox-thumb ${i === this.currentImageIndex ? 'active' : ''}" data-index="${i}" onclick="PropertyDetailsController.setGalleryIndex(${i})">
        <img src="${imgUrl}" alt="Photo ${i + 1}" onerror="this.src='${App.getFallbackImage()}';" />
      </div>
    `).join("");
  },

  setGalleryIndex(index) {
    const images = this.getImages();
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    this.currentImageIndex = index;

    this.updateGalleryUI();
    if (this.isLightboxOpen) {
      this.updateLightboxUI();
    }
  },

  galleryPrev() {
    const images = this.getImages();
    this.setGalleryIndex((this.currentImageIndex - 1 + images.length) % images.length);
  },

  galleryNext() {
    const images = this.getImages();
    this.setGalleryIndex((this.currentImageIndex + 1) % images.length);
  },

  /**
   * Opens fullscreen Lightbox view.
   */
  openLightbox(index) {
    if (index !== undefined) {
      this.currentImageIndex = index;
    }
    this.isLightboxOpen = true;

    const titleEl = document.getElementById("lightboxTitle");
    if (titleEl && this.property) {
      titleEl.textContent = this.property.title;
    }

    this.renderLightboxThumbs();
    this.updateLightboxUI();

    const lb = document.getElementById("galleryLightbox");
    if (lb) lb.classList.add("active");
    document.body.classList.add("no-scroll");
  },

  /**
   * Closes fullscreen Lightbox view.
   */
  closeLightbox() {
    this.isLightboxOpen = false;
    const lb = document.getElementById("galleryLightbox");
    if (lb) lb.classList.remove("active");
    document.body.classList.remove("no-scroll");
  },

  lightboxPrev() {
    this.galleryPrev();
  },

  lightboxNext() {
    this.galleryNext();
  },

  /**
   * Initializes Real-Time Mortgage & Cost Breakdown Calculator.
   */
  initEmiCalculator() {
    const p = this.property;
    if (p.listingType === "rent") {
      // Hide EMI calculator for rentals
      const calcCard = document.getElementById("emiCalculatorCard");
      if (calcCard) calcCard.style.display = "none";
      return;
    }

    const downPaymentPctInput = document.getElementById("calcDownPaymentPct");
    const loanAmountInput = document.getElementById("calcLoanAmount");
    const interestRateInput = document.getElementById("calcInterestRate");
    const tenureInput = document.getElementById("calcTenure");

    const downPaymentDisplay = document.getElementById("calcDownPaymentVal");
    const loanDisplay = document.getElementById("calcLoanAmountVal");
    const rateDisplay = document.getElementById("calcInterestRateVal");
    const tenureDisplay = document.getElementById("calcTenureVal");
    const emiOutput = document.getElementById("calcMonthlyEmi");
    const totalInterestOutput = document.getElementById("calcTotalInterest");
    const totalRepaymentOutput = document.getElementById("calcTotalRepayment");
    const totalOutflowOutput = document.getElementById("calcTotalOutflowVal");

    // Bars
    const barDown = document.getElementById("barDown");
    const barLoan = document.getElementById("barLoan");
    const barInterest = document.getElementById("barInterest");
    const barTaxes = document.getElementById("barTaxes");

    // Legends
    const legendDownVal = document.getElementById("legendDownVal");
    const legendDownPct = document.getElementById("legendDownPct");
    const legendLoanVal = document.getElementById("legendLoanVal");
    const legendLoanPct = document.getElementById("legendLoanPct");
    const legendInterestVal = document.getElementById("legendInterestVal");
    const legendInterestPct = document.getElementById("legendInterestPct");
    const legendTaxesVal = document.getElementById("legendTaxesVal");
    const legendTaxesPct = document.getElementById("legendTaxesPct");

    // Initialize values based on property price
    const initialDownPct = downPaymentPctInput ? Number(downPaymentPctInput.value) : 20;
    const initialDownAmount = Math.round(p.price * (initialDownPct / 100));
    const initialLoanAmount = p.price - initialDownAmount;

    if (loanAmountInput) {
      loanAmountInput.min = Math.round(p.price * 0.1);
      loanAmountInput.max = Math.round(p.price * 0.9);
      loanAmountInput.step = p.price > 50000000 ? 500000 : 100000;
      loanAmountInput.value = initialLoanAmount;
    }

    const calculate = () => {
      const P = Number(loanAmountInput ? loanAmountInput.value : (p.price * 0.8));
      const downAmount = Math.max(0, p.price - P);
      const r = Number(interestRateInput ? interestRateInput.value : 8.5) / 12 / 100;
      const n = Number(tenureInput ? tenureInput.value : 20) * 12;

      // EMI Formula = P * r * (1 + r)^n / ((1 + r)^n - 1)
      const emi = Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
      const totalLoanRepayment = emi * n;
      const totalInterest = Math.max(0, totalLoanRepayment - P);
      const stampDutyAndReg = Math.round(p.price * 0.065); // ~6.5% standard stamp duty & reg fees
      const totalOutflow = downAmount + P + totalInterest + stampDutyAndReg;

      // Update text values
      if (downPaymentDisplay) downPaymentDisplay.textContent = `${App.formatPrice(downAmount, "sale")} (${Math.round((downAmount / p.price) * 100)}%)`;
      if (loanDisplay) loanDisplay.textContent = App.formatPrice(P, "sale");
      if (rateDisplay && interestRateInput) rateDisplay.textContent = `${interestRateInput.value}%`;
      if (tenureDisplay && tenureInput) tenureDisplay.textContent = `${tenureInput.value} Years`;

      if (emiOutput) emiOutput.innerHTML = App.formatPrice(emi, "rent");
      if (totalInterestOutput) totalInterestOutput.textContent = App.formatPrice(totalInterest, "sale");
      if (totalRepaymentOutput) totalRepaymentOutput.textContent = App.formatPrice(totalLoanRepayment, "sale");
      if (totalOutflowOutput) totalOutflowOutput.textContent = App.formatPrice(totalOutflow, "sale");

      // Percentages for stacked bar & legend
      const pctDown = ((downAmount / totalOutflow) * 100).toFixed(1);
      const pctLoan = ((P / totalOutflow) * 100).toFixed(1);
      const pctInterest = ((totalInterest / totalOutflow) * 100).toFixed(1);
      const pctTaxes = ((stampDutyAndReg / totalOutflow) * 100).toFixed(1);

      if (barDown) barDown.style.width = `${pctDown}%`;
      if (barLoan) barLoan.style.width = `${pctLoan}%`;
      if (barInterest) barInterest.style.width = `${pctInterest}%`;
      if (barTaxes) barTaxes.style.width = `${pctTaxes}%`;

      if (legendDownVal) legendDownVal.textContent = App.formatPrice(downAmount, "sale");
      if (legendDownPct) legendDownPct.textContent = `${pctDown}%`;
      if (legendLoanVal) legendLoanVal.textContent = App.formatPrice(P, "sale");
      if (legendLoanPct) legendLoanPct.textContent = `${pctLoan}%`;
      if (legendInterestVal) legendInterestVal.textContent = App.formatPrice(totalInterest, "sale");
      if (legendInterestPct) legendInterestPct.textContent = `${pctInterest}%`;
      if (legendTaxesVal) legendTaxesVal.textContent = App.formatPrice(stampDutyAndReg, "sale");
      if (legendTaxesPct) legendTaxesPct.textContent = `${pctTaxes}%`;
    };

    this.recalculateEmi = calculate;

    if (downPaymentPctInput) {
      downPaymentPctInput.addEventListener("input", (e) => {
        const pct = Number(e.target.value);
        const down = Math.round(p.price * (pct / 100));
        if (loanAmountInput) loanAmountInput.value = p.price - down;
        calculate();
      });
    }

    if (loanAmountInput) {
      loanAmountInput.addEventListener("input", (e) => {
        const loan = Number(e.target.value);
        const down = Math.max(0, p.price - loan);
        if (downPaymentPctInput) downPaymentPctInput.value = Math.round((down / p.price) * 100);
        calculate();
      });
    }

    if (interestRateInput) interestRateInput.addEventListener("input", calculate);
    if (tenureInput) tenureInput.addEventListener("input", calculate);

    calculate();
  },

  /**
   * Initializes Neighborhood Explorer.
   */
  initNeighborhood() {
    this.renderNeighborhood("all");
  },

  /**
   * Returns list of nearby landmarks either from property data or dynamically generated by city.
   */
  getNeighborhoodData() {
    if (this.property.nearbyPlaces && this.property.nearbyPlaces.length > 0) {
      return this.property.nearbyPlaces;
    }

    const city = (this.property.city || "").toLowerCase();

    if (city.includes("mumbai")) {
      return [
        { name: "Worli Sea Face Metro Station (Line 3)", category: "transit", icon: "🚆", dist: "0.4 km", time: "5 min walk" },
        { name: "Bandra-Worli Sea Link Interchange", category: "transit", icon: "🚗", dist: "1.8 km", time: "4 min drive" },
        { name: "St. Xavier's International School", category: "education", icon: "🏫", dist: "2.1 km", time: "7 min drive" },
        { name: "Lilavati Multi-Specialty Hospital", category: "healthcare", icon: "🏥", dist: "2.5 km", time: "8 min drive" },
        { name: "Apollo 24x7 Pharmacy & Clinic", category: "healthcare", icon: "💊", dist: "0.5 km", time: "6 min walk" },
        { name: "Phoenix Palladium & Luxury Mall", category: "shopping", icon: "🛍️", dist: "1.4 km", time: "5 min drive" },
        { name: "Nature's Basket Organic Supermarket", category: "shopping", icon: "🛒", dist: "0.7 km", time: "8 min walk" },
        { name: "Bayview Coastal Lounge & Cafe", category: "dining", icon: "☕", dist: "0.5 km", time: "6 min walk" }
      ];
    } else if (city.includes("bangalore") || city.includes("bengaluru")) {
      return [
        { name: "Whitefield Kadugodi Metro Station", category: "transit", icon: "🚆", dist: "0.6 km", time: "7 min walk" },
        { name: "ITPL Main Tech Park Corridor", category: "transit", icon: "🚗", dist: "1.2 km", time: "4 min drive" },
        { name: "The Deens Academy School", category: "education", icon: "🏫", dist: "1.5 km", time: "5 min drive" },
        { name: "Manipal Hospital Whitefield", category: "healthcare", icon: "🏥", dist: "2.0 km", time: "6 min drive" },
        { name: "Columbia Asia Emergency Clinic", category: "healthcare", icon: "💊", dist: "0.8 km", time: "9 min walk" },
        { name: "Nexus Shantiniketan Promenade Mall", category: "shopping", icon: "🛍️", dist: "1.2 km", time: "4 min drive" },
        { name: "Star Market & Food Hall", category: "shopping", icon: "🛒", dist: "0.6 km", time: "7 min walk" },
        { name: "Third Wave Coffee & Bistro", category: "dining", icon: "☕", dist: "0.4 km", time: "5 min walk" }
      ];
    } else if (city.includes("hyderabad")) {
      return [
        { name: "Raidurg Metro Station (Blue Line)", category: "transit", icon: "🚆", dist: "0.5 km", time: "6 min walk" },
        { name: "Outer Ring Road (ORR) Expressway", category: "transit", icon: "🚗", dist: "2.0 km", time: "5 min drive" },
        { name: "Oakridge International School", category: "education", icon: "🏫", dist: "2.8 km", time: "8 min drive" },
        { name: "AIG Multi-Specialty Hospital", category: "healthcare", icon: "🏥", dist: "1.6 km", time: "5 min drive" },
        { name: "MedPlus 24-Hr Pharmacy", category: "healthcare", icon: "💊", dist: "0.4 km", time: "5 min walk" },
        { name: "Inorbit Mall Cyberabad", category: "shopping", icon: "🛍️", dist: "1.3 km", time: "4 min drive" },
        { name: "Ratnadeep Supermarket Hitec City", category: "shopping", icon: "🛒", dist: "0.5 km", time: "6 min walk" },
        { name: "Concu Artisanal Patisserie", category: "dining", icon: "☕", dist: "0.7 km", time: "8 min walk" }
      ];
    } else {
      return [
        { name: "Central Metro & City Transit Station", category: "transit", icon: "🚆", dist: "0.8 km", time: "9 min walk" },
        { name: "City Ring Road Expressway", category: "transit", icon: "🚗", dist: "1.5 km", time: "4 min drive" },
        { name: "Delhi Public School & Campus", category: "education", icon: "🏫", dist: "2.2 km", time: "7 min drive" },
        { name: "Fortis City Care Hospital", category: "healthcare", icon: "🏥", dist: "1.9 km", time: "6 min drive" },
        { name: "Apollo Diagnostic Care", category: "healthcare", icon: "💊", dist: "0.6 km", time: "7 min walk" },
        { name: "Grand Central Galleria Mall", category: "shopping", icon: "🛍️", dist: "1.5 km", time: "5 min drive" },
        { name: "Fresh Mart Hypermarket", category: "shopping", icon: "🛒", dist: "0.5 km", time: "6 min walk" },
        { name: "Artisan Roastery & Bakery", category: "dining", icon: "☕", dist: "0.6 km", time: "7 min walk" }
      ];
    }
  },

  /**
   * Filters and renders nearby landmarks.
   * @param {string} category
   */
  renderNeighborhood(category = "all") {
    const grid = document.getElementById("nearbyPlacesGrid");
    if (!grid) return;

    const places = this.getNeighborhoodData();
    const filtered = category === "all" ? places : places.filter(p => p.category === category);

    if (filtered.length === 0) {
      grid.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-muted); font-size: 0.9rem;">No nearby landmarks recorded for this category.</p>`;
      return;
    }

    grid.innerHTML = filtered.map(p => `
      <div class="nearby-place-item">
        <div class="nearby-place-main">
          <div class="nearby-icon-wrap">${p.icon}</div>
          <div>
            <div class="nearby-place-name">${p.name}</div>
            <div class="nearby-place-cat">${p.category}</div>
          </div>
        </div>
        <div class="nearby-place-badge">
          <div class="nearby-dist">${p.dist}</div>
          <span class="nearby-time">${p.time}</span>
        </div>
      </div>
    `).join("");
  },

  /**
   * Category pill click handler.
   */
  filterNearby(category) {
    document.querySelectorAll(".nearby-pill").forEach(btn => {
      if (btn.getAttribute("data-cat") === category) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
    this.renderNeighborhood(category);
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
   * Opens the tour booking modal with prefilled data.
   */
  openTourModal() {
    const titleEl = document.getElementById("tourModalPropTitle");
    if (titleEl) titleEl.textContent = this.property.title;

    // Set minimum date to tomorrow
    const dateInput = document.getElementById("tourDateInput");
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.min = tomorrow.toISOString().split("T")[0];
      if (!dateInput.value) {
        dateInput.value = tomorrow.toISOString().split("T")[0];
      }
    }

    // Prefill user details if logged in
    const user = StorageManager.getCurrentUser();
    if (user) {
      const nameInput = document.getElementById("tourClientName");
      const emailInput = document.getElementById("tourClientEmail");
      const phoneInput = document.getElementById("tourClientPhone");
      if (nameInput) nameInput.value = user.fullName || "";
      if (emailInput) emailInput.value = user.email || "";
      if (phoneInput && user.phone) phoneInput.value = user.phone || "";
    }

    App.openModal("tourModal");
  },

  /**
   * Handles tour booking submission.
   */
  handleTourSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const tourData = {
      propertyId: this.property.id,
      propertyTitle: this.property.title,
      propertyPrice: this.property.price,
      propertyImage: this.property.images && this.property.images[0] ? this.property.images[0] : "",
      clientName: formData.get("clientName"),
      clientEmail: formData.get("clientEmail"),
      clientPhone: formData.get("clientPhone"),
      tourType: formData.get("tourType"),
      tourDate: formData.get("tourDate"),
      timeSlot: formData.get("timeSlot"),
      notes: formData.get("notes")
    };

    StorageManager.addTour(tourData);
    App.closeModal("tourModal");
    form.reset();
    App.showToast("Site Tour scheduled! The listing agent will confirm your appointment shortly.", "success", 5000);
  },

  /**
   * Opens the interactive share modal with QR code and prefilled social links.
   */
  openShareModal() {
    if (!this.property) return;
    const p = this.property;
    const shareUrl = window.location.href;
    const shareText = `Explore ${p.title} (${p.city}) on EstateHub:`;

    const titleEl = document.getElementById("shareModalPropTitle");
    const locEl = document.getElementById("shareModalPropLocation");
    const priceEl = document.getElementById("shareModalPropPrice");
    const thumbEl = document.getElementById("shareModalPropThumb");
    const urlInput = document.getElementById("shareModalUrlInput");
    const qrImg = document.getElementById("shareModalQrImg");

    if (titleEl) titleEl.textContent = p.title;
    if (locEl) locEl.textContent = `${p.address}, ${p.city}`;
    if (priceEl) priceEl.innerHTML = App.formatPrice(p.price, p.listingType);
    if (thumbEl) thumbEl.src = (p.images && p.images[0]) || App.getFallbackImage();
    if (urlInput) urlInput.value = shareUrl;

    if (qrImg) {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}`;
    }

    const waBtn = document.getElementById("shareWhatsAppBtn");
    const twBtn = document.getElementById("shareTwitterBtn");
    const liBtn = document.getElementById("shareLinkedInBtn");
    const fbBtn = document.getElementById("shareFacebookBtn");
    const emBtn = document.getElementById("shareEmailBtn");
    const nativeBtn = document.getElementById("shareNativeBtn");

    if (waBtn) waBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
    if (twBtn) twBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    if (liBtn) liBtn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    if (fbBtn) fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    if (emBtn) emBtn.href = `mailto:?subject=${encodeURIComponent("Property Listing: " + p.title)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`;

    if (nativeBtn) {
      if (navigator.share) {
        nativeBtn.style.display = "inline-flex";
        nativeBtn.onclick = () => {
          navigator.share({
            title: p.title,
            text: shareText,
            url: shareUrl,
          }).catch(() => {});
        };
      } else {
        nativeBtn.style.display = "none";
      }
    }

    App.openModal("shareModal");
  },

  /**
   * Copies current listing URL to clipboard with UI feedback.
   */
  copyShareUrl() {
    const urlInput = document.getElementById("shareModalUrlInput");
    const copyBtn = document.getElementById("copyShareUrlBtn");
    if (!urlInput) return;

    const onSuccess = () => {
      if (copyBtn) {
        const origContent = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Copied!
        `;
        setTimeout(() => {
          copyBtn.innerHTML = origContent;
        }, 2200);
      }
      App.showToast("Listing URL copied to clipboard!", "success");
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(urlInput.value).then(onSuccess).catch(() => {
        urlInput.select();
        document.execCommand("copy");
        onSuccess();
      });
    } else {
      urlInput.select();
      document.execCommand("copy");
      onSuccess();
    }
  },

  /**
   * Downloads the generated listing QR Code image.
   */
  downloadQrCode() {
    const qrImg = document.getElementById("shareModalQrImg");
    if (!qrImg || !qrImg.src) return;
    const a = document.createElement("a");
    a.href = qrImg.src;
    a.download = `EstateHub-QR-${this.property ? this.property.id : "listing"}.png`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },

  /**
   * Initializes and renders customer reviews for this property.
   */
  initReviews() {
    this.renderReviews();

    // Prefill user details if logged in
    const user = StorageManager.getCurrentUser();
    if (user) {
      const nameInput = document.getElementById("reviewAuthor");
      const emailInput = document.getElementById("reviewEmail");
      if (nameInput) nameInput.value = user.fullName || "";
      if (emailInput) emailInput.value = user.email || "";
    }

    // Listen to review updates
    window.addEventListener("reviewsUpdated", (e) => {
      if (e.detail && e.detail.propertyId === String(this.property.id)) {
        this.renderReviews();
      }
    });
  },

  /**
   * Renders reviews list and calculated average star rating.
   */
  renderReviews() {
    const listContainer = document.getElementById("reviewsList");
    const summaryContainer = document.getElementById("reviewsSummary");
    if (!listContainer) return;

    const reviews = StorageManager.getReviews(this.property.id);

    if (reviews.length === 0) {
      if (summaryContainer) {
        summaryContainer.innerHTML = `No reviews yet. Be the first to share your thoughts!`;
      }
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border);">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🌟</div>
          <p style="margin: 0; font-size: 0.95rem;">No reviews submitted yet for this property.</p>
          <small>Visited or toured this home? Click "Write a Review" above to help future buyers!</small>
        </div>
      `;
      return;
    }

    // Calculate average rating
    const avgRating = (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1);
    const starString = "★".repeat(Math.round(avgRating)) + "☆".repeat(5 - Math.round(avgRating));

    if (summaryContainer) {
      summaryContainer.innerHTML = `
        <span style="color: var(--accent-gold); font-size: 1.05rem; font-weight: 700;">${starString}</span>
        <strong style="color: var(--text-main); margin-left: 0.35rem;">${avgRating} / 5.0</strong>
        <span>(${reviews.length} ${reviews.length === 1 ? 'verified review' : 'verified reviews'})</span>
      `;
    }

    listContainer.innerHTML = reviews.map(r => {
      const ratingStars = "★".repeat(r.rating || 5) + "☆".repeat(5 - (r.rating || 5));
      const formattedDate = new Date(r.createdAt || Date.now()).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });

      return `
        <div class="review-item" style="padding: 1.15rem 0; border-bottom: 1px solid var(--border);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.4rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--brand-light, #eff6ff); color: var(--brand); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem;">
                  ${r.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong style="font-size: 0.95rem; color: var(--text-main);">${r.author}</strong>
                  <span style="font-size: 0.75rem; background: var(--bg-alt); padding: 0.15rem 0.4rem; border-radius: 4px; margin-left: 0.35rem; color: var(--success); font-weight: 600;">✓ Verified</span>
                </div>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="color: var(--accent-gold); font-size: 0.95rem;">${ratingStars}</div>
              <small style="color: var(--text-muted); font-size: 0.78rem;">${formattedDate}</small>
            </div>
          </div>
          <h5 style="margin: 0.5rem 0 0.25rem; font-size: 0.95rem; font-weight: 700; color: var(--text-main);">${r.title || ""}</h5>
          <p style="margin: 0; font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">${r.comment}</p>
        </div>
      `;
    }).join("");
  },

  /**
   * Toggles review submission form visibility.
   */
  toggleReviewForm() {
    const form = document.getElementById("propertyReviewForm");
    const btn = document.getElementById("toggleReviewFormBtn");
    if (!form) return;

    if (form.style.display === "none" || !form.style.display) {
      form.style.display = "block";
      if (btn) btn.innerHTML = `&times; Cancel`;
    } else {
      form.style.display = "none";
      if (btn) btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        Write a Review
      `;
    }
  },

  /**
   * Updates interactive star rating selector.
   */
  setRating(rating) {
    const selectedRatingInput = document.getElementById("selectedRating");
    const starRatingText = document.getElementById("starRatingText");
    if (selectedRatingInput) selectedRatingInput.value = rating;

    const labels = {
      1: "1.0 - Poor",
      2: "2.0 - Fair",
      3: "3.0 - Good",
      4: "4.0 - Very Good",
      5: "5.0 - Excellent"
    };
    if (starRatingText) starRatingText.textContent = labels[rating] || `${rating}.0`;

    const buttons = document.querySelectorAll(".star-pick-btn");
    buttons.forEach(btn => {
      const btnRating = Number(btn.getAttribute("data-rating"));
      if (btnRating <= rating) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  },

  /**
   * Handles review submission.
   */
  handleReviewSubmit(e) {
    e.preventDefault();
    const author = document.getElementById("reviewAuthor").value;
    const email = document.getElementById("reviewEmail").value;
    const title = document.getElementById("reviewTitle").value;
    const comment = document.getElementById("reviewComment").value;
    const rating = document.getElementById("selectedRating").value || 5;

    if (!author || !email || !comment) {
      App.showToast("Please fill in all required fields.", "warning");
      return;
    }

    StorageManager.addReview(this.property.id, {
      author,
      email,
      title,
      comment,
      rating: Number(rating)
    });

    App.showToast("Thank you! Your verified review has been published.", "success", 4500);

    // Reset form and close
    const form = document.getElementById("propertyReviewForm");
    if (form) form.reset();
    this.setRating(5);
    this.toggleReviewForm();
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
  },

  /**
   * Renders recently viewed properties section excluding the current property.
   */
  renderRecentlyViewed() {
    App.renderRecentlyViewedGrid("recentlyViewedGrid", "recentlyViewedSection", this.property.id);
  },

  /**
   * Updates Price Alert buttons state (header and sidebar) based on subscription.
   */
  updatePriceAlertBtnState() {
    if (!this.property) return;
    const isSubscribed = StorageManager.hasPriceAlert(this.property.id);
    const headerBtn = document.getElementById("openPriceAlertBtn");
    const headerLabel = document.getElementById("priceAlertBtnLabel");
    const sidebarLabel = document.getElementById("sidebarPriceAlertLabel");
    const sidebarBtn = document.getElementById("sidebarPriceAlertBtn");

    if (isSubscribed) {
      if (headerBtn) {
        headerBtn.classList.add("active");
        headerBtn.style.color = "var(--success)";
        headerBtn.style.borderColor = "var(--success)";
      }
      if (headerLabel) headerLabel.textContent = "Alert Active ✓";
      if (sidebarLabel) sidebarLabel.textContent = "Price Alert Active ✓";
      if (sidebarBtn) {
        sidebarBtn.style.borderColor = "var(--success)";
        sidebarBtn.style.color = "var(--success)";
      }
    } else {
      if (headerBtn) {
        headerBtn.classList.remove("active");
        headerBtn.style.color = "";
        headerBtn.style.borderColor = "";
      }
      if (headerLabel) headerLabel.textContent = "Price Alert";
      if (sidebarLabel) sidebarLabel.textContent = "Track Price Drop";
      if (sidebarBtn) {
        sidebarBtn.style.borderColor = "";
        sidebarBtn.style.color = "";
      }
    }
  },

  /**
   * Opens Price Alert Modal and sets up initial values.
   */
  openPriceAlertModal() {
    if (!this.property) return;
    const titleEl = document.getElementById("priceAlertModalPropTitle");
    const priceEl = document.getElementById("priceAlertModalPropPrice");
    if (titleEl) titleEl.textContent = this.property.title;
    if (priceEl) priceEl.innerHTML = App.formatPrice(this.property.price, this.property.listingType);

    const user = Auth.getUser();
    if (user) {
      const emailInput = document.getElementById("priceAlertEmail");
      const phoneInput = document.getElementById("priceAlertPhone");
      if (emailInput && !emailInput.value) emailInput.value = user.email || "";
      if (phoneInput && !phoneInput.value && user.phone) phoneInput.value = user.phone;
    }

    this.updateAlertTargetCalc();
    App.openModal("priceAlertModal");
  },

  /**
   * Recalculates dynamic target price trigger summary in modal.
   */
  updateAlertTargetCalc() {
    if (!this.property) return;
    const form = document.getElementById("priceAlertForm");
    if (!form) return;

    const thresholdInput = form.querySelector("input[name='threshold']:checked");
    const threshold = thresholdInput ? thresholdInput.value : "any";
    const customWrap = document.getElementById("customTargetPriceWrap");
    const summaryEl = document.getElementById("priceAlertTargetSummary");
    const currentPrice = this.property.price;

    if (threshold === "custom") {
      if (customWrap) customWrap.style.display = "block";
      const customVal = Number(document.getElementById("customTargetPriceInput")?.value) || 0;
      if (summaryEl) {
        summaryEl.textContent = customVal > 0 ? `Alert when price drops below ${App.formatPrice(customVal, this.property.listingType)}` : "Please enter your desired target price";
      }
    } else {
      if (customWrap) customWrap.style.display = "none";
      if (threshold === "5") {
        const target = Math.round(currentPrice * 0.95);
        if (summaryEl) summaryEl.textContent = `Alert when price drops by 5% (below ${App.formatPrice(target, this.property.listingType)})`;
      } else if (threshold === "10") {
        const target = Math.round(currentPrice * 0.9);
        if (summaryEl) summaryEl.textContent = `Alert when price drops by 10% (below ${App.formatPrice(target, this.property.listingType)})`;
      } else {
        if (summaryEl) summaryEl.textContent = `Any reduction below ${App.formatPrice(currentPrice, this.property.listingType)}`;
      }
    }
  },

  /**
   * Handles price drop alert subscription form submission.
   */
  handlePriceAlertSubmit(e) {
    e.preventDefault();
    if (!this.property) return;
    const form = e.target;
    const formData = new FormData(form);

    const threshold = formData.get("threshold");
    let thresholdLabel = "Any Price Cut";
    let targetPrice = this.property.price;

    if (threshold === "5") {
      thresholdLabel = "5% Price Drop";
      targetPrice = Math.round(this.property.price * 0.95);
    } else if (threshold === "10") {
      thresholdLabel = "10% Price Drop";
      targetPrice = Math.round(this.property.price * 0.90);
    } else if (threshold === "custom") {
      const customVal = Number(document.getElementById("customTargetPriceInput")?.value) || 0;
      if (customVal <= 0 || customVal >= this.property.price) {
        App.showToast("Target price must be lower than the current asking price.", "warning");
        return;
      }
      thresholdLabel = "Target " + App.formatPrice(customVal, this.property.listingType);
      targetPrice = customVal;
    }

    const alertData = {
      propertyId: this.property.id,
      propertyTitle: this.property.title,
      propertyPrice: this.property.price,
      propertyImage: (this.property.images && this.property.images[0]) || "",
      propertyCity: this.property.city || "",
      userEmail: formData.get("userEmail"),
      userPhone: formData.get("userPhone") || "",
      threshold: threshold,
      thresholdLabel: thresholdLabel,
      targetPrice: targetPrice,
      notificationMethod: formData.get("notificationMethod") || "email_whatsapp"
    };

    StorageManager.addPriceAlert(alertData);
    App.closeModal("priceAlertModal");
    this.updatePriceAlertBtnState();
    App.showToast("Price Drop Alert activated! You'll be notified automatically on market reductions.", "success", 4500);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("propertyDetailsContainer")) {
    PropertyDetailsController.init();
  }
});
