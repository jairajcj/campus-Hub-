# CampusHub — Digital Students Hub

A full-stack MERN application designed to streamline campus life for students.

## Features

- **Campus News** — Stay updated with the latest campus announcements and events
- **Lost & Found** — Report and find lost items across campus
- **Used Textbooks** — Buy and sell used textbooks with fellow students

## Tech Stack

- **Frontend:** React, Vite, CSS3
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Deployment:** Render

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account

### Installation

```bash
# Install all dependencies
npm run install-all

# Run development server
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
campushub/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   └── api/         # API configuration
│   └── public/
├── server/          # Express backend
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API routes
│   └── server.js    # Entry point
└── package.json     # Root scripts
```

## License

This project is part of a Full Stack Development course project.
