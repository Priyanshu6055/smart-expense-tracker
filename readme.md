setup:
  frontend:
    steps:
      - Navigate to the frontend folder:
          command: cd smart-expense-tracker/client
      - Install dependencies:
          command: npm install
      - Start the frontend server:
          command: npm run start

  backend:
    steps:
      - Navigate to the backend folder:
          command: cd smart-expense-tracker/server
      - Install dependencies:
          command: npm install
      - Create a `.env` file with the following content:
          env:
            PORT: 5000
            JWT_SECRET: yourStrongSecretKey
            MONGO_URI: mongodb://localhost:27017/expenseTracker
      - Start the backend server:
          command: npm run dev
