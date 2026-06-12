# 🖥️ PC Builder E-Commerce Platform

A full-stack web application that empowers users to customize, build, and purchase their ideal personal computers. The platform features an advanced hardware compatibility engine and an intelligent AI shopping assistant to enhance the customer experience.

🚀 **Live Demo:** [https://pc-builder-red-psi.vercel.app/](https://pc-builder-red-psi.vercel.app/)

> ⚠️ **Note:** The backend API is deployed on a free Render instance. It may spin down after 15 minutes of inactivity, so **the initial load might take up to 50 seconds**. Thank you for your patience!

---

## 🔑 Test Accounts
To explore the full features without creating an account, please use the following credentials:
- **Admin Account** (Dashboard Access): `admin@gmail.com` | Password: `admin`* (When you want to go in dashboard, click on the admin Icon next to the admin's name)
- **User Account** (Checkout & Builder): `test@demo` | Password: `test`*

---

## ✨ Key Features

### 🛠️ Smart PC Builder Engine
- **Real-time Compatibility Check:** Implemented algorithms to automatically validate hardware compatibility (e.g., matching CPU sockets with Motherboards, calculating adequate PSU wattage).
- **Budget Optimization:** Recommends appropriate components based on the user's defined budget constraint.

### 🤖 AI Shopping Assistant (RAG Architecture)
- Integrated a context-aware Chatbot utilizing **Vector Embeddings** for semantic search.
- Provides technical support, answers hardware-related queries, and allows users to add recommended components directly to their cart via chat.

### 🛒 E-Commerce & Checkout
- Comprehensive cart management and detailed order history tracking.
- Dynamic Coupon system for promotional discounts.
- Integrated secure payment gateway (Stripe).

### 🔐 Security & Administration
- Robust user authentication and authorization using **JWT** and `bcryptjs`.
- Role-Based Access Control (RBAC) separating User and Admin privileges.
- **Admin Dashboard:** An intuitive interface to manage inventory (Products), Orders, Users, and Coupons.

### 🌍 Enhanced User Experience (UX)
- **Internationalization (i18n):** Multi-language support (English, Vietnamese, Japanese) via `react-i18next`.
- **Theming:** Seamless Light / Dark mode toggle using React Context API.

---

## 💻 Tech Stack

**Frontend:**
- **Framework:** React.js (Vite)
- **State Management:** Context API
- **Styling:** Pure CSS
- **Utilities:** `react-i18next` (Localization)

**Backend:**
- **Runtime & Framework:** Node.js, Express.js
- **Database:** MongoDB Atlas & Mongoose
- **Authentication:** JWT, bcryptjs
- **AI & Vector Search:** Pinecone (Vector DB), Hugging Face (Embeddings), Groq (LLM)

---
