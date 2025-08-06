import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { AuthContext } from '../context/AuthContext';
import registerImg from '../assets/images/register.svg';

export default function RegisterPage() {
  const {
    register: reg,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        bio: data.bio || '',
      });

      const token = res.data.token;
      if (!token) throw new Error('No token returned from backend');

      await loginUser(token);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      alert(msg);
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center py-4"
      style={{
        minHeight: '80dvh',
        // background: 'linear-gradient(to right, #3b82f6, #60a5fa)',
        overflow: 'hidden',
      }}
    >
      <div className="row bg-white rounded-4 shadow p-4" style={{ maxWidth: 960, width: '100%' }}>
        {/* Left – Form */}
        <div className="col-md-6">
          <h2 className="text-center mb-4 text-primary fw-bold">Register</h2>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-3">
              <label className="form-label text-secondary">Name</label>
              <input
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                {...reg('name', { required: 'Name is required' })}
                placeholder="Your name"
              />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                {...reg('email', {
                  required: 'Email is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
                })}
                placeholder="you@example.com"
              />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                {...reg('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'At least 6 characters' },
                })}
                placeholder="Password"
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password.message}</div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label text-secondary">Bio (optional)</label>
              <textarea
                className="form-control"
                {...reg('bio')}
                placeholder="Short bio"
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 rounded-pill shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>

        {/* Right – SVG Image */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center">
          <img
            src={registerImg}
            alt="Register"
            style={{ maxWidth: '100%', maxHeight: 400 }}
          />
        </div>
      </div>
    </div>
  );
}
