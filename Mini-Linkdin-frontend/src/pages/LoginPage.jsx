import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { AuthContext } from '../context/AuthContext';
import loginImg from '../assets/images/login.svg';

export default function LoginPage() {
  const {
    register: reg,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });
      const token = res.data.token;
      if (!token) throw new Error('No token returned');
      await loginUser(token);
      navigate('/');
    } catch (err) {
      console.error('Login failed', err);
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
<div
  className="d-flex align-items-center justify-content-center container py-5"
  style={{
    // background: 'linear-gradient(to right, #3f51b5, #2196f3)',
    borderRadius: '10px',
  }}
>
  <div className="row shadow rounded-4 overflow-hidden bg-white" style={{ maxWidth: 900, width: '100%' }}>
    {/* Left: Image */}
    <div className="col-md-6 bg-light d-none d-md-flex align-items-center justify-content-center">
      <img
        src={loginImg}
        alt="Login Illustration"
        className="img-fluid p-4"
        style={{ maxHeight: '400px' }}
      />
    </div>

    {/* Right: Form */}
    <div className="col-md-6 p-4 bg-white">
      <h3 className="mb-4 text-primary text-center">Login to Your Account</h3>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            placeholder="you@example.com"
            {...reg('email', { required: 'Email is required' })}
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            placeholder="Password"
            {...reg('password', { required: 'Password is required' })}
          />
          {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 rounded-pill shadow-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  </div>
</div>

  );
}
