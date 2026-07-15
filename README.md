# GrabGrocery
 
A full-stack grocery delivery web app built with vanilla **HTML, CSS, JavaScript** on the frontend and **Node.js, Express, MongoDB, and JWT authentication** on the backend.
 
Customers can browse products, add them to a cart, check out with a delivery address (with optional live geolocation), and track their order status. Sellers get a dedicated dashboard to view every incoming order and update its delivery status in real time.
 
---
 
## Features
 
### Customer
- Register / Login with JWT-based authentication
- Passwords hashed with bcrypt
- Browse products (fetched live from MongoDB)
- Live product search
- Cart with quantity controls, powered by localStorage
- Checkout with delivery address form + "Use My Current Location" (browser geolocation)
- Order history with live status tracking
- Profile page showing account info and total order count
- Fully responsive design
### Seller
- Separate seller login (role-based access)
- Dashboard listing every customer order
- Customer contact + delivery address per order
- Google Maps link when geolocation was captured at checkout
- Update order status: `Pending → Confirmed → Out for Delivery → Delivered`
---
 
##  Tech Stack
 
**Frontend:** HTML5, CSS3, Vanilla JavaScript
**Backend:** Node.js, Express.js
**Database:** MongoDB (Mongoose ODM)
**Auth:** JWT + bcrypt.js
**Other:** REST API, LocalStorage (cart), Geolocation API
 
---
 
## Project Structure
 
```text
grabgrocery/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── sellerMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── seed.js
│   ├── createSeller.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── css/
│   └── style.css
├── js/
│   ├── auth.js
│   ├── script.js
│   ├── login.js
│   ├── register.js
│   ├── cart.js
│   ├── orders.js
│   ├── profile.js
│   └── seller-orders.js
├── images/
│
├── index.html
├── login.html
├── register.html
├── product.html
├── cart.html
├── orders.html
├── profile.html
├── seller-orders.html
│
└── README.md
```
 
---
 
## Installation & Setup
 
### 1. Clone the repository
```bash
git clone https://github.com/Raghavendra180/grabgrocery.git
cd grabgrocery/backend
```
 
### 2. Install dependencies
```bash
npm install
```
 
### 3. Set up environment variables
 
Create a `backend/.env` file (see `backend/.env.example` for reference):
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
 
### 4. Seed the product catalog
```bash
npm run seed
```
 
### 5. Create a seller account
```bash
npm run create-seller
```
This creates a demo seller login: `seller@grabgrocery.com / seller123`
(change this password before deploying anywhere public)
 
### 6. Start the server
```bash
npm run dev
```
 
The app runs at **http://localhost:3000** — open it in the browser (don't open the HTML files directly, since they call the backend API).
 
---
 
## Usage
 
- Register a new account → browse Products → add to cart → checkout with delivery details
- Log in as the seller account to view and manage all incoming orders from `seller-orders.html`
- Status updates made by the seller are reflected instantly on the customer's "My Orders" page
---
 
## Security Notes
 
- Passwords are hashed with bcrypt before being stored
- JWT tokens authenticate protected routes (`/profile`, `/orders`, seller routes)
- Seller-only routes are protected by a dedicated role-check middleware
- `.env` is excluded from version control via `.gitignore`
---
 
## Future Improvements
 
- Product stock/inventory tracking
- Seller product management (add/edit/delete products via UI, not just `seed.js`)
- Order confirmation via email
- Payment gateway integration
- Product categories/filtering and wishlist
- Forgot password flow
- Deployment (Render/Vercel + MongoDB Atlas)
---
 
 
## 👨‍💻 Author
 
**Botla Raghavendra**
GitHub: [https://github.com/Raghavendra180](https://github.com/Raghavendra180)
 
---

 
