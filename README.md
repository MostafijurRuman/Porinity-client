# Porinity Matrimony Platform

Welcome to **Porinity** – a modern, secure, and feature-rich matrimony platform built with the MERN stack (MongoDB, Express, React, Node.js). Porinity is designed to help users find meaningful connections and life partners in a seamless, intuitive environment.

---

## 🚀 Live Site
[https://porinity.web.app](https://porinity.web.app)

---

## 👤 Admin Login Details
- **Email:** admin@porinity.com
- **Password:** Admin1234

## 👤 Demo User Login Details
- **Email:** DemoUser@porinity.com
- **Password:** User1234

---

## 🌟 Key Features

- 🔒 **Authentication & Authorization**: Secure login, registration, Google sign-in, JWT-based private routes, and role-based dashboards for users and admins.
- 📱 **Fully Responsive Design**: Optimized for mobile, tablet, and desktop. Dashboard and all pages adapt beautifully to any device.
- 🏠 **Dynamic Homepage**: Eye-catching banner/slider, six premium member cards (sortable by age), "How It Works" section, live success counters, and real marriage success stories.
- 🗂️ **Advanced Biodata Management**: Filter, search, and paginate biodatas by age, type, and division. View, edit, and publish biodata with auto-generated IDs.
- 🔐 **Private & Premium Access**: Biodata details and contact info are private. Premium members see contact info instantly; others can request via secure Stripe checkout.
- ⭐ **Favorites & Requests**: Add biodatas to favorites, request contact info, and track all requests in your dashboard.
- 🛡️ **Admin Dashboard**: Manage users, approve premium requests, approve contact requests, view analytics (pie chart), and moderate success stories.
- 📈 **Analytics & Revenue**: Real-time stats for total biodata, gender breakdown, premium count, and revenue from contact requests.
- 📝 **Success Stories**: Users can submit their marriage stories; admin reviews and publishes them to the homepage.
- 🌐 **Environment Security**: All sensitive keys (Firebase, MongoDB) are hidden using environment variables.
- 💬 **Modern UX**: Sweet alerts/toasts for all CRUD/auth actions, no browser alerts, and no Lorem Ipsum anywhere.

---

## 📋 How to Run Locally

1. **Clone the repo:**
	```bash
	git clone https://github.com/MostafijurRuman/Porinity-client.git
	```
2. **Install dependencies:**
	```bash
	cd Porinity-client
	npm install
	```
3. **Set up environment variables:**
	- Create a `.env` file in both client and server directories.
	- Add your Firebase config and MongoDB credentials as per `.env.example`.
4. **Start the development server:**
	```bash
	npm run dev
	```
5. **Access the app:**
	- Client: [http://localhost:5173](http://localhost:5173)
	- Server: [http://localhost:5000](http://localhost:5000)

---

## 📑 Notable Commits
- **Client:** 20+ meaningful commits
- **Server:** 12+ meaningful commits

---

## 🏆 Project Highlights

- No Daisy UI or Lorem Ipsum used anywhere.
- All CRUD/auth actions use sweet alerts/toasts (never browser alerts).
- TanStack Query powers all GET data fetching for blazing-fast UX.
- After reload, private routes persist login (no forced logout).
- All forms and tables are custom-designed (no copy-paste from previous work).
- Stripe integration for secure payments.
- Admin and user dashboards are fully responsive and role-aware.
- Pagination implemented for biodata listings.
- JWT securely stored and used for all private API calls.
- Clean, modern, and industry-standard codebase and UI/UX.

---

## 💡 Explore More
- React Select, Ant Design, Material UI, and TanStack Query Pagination explored.
- Axios interceptor for secure API calls.
- Data always loads on first page reload.

---

> **Porinity** is your trusted partner in finding meaningful connections. Built with care, security, and modern web standards.

---

© 2025 Porinity. All rights reserved.


