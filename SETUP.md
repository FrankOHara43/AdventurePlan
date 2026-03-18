# Natours - MVP Setup Guide

## Overview
This is a complete Node.js + Express + MongoDB tour booking application with authentication. The MVP includes:
- Backend REST API with user authentication (JWT)
- Frontend HTML/CSS/JavaScript interface
- Dynamic tour display
- User signup/login functionality
- Protected routes

---

## Prerequisites

Make sure you have installed:
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local or Atlas cloud)

---

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

---

### 2. Configure Environment Variables

Edit `config.env` and update the following:

```dotenv
NODE_ENV=development
PORT=3000
PASSWORD=123456
DATABASE_PASSWORD=your_mongodb_password
DATABASE=mongodb+srv://username:<PASSWORD>@cluster.mongodb.net/natours?appName=Cluster0
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=90d
```

**Important:** 
- Replace `DATABASE_PASSWORD` with your MongoDB password
- Replace `DATABASE` with your MongoDB connection string
- Update `JWT_SECRET` with a strong secret key

---

### 3. Seed Database with Sample Data

Run the seed script to populate the database with tours and users:

```bash
npm run seed
```

This will create:
- Sample tours
- Demo users (john@example.com, jane@example.com - password: password123)

---

### 4. Start the Server

```bash
npm start
```

The server will start on `https://adventureplan.onrender.com`

You should see:
```
App running on port 3000
DB connection successful!!
CONNECTED TO DB → natours
```

---

## Using the Application

### 1. **View Tours**
- Open browser and go to `https://adventureplan.onrender.com/overview.html`
- See all available tours displayed dynamically

### 2. **Sign Up**
- Click login/signup in navigation or go to `https://adventureplan.onrender.com/signup.html`
- Create new account with name, email, and password
- You'll be logged in automatically and redirected to overview

### 3. **Log In**
- Go to `https://adventureplan.onrender.com/login.html`
- Use credentials:
  - Email: `john@example.com` or `jane@example.com`
  - Password: `password123`
  - OR use any account you created via signup

### 4. **View Tour Details**
- Click on any tour card to view full details
- See pricing, duration, difficulty, ratings, start dates

### 5. **Log Out**
- Click logout button in navigation

---

## Project Structure

```
natours/
├── public/               # Frontend files
│   ├── overview.html     # Tours listing page
│   ├── tour.html         # Tour details page
│   ├── login.html        # Login page
│   ├── signup.html       # Signup page
│   ├── index.js          # Frontend API logic
│   └── css/
│       └── style.css     # All styles
├── controllers/          # API logic
│   ├── tourController.js
│   ├── userController.js
│   ├── authController.js
│   └── errorController.js
├── models/               # Database schemas
│   ├── tourModel.js
│   └── userModel.js
├── routes/               # API endpoints
│   ├── tourRoutes.js
│   └── userRoutes.js
├── middleware/           # Custom middleware
│   └── authMiddleware.js # JWT verification
├── utils/                # Helper functions
│   ├── apiFeatures.js
│   ├── appError.js
│   └── catchAsync.js
├── dev-data/             # Data files
│   └── data/
│       └── tours.json    # Tour data
├── app.js                # Express app configuration
├── server.js             # Server startup
├── seed.js               # Database seeding script
└── config.env            # Environment variables
```

---

## API Endpoints

### Tours
- `GET /api/v1/tours` - Get all tours
- `GET /api/v1/tours/:id` - Get single tour
- `POST /api/v1/tours` - Create tour (requires auth)
- `PATCH /api/v1/tours/:id` - Update tour (requires auth)
- `DELETE /api/v1/tours/:id` - Delete tour (requires auth)
- `GET /api/v1/tours/top-5-cheap` - Get top 5 cheapest tours
- `GET /api/v1/tours/tour-stats` - Get tour statistics
- `GET /api/v1/tours/monthly-plan/:year` - Get monthly plan

### Users
- `POST /api/v1/users/signup` - Create account
- `POST /api/v1/users/login` - Login 
- `GET /api/v1/users` - Get all users

---

## Troubleshooting

### Issue: "DB CONNECTION ERROR"
**Solution:** 
- Check your MongoDB connection string in `config.env`
- Ensure MongoDB is running
- Verify database password is correct

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port:
PORT=5000 npm start
```

### Issue: Tours not displaying
**Solution:**
- Run `npm run seed` to populate database
- Check browser console for API errors
- Ensure server is running

### Issue: Login/Signup not working
**Solution:**
- Check server logs for errors
- Ensure JWT_SECRET is set in config.env
- Test API with Postman: `POST /api/v1/users/login`

### Issue: CORS errors in console
**Solution:**
- Already handled in app.js
- Check if server is running on correct port

---

## Testing with Postman

1. **Test API without auth:**
```
GET https://adventureplan.onrender.com/api/v1/tours
```

2. **Signup:**
```
POST https://adventureplan.onrender.com/api/v1/users/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

3. **Login:**
```
POST https://adventureplan.onrender.com/api/v1/users/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

4. **Access protected route:**
```
POST https://adventureplan.onrender.com/api/v1/tours
Authorization: Bearer <token_from_login>
Content-Type: application/json

{
  "name": "Test Tour",
  "duration": 5,
  "maxGroupSize": 25,
  "difficulty": "easy",
  "price": 997,
  "summary": "Test tour summary",
  "imageCover": "tour-1-cover.jpg"
}
```

---

## Reset Database

To delete all data and start fresh:

```bash
npm run seed:delete
```

Then re-seed with:
```bash
npm run seed
```

---

## Next Steps / Future Enhancements

- [ ] Add image upload functionality
- [ ] Implement tour reviews and ratings
- [ ] Add booking/reservation system
- [ ] Email verification on signup
- [ ] Password reset functionality
- [ ] User profile management
- [ ] Payment integration (Stripe)
- [ ] Admin dashboard
- [ ] Search and filtering
- [ ] Map integration
- [ ] Real-time notifications

---

## Common Credentials for Testing

**Demo User 1:**
- Email: john@example.com
- Password: password123

**Demo User 2:**
- Email: jane@example.com  
- Password: password123

---

## Support

If you encounter any issues:
1. Check that all environment variables are set correctly
2. Ensure MongoDB is connected
3. Review server console logs for error messages
4. Check browser console for frontend errors
5. Verify all dependencies are installed (`npm install`)

---

## License

ISC
