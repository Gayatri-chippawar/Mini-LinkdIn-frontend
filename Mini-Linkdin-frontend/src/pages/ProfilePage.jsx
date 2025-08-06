import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { deletePost as apiDeletePost } from '../api/posts';
import profileImg from '../assets/images/profile.svg';

export default function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/users/${userId}`); // { user, posts }
        setProfile(res.data.user);
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [userId]);

  const handleDelete = async (postId) => {
    try {
      await apiDeletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error('Delete failed', err);
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <div className="container py-4">Loading profile...</div>;
  if (error) return <div className="container text-danger py-4">{error}</div>;
  if (!profile) return <div className="container py-4">User not found.</div>;

  return (
    <div className="container py-4" style={{ maxWidth: 1000 }}>
      {/* Profile Card */}
      <div
        className="card shadow-sm rounded-4 mb-4 border-0 text-white"
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
        }}
      >
        <div className="row g-0 align-items-center">
          {/* Left Image */}
          <div className="col-md-4 text-center">
            <img
              src={profileImg}
              alt="Profile"
              style={{
                height: '300px',
                width: '100%',
                objectFit: 'contain',
                padding: '1.5rem'
              }}
            />
          </div>

          {/* Right User Info */}
          <div className="col-md-8">
            <div className="card-body ps-4">
              <h2 className="card-title">{profile.name}</h2>
              <p className="card-text">{profile.bio || 'No bio provided.'}</p>
              <p className="card-subtitle small">Email: {profile.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div>
        <h4 className="mb-3">Posts</h4>
        {posts.length === 0 ? (
          <p className="text-muted">{profile.name} hasn&apos;t posted anything yet.</p>
        ) : (
          <div className="d-flex overflow-auto gap-3 pb-3">
  {posts.map((post) => (
    <div className="card flex-shrink-0 shadow-sm rounded-3 border-0 position-relative" style={{ width: '100%' }} key={post._id}>
                <div className="card h-100 shadow-sm rounded-3 border-0 position-relative">
                  <div className="card-body">
                    <p className="card-text mb-2" style={{ paddingRight: '60px' }}>{post.content}</p>
                    <small className="text-muted">
                      {new Date(post.createdAt).toLocaleString()}
                    </small>

                    {currentUser && currentUser._id === profile._id && (
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="btn btn-sm btn-outline-danger position-absolute"
                        style={{ top: 10, right: 10 }}
                      >
                        Delete
                      </button>
                    )}
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
