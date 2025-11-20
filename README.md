
---

## 📌 BACKEND — `README.md`

```md
# 🏢 Tenant Management Backend (Node.js + Express)

This is the **backend API** for the Tenant Conduct / Tenant Management System.  
It manages authentication, tenant storage, and ensures each property owner can only access their own tenant data.

---

## 🚀 Features

### 🔐 Authentication
- Login endpoint returns **JWT token**.
- Protected routes require token for access.
- Token contains owner ID which is used to scope all tenant queries.

### 🧾 Tenant Management (CRUD)
| Action | Endpoint | Method |
|--------|----------|--------|
| Get all tenants for owner | `/tenants` | GET |
| Add tenant | `/tenants` | POST |
| Update tenant | `/tenants/:id` | PUT |
| Delete tenant | `/tenants/:id` | DELETE |

### 🔍 Filtering
Example:
Only returns tenants belonging to the authenticated owner.

### 👤 User Isolation (Security)
```js
const ownerId = req.user.id;
Tenant.find({ owner: ownerId });
🛠️ Tech Stack

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

bcrypt password hashing