# 🧠 ExpenseIQ — Smart Collaborative Expense Tracker

ExpenseIQ and a powerful personal and group expense tracking platform that helps you manage your finances with ease. Built for individuals and teams to track, split, and settle expenses in real-time.

> **Live Demo:** Deploy to [Vercel](https://smart-expense-tracker-6055.vercel.app/) or run locally — see setup below.

---

## ✨ Features

### 📊 Smart Financial Dashboard
- **Real-time Overview** — instantly see your Total Income, Expenses, and Balance.
- **Visual Analytics** — beautiful category-based pie charts for spending insights via [Chart.js](https://www.chartjs.org/).
- **Recent Transactions** — quick access to your latest financial activity.

### 🏢 Group Expense Splitting
- **Multi-user groups** — create or join groups for trips, rent, or events.
- **Easy结算** — split bills among members with precise accuracy.
- **Settlement Tracking** — keep track of who owes what within your circle.

### 💸 UPI Payment Integration
- **Direct Payments** — generate UPI payment links/QR codes for group settlements.
- **One-tap Settlement** — settle debts quickly using your favorite UPI apps.
- **Secure Handling** — payment links are generated on-the-fly for maximum security.

### 🔒 Privacy-First Income Tracking
- **Monthly Income Manager** — log and track your monthly earnings.
- **Privacy Toggle** — hide your income amount with a single click (Eye icon) for shared screen safety.
- **Category History** — see exactly where your money comes from.

### 🔐 JWT Authentication & Security
- **Register / Login** — secure authentication with bcrypt password hashing.
- **Protected Routes** — your financial data is only accessible to you.
- **Profile Management** — update profile details, change passwords with OTP verification.

### 🎨 Premium User Experience
- **Modern Theme** — sleek Royal Blue + White aesthetic with glassmorphism effects.
- **Draggable UI** — floating action buttons that you can move anywhere on the screen.
- **Mobile Responsive** — optimized for all devices, from desktops to smartphones.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite), Tailwind CSS v4, Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Charts | Chart.js 4+ |
| Routing | React Router v7 |
| Icons | Lucide React |

---

## 📁 Project Structure

```
ExpenseIQ/
├── package.json                        # Root orchestrator
├── .env                                # Server environment variables
├── README.md
│
├── server/                             # Express backend
│   ├── config/                         # DB & Passport config
│   ├── controllers/                    # Business logic (Auth, Expense, Budget)
│   ├── middlewares/                    # JWT verification & Error handling
│   ├── models/                         # Mongoose schemas (User, Group, Transaction)
│   ├── routes/                         # API endpoints
│   ├── utils/                          # Helper functions (OTP, UPI)
│   └── server.js                       # Entry point
│
├── client/                             # React frontend (Vite)
│   ├── public/                         # Static assets (logo.webp)
│   ├── src/
│   │   ├── components/                 # Reusable UI (Navbar, Cards, Modals)
│   │   ├── pages/                      # View components (Dashboard, Profile, Groups)
│   │   ├── context/                    # Auth & Theme state
│   │   ├── services/                   # API interaction layer
│   │   ├── assets/                     # Styles & Local images
│   │   └── App.jsx                     # Core routes & Layout
```

---

## ⚙️ Environment Setup

### Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org))
- **npm** v9+
- **MongoDB** running locally or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

### 1. Clone the Repository

```bash
git clone https://github.com/Priyanshu6055/ExpenseIQ.git
cd ExpenseIQ
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 3. Create `.env` Files

Create a `.env` file in the **server** directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expenseiq
JWT_SECRET=your_super_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

## 🚀 Start Commands

### Development

```bash
# From root
# Run Server
cd server && npm start

# Run Client (in another terminal)
cd client && npm run dev
```

### All Available Scripts (Client)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

---

## 🔌 API Routes

### Auth — `/api/auth`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/register` | Create account | ❌ |
| POST | `/api/login` | Login, get JWT | ❌ |
| GET | `/api/me` | Get current user profile | ✅ |

### Expenses — `/api/expenses`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List all user expenses | ✅ |
| POST | `/` | Add new expense | ✅ |
| DELETE | `/:id` | Delete an expense | ✅ |

### Groups — `/api/groups`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List user groups | ✅ |
| POST | `/` | Create new group | ✅ |
| POST | `/:id/expense` | Add group expense | ✅ |

---

## 🚢 Production Deployment

### Build

```bash
cd client && npm run build
```

### Deploy to Render

1. Push code to GitHub.
2. Create a new **Web Service** for the backend.
3. Create a **Static Site** for the frontend (or serve from Express).
4. Set required Environment Variables.

---

**Built with ❤️ by [Priyanshu](https://github.com/Priyanshu6055)**
