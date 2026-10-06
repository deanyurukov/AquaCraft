# AquaCraft 🌿💦

*A modern irrigation system platform with DIY guides and product ordering.*

## 🚀 About AquaCraft  
AquaCraft is an irrigation system platform where users can explore, purchase, and even learn how to build their own irrigation systems.  

## 🛠️ Tech Stack  

### Frontend  
- **React** (Framework)  
- **React Router** (Client-side navigation)  
- **i18next** (Multilingual support)  
- **Vercel** (Deployment)
- **Font Awesome** (Icons)
- **EmailJS** (Email Service)
- **React Scan** (Detecting Performance Issues)

### Backend  
- **Express** (Server)  
- **Mongoose** (MongoDB ODM)  
- **bcrypt** (Password hashing)  
- **dotenv** (.env file support)  
- **jsonwebtoken** (User authentication)  
- **render.com** (Deployment)

---

## 🏗️ Setup & Installation  

### 1️⃣ Prerequisites  
Before running the project, ensure you have the following installed:  
- **[Node.js](https://nodejs.org/) (installed)** 
- **[MongoDB](https://www.mongodb.com/try/download/community) (installed and running)**  

---

### 2️⃣ Clone the Repository  
```bash
git clone https://github.com/deanyurukov/AquaCraft
```

#### Navigate to the project folder
```bash
cd AquaCraft
```

### 3️⃣ Backend Setup

Open a terminal and run the following commands to start the backend:

```bash
cd server && npm install && npm start
```

The backend is now running on `http://localhost:5001/` (Ensure MongoDB is running).

### 4️⃣ Frontend Setup

Open a new terminal window and run the following commands to start the frontend:

```bash
cd client && npm install && npm start
```

The frontend is now running on `http://localhost:3000/`.

---

### 🔒 Page Access Control

#### Public Pages
- Home
- Products
- Product Details
- Privacy Policy
- Terms and Conditions
- How To
- Project Request
- Contact Us
- Drip / Micro / Subsurface / Sprinkler Irrigation Method Guides

#### 🚪 Guest-Only Pages
- Login
- Register

#### 👤 Logged-In Users & Admin
- Cart
- Checkout
- Logout
- Profile
- Order Details

#### 🔧 Admin-Only Pages
- Create Product
- Change Stock
- Edit Products (with options to delete/edit products)
- All Orders (with option to mark order as completed)

---

### 🌎 Deployment

The project is live at: `https://www.aquacraft.ltd/`

---

### 📜 License

![License](https://img.shields.io/github/license/dean10042008/AquaCraft)
