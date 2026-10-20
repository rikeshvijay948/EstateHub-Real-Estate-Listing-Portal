# EstateHub – Real Estate Listing Portal 🏡

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-2563eb?style=for-the-badge&logo=github)](https://rikesvijay948.github.io/EstateHub-Real-Estate-Listing-Portal/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/Vanilla%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> A modern, responsive, commercial-grade Real Estate Portal built exclusively with **pure HTML5, CSS3, and vanilla JavaScript** without any external UI frameworks or server-side dependencies. Features complete client-side database simulation via browser `localStorage`.

🌐 **Live Demo:** [https://rikesvijay948.github.io/EstateHub-Real-Estate-Listing-Portal/](https://rikesvijay948.github.io/EstateHub-Real-Estate-Listing-Portal/)

---

## ✨ Features

- **🏠 Interactive Hero Search**: Quick filter by listing type (Buy/Rent), city, property category, bedrooms, and maximum budget with direct query synchronization to the listing directory.
- **🔍 Multi-Facet Filter Engine**: Real-time filtering across keyword search, listing type, Indian cities (Mumbai, Bangalore, Hyderabad, Chennai, Pune, Goa, etc.), property type, price sliders, bedrooms (1–4+ BHK), area, and amenities.
- **📄 Dynamic Property Details**: Image gallery with interactive thumbnails and navigation controls, 8-point specifications grid, verified agent contact cards, and similar property recommendations.
- **💰 Financial Calculator**: Real-time Home Loan EMI calculator with sliders for principal, interest rate, and tenure.
- **❤️ Favorites & Wishlist**: Toggle favorites from any property card; saves instantly to `localStorage` with header counter badge synchronization and dedicated wishlist management page.
- **✍️ Full Property CRUD**: Add, edit, view, and delete property listings with automated form validation, image URL previews, and toast feedback.
- **📊 Agent & Seller Dashboard**: Interactive dashboard showcasing metrics (Total Listings, Active Listings, Inquiries, Favorites), property inventory manager, and customer inquiries inbox.
- **📬 Customer Inquiry System**: "Contact Agent" inquiry modal pre-populating property metadata, capturing buyer inquiries directly to the agent's dashboard.
- **🔐 Simulated Authentication**: Client-side session management with 1-click **Demo Agent** and **Demo Buyer** login options for instant portfolio review.
- **📱 Responsive & Accessible**: Mobile navigation drawer, fluid typography, subtle shadows, and responsive layouts across desktops, tablets, and phones.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Structure** | Semantic HTML5 |
| **Styling** | Modern CSS3 (CSS Variables, Flexbox, CSS Grid, Responsive Breakpoints, Custom Animations) |
| **Logic** | Vanilla JavaScript (ES6+ Modules, DOM API, Custom Events) |
| **Persistence** | Browser `localStorage` API |
| **Hosting** | GitHub Pages |

---

## 📂 Project Architecture

```
EstateHub/
│
├── index.html              # Landing page (Hero search, Featured, Cities, Testimonials, CTA)
├── properties.html         # Property catalog with real-time multi-filter sidebar & sorting
├── property-details.html   # Detailed property view, image gallery, EMI calculator, & inquiry modal
├── add-property.html       # Dual-mode Add/Edit property submission form
├── favorites.html          # Saved wishlist properties management
├── dashboard.html          # Seller & agent dashboard (Analytics, Inventory CRUD, Inquiries)
├── login.html              # Authentication sign-in with 1-click demo logins
├── register.html           # User registration flow
├── contact.html            # Contact advisory team, regional hubs, and interactive FAQ
│
├── css/
│   └── style.css           # Global stylesheet with design system tokens & responsive queries
│
├── js/
│   ├── data.js             # Realistic sample properties, agent profiles, and initial data
│   ├── storage.js          # LocalStorage database controller & CRUD operations
│   ├── auth.js             # Session management, simulated auth, and route protection
│   ├── app.js              # Shared UI components (Navigation, Toasts, Modals, Card Builder, Currency)
│   ├── properties.js       # Search, filter, sorting, and pagination logic
│   ├── details.js          # Gallery slider, specs, inquiry modal, and EMI calculator
│   └── dashboard.js        # Analytics metrics, inventory management, and lead tracking
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Method 1: Direct File Access
1. Clone the repository:
   ```bash
   git clone https://github.com/rikesvijay948/EstateHub-Real-Estate-Listing-Portal.git
   ```
2. Open `index.html` directly in any modern web browser.

### Method 2: Local HTTP Server
Using Python:
```bash
python -m http.server 3000
```
Then visit `http://localhost:3000` in your browser.

Using VS Code:
Right-click `index.html` and choose **"Open with Live Server"**.

---

## 💾 LocalStorage Keys

The simulated database manages state under the following keys:
- `estatehub_properties`: Catalog of all properties.
- `estatehub_users`: Registered user accounts.
- `estatehub_current_user`: Currently active user session.
- `estatehub_favorites`: Array of favorited property IDs.
- `estatehub_inquiries`: Customer messages and leads sent to agents.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
