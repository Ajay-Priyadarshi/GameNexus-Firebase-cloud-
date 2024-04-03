# GameNexus Social Media Application

Welcome to GameNexus, a social media application designed to connect users, share content, and engage in a vibrant community.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [Directory Structure](#directory-structure)
- [Technologies Used](#technologies-used)

## Overview

GameNexus is a social media platform where users can create profiles, share posts, connect with others, and explore a variety of features. The application is built using [Express](https://expressjs.com/) for the backend, [MongoDB](https://www.mongodb.com/) as the database, and [EJS](https://ejs.co/) for rendering views.

## Features

- User authentication and authorization
- Profile management
- Post creation and interaction (likes, comments)
- Search functionality
- Analytics for user, post, and sales
- Real-time chat
- Events and notifications

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/GameNexus.git

2. Change to the project directory:
   ```bash
   cd GameNexus
3. Install dependencies:
   ```bash
   npm install

### Configuration
1. Create a .env file in the root directory:
   ```bash
   # MongoDB connection string:
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database
   
   # Session secret:
   SESSION_SECRET=your-session-secret

   # Server port
   PORT=3001
2. Create folder uploads inside that:
   - Create folder posts
   - Create folder profileImages.
3. Start the application:
   ```bash
   npm start
The application will be accessible at http://localhost:3001.

## Usage
- Visit http://localhost:3001 to access the application.
- Create an account, set up your profile, and start exploring the features.

## Directory Structure
- src: Source code for the application
   - controllers: Controller Functions
   - routes: Express route definitions
   - models: MongoDB data models
- views: EJS views
- static: Static files (CSS, client-side JavaScript)
- uploads: Directory for user-uploaded files
- assets: all static assets
- templates: templates for generating reports

## Technologies Used
- Node.js
- Express
- MongoDB
- EJS
- Multer
- Moment-Timezone
- Puppeteer
- Bcrypt
