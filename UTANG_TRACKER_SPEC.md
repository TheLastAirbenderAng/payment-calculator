# Utang Tracker — Project Specification

## Overview

Build a personal debt/bill-splitting tracker web app. Users can log expenses where someone paid on their behalf, track what they owe, and maintain a history of all transactions.

**This is a personal tracking app** — users only see their own data, no shared/collaborative features between users.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React (JSX) + Vite |
| Styling | Tailwind CSS + shadcn/ui components |
| Routing | React Router |
| Auth | Firebase Authentication (Email/Password + Google Sign-in) |
| Database | Cloud Firestore |
| Hosting | GitHub Pages (static) |
| PWA | Yes — service worker + manifest for installability |

### Firebase Configuration

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDRFCEcrxi6zuxGZfK725yx4Nn_LRS9PO8",
  authDomain: "payment-calculator-577d1.firebaseapp.com",
  projectId: "payment-calculator-577d1",
  storageBucket: "payment-calculator-577d1.firebasestorage.app",
  messagingSenderId: "230239579090",
  appId: "1:230239579090:web:8c89afd8cf93870c18f60b",
  measurementId: "G-Z5QT43MBBX"
};
```

### Important Notes

- A `global.css` file with Tailwind/shadcn theme configuration from tweakcn already exists in the project folder — **use it as-is**
- Mobile-first responsive design, but ensure desktop/laptop views are fully polished
- Use shadcn/ui components wherever applicable (Button, Input, Dialog, Card, etc.)

---

## Pages & Routes

| Route | Page | Auth Required |
|-------|------|---------------|
| `/login` | Login / Sign Up | No |
| `/` | Main Calculator | Yes |
| `/history` | Entry List | Yes |
| `/history/:id` | Entry Detail | Yes |

Protected routes should redirect to `/login` if user is not authenticated.
After successful login, redirect to `/` (main calculator).

---

## Page Specifications

### 1. Login Page (`/login`)

**Features:**
- Email/password sign up (create account)
- Email/password sign in
- Google sign-in button
- Toggle between "Sign In" and "Create Account" modes
- Form validation with error messages
- Loading states during authentication

**UI Notes:**
- Centered card layout
- App logo/title at top
- Clean, minimal design

---

### 2. Main Calculator Page (`/`)

This is the core feature of the app.

**Header:**
- App title/logo
- User menu (profile icon) with logout option
- Link to History page

**Form Fields:**

| Field | Type | Description |
|-------|------|-------------|
| Situation | Text input | What this expense is for (e.g., "Dinner @ Jollibee", "Movie tickets for Avengers") |
| Payer Name | Text input | Name of the person who paid for everything |
| Pending Debt | Number input | Any existing debt to this payer. **Can be negative** (if payer owes the user instead) |
| Currency | Toggle/Select | PHP (default) or USD. Display conversion rate when USD is selected |

**Items Section:**

A dynamic list where users add what they personally owe from the bill.

Each item row:
- Item name (text input) — e.g., "Lumpia", "Iced Coffee"
- Price (number input)
- Quantity/Units (number input + optional unit label like "pcs", "orders")
- Delete button (trash icon)

Below the items:
- "Add Item" button to append a new row
- Running subtotal of all items displayed

**Additional Charges Section:**

- Toggle switch to enable/disable
- When enabled, show:
  - Service charge (number input)
  - Delivery fee (number input)
  - Number of people splitting these charges (number input)
- User's share = (service charge + delivery fee) / number of people

**Calculate Button:**

Large, prominent button at the bottom. When clicked:
- Validate all required fields
- Open a **modal** with the breakdown

**Calculation Breakdown Modal:**

Display:
- Situation and Payer name (header)
- List of items with individual totals
- Items subtotal
- Additional charges (if any) with user's share calculation
- Pending debt adjustment (+ or -)
- **Final Total** (prominently displayed)
- Currency indicator

Modal actions:
- "Cancel" button — closes modal, returns to form
- "Save to History" button — saves entry to Firestore, shows success feedback, optionally resets form

---

### 3. History Page (`/history`)

**Header:**
- Page title "History"
- Back button to main calculator

**Entry List:**
- Scrollable list of all saved entries
- Each entry card shows:
  - Date (formatted nicely)
  - Situation text
  - Payer name
  - Final amount owed
  - Currency
- Sorted by date, newest first
- Click/tap on entry navigates to `/history/:id`

**Empty State:**
- Friendly message when no entries exist
- Prompt to create first entry

**Loading State:**
- Skeleton loaders while fetching

---

### 4. Entry Detail Page (`/history/:id`)

**Header:**
- Back button to history list
- Date of entry
- (Optional) Delete entry button

**Content:**
Full breakdown identical to the calculation modal:
- Situation
- Payer name
- All items with quantities and prices
- Items subtotal
- Additional charges breakdown (if any)
- Pending debt
- Final total

**Not Found State:**
- Handle invalid IDs gracefully

---

## User Flows

### Flow 1: New User Registration

1. User opens app → lands on `/login`
2. User clicks "Create Account"
3. User enters email and password
4. User clicks "Sign Up"
5. Account created → redirect to `/` (main calculator)

### Flow 2: Returning User Login

1. User opens app → lands on `/login`
2. User enters email and password (or clicks Google sign-in)
3. User clicks "Sign In"
4. Authenticated → redirect to `/`

### Flow 3: Creating a New Entry

1. User is on main calculator (`/`)
2. User fills in situation: "Dinner @ Samgyupsal"
3. User fills in payer: "Juan"
4. User enters pending debt: 150 (they owed Juan 150 from before)
5. User selects currency: PHP
6. User adds items:
   - "Pork Belly Set" — ₱450 × 1
   - "Rice" — ₱50 × 2
   - "Iced Tea" — ₱65 × 1
7. User toggles on additional charges:
   - Service charge: ₱200
   - Delivery fee: ₱0
   - Split among: 4 people
8. User clicks "Calculate"
9. Modal appears with breakdown:
   - Items: ₱450 + ₱100 + ₱65 = ₱615
   - Charges: ₱200 / 4 = ₱50
   - Pending: +₱150
   - **Total: ₱815**
10. User clicks "Save to History"
11. Entry saved, modal closes, success toast shown
12. Form resets (or stays filled — your choice)

### Flow 4: Viewing History

1. User clicks "History" link from main page
2. User sees list of all past entries
3. User scrolls through entries
4. User taps on "Dinner @ Samgyupsal" entry
5. User sees full detail page with complete breakdown
6. User clicks back to return to list

### Flow 5: Logging Out

1. User clicks profile/user icon in header
2. User clicks "Logout"
3. User is signed out → redirect to `/login`

### Flow 6: Returning Authenticated User

1. User opens app (already logged in from previous session)
2. Firebase persists auth state
3. User lands directly on `/` (main calculator)

### Flow 7: Using USD Currency

1. User selects "USD" from currency toggle
2. Conversion rate displayed (fetch from API or use static rate)
3. All inputs are in USD
4. Saved entry stores currency type
5. History shows amounts in original currency used

---

## Data Model (Firestore)

### Collection: `users/{userId}/entries`

Each document represents one saved entry:

```javascript
{
  id: "auto-generated",
  createdAt: Timestamp,
  situation: "Dinner @ Samgyupsal",
  payerName: "Juan",
  pendingDebt: 150,
  currency: "PHP", // or "USD"
  items: [
    { name: "Pork Belly Set", price: 450, quantity: 1 },
    { name: "Rice", price: 50, quantity: 2 },
    { name: "Iced Tea", price: 65, quantity: 1 }
  ],
  hasAdditionalCharges: true,
  additionalCharges: {
    serviceCharge: 200,
    deliveryFee: 0,
    splitAmong: 4
  },
  calculatedTotal: 815
}
```

---

## UI/UX Requirements

- **Mobile-first**: Design for phones first, then enhance for larger screens
- **Responsive**: Must look great on desktop/laptop as well
- **Touch-friendly**: Adequate tap targets, easy form inputs on mobile
- **Loading states**: Show spinners/skeletons during async operations
- **Error handling**: User-friendly error messages for auth failures, network issues
- **Form validation**: Inline validation, disable submit until valid
- **Accessibility**: Proper labels, focus states, semantic HTML
- **PWA**: 
  - Add manifest.json with app name, icons, theme color
  - Register service worker for offline capability
  - App should be installable to home screen

---

## Additional Notes

- Keep the UI clean and minimal — avoid clutter
- Use shadcn/ui Dialog for the calculation breakdown modal
- Use shadcn/ui Sheet for mobile navigation if needed
- Toast notifications for success/error feedback (shadcn/ui Sonner or Toast)
- For currency conversion, either:
  - Use a free API like exchangerate-api.com, OR
  - Use a static rate (e.g., 1 USD = 56 PHP) with a note that it's approximate

---

## File Structure Suggestion

```
src/
├── components/
│   ├── ui/              # shadcn components
│   ├── layout/          # Header, Navigation
│   ├── calculator/      # Calculator form components
│   └── history/         # History list/detail components
├── pages/
│   ├── Login.jsx
│   ├── Calculator.jsx
│   ├── History.jsx
│   └── HistoryDetail.jsx
├── hooks/
│   └── useAuth.js       # Auth state hook
├── lib/
│   ├── firebase.js      # Firebase init
│   └── utils.js         # Helper functions
├── App.jsx
├── main.jsx
└── global.css           # Already exists — from tweakcn
```

---

## Deployment

Configure Vite for GitHub Pages deployment:

```javascript
// vite.config.js
export default defineConfig({
  base: '/repo-name/', // Replace with actual repo name
  // ... other config
})
```

Build command: `npm run build`
Output: `dist/` folder contents go to `gh-pages` branch

---

## Summary

Build a personal utang (debt) tracking app where users can:
1. Log in with email or Google
2. Calculate how much they owe someone after splitting a bill
3. Factor in existing debts, individual items, and shared charges
4. Save calculations to history
5. Review past entries anytime

Keep it simple, clean, and mobile-friendly.
