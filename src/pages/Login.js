import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animation when component mounts
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className={`max-w-md w-full space-y-8 transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center transition-all duration-500 delay-100" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 animate-fade-in-down">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 animate-fade-in-up">
            Or{' '}
            <Link 
              to="/register" 
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-300 hover:underline"
            >
              create a new account
            </Link>
          </p>
        </div>
        
        <div className={`bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <Button
                type="submit"
                variant="primary"
                className="w-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                loading={loading}
              >
                Sign in
              </Button>
            </div>
          </form>
          
          <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 transition-colors duration-300 hover:border-primary-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium transition-all duration-300 hover:text-primary-600">
                  Demo Credentials
                </span>
              </div>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-500 space-y-1 transition-all duration-500 hover:scale-105">
              <p className="transition-colors duration-300 hover:text-gray-700">Email: <span className="font-mono bg-gray-100 px-2 py-1 rounded">demo@example.com</span></p>
              <p className="transition-colors duration-300 hover:text-gray-700">Password: <span className="font-mono bg-gray-100 px-2 py-1 rounded">Demo123!</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;