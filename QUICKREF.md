# 🎯 Natours MVP Quick Reference

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Update config.env with your MongoDB credentials

# 3. Seed database with sample data
npm run seed

# 4. Start server
npm start

# 5. Open browser
# - Tours: https://adventureplan.onrender.com/overview.html
# - Login: https://adventureplan.onrender.com/login.html
# - Signup: https://adventureplan.onrender.com/signup.html
```

---

## 📋 What's Included in MVP

### ✅ Backend (Node.js + Express)
- RESTful API for tours and users
- JWT authentication
- Protected routes (create/update/delete tours require login)
- Error handling middleware
- Database validation

### ✅ Frontend (HTML + CSS + JavaScript)
- Overview page displaying all tours dynamically
- Tour detail page with full information
- Login page with authentication
- Signup page for new users
- Responsive CSS styling
- JWT token management
- API integration

### ✅ Database (MongoDB)
- Tour model with full schema
- User model with password hashing
- Pre-built sample data
- Validation rules

### ✅ Security Features
- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- CORS enabled
- Input validation

---

## 🔑 Demo Accounts

```
Email: john@example.com
Password: password123

Email: jane@example.com
Password: password123
```

---

## 🛣️ Website Routes

| URL | Type | Auth Required |
|-----|------|---------------|
| `/overview.html` | Public | No |
| `/tour.html?id=TOUR_ID` | Public | No |
| `/login.html` | Public | No |
| `/signup.html` | Public | No |

---

## 🔗 API Routes

| Method | Endpoint | Auth Required |
|--------|----------|---------------|
| GET | `/api/v1/tours` | No |
| GET | `/api/v1/tours/:id` | No |
| POST | `/api/v1/tours` | Yes |
| PATCH | `/api/v1/tours/:id` | Yes |
| DELETE | `/api/v1/tours/:id` | Yes |
| POST | `/api/v1/users/signup` | No |
| POST | `/api/v1/users/login` | No |
| GET | `/api/v1/users` | No |

---

## 📁 Key Files Modified/Created

### New Files:
- `public/index.js` - Frontend API logic
- `public/login.html` - Login page
- `public/signup.html` - Signup page
- `middleware/authMiddleware.js` - JWT verification
- `seed.js` - Database seeding script
- `SETUP.md` - Detailed setup guide
- `QUICKREF.md` - This file

### Modified Files:
- `app.js` - Added CORS support
- `package.json` - Added seed scripts
- `public/overview.html` - Added script, dynamic content
- `public/tour.html` - Added script, dynamic content
- `public/css/style.css` - Added new styles
- `controllers/userController.js` - Implemented all methods
- `routes/tourRoutes.js` - Added authentication

---

## 🧪 Test the Application

### 1. View Tours (No login needed)
```
GET https://adventureplan.onrender.com/api/v1/tours
```

### 2. Create Account
```
POST https://adventureplan.onrender.com/api/v1/users/signup
{
  "name": "Your Name",
  "email": "you@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

### 3. Login
```
POST https://adventureplan.onrender.com/api/v1/users/login
{
  "email": "you@example.com",
  "password": "password123"
}
```
Copy the returned token

### 4. Create Tour (Protected)
```
POST https://adventureplan.onrender.com/api/v1/tours
Authorization: Bearer YOUR_TOKEN
{
  "name": "My Awesome Tour",
  "duration": 7,
  "maxGroupSize": 30,
  "difficulty": "medium",
  "price": 1500,
  "summary": "An amazing tour experience",
  "imageCover": "tour-1-cover.jpg"
}
```

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Database connection error | Check config.env MongoDB credentials |
| Port 3000 already in use | `lsof -ti:3000 \| xargs kill -9` or `PORT=5000 npm start` |
| Tours not displaying | Run `npm run seed` to populate database |
| Login not working | Ensure JWT_SECRET is set in config.env |
| CORS errors | Already enabled in app.js |

---

## 📚 Read These First

1. **[SETUP.md](./SETUP.md)** - Comprehensive setup guide
2. **[README.md](./README.md)** - Project overview
3. **[package.json](./package.json)** - Dependencies and scripts

---

## 🚀 Ready to Go!

```bash
npm install && npm run seed && npm start
```

Then open your browser to: **https://adventureplan.onrender.com/overview.html**

Enjoy! 🎉
