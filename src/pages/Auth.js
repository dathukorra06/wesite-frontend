import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any existing errors when switching forms
    setLoginErrors({});
    setRegisterErrors({});
  }, [isLogin]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (loginErrors[name]) {
      setLoginErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (registerErrors[name]) {
      setRegisterErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateLoginForm = () => {
    const newErrors = {};
    
    if (!loginData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!loginData.password) {
      newErrors.password = 'Password is required';
    }
    
    setLoginErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors = {};
    
    if (!registerData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (registerData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!registerData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!registerData.password) {
      newErrors.password = 'Password is required';
    } else if (registerData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(registerData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setRegisterErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
      return;
    }
    
    setLoginLoading(true);
    const result = await login(loginData.email, loginData.password);
    setLoginLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) {
      return;
    }
    
    setRegisterLoading(true);
    const result = await register(registerData.name, registerData.email, registerData.password);
    setRegisterLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const switchForm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        {/* Main Card Container */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ease-in-out ${isLogin ? 'bg-white' : 'bg-gradient-to-r from-white to-purple-50'}`}>
          <div className="flex flex-col md:flex-row">
            {/* Left Panel - Form */}
            <div className={`w-full md:w-1/2 p-8 md:p-12 transition-all duration-500 ease-in-out ${isLogin ? 'bg-white' : 'bg-gradient-to-br from-purple-50 to-pink-50'}`}>
              <div className={`transition-all duration-500 ease-in-out ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
                <div className="text-center mb-8">
                  <h2 className={`text-3xl font-bold mb-2 ${isLogin ? 'text-gray-900' : 'text-purple-800'}`}>
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </h2>
                  <p className={`${isLogin ? 'text-gray-600' : 'text-purple-600'}`}>
                    {isLogin 
                      ? 'Sign in to access your dashboard' 
                      : 'Join us to get started today'
                    }
                  </p>
                </div>

                {isLogin ? (
                  // Login Form
                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      error={loginErrors.email}
                      placeholder="Enter your email"
                      required
                    />
                    
                    <Input
                      label="Password"
                      name="password"
                      type="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      error={loginErrors.password}
                      placeholder="Enter your password"
                      required
                    />
                    
                    <Button
                      type="submit"
                      variant={isLogin ? "primary" : "secondary"}
                      className={`w-full py-3 text-base font-semibold ${isLogin ? '' : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'}`}
                      loading={isLogin ? loginLoading : registerLoading}
                    >
                      {isLogin ? 'Sign In' : 'Create Account'}
                    </Button>
                    
                    
                  </form>
                ) : (
                  // Register Form
                  <form onSubmit={handleRegisterSubmit} className="space-y-5">
                    <Input
                      label="Full Name"
                      name="name"
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      error={registerErrors.name}
                      placeholder="Enter your full name"
                      required
                    />
                    
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      error={registerErrors.email}
                      placeholder="Enter your email"
                      required
                    />
                    
                    <Input
                      label="Password"
                      name="password"
                      type="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      error={registerErrors.password}
                      placeholder="Create a password"
                      required
                    />
                    
                    <Input
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      error={registerErrors.confirmPassword}
                      placeholder="Confirm your password"
                      required
                    />
                    
                    <Button
                      type="submit"
                      variant={isLogin ? "primary" : "secondary"}
                      className={`w-full py-3 text-base font-semibold ${isLogin ? '' : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'}`}
                      loading={isLogin ? loginLoading : registerLoading}
                    >
                      {isLogin ? 'Sign In' : 'Create Account'}
                    </Button>
                    
                    
                  </form>
                )}


              </div>
            </div>

            {/* Right Panel - Welcome */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-8 md:p-12 flex flex-col justify-center text-white">
              <div className={`transition-all duration-700 ease-in-out delay-150 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  {isLogin ? 'New Here?' : 'Already Member?'}
                </h3>
                
                <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
                  {isLogin
                    ? 'Join our platform to manage your tasks efficiently and boost your productivity with our powerful tools.'
                    : 'Sign in to continue managing your tasks and accessing your personalized dashboard.'
                  }
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-white opacity-90">Task Management</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-white opacity-90">Priority Tracking</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-white opacity-90">Progress Analytics</span>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  onClick={switchForm}
                  className={`w-full py-3 text-base font-semibold border-2 border-white text-white hover:bg-white transition-all duration-300 ${isLogin ? 'hover:text-primary-600' : 'hover:text-purple-600'}`}
                >
                  {isLogin ? 'Sign Up Now' : 'Sign In Now'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;