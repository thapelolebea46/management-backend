Absolutely! I’ve rewritten your README to be **professional, structured, and step-by-step**, showing **how you developed the project, the logic behind each step, and the technologies used**. This makes it suitable for GitHub or portfolio use.

---

# 🏢 Tenant Management Backend (Node.js + Express)

This is the **backend API** for a **Tenant Conduct / Tenant Management System**.
It is designed to **help property owners manage tenants efficiently**, including tracking tenant information, complaints, room occupancy, and tenant history.
The system ensures **secure access to tenant data per property owner**.

---

## 🎯 Project Goal

The main goal was to **build a practical, secure backend** for a tenant management system that allows:

* Property owners to register and log in.
* Owners to manage their tenants (add, update, delete).
* Track tenant behavior through complaints.
* Monitor room occupancy and tenant stay duration.
* Ensure data isolation so owners only access their own tenants.

This backend is designed to integrate seamlessly with a frontend web or mobile app.

---

## 🛠️ Tech Stack

* **Node.js** – Backend runtime environment
* **Express.js** – API routing and server framework
* **MongoDB + Mongoose** – Database and schema modeling
* **JWT Authentication** – Secure, stateless access control
* **bcryptjs** – Password hashing for security
* **Multer + Cloudinary** – Tenant image upload management
* **CORS** – Enable frontend-backend communication

---

## 📝 Step-by-Step Development Process

### **Step 1: Project Setup**

* Initialized Node.js project with `npm init`.
* Installed required dependencies: `express`, `mongoose`, `cors`, `dotenv`, `jsonwebtoken`, `bcryptjs`, `multer`, `cloudinary`.
* Created folder structure:

  ```
  backend/
    ├─ config/        # Database & Cloudinary config
    ├─ controllers/   # Logic for auth and tenants
    ├─ models/        # Mongoose schemas (User, Tenant)
    ├─ routes/        # API routes
    ├─ middleware/    # JWT auth middleware
    └─ server.js      # Entry point
     authServer.js
     imageServer.js
  ```

---

### **Step 2: Database Setup**

* Connected to MongoDB using **Mongoose**.
* Created `User` and `Tenant` schemas with validation:

  * `User`: username, password, firstName, lastName, address.
  * `Tenant`: firstName, lastName, roomNumber, roomPrice, nextOfKin, contact, imageUrl, complaints, `startDate`, `isActive`, linked to owner (`user`).

---

### **Step 3: Authentication**

* **User registration**:

  * Check for duplicate usernames.
  * Hash password using `bcryptjs`.
  * Save user to MongoDB.
* **User login**:

  * Validate username and password.
  * Generate JWT token with owner info for secure access.
* **Update user info**:

  * Requires old password verification.
  * Optional password update.
  * Returns new JWT token after update.

---

### **Step 4: JWT Middleware**

* Created `authMiddleware` to protect routes.
* Validates the token in `Authorization` header.
* Attaches decoded user info (`req.user`) to requests.
* Ensures only authenticated owners can access tenant data.

---

### **Step 5: Tenant Management**

* **Add Tenant**:

  * Supports image uploads via **Multer + Cloudinary**.
  * Saves tenant info including room number, price, contact, and owner.
* **Get tenants for owner**:

  * Queries tenants where `user` matches the authenticated owner.
* **Update Tenant**:

  * Updates any tenant field, including adding complaints.
* **Delete Tenant**:

  * Deletes tenant record permanently.
* **Complaint Management**:

  * Add complaints to tenant.
  * View all complaints per tenant.

---

### **Step 6: Room and Occupancy Management**

* Added fields `startDate` and `isActive` to track occupancy.
* Used `isActive` to determine if a room is currently occupied.
* Calculated tenant stay duration using `startDate`.

---

### **Step 7: Security and Data Isolation**

* JWT tokens ensure only authenticated users can access their data.
* All tenant queries are scoped to the logged-in owner:

```js
const ownerId = req.user.id;
const tenants = await Tenant.find({ user: ownerId });
```

* Prevents cross-owner data access.

---

### **Step 8: Testing**

* Tested all endpoints using **Postman**:

  * `/api/auth/register`
  * `/api/auth/login`
  * `/api/auth/update-info`
  * `/api/tenants` (CRUD)
  * `/api/tenants/add-complaint/:id`
* Verified JWT protection for all tenant routes.

---

## 🚀 Features Summary

* **Authentication**: Secure login, registration, and profile updates.
* **Tenant CRUD**: Add, view, update, delete tenants.
* **Image Upload**: Tenant photos via Cloudinary.
* **Complaints Tracking**: Monitor tenant behavior.
* **Room Management**: Track occupancy and duration.
* **Owner Data Isolation**: Each owner sees only their tenants.

---

## 📌 Future Improvements

* Add **role-based access** (admin vs owner).
* Add **pagination** for large tenant lists.
* Add **notifications** for new complaints or expiring leases.
* Integrate **frontend** (React / React Native) for a complete system.

---

