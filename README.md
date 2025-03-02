Here’s the updated `README.md` file for your **Globetrotter Challenge** project, now including **MongoDB** integration and ensuring all relevant details are covered:

---

# 🌍 Globetrotter Challenge

**Globetrotter Challenge** is a fun and interactive geography quiz game where users can challenge their friends to beat their scores. The project is built using **Next.js**, **TypeScript**, **Tailwind CSS**, and **MongoDB** for data storage.

---

## Features

- **Dynamic Game Segments**: Games are divided into segments, each containing a set of quizzes.
- **Challenge Friends**: Share your game results with friends via a unique URL.
- **User Authentication**: Secure login and registration using **NextAuth.js**.
- **Score Tracking**: Store and retrieve user scores from **MongoDB**.
- **Responsive Design**: Built with Tailwind CSS for a seamless experience across devices.
- **API Integration**: Fetches quizzes dynamically from an API endpoint.

---

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: NextAuth.js
- **Deployment**: Vercel (recommended)

---

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/naveen42266/globetrotter-nextjs.git
   cd globetrotter-challenge
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory and add the following variables:

   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/globetrotter?retryWrites=true&w=majority
   NEXT_PUBLIC_GEMINI_API_KEY=<key>

   ```
   <!-- NEXTAUTH_URL=http://localhost:3000 -->
   <!-- NEXTAUTH_SECRET=your_nextauth_secret -->

   Replace `<username>`, `<password>`, and `Key` with your actual MongoDB credentials and a secret key for NextAuth.

4. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser:**

   Visit `http://localhost:3000` to view the application.

---

## Project Structure

```
src/
├── components/            # Reusable components (e.g., ShareButton, GameComponent)
├── pages/                 # Next.js pages
│   ├── api/               # API routes
│   ├── [username]/        # Dynamic route for user challenges
│   │   ├── index.tsx      # Default page for a user
│   │   └── [gameId]/      # Dynamic route for game segments
│   │       └── index.tsx  # Page for a specific game segment
├── types/                 # TypeScript types and interfaces
├── styles/                # Global styles (if any)
└── public/                # Static assets (e.g., images, favicon)
```

---

## MongoDB Integration

The project uses **MongoDB** to store user data, quizzes, and scores. Here’s how it’s integrated:

### Database Schema

1. **Users Collection**:
   - `username`: Unique username for the user.
   - `email`: User's email address.
   - `password`: Hashed password (using NextAuth.js).

2. **Quizzes Collection**:
   - `gameId`: Unique ID for the game segment.
   - `questions`: Array of questions and answers.

3. **Scores Collection**:
   - `username`: Username of the player.
   - `gameId`: ID of the game segment.
   - `score`: User's score for the game.

### Example Queries

1. **Fetch Quizzes for a Game Segment**:

   ```javascript
   const quizzes = await db.collection('quizzes').find({ gameId: gameId }).toArray();
   ```

2. **Save User Score**:

   ```javascript
   await db.collection('scores').insertOne({
     username,
     gameId,
     score,
   });
   ```

3. **Fetch User Scores**:

   ```javascript
   const scores = await db.collection('scores').find({ username }).toArray();
   ```

---

## API Endpoints

The project uses Next.js API routes to fetch quizzes and manage user data.

### Fetch Quizzes for a Game Segment

- **Endpoint**: `/api/game/[gameId]`
- **Method**: `GET`
- **Response**:

  ```json
  [
    {
      "id": 1,
      "question": "What is the capital of France?",
      "answer": "Paris"
    },
    {
      "id": 2,
      "question": "What is the capital of Germany?",
      "answer": "Berlin"
    }
  ]
  ```

### Save User Score

- **Endpoint**: `/api/scores`
- **Method**: `POST`
- **Request Body**:

  ```json
  {
    "username": "naveen",
    "gameId": "0",
    "score": 5
  }
  ```

- **Response**:

  ```json
  {
    "message": "Score saved successfully"
  }
  ```

---

## Authentication

The project uses **NextAuth.js** for user authentication. Users can register, log in, and track their scores securely.

### Example Authentication Flow

1. **Register**:
   - Users can register using their email and password.
   - Passwords are hashed before being stored in MongoDB.

2. **Login**:
   - Users can log in using their credentials.
   - Sessions are managed using NextAuth.js.

3. **Protected Routes**:
   - Certain routes (e.g., score tracking) are protected and require authentication.

---

## Deployment

   - Login the Github to Vercel Account 
   - Environment Values (.env values) 
   - Then deploy it.


<!-- ### Deploy to Vercel

1. Install the Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Deploy the project:

   ```bash
   vercel
   ```

3. Follow the prompts to complete the deployment. -->

---

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes.
4. Push your branch and open a pull request.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Built with ❤️ using Next.js, Tailwind CSS, and MongoDB.
- Inspired by geography quiz games.

---

## Contact

For questions or feedback, feel free to reach out:

- **Your Name** - [vnaveenlgp2001@gmail.com](mailto:vnaveenlgp2001@gmail.com)
- **GitHub**: [naveen42266](https://github.com/naveen42266)

---

Enjoy the **Globetrotter Challenge**! 🌎✨

---

This updated `README.md` now includes MongoDB integration and ensures all relevant details are covered. Let me know if you need further adjustments!