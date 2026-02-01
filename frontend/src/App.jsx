import { useEffect, useState } from "react";
import axios from "axios";

function Comment({ comment, depth = 0 }) {

  const likeComment = async (id) => {
  const res = await axios.post(
    `http://127.0.0.1:8000/comments/${id}/like/`
  );

  if (res.data.status === "already liked") {
    alert("You already liked this comment!");
    return;
  }

  window.location.reload();
};


  return (
    <div style={{ marginLeft: depth * 20 }} className="mt-2">
      <p className="font-semibold">{comment.author}</p>
      <p>{comment.content}</p>

      <button
        onClick={() => likeComment(comment.id)}
        className="text-sm text-blue-600"
      >
        👍 {comment.likes || 0}
      </button>

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

const likePost = async (postId) => {
  const res = await axios.post(
    `http://127.0.0.1:8000/posts/${postId}/like/`
  );

  if (res.data.status === "already liked") {
    alert("You already liked this post!");
    return;
  }

  const feedRes = await axios.get("http://127.0.0.1:8000/feed/");
  setPosts(feedRes.data);

  const lbRes = await axios.get("http://127.0.0.1:8000/leaderboard/");
  setLeaders(lbRes.data);
};


  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-3 gap-6">

      <div className="col-span-2">
        <h1 className="text-3xl font-bold mb-6">Community Feed</h1>

        {posts.map(post => (
          <div key={post.id} className="border p-4 rounded mb-6 shadow-sm">
            <p className="font-semibold">{post.author}</p>
            <p className="my-2">{post.content}</p>
            <button
              onClick={() => likePost(post.id)}
              className="text-sm text-blue-600 hover:underline"
            >
              👍 {post.likes} likes
            </button>


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
