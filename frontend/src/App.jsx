import { useEffect, useState } from "react";
import axios from "axios";

function Comment({ comment, depth = 0 }) {
  return (
    <div style={{ marginLeft: depth * 20 }} className="mt-2">
      <p className="font-semibold">{comment.author}</p>
      <p>{comment.content}</p>

      {comment.replies.map(reply => (
        <Comment key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );
}

function App() {
  const [posts, setPosts] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [comments, setComments] = useState({});

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/feed/")
      .then(res => {
        setPosts(res.data);

        // Load comments for each post
        res.data.forEach(post => {
          axios
            .get(`http://127.0.0.1:8000/posts/${post.id}/comments/`)
            .then(r =>
              setComments(prev => ({
                ...prev,
                [post.id]: r.data
              }))
            );
        });
      });

    axios.get("http://127.0.0.1:8000/leaderboard/")
      .then(res => setLeaders(res.data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-3 gap-6">

      <div className="col-span-2">
        <h1 className="text-3xl font-bold mb-6">Community Feed</h1>

        {posts.map(post => (
          <div key={post.id} className="border p-4 rounded mb-6 shadow-sm">
            <p className="font-semibold">{post.author}</p>
            <p className="my-2">{post.content}</p>
            <p className="text-sm text-gray-500 mb-3">
              👍 {post.likes} likes
            </p>

            <div className="border-t pt-3">
              <p className="font-semibold mb-2">Comments</p>

              {(comments[post.id] || []).map(comment => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Leaderboard (24h)</h2>

        <div className="border rounded p-4 shadow-sm">
          {leaders.map((user, i) => (
            <div key={i} className="flex justify-between py-1">
              <span>{user.user}</span>
              <span>{user.karma} pts</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default App;
