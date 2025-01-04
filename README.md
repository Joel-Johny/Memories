# Memories - MERN Stack Project 🌟

**Memories** is a dynamic journaling application built with the MERN stack (MongoDB, Express, React, Node.js). This platform allows users to log their daily experiences, express their thoughts, and capture memories in multiple formats.

---

## Features

- **User Authentication**

  - Secure login and signup with JWT-based authentication.

- **Daily Journals**

  - Write and save your daily thoughts and activities.

- **Media Attachments**

  - Upload and attach photos or videos to your journal entries.

- **Video Recording**

  - Record videos directly within the app for a more personalized touch.

- **Responsive Design**
  - Fully responsive interface, optimized for all devices.

---

## Tech Stack

### Frontend

- **ReactJS**: Build the user interface.
- **Tailwind CSS**: Style the application for a modern look and feel.

### Backend

- **Node.js**: Handle server-side logic.
- **Express**: Set up RESTful APIs and routing.

### Database

- **MongoDB**: Store user data and journal entries.

### Authentication

- **JWT**: Secure authentication mechanism.

---

## Installation and Setup

Follow these steps to set up the project on your local machine:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/journal-hub.git
   cd journal-hub
   ```

2. **Install dependencies**:

   - For the backend:
     ```bash
     cd backend
     npm install
     ```
   - For the frontend:
     ```bash
     cd frontend
     npm install
     ```

3. **Environment Variables**:

   - Create a `.env` file in the `backend` directory with the following variables:
     ```env
     MONGO_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-jwt-secret>
     ```

4. **Start the development servers**:

   - Backend:
     ```bash
     npm run dev
     ```
   - Frontend:
     ```bash
     npm start
     ```

5. **Access the application**:
   - Open your browser and navigate to `http://localhost:3000`.

---

## Folder Structure

```
journal-hub/
  |-- backend/
  |    |-- models/
  |    |-- routes/
  |    |-- controllers/
  |    |-- server.js
  |    |-- .env
  |
  |-- frontend/
  |    |-- src/
  |         |-- components/
  |         |-- pages/
  |         |-- App.js
  |    |-- public/
  |
  |-- README.md
```

---

## Contributing

Contributions are welcome! If you find a bug or have an idea for improvement, feel free to fork the repository and submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

### Contact

For any inquiries or support, please contact:

- **Email**: your-email@example.com
- **GitHub**: [your-username](https://github.com/your-username)

---

Happy Journaling! ✨
