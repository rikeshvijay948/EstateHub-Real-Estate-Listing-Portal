/**
 * EstateHub - Properties Listing & Filter Engine
 * Handles multi-facet filtering, real-time search, sorting, URL query param synchronization, and results rendering.
 */

const PropertiesController = {
  allProperties: [],
  filteredProperties: [],
  filters: {
    query: "",
    listingType: "all",
    propertyType: "all",
    city: "all",
    minPrice: null,
    maxPrice: null,
    bedrooms: "all",
    bathrooms: "all",
    minArea: null,
    maxArea: null,
    amenities: []
  },
  sortBy: "featured",

  init() {
    this.allProperties = StorageManager.getProperties();
    this.parseUrlParams();
    this.bindEvents();
    this.syncFormControls();
    this.applyFilters();
  },

  /**
   * Reads URL query parameters on initial page load (e.g. from Hero Search).
   */
  parseUrlParams() {
    const params = new URLSearchParams(window.location.search);

    if (params.has("query")) this.filters.query = params.get("query");
    if (params.has("type")) this.filters.listingType = params.get("type");
    if (params.has("propertyType")) this.filters.propertyType = params.get("propertyType");
    if (params.has("city")) this.filters.city = params.get("city");
    if (params.has("minPrice")) this.filters.minPrice = Number(params.get("minPrice")) || null;
    if (params.has("maxPrice")) this.filters.maxPrice = Number(params.get("maxPrice")) || null;
    if (params.has("bedrooms")) this.filters.bedrooms = params.get("bedrooms");
    if (params.has("sort")) this.sortBy = params.get("sort");
  },

  /**
   * Binds UI filter and search inputs.
   */
  bindEvents() {
    // Search keyword input
    const searchInput = document.getElementById("filterSearch");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.filters.query = e.target.value.trim();
        this.applyFilters();
      });
    }

    // Listing Type Radio/Buttons
    document.querySelectorAll("input[name='listingTypeFilter']").forEach(radio => {
      radio.addEventListener("change", (e) => {
        this.filters.listingType = e.target.value;
        this.applyFilters();
      });
    });

    // City dropdown
    const citySelect = document.getElementById("filterCity");
    if (citySelect) {
      citySelect.addEventListener("change", (e) => {
        this.filters.city = e.target.value;
        this.applyFilters();
      });
    }

    // Property Type dropdown
    const propTypeSelect = document.getElementById("filterPropType");
    if (propTypeSelect) {
      propTypeSelect.addEventListener("change", (e) => {
        this.filters.propertyType = e.target.value;
        this.applyFilters();
      });
    }

    // Price inputs
    const minPriceInput = document.getElementById("filterMinPrice");
    const maxPriceInput = document.getElementById("filterMaxPrice");
    if (minPriceInput) {
      minPriceInput.addEventListener("input", (e) => {
        this.filters.minPrice = e.target.value ? Number(e.target.value) : null;
        this.applyFilters();
      });
    }
    if (maxPriceInput) {
      maxPriceInput.addEventListener("input", (e) => {
        this.filters.maxPrice = e.target.value ? Number(e.target.value) : null;
        this.applyFilters();
      });
    }

    // Bedrooms pills
    document.querySelectorAll(".bedroom-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".bedroom-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.filters.bedrooms = btn.dataset.value;
        this.applyFilters();
      });
    });

    // Area inputs
    const minAreaInput = document.getElementById("filterMinArea");
    const maxAreaInput = document.getElementById("filterMaxArea");
    if (minAreaInput) {
      minAreaInput.addEventListener("input", (e) => {
        this.filters.minArea = e.target.value ? Number(e.target.value) : null;
        this.applyFilters();
      });
    }
    if (maxAreaInput) {
      maxAreaInput.addEventListener("input", (e) => {
        this.filters.maxArea = e.target.value ? Number(e.target.value) : null;
        this.applyFilters();
      });
    }

    // Amenities Checkboxes
    document.querySelectorAll(".amenity-filter-cb").forEach(cb => {
      cb.addEventListener("change", () => {
        const checked = Array.from(document.querySelectorAll(".amenity-filter-cb:checked")).map(c => c.value);
        this.filters.amenities = checked;
        this.applyFilters();
      });
    });

    // Sorting Dropdown
    const sortSelect = document.getElementById("filterSortBy");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortBy = e.target.value;
        this.applyFilters();
      });
    }

    // Reset Filters Button
    const resetBtn = document.getElementById("resetFiltersBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.resetFilters();
      });
    }
  },

  /**
   * Synchronizes HTML form inputs with current filter state.
   */
  syncFormControls() {
    const searchInput = document.getElementById("filterSearch");
    if (searchInput && this.filters.query) searchInput.value = this.filters.query;

    const citySelect = document.getElementById("filterCity");
    if (citySelect && this.filters.city !== "all") citySelect.value = this.filters.city;

    const propTypeSelect = document.getElementById("filterPropType");
    if (propTypeSelect && this.filters.propertyType !== "all") propTypeSelect.value = this.filters.propertyType;

    const minPriceInput = document.getElementById("filterMinPrice");
    if (minPriceInput && this.filters.minPrice) minPriceInput.value = this.filters.minPrice;

    const maxPriceInput = document.getElementById("filterMaxPrice");
    if (maxPriceInput && this.filters.maxPrice) maxPriceInput.value = this.filters.maxPrice;

    const sortSelect = document.getElementById("filterSortBy");
    if (sortSelect && this.sortBy) sortSelect.value = this.sortBy;

    // Listing type radio
    const radio = document.querySelector(`input[name='listingTypeFilter'][value='${this.filters.listingType}']`);
    if (radio) radio.checked = true;

    // Bedrooms pills
    if (this.filters.bedrooms !== "all") {
      document.querySelectorAll(".bedroom-btn").forEach(b => {
        if (b.dataset.value === String(this.filters.bedrooms)) {
          b.classList.add("active");
        } else {
          b.classList.remove("active");
        }
      });
    }
  },

  /**
   * Applies all filters and sorting algorithms.
   */
  applyFilters() {
    this.allProperties = StorageManager.getProperties();

    this.filteredProperties = this.allProperties.filter(prop => {
      // 1. Keyword search (Title, Description, City, Address, Property Type)
      if (this.filters.query) {
        const q = this.filters.query.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(q);
        const matchesDesc = (prop.description || "").toLowerCase().includes(q);
        const matchesCity = prop.city.toLowerCase().includes(q);
        const matchesAddress = (prop.address || "").toLowerCase().includes(q);
        const matchesType = (prop.propertyType || "").toLowerCase().includes(q);

        if (!matchesTitle && !matchesDesc && !matchesCity && !matchesAddress && !matchesType) {
          return false;
        }
      }

      // 2. Listing Type (sale / rent)
      if (this.filters.listingType !== "all" && prop.listingType !== this.filters.listingType) {
        return false;
      }

      // 3. Property Type
      if (this.filters.propertyType !== "all" && prop.propertyType.toLowerCase() !== this.filters.propertyType.toLowerCase()) {
        return false;
      }

      // 4. City
      if (this.filters.city !== "all" && prop.city.toLowerCase() !== this.filters.city.toLowerCase()) {
        return false;
      }

      // 5. Price Min / Max
      if (this.filters.minPrice !== null && prop.price < this.filters.minPrice) {
        return false;
      }
      if (this.filters.maxPrice !== null && prop.price > this.filters.maxPrice) {
        return false;
      }

      // 6. Bedrooms
      if (this.filters.bedrooms !== "all") {
        if (this.filters.bedrooms === "4+") {
          if (prop.bedrooms < 4) return false;
        } else {
          if (Number(prop.bedrooms) !== Number(this.filters.bedrooms)) return false;
        }
      }

      // 7. Area Min / Max
      if (this.filters.minArea !== null && prop.area < this.filters.minArea) {
        return false;
      }
      if (this.filters.maxArea !== null && prop.area > this.filters.maxArea) {
        return false;
      }

      // 8. Amenities (must include all selected)
      if (this.filters.amenities.length > 0) {
        const propAmenities = (prop.amenities || []).map(a => a.toLowerCase());
        const hasAll = this.filters.amenities.every(amenity => propAmenities.includes(amenity.toLowerCase()));
        if (!hasAll) return false;
      }

      return true;
    });

    // Apply Sorting
    this.sortProperties();

    // Render output
    this.render();
    this.renderActiveFilterChips();
  },

  /**
   * Sorts filtered properties array.
   */
  sortProperties() {
    switch (this.sortBy) {
      case "price_asc":
        this.filteredProperties.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        this.filteredProperties.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        this.filteredProperties.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case "area_desc":
        this.filteredProperties.sort((a, b) => b.area - a.area);
        break;
      case "featured":
      default:
        this.filteredProperties.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
  },

  /**
   * Renders the property grid or empty state.
   */
  render() {
    const grid = document.getElementById("propertiesGrid");
    const countEl = document.getElementById("resultsCount");

    if (countEl) {
      countEl.innerHTML = `Showing <span>${this.filteredProperties.length}</span> of ${this.allProperties.length} properties`;
    }

    if (!grid) return;

    if (this.filteredProperties.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <h3 class="empty-title">No matching properties found</h3>
          <p class="empty-desc">We couldn't find any listings matching your current filter criteria. Try adjusting your search query, price range, or city.</p>
          <button class="btn btn-primary" onclick="PropertiesController.resetFilters()">
            Reset All Filters
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.filteredProperties
      .map(prop => App.createPropertyCard(prop))
      .join("");
  },

  /**
   * Renders active filter chip tags with 1-click remove.
   */
  renderActiveFilterChips() {
    const chipsContainer = document.getElementById("activeFiltersBar");
    if (!chipsContainer) return;

    const chips = [];

    if (this.filters.query) {
      chips.push({ label: `Search: "${this.filters.query}"`, key: "query" });
    }
    if (this.filters.listingType !== "all") {
      chips.push({ label: `Type: ${this.filters.listingType === 'rent' ? 'For Rent' : 'For Sale'}`, key: "listingType" });
    }
    if (this.filters.propertyType !== "all") {
      chips.push({ label: `Category: ${this.filters.propertyType}`, key: "propertyType" });
    }
    if (this.filters.city !== "all") {
      chips.push({ label: `City: ${this.filters.city}`, key: "city" });
    }
    if (this.filters.bedrooms !== "all") {
      chips.push({ label: `Beds: ${this.filters.bedrooms}`, key: "bedrooms" });
    }
    if (this.filters.minPrice !== null || this.filters.maxPrice !== null) {
      chips.push({ label: `Price Filtered`, key: "price" });
    }
    if (this.filters.amenities.length > 0) {
      this.filters.amenities.forEach(amenity => {
        chips.push({ label: amenity, key: `amenity_${amenity}`, val: amenity });
      });
    }

    if (chips.length === 0) {
      chipsContainer.innerHTML = "";
      chipsContainer.style.display = "none";
      return;
    }

    chipsContainer.style.display = "flex";
    chipsContainer.innerHTML = `
      <span style="font-size: 0.8125rem; font-weight: 700; color: var(--text-muted);">Active Filters:</span>
      ${chips.map(chip => `
        <span class="filter-tag-chip">
          ${chip.label}
          <button type="button" onclick="PropertiesController.removeFilter('${chip.key}', '${chip.val || ""}')" aria-label="Remove filter">&times;</button>
        </span>
      `).join("")}
      <button type="button" class="btn-reset-filter" onclick="PropertiesController.resetFilters()">Clear All</button>
    `;
  },

  /**
   * Removes a single active filter.
   */
  removeFilter(key, val) {
    if (key === "query") {
      this.filters.query = "";
      const el = document.getElementById("filterSearch");
      if (el) el.value = "";
    } else if (key === "listingType") {
      this.filters.listingType = "all";
      const radio = document.querySelector("input[name='listingTypeFilter'][value='all']");
      if (radio) radio.checked = true;
    } else if (key === "propertyType") {
      this.filters.propertyType = "all";
      const el = document.getElementById("filterPropType");
      if (el) el.value = "all";
    } else if (key === "city") {
      this.filters.city = "all";
      const el = document.getElementById("filterCity");
      if (el) el.value = "all";
    } else if (key === "bedrooms") {
      this.filters.bedrooms = "all";
      document.querySelectorAll(".bedroom-btn").forEach(b => {
        if (b.dataset.value === "all") b.classList.add("active");
        else b.classList.remove("active");
      });
    } else if (key === "price") {
      this.filters.minPrice = null;
      this.filters.maxPrice = null;
      const minEl = document.getElementById("filterMinPrice");
      const maxEl = document.getElementById("filterMaxPrice");
      if (minEl) minEl.value = "";
      if (maxEl) maxEl.value = "";
    } else if (key.startsWith("amenity_")) {
      this.filters.amenities = this.filters.amenities.filter(a => a !== val);
      const cb = document.querySelector(`.amenity-filter-cb[value="${val}"]`);
      if (cb) cb.checked = false;
    }

    this.applyFilters();
  },

  /**
   * Resets all filters to initial state.
   */
  resetFilters() {
    this.filters = {
      query: "",
      listingType: "all",
      propertyType: "all",
      city: "all",
      minPrice: null,
      maxPrice: null,
      bedrooms: "all",
      bathrooms: "all",
      minArea: null,
      maxArea: null,
      amenities: []
    };
    this.sortBy = "featured";

    // Reset Form Elements
    const search = document.getElementById("filterSearch");
    if (search) search.value = "";
    const city = document.getElementById("filterCity");
    if (city) city.value = "all";
    const propType = document.getElementById("filterPropType");
    if (propType) propType.value = "all";
    const minPrice = document.getElementById("filterMinPrice");
    if (minPrice) minPrice.value = "";
    const maxPrice = document.getElementById("filterMaxPrice");
    if (maxPrice) maxPrice.value = "";
    const minArea = document.getElementById("filterMinArea");
    if (minArea) minArea.value = "";
    const maxArea = document.getElementById("filterMaxArea");
    if (maxArea) maxArea.value = "";
    const sort = document.getElementById("filterSortBy");
    if (sort) sort.value = "featured";

    const allRadio = document.querySelector("input[name='listingTypeFilter'][value='all']");
    if (allRadio) allRadio.checked = true;

    document.querySelectorAll(".bedroom-btn").forEach(b => {
      if (b.dataset.value === "all") b.classList.add("active");
      else b.classList.remove("active");
    });

    document.querySelectorAll(".amenity-filter-cb").forEach(cb => {
      cb.checked = false;
    });

    // Clear URL parameters smoothly without reload
    window.history.replaceState({}, document.title, window.location.pathname);

    this.applyFilters();
    App.showToast("Filters reset to default.", "info");
  }
};

// Initialize if properties grid exists on current page
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("propertiesGrid")) {
    PropertiesController.init();
  }
});
