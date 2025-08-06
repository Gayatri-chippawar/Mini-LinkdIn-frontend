import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getFeed } from '../api/posts';

export default function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const goToCreate = () => {
    navigate('/create');
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getFeed();
        setPosts(res.data);
      } catch (e) {
        console.error('Feed load error', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="container py-4">
      {/* Typing animation styles */}
      <style>
        {`
        .typewriter h1 {
          overflow: hidden;
          white-space: nowrap;
          border-right: 3px solid white;
          animation: typing 5s steps(32, end) infinite, blink 0.8s step-end infinite;
          width: 0;
        }

        @keyframes typing {
          0% { width: 0; }
          80% { width: 32ch; }
          100% { width: 0; }
        }

        @keyframes blink {
          0%, 100% { border-color: transparent; }
          50% { border-color: white; }
        }

        .typewriter {
          display: inline-block;
        }
        `}
      </style>

      {/* Header */}
      <div className="text-center mb-4">
        <div className="typewriter">
          <h1
            style={{
              color: 'white',
              textShadow: '2px 2px 6px black',
            }}
          >
            Welcome to the Community Platform
          </h1>
        </div>
        <p className="text-light">A mini LinkedIn-like space to connect and share posts.</p>
        <button
          className="btn px-4 py-2 mt-3 rounded-pill shadow-sm text-white"
          style={{
            background: 'linear-gradient(to right, #00b09b, #96c93d)',
            border: 'none',
          }}
          onClick={goToCreate}
        >
          <i className="bi bi-plus-circle me-2"></i>Create Post
        </button>
      </div>

      {/* Feed Section */}
      <div style={{ marginTop: '2rem' }}>
        <h3 className="mb-4 text-white">Feed</h3>

        {loading ? (
          <div className="text-center text-white">Loading feed...</div>
        ) : posts.length === 0 ? (
          <div className="text-muted">No posts yet.</div>
        ) : (
          <div className="row">
            {posts.map((post) => (
              <div key={post._id} className="col-md-4 mb-4">
                <div
                  className="card shadow h-100"
                  style={{
                    borderRadius: '16px',
                    border: 'none',
                    background: '#fdfdfd',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between mb-2">
                      <strong className="text-success">{post.author?.name || 'Unknown'}</strong>
                      <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                        {new Date(post.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="mb-0">{post.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
