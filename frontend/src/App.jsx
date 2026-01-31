import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [posts, setPosts] = useState([]);
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/feed/")
      .then(res => setPosts(res.data));

    axios.get("http://127.0.0.1:8000/leaderboard/")
      .then(res => setLeaders(res.data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-3 gap-6">

      <div className="col-span-2">
        <h1 className="text-3xl font-bold mb-6">Community Feed</h1>

        {posts.map(post => (
          <div key={post.id} className="border p-4 rounded mb-4 shadow-sm">
            <p className="font-semibold">{post.author}</p>
            <p className="my-2">{post.content}</p>
            <p className="text-sm text-gray-500">
              👍 {post.likes} likes
            </p>
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
