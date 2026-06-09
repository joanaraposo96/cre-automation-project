# Books CRUD Backend and Frontend Automation Project


This project contains automated tests of both backend (API) and frontend (UI) of a Library Management System. The test suite was built using JavaScript, Playwright, and Faker.js for dynamic test data generation.


## 🚀 Tech Stack 
- JavaScript (Node.js)
- Playwright – End-to-end and API testing
- Faker.js – Fake data generation


## 📦 Setup & Installation
1. **Clone the repository**  
```bash
git clone https://github.com/joanaraposo96/books-crud-backend-and-frontend-automation-project.git
cd books-crud-backend-and-frontend-automation-project
```

2. **Initialize Node.js project**
```
npm init -y
```

3. **Install Playwright**
```bash
npm install -D @playwright/test
npx playwright install
```

4. **Install Faker.js**
```
npm install @faker-js/faker
```

## ▶️ Running tests (UI mode)
```
npx playwright test --ui
```

## 📁 Project Structure
```
📦 cre-automation-project
├── 📂 backend
│   ├── 🧪 authentication.spec.js
│   ├── 🧪 books.spec.js
│   ├── 🧪 favourites.spec.js
│   ├── 🧪 purchases.spec.js
│   ├── 🧪 renting.spec.js
│   ├── 🧪 statistics.spec.js
│   └── 🧪 users.spec.js
│
├── 📂 frontend
│   ├── 📂 components
│   │   └── 📄 Header.js
│   │
│   └── 📂 pom
│       ├── 📄 AdminPurchases.js
│       ├── 📄 Approvals.js
│       ├── 📄 Books.js
│       ├── 📄 BooksAvailableForPurchase.js
│       ├── 📄 Dashboard.js
│       ├── 📄 DetailsPage.js
│       ├── 📄 Favourites.js
│       ├── 📄 Login.js
│       ├── 📄 PurchaseHistory.js
│       ├── 📄 Register.js
│       ├── 📄 Rents.js
│       ├── 📄 Users.js
│       └── 📄 UsersNonAdmin.js
│
├── 🧪 books.spec.js
├── 🧪 dashboard.spec.js
├── 🧪 favourites.spec.js
├── 🧪 logout.spec.js
├── 🧪 purchases.spec.js
├── 🧪 registration-and-login.spec.js
├── 🧪 renting.spec.js
├── 🧪 routing-and-navigation.spec.js
├── 🧪 users.spec.js
│
├── 📂 helpers
│   ├── 📂 backed
│   │   ├── 🔧 addBook.js
│   │   ├── 🔧 addPurchase.js
│   │   ├── 🔧 addRenting.js
│   │   ├── 🔧 addToFavourites.js
│   │   ├── 🔧 approvePurchase.js
│   │   ├── 🔧 deleteBooks.js
│   │   ├── 🔧 deleteUser.js
│   │   ├── 🔧 listAllBooks.js
│   │   ├── 🔧 listAllPurchases.js
│   │   ├── 🔧 listAvailableBooks.js
│   │   ├── 🔧 listSpecificBook.js
│   │   ├── 🔧 listSpecificUserBookPurchases.js
│   │   ├── 🔧 listSpecificUserBookRentals.js
│   │   ├── 🔧 listStatistics.js
│   │   ├── 🔧 listUserFavourites.js
│   │   ├── 🔧 loginUser.js
│   │   ├── 🔧 registerUser.js
│   │   ├── 🔧 removeFromFavourites.js
│   │   ├── 🔧 updateBook.js
│   │   └── 🔧 updateUser.js
│   │
│   └── 📂 frontend
│       └── 🔧 menuItems.js
│
├── 📂 test-data
│   ├── 📂 backend
│   │   ├── 🎲 books.js
│   │   └── 🎲 users.js
│   │
│   └── 📂 frontend
│       └── 🎲 users.js
|
└── 🖥️ server.js
```

## 🧪 Test Coverage
⚙️ **Backend (API)**
- Authentication & User Registration
- Books (CRUD)
- Favorites Feature
- Rentals
- Purchases
- Statistics
- Users 

🖥️ **Frontend (UI)**
- Authentication Flow
- Route Protection & Navigation
- Dashboard Validation
- Book Management
- Favorites System
- Rentals
- Purchases
- User Administration
- Logout

## 🏆 Credits

This backend automation project is based on the original API system built by **Bruno Figueiredo** 👉 [CRUD Livros Expandido](https://github.com/brunonf15/crud-livros-expandido).
