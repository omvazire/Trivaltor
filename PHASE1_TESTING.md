# Phase 1 Verification and Testing Guide

This document outlines the modifications made during **Phase 1: Client Visible Improvements**, lists new files, and provides a comprehensive manual testing checklist to verify the updated functionality of the Tirvaltor Group Website.

---

## 1. Project Directory Changes

### A. New Configuration & Service Files
- [config.js](file:///e:/demo%20trivaltor/src/services/config.js): Contains configurable constants for investment ranges (USD and INR) and the YouTube video URL.
- [categoriesData.js](file:///e:/demo%20trivaltor/src/services/categoriesData.js): Configurable data structure with categories (Fruits, Vegetables, Spices) and localized placeholder products.
- [translations.js](file:///e:/demo%20trivaltor/src/services/translations.js): Complete dictionary of translations in English (`en`) and Marathi (`mr`) for layout, sections, buttons, and forms.

### B. New Global State & Components
- [LanguageContext.jsx](file:///e:/demo%20trivaltor/src/context/LanguageContext.jsx): Provides language detection, `localStorage` persistence, and the translation utility `t(key)`.
- [LeadPopup.jsx](file:///e:/demo%20trivaltor/src/components/LeadPopup.jsx): Trigger-controlled modal popup showing once per session (after 20 seconds of activity or immediately upon entering a category page). Outputs lead data to the browser console.
- [CategoryDetail.jsx](file:///e:/demo%20trivaltor/src/pages/CategoryDetail.jsx): Page view for `/category/:categoryId` showing banners, category descriptions, product grids, specs, and form shortcuts.

### C. Modified Code Files
- [main.jsx](file:///e:/demo%20trivaltor/src/main.jsx): Wrapped application with `<LanguageProvider>`.
- [App.jsx](file:///e:/demo%20trivaltor/src/App.jsx): Added the `/category/:categoryId` routing path.
- [Layout.jsx](file:///e:/demo%20trivaltor/src/layouts/Layout.jsx): Overhauled navbar styling, replaced theme toggle with language selector dropdown, and integrated `<LeadPopup />`.
- [index.css](file:///e:/demo%20trivaltor/src/index.css): Added custom stylesheet classes for navbar green backgrounds, language toggles, popup modals, video container aspect-ratios, stats cards, and review grids.
- [Home.jsx](file:///e:/demo%20trivaltor/src/pages/Home.jsx): Integrated category navigation cards, responsive company video, credibility achievements stats, downloads, testimonials, and address inputs on the contact form.
- [FarmerLead.jsx](file:///e:/demo%20trivaltor/src/pages/FarmerLead.jsx): Localized all fields and added State, District, City/Village, and Pincode fields.
- [BuyerLead.jsx](file:///e:/demo%20trivaltor/src/pages/BuyerLead.jsx): Localized forms, added State, District, City/Village, Pincode fields, and target budget + currency selector (INR/USD).
- [InvestorLead.jsx](file:///e:/demo%20trivaltor/src/pages/InvestorLead.jsx): Localized forms, added address inputs, currency selector (INR/USD), and dynamic bracket options loaded from `config.js`.

---

## 2. Translation Keys Map

Key translations are defined in `src/services/translations.js` and cover the following blocks:
- **Navbar/Layout Links**: `home`, `farmersPortal`, `buyersPortal`, `investorsPortal`, `adminDashboard`, `inquireButton`, `switchLanguage`.
- **Forms & Addresses**: `state`, `district`, `cityVillage`, `pincode`, `formName`, `formEmail`, `phoneNo`, `formSubject`, `formMessage`, `financialCurrency`, `targetBudget`.
- **Portal Headers**: `farmerHeader`, `buyerHeader`, `investorHeader`, `farmerSub`, `buyerSub`, `investorSub`.
- **Sections**: `corePrinciples`, `operationalScope`, `categoriesTitle`, `videoTag`, `credibilityTag`, `reviewsTag`, `getInTouch`.

---

## 3. Manual Testing Checklist

Follow this checklist to test and verify the implemented features:

### Step 1: Verification of Navbar and Style Contrast
- [ ] Open the site. Confirm the navbar background is **Dark Forest Green** (`#0c2d1c`).
- [ ] Check the Tirvaltor text logo (`TRIVALTOR`). Confirm it is rendered in golden color with strong legibility and high contrast.
- [ ] Confirm hover lines and active link underlines render in gold.

### Step 2: Language Toggle Operations
- [ ] Locate the language toggle dropdown in the top header.
- [ ] Click the toggle button. Confirm it shows **English** and **मराठी**.
- [ ] Select **मराठी**. Confirm the entire page layout translates instantly (Pillars, Divisions, Hero, Footer, form labels).
- [ ] Reload the browser. Verify the language setting remains in **Marathi** (persists using `localStorage`).
- [ ] Toggle back to **English**.

### Step 3: Product Category Exploration
- [ ] Scroll down the homepage to the **Product Categories** section.
- [ ] Verify there are three category cards: **Fruits**, **Vegetables**, and **Spices**.
- [ ] Click the **Explore Products** button on the **Fruits** category.
- [ ] Verify it navigates you to `/category/fruits`. Confirm that:
  - The banner displays the Fruits image.
  - The category title and description are localized.
  - Three mock fruit product cards are visible (Mango, Pomegranate, Banana).
  - Detailed specs (Origin, Purity, Moisture, Packaging) are displayed.
- [ ] Click the **Inquire as Buyer** button on a fruit card. Verify it redirects you to the Buyer Portal with the product field pre-filled.

### Step 4: Lead Capture Popup Triggers
- [ ] Open the site in a new browser incognito window (or clear `sessionStorage` key `trivaltor-lead-popup-shown`).
- [ ] **Test Case 1 (20s Timer)**: Stay on the homepage. Do not click anything. Wait 20 seconds. Confirm the popup appears.
- [ ] **Test Case 2 (Immediate Category Trigger)**: Clear session storage, refresh, and immediately click "Explore Products" on Spices. Verify the popup appears **instantly** without waiting 20 seconds.
- [ ] Fill out the popup fields (Name, Phone, Email) and click **Continue**.
  - [ ] Open browser developer tools (F12) -> Console. Confirm a structured log starting with `[Lead Capture Popup Submission] SUCCESS` is printed with the submitted details.
  - [ ] Verify the popup closes.
  - [ ] Navigate to other pages. Confirm the popup **never triggers again** in this session.

### Step 5: Importer / Buyer Currency and Address Selector
- [ ] Go to the **Buyers Portal** `/buyer`.
- [ ] Confirm the address fields are present: **State**, **District**, **City / Village**, and **Pincode**.
- [ ] Locate the **Target Budget** field and its **Select Currency** option.
- [ ] Select **USD ($)**. Verify the currency symbol prefix shows `$`.
- [ ] Switch to **INR (₹)**. Verify the prefix dynamically changes to `₹`.

### Step 6: Investor Currency Selector and Dynamic Brackets
- [ ] Go to the **Investors Portal** `/investor`.
- [ ] Confirm the address fields are present: **State**, **District**, **City / Village**, and **Pincode**.
- [ ] Locate the **Estimated Investment Amount** select list and the **Select Currency** dropdown.
- [ ] Select **USD ($)**. Open the investment brackets. Verify they show values in USD (`$50,000 - $100,000`, etc.).
- [ ] Switch to **INR (₹)**. Open the investment brackets. Verify they dynamically update to INR values (`₹40 Lakhs - ₹80 Lakhs`, etc.) loaded from the configuration file.

### Step 7: Verification of Media and Mock Sections on Homepage
- [ ] Scroll down to the **Company Video Section**. Confirm the YouTube video is embedded and loads.
- [ ] Scroll to the **Credibility Section**. Verify statistics cards, company description overview, and the prospectus/sales reports download buttons exist. Click a download button; verify a popup alert simulates the download.
- [ ] Scroll to the **Reviews Section**. Confirm three testimonials are displayed showing name, review text, and star icons.

---

## 4. Known Limitations & Phase 2 Outlook

- **No Permanent Backend Databases**: Submitted leads (Popup Leads, Form Enquiries) are simulated and output to the console logs or context states. MongoDB Atlas storage collections will be implemented in Phase 2.
- **No Analytics Dashboard**: Analytics data, visitor sessions, and CSV exports are scheduled for Phase 2.
- **No Secured Admin Control**: The Admin Panel is currently running in local Demo mode and will be protected with JWT authentication and bcrypt password hashing in Phase 2.
