

# Memories - MERN Stack Project 🌟

**Memories** is a dynamic journaling application built with the MERN stack (MongoDB, Express, React, Node.js). This platform allows users to log their daily experiences, express their thoughts, and capture memories in multiple formats, including multimedia.

---

## Features

- **User Authentication**
  - Secure JWT-based login and signup with email verification using Nodemailer.
  
- **Daily Journals**
  - Write and save your daily thoughts and activities.
  
- **Multimedia Support**
  - Upload and attach photos, videos, or other media files to your journal entries.
  - Manage media efficiently with Cloudinary integration.
  
- **Video Recording**
  - Record videos directly within the app for a personalized touch.
  
- **Responsive Design**
  - Fully responsive interface optimized for devices of all sizes.

---

## Tech Stack

### Frontend
- **ReactJS**: For building the user interface.
- **Vite**: For a fast development environment.
- **Tailwind CSS**: For a sleek and modern UI.

### Backend
- **Node.js**: To handle server-side logic.
- **Express.js**: To set up RESTful APIs and routing.

### Database
- **MongoDB**: For storing user data and journal entries.

### Authentication
- **JWT**: Secure authentication mechanism with expiring tokens.

### Cloud Services
- **Cloudinary**: For media management (upload, thumbnails, and cleanup).

---

## Installation and Setup

Follow these steps to set up the project on your local machine:

### 1. Clone the repository

```bash
git clone https://github.com/Joel-Johny/Memories.git
cd Memories
```

### 2. Install dependencies

- Backend:
  ```bash
  cd backend
  npm install
  ```
- Frontend:
  ```bash
  cd frontend
  npm install
  ```

### 3. Add Environment Variables

Create `.env` files in the respective directories:

#### Backend (`backend/.env`)
```env
PORT=<your-port>
VERCEL=<your-vercel-url>
CLIENT_URL=<frontend-url>
MONGO_URI=<your-mongodb-uri>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
JWT_SECRET=<your-jwt-secret>
EMAIL_SERVICE=<email-service>
EMAIL_HOST=<email-host>
EMAIL_PORT=<email-port>
EMAIL_USER=<email-user>
EMAIL_PASSWORD=<email-password>
```

#### Frontend (`frontend/.env`)
```env
VITE_BACKEND_URL=<backend-url>
```

### 4. Start the development servers

- Backend:
  ```bash
  npm run dev
  ```
- Frontend:
  ```bash
  npm run dev
  ```

---

## Folder Structure

```
Memories/
  ├── backend/
  │   ├── node_modules/
  │   ├── src/
  │   │   ├── controllers/
  │   │   ├── routes/
  │   │   ├── models/
  │   │   └── uploads/
  │   ├── .env
  │   ├── package.json
  │   ├── package-lock.json
  │   └── vercel.json
  ├── frontend/
  │   ├── dist/
  │   ├── node_modules/
  │   ├── public/
  │   ├── src/
  │   │   ├── components/
  │   │   ├── pages/
  │   │   └── App.js
  │   ├── .env
  │   ├── package.json
  │   ├── package-lock.json
  │   ├── tailwind.config.js
  │   ├── postcss.config.js
  │   ├── vite.config.js
  │   └── vercel.json
  ├── .gitignore
  ├── README.md
  └── LICENSE
```

---

## Contact

For any inquiries or support, feel free to reach out:

- **Email**: joelj088m@gmail.com
- **GitHub**: [Joel-Johny](https://github.com/Joel-Johny)

---

Happy Journaling! ✨
