# EXPLAINER.md – Playto Engineering Challenge

## 1. The Tree – Nested Comments

### Database Modeling
I used the **Adjacency List Model** for threaded comments.

Each comment has:
- `post` → ForeignKey to Post
- `parent` → ForeignKey to Comment (nullable)

This allows unlimited nesting depth without additional tables.

---

### Avoiding N+1 Queries
Instead of recursively querying replies from the database, I:

1. Fetched **all comments for a post in a single query**
2. Built a nested tree structure **in memory using Python dictionaries**

This ensures:
- Only **1 SQL query** regardless of comment depth
- No recursive DB calls
- Fast rendering even with large comment trees

---

## 2. The Math – Leaderboard Aggregation

### Requirement
Leaderboard must show top users based on karma earned **only in the last 24 hours**.

### Design Decision
I did **not store daily karma** on the User model.  
Instead, I stored **karma transactions** with timestamps.

Each like generates a `KarmaTransaction` row:
- Post Like → +5 points
- Comment Like → +1 point

---

### Query Used

```python
last_24_hours = now() - timedelta(hours=24)

leaderboard = (
    KarmaTransaction.objects
    .filter(created_at__gte=last_24_hours)
    .values("user__username")
    .annotate(total_karma=Sum("points"))
    .order_by("-total_karma")[:5]
)
```

---

### Why This Works
- No reset jobs required
- Historical data preserved
- Always accurate
- Prevents counter drift

---

## 3. Concurrency & Data Integrity

### Problem
Users might click "Like" multiple times or requests may arrive simultaneously.

### Solution
I added **database-level unique constraints**:

```
(user, post)
(user, comment)
```

This guarantees:
- No duplicate likes
- Race conditions handled by the database
- Integrity without relying only on application logic

---

## 4. AI Audit

AI tools were used to accelerate development, but all generated code was manually reviewed and tested.

### Example Issue

The AI initially suggested storing daily karma as a simple integer field on the User model and did not provide user feedback in the frontend for duplicate likes.

### Fix

I replaced this approach with a **transaction-based karma system** and dynamic aggregation queries to correctly calculate karma within the last 24 hours.
On the frontend, I added alert feedback for duplicate likes to improve user experience.

This ensured scalability, correctness, and better usability.

---

## 5. Frontend Tree Rendering

I used a **recursive React component** to render nested comments:

```
Comment
  └── Comment
        └── Comment
```

This matches the backend adjacency model and supports unlimited depth.

---

## Summary
The system emphasizes:

- Performance (N+1 avoidance)
- Data integrity (unique constraints)
- Scalability (transaction history)
- Correct aggregation (dynamic leaderboard)
- Clean UI recursion for nested threads
