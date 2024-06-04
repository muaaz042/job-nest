import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [userType, setUserType] = useState(''); // Default to 'employer'
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Email') {
      setEmail(value);
    } else if (name === 'Password') {
      setPassword(value);
    } else if (name === 'userType') {
      setUserType(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Email, Password, userType })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data.token)
      localStorage.setItem('token', data.token);
      const tk = jwtDecode(data.token)
      if (tk.userType === 'job_seeker')
      navigate('/jobs');
    else

      navigate('/dashboard');
    } catch (error) {
      console.log('Error:', error);
      setError('Failed to log in. Please check your credentials and try again.');
    }
  };

  return (
    <div className='d-flex align-items-center justify-center h-auto mt-20'>
      <form className='d-flex flex-col gap-4 h-4/5 w-1/3 p-8 rounded-2xl shadow' onSubmit={handleSubmit}>
        <h1 className='mt-4 fw-bolder text-3xl text-center'>LOG IN</h1>
        {error && <div className='text-red-500'>{error}</div>}
        <input
          className='outline-none border-2 focus:border-background w-full p-2 rounded-md'
          type="email"
          name="Email"
          placeholder='Enter email'
          value={Email}
          onChange={handleChange}
        />
        <input
          className='outline-none border-2 focus:border-background w-full p-2 rounded-md'
          type="password"
          name="Password"
          placeholder='Enter password'
          value={Password}
          onChange={handleChange}
        />
        <div className='d-flex justify-center items-center gap-4'>
          <input
            type="radio"
            id="employer"
            name="userType"
            value="employer"
            checked={userType === 'employer'}
            onChange={handleChange}
          />
          <label htmlFor="employer" className='text-xl font-semibold'>Employer</label>
          <input
            type="radio"
            id="job_seeker"
            name="userType"
            value="job_seeker"
            checked={userType === 'job_seeker'}
            onChange={handleChange}
          />
          <label htmlFor="job_seeker" className='text-xl font-semibold'>Job Seeker</label>
        </div>
        <button className='drop-shadow-xl text-center font-medium border-background text-background cursor-pointer hover:bg-background hover:text-white outline-none border-2 self-center w-50 p-2 rounded-md'>
          LOG IN
        </button>
        <div>Don't have an account? <Link to="/signup" className='text-background underline'>Sign Up</Link></div>
      </form>
    </div>
  );
}

export default Login;
