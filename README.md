# Baat Cheet — WhatsApp-like Mobile Application

A minimal, secure, real-time chat application built with React Native (Expo) and Node.js.

## Features
- **Real-time Messaging**: Instant message delivery using Socket.io.
- **1-on-1 & Group Chats**: Private conversations and group discussions.
- **Image Sharing**: Upload and send images via Cloudinary.
- **Friend System**: Search for users and add them to your friend list.
- **Secure Auth**: JWT-based authentication with encrypted passwords (bcrypt).
- **Modern UI**: WhatsApp-inspired design with smooth navigation.

---

## Tech Stack
- **Frontend**: React Native (Expo), React Navigation, Socket.io-client, Axios, Gifted Chat (logic).
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io.
- **Storage**: Cloudinary (Images), Expo Secure Store (Tokens).

---

## Prerequisites
- Node.js (v16+)
- MongoDB (Atlas or local)
- Cloudinary Account
- Expo Go app on your phone (for testing)

---

## Setup Instructions

### 1. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Run the server:
```bash
npm start
```

### 2. Frontend Setup
```bash
cd mobile
npm install
```
**Important**: Update the `API_URL` and `SOCKET_URL` in:
- `mobile/context/AuthContext.js`
- `mobile/context/SocketContext.js`
Use your machine's **LAN IP** (e.g., `http://192.168.1.10:5000`) instead of `localhost` if testing on a physical device.

Run the app:
```bash
npx expo start
```
Scan the QR code with the Expo Go app.

---

## Testing with Postman
1. **Register**: `POST /api/auth/register` with `{username, email, password}`.
2. **Login**: `POST /api/auth/login` with `{email, password}`.
3. **Get Profile**: `GET /api/users/profile` with Bearer Token.
4. **Search**: `GET /api/users/search?search=test`.
5. **Create Chat**: `POST /api/chats` with `{userId}`.
