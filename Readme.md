# **Design Image to Any Code (Backend)**

## **Project Overview**

The Image to Code Converter is an innovative web application designed to transform design images into corresponding HTML, CSS, and React code snippets, along with support for other programming languages. This project aims to bridge the gap between designers and developers, enabling a seamless workflow by automating the conversion process. The backend is built using **Node.js**, **Express.js**, and **MongoDB with Mongoose**, with secure authentication via JWT tokens.

---

## **Table of Contents**

1. [Objective](#objective)
2. [Technologies Used](#technologies-used)
3. [Features](#features)
4. [Installation Guidelines](#installation-guidelines)
5. [Project Structure](#project-structure)
6. [API Endpoints](#api-endpoints)
7. [Documentation](#documentation)
8. [Contributors](#contributors)

---

## **Objective**

The backend handles all the core functionalities of the Design Image to Any Code, including:

- User authentication for users.
- Upload design image and select Code type in which you want to get code.

---

## **Technologies Used**

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for building REST APIs.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM for MongoDB to model application data.
- **JWT (JSON Web Token)**: Token-based authentication for secure user sessions.
- **Bcrypt.js**: For password hashing.
- **Cloudinary**: For managing and storing uploaded files (e.g., avatar, coverImage, designImage).
- **Multer**: Middleware for handling file uploads in forms.

---

## **Features**

1. **User Authentication & Authorization**:

   - Secure registration and login for users.
   - JWT-based authentication for secure API access.

2. **Upload Image and Get Code**:

   - Upload design image and select Code type in which you want to get code.

---

## **Installation Guidelines**

### **Prerequisites**

- **Node.js** and **npm** installed.
- **MongoDB** installed locally or using MongoDB Atlas.
- **Cloudinary** account for file storage.

### **Steps to Set Up the Backend**

1. **Clone the repository**:

   ```bash
   git clone https://github.com/AliHasnM/design-image-to-any-code.git
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_url
   CORS_ORIGIN=set_cors_origin (*, url, etc.)

   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=your_access_token_expiry
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=your_refresh_token_expiry

   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_apiKey
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   OPENAI_API_KEY=your-apiKey-of-chatgpt
   ```

4. **Run the MongoDB database**:

- Make sure your MongoDB server is running or configure MongoDB Atlas.

6. **Start the server**:

```bash
npm run dev
```

---

## **Project Structure**

```bash
backend-design-image-to-any-code/
│
├── public/
│   ├── temp/
│   │   ├── .gitkeep
├── src/
│   ├── controllers/
│   │   ├── code.controllers.js
│   │   ├── dashboard.controllers.js
│   │   ├── healthcheck.controllers.js
│   │   ├── user.controllers.js
│   ├── db/
│   │   ├── index.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── multer.middleware.js
│   ├── models/
│   │   ├── code.model.js
│   │   ├── user.model.js
│   ├── routes/
│   │   ├── code.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── healthcheck.routes.js
│   │   ├── user.routes.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   ├── cloudinary.js
│   │   ├── openai.js
│   ├── app.js
│   └── constant.js
│   └── index.js
│
├── .env
├── package.json
└── README.md
```

---

### **API Endpoints**

#### **User Authentication & Profile**

1. **Register and Login Routes**:

   - **User**:
     - `POST /api/v1/users/register` - Register a new user with file upload for `avatar`.
     - `POST /api/v1/users/login` - user login.
     - `POST /api/v1/users/logout` - user logout.

2. **Token and Password Management**:
   - **User**:
     - `POST /api/v1/users/refresh-token` - Refresh JWT token for user.
     - `POST /api/v1/users/change-password` - Change password for user (requires authentication).

---

#### **User Actions**

1. **Profile Management**:

   - `GET /api/v1/users/` - Get user profile.
   - `PATCH /api/v1/users/update` - Update user profile.
   - `PATCH /api/v1/users/avatar` - Update user profile with file avatar.
   - `PATCH /api/v1/users/cover-image` - Update user profile with file cover-image.
   - `GET /api/v1/users/image-history` - Get User History.

---

#### **Upload Design Image and Get Code**

- **User**:
  - `POST /api/v1/codes/` - Upload design image for code and select code type in which you want to get code (requires authentication).
  - `GET /api/v1/codes/` - Get design image code details.
  - `GET /api/v1/codes/:id` - Get details of a specific design image.
  - `DELETE /api/v1/codes/:id` - Delete a design image code (requires authentication).

---

### **Final Route Structure**

- **User Routes (`/api/v1/users/`)**

  - `POST /register` - Register user.
  - `POST /login` - Login user.
  - `POST /logout` - Logout user.
  - `POST /refresh-token` - Refresh token.
  - `POST /change-password` - Change password.
  - `GET /` - Get user profile.
  - `PATCH /update` - Update user profile.
  - `PATCH /image-history` - Check image history.
  - `PATCH /avatar` - Update user avatar.
  - `PATCH /cover-image` - Update user cover-image.

- **Design Image to Any Code (`/api/v1/codes/`)**

  - `POST /` - Upload design image and select code type.
  - `GET /` - Get all design image code details.
  - `GET /:id` - Get specific design image code details.
  - `DELETE /:id` - Delete design image code details.

---

## **Documentation**

- **API Documentation**: [\[Link to API docs\]](https://www.postman.com/api-platform/api-documentation/)
- **Backend Guide**: [\[Link to backend guide\]](https://roadmap.sh/backend)

---

## **Contributors**

- **[Ali Hassan]** – Backend Developer
