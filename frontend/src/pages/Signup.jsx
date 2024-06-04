import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Password: '',
    userType: ''
  });
  const [cpass, setCPass] = useState('');


  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [compareOtp, setcompareOtp] = useState('');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const sendOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Email: formData.Email })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Success:', data);
      setcompareOtp(data);
      setTimer(30);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to send OTP. Please try again.');
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(compareOtp != otp){
      setError('Invalid OTP');
      return;
    }

    if (formData.Password !== cpass) {
      setError('Passwords do not match');
      return;
    }

    console.log(formData)

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Success:', data);
      setFormData({
        Name: '',
        Email: '',
        Password: '',
        userType: ''
      });

      navigate('/login');
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Sign up successful! Please login to continue.",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to sign up. Please try again.');
    }
  };

  return (
    <div className='d-flex align-items-center justify-center h-auto mt-20'>
      <form className='d-flex flex-col gap-4 h-auto w-1/3 p-8 rounded-2xl shadow'>
        <h1 className='fw-bolder text-3xl text-center'>SIGN UP</h1>
        {error && <div className='text-red-500'>{error}</div>}
        <input
          className='outline-none border-2 focus:border-background w-full p-2 rounded-md'
          type="text"
          name="Name"
          placeholder='Enter full name'
          value={formData.Name}
          onChange={handleChange}
        />
        <input
          className='outline-none border-2 focus:border-background w-full p-2 rounded-md'
          type="email"
          name="Email"
          placeholder='Enter Email'
          value={formData.Email}
          onChange={handleChange}
        />
        <input
          className='outline-none border-2 focus:border-background w-full p-2 rounded-md'
          type="password"
          name="Password"
          placeholder='Enter password'
          value={formData.Password}
          onChange={handleChange}
        />
        <input
          className='outline-none border-2 focus:border-background w-full p-2 rounded-md'
          type="password"
          name="confirmPassword"
          placeholder='Confirm password'
          value={cpass}
          onChange={(e) => setCPass(e.target.value)}
        />
        <div className='flex justify-center gap-3'>
          <input
            disabled={!formData.Email}
            className='outline-none border-2 focus:border-background w-full p-2 rounded-md'
            type="text"
            name="otp"
            placeholder='Enter OTP'
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={sendOtp}
            disabled={!formData.Email || timer > 0} // Disable the button when the timer is running
            className='text-center font-medium border-green-400 text-green-400 cursor-pointer hover:bg-green-400 hover:text-white outline-none border-2 w-50 self-center p-2 rounded-md'
          >
            {timer > 0 ? `Resend OTP (${timer}s)` : 'Send OTP'}
          </button>
        </div>
        <div className='d-flex justify-center items-center gap-4'>
          <input
            type="radio"
            id="employer"
            name="userType"
            value="employer"
            checked={formData.userType === 'employer'}
            onChange={handleChange}
          />
          <label htmlFor="employer" className='text-xl font-semibold'>Employer</label>
          <input
            type="radio"
            id="job_seeker"
            name="userType"
            value="job_seeker"
            checked={formData.userType === 'job_seeker'}
            onChange={handleChange}
          />
          <label htmlFor="job_seeker" className='text-xl font-semibold'>Job Seeker</label>
        </div>
        <button
        onClick={handleSubmit}
          className='text-center font-medium border-background text-background cursor-pointer hover:bg-background hover:text-white outline-none border-2 w-50 self-center p-2 rounded-md'
        >
          SIGN UP
        </button>
        <div>Already have an account <Link to="/login" className='text-blue-600 underline'>Log In</Link></div>
      </form>
    </div>
  );
}

export default Signup;
