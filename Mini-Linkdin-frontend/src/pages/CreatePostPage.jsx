import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/posts';
import postImg from '../assets/images/post.svg';

export default function CreatePostPage() {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false); // ✅ alert state
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Post content cannot be empty');
      return;
    }
    setSubmitting(true);
    try {
      await createPost(content.trim());
      setSuccess(true); // ✅ show alert
      setContent('');   // clear textarea
      setTimeout(() => {
        setSuccess(false);
        navigate('/');
      }, 2000); // hide alert after 2s & redirect
    } catch (err) {
      console.error('Create post error', err);
      alert(err.response?.data?.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-lg rounded-4 p-4" style={{ maxWidth: 600, width: '100%' }}>
        
        {/* Image */}
        <div className="text-center mb-3">
          <img
            src={postImg}
            alt="Post"
            style={{ width: 250, height: 'auto' }}
          />
        </div>

        <h3 className="text-center text-primary mb-3">Create a New Post</h3>

        {/* ✅ Alert */}
        {success && (
          <div className="alert alert-success text-center" role="alert">
            Post created successfully!
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              style={{ resize: 'none', fontSize: 16 }}
            />
          </div>
          <div className="text-end">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary px-4 py-2 rounded-pill"
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
