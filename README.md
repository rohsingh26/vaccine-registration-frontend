# 🛡️ Vaccine Registration System

A professional full-stack application built for managing vaccination slots during a 30-day drive (November 2024). This project features a dual-portal system for Users and Administrators with real-time slot management and data filtering.

## 🚀 Live Deployment
* **Frontend:** 
* **Backend API:** [https://runo-assignment-vaccine-registration.onrender.com/api](https://runo-assignment-vaccine-registration.onrender.com/api)

---

## ✨ Key Features

### **User Portal**
- **Authentication:** Secure Login/Signup with JWT stored in local storage.
- **Dynamic Dashboard:** Real-time view of vaccination status (None, First Dose, or Fully Vaccinated).
- **Slot Booking:** - Users can book Dose 1 or Dose 2.
  - Automatic logic prevents booking Dose 2 if Dose 1 is not yet completed.
- **Rescheduling:** Ability to edit or cancel existing appointments.

### **Admin Portal**
- **Stats Overview:** Daily breakdown of total bookings, Dose 1 counts, and Dose 2 counts for any date in November.
- **User Management:** Advanced filtering of the user database based on:
  - Age Range (Min/Max)
  - Pincode
  - Vaccination Status

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), React Router v6, Axios, Day.js |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose) |
| **Authentication** | JSON Web Tokens (JWT), BcryptJS |
| **Deployment** | Render (Backend), Vercel (Frontend) |

---

## 📊 High-Level Architecture



The application utilizes **Axios Interceptors** to automatically attach JWT tokens to every request, ensuring a seamless and secure communication flow between the client and the protected API routes.

