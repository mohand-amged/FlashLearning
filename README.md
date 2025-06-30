# ⚡ FlashLearning API

A smart flashcard-based learning API built with **Node.js**, **Express**, **MongoDB**, and **Swagger** for seamless documentation. FlashLearning helps users learn faster and remember more through organized decks and smart card repetition.

![GitHub Repo](https://img.shields.io/github/repo-size/mohand-amged/FlashLearning?style=flat-square)
![Issues](https://img.shields.io/github/issues/mohand-amged/FlashLearning?style=flat-square)
![Forks](https://img.shields.io/github/forks/mohand-amged/FlashLearning?style=flat-square)
![Stars](https://img.shields.io/github/stars/mohand-amged/FlashLearning?style=flat-square)

---

## 🚀 Features

- 🔐 **User Authentication** (JWT)
- 📚 **Deck & Card Management**
- 📈 **Learning Progress Tracking**
- 🧠 **Spaced Repetition Ready**
- 🛠️ **RESTful API** built with Express
- 📄 **Auto-generated Swagger Docs**

---

## 📦 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JSON Web Token (JWT)
- **Documentation**: Swagger (OpenAPI)

---

## 📄 API Documentation

The full Swagger docs are available after running the project:

➡️ [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

![Dashboard]([images/Screenshot 2025-06-30 035306.png](https://github.com/mohand-amged/FlashLearning/blob/main/images/Screenshot%202025-06-30%20035306.png))
---

## 🔧 Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/mohand-amged/FlashLearning.git
cd FlashLearning

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Fill your own MongoDB URI, JWT secret, etc.

# 4. Start the server
npm run dev
