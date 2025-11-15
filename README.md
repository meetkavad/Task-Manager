# Task Management Application

## 📌 Overview
This is a full-stack **Task Management Application** with a **React + TypeScript** frontend and a **Node.js + Express + MongoDB** backend.  
Users can create, update, delete, search, filter, drag-and-drop, and manage tasks across multiple categories.

---

## 🚀 Live Demo
### 🔗 **Frontend (Live App)**
https://task-manager-7o5e.vercel.app/

### 🔗 **Backend API**
https://task-manager-six-orpin.vercel.app/

---

## 📁 Project Drive Folder  
Contains screenshots, demo video, and additional documentation:

https://drive.google.com/file/d/1Ow7IUCl8ynok5H7sChqyPvOjTV86Ue8q/view?usp=drive_link

---

## ✨ Features
- Create, edit, delete tasks  
- Drag & Drop between categories  
- Automatic status updates  
- High/Low priority filtering  
- Search functionality  
- Deadline selection calendar  
- Success modals  
- Fully responsive UI  

---

## 🛠️ Tech Stack

### Frontend
- React + TypeScript  
- CSS  
- react-beautiful-dnd  
- Vercel (deployment)

### Backend
- Node.js  
- Express  
- MongoDB  
- Mongoose  
- Render / Railway / etc.

---

## 📦 Installation & Local Setup

### 🔧 1. Clone the repository
```
git clone https://github.com/meetkavad/Task-Manager.git
cd Task-Manager
```

Frontend Setup

Move into the frontend folder:
```
cd frontend
```
Install dependencies:
```
npm install
```
Create .env file:
```
REACT_APP_BASE_URL=http://localhost:8080
```
Run frontend:
```
npm start
```
Frontend runs at: http://localhost:3000/

Backend Setup

Open a new terminal and go to backend folder:

```
cd backend
```
Install dependencies:
```
npm install
```

Create .env file:
```
PORT=8080
MONGO_URI=your_mongodb_uri
```

Run backend:
```
npm run dev
```

Backend runs at: http://localhost:8080/