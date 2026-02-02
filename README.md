# Playto Community Feed Prototype

A full-stack prototype of a community feed system built for the Playto Engineering Challenge.  
The application demonstrates threaded discussions, gamification mechanics, and a dynamic leaderboard with strong focus on performance and data integrity.

---

## Tech Stack

**Backend**
- Django
- Django REST Framework
- SQLite (can be switched to PostgreSQL)
- Python 3

**Frontend**
- React (Vite)
- Tailwind CSS v4
- Axios

---

## Core Features

### 1. Community Feed
- Displays posts with:
  - Author
  - Content
  - Like count
  - Creation timestamp

### 2. Threaded Comments
- Nested replies supported (Reddit-style).
- Unlimited depth.
- Built using adjacency list model.

### 3. Gamification
- 1 Post Like = **+5 Karma**
- 1 Comment Like = **+1 Karma**
- Karma stored as transaction history, not counters.

### 4. Leaderboard
- Shows **Top 5 Users**.
- Aggregated dynamically from last 24 hours only.
- No daily reset jobs required.

---

## Technical Highlights

### Concurrency Safe Likes
- Database unique constraints prevent duplicate likes.
- Race conditions avoided at DB level.

### N+1 Query Optimization
- All comments fetched in a **single query**.
- Nested tree constructed in memory.
- Prevents recursive database calls.

### Dynamic Aggregation
- Karma calculated from transaction history.
- Ensures accuracy without cached counters.

---

## API Endpoints

### Feed
```
GET /feed/
```

### Comments
```
GET /posts/<post_id>/comments/
```

### Like Post
```
POST /posts/<post_id>/like/
```

### Like Comment
```
POST /comments/<comment_id>/like/
```

### Leaderboard
```
GET /leaderboard/
```

---

## Running Locally

### Backend

```bash
cd Backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs on:
```
http://127.0.0.1:8000
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

---

## Project Structure

```
Backend/
  core/
  manage.py

frontend/
  src/
  vite.config.js
```

---

## Design Decisions

- **Transaction-based Karma** instead of user counters.
- **Adjacency List** model for comments.
- **Recursive React Component** for nested UI.
- **Database Constraints** for integrity over application logic.

---

## Future Improvements

- Authentication system
- Pagination
- UI animations
- Real-time updates via WebSockets

---

## Author

Anas Khan  
Built for Playto Engineering Challenge
