import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import Swal from 'sweetalert2';

const JobSeekerProfile = () => {
  const [profileData, setProfileData] = useState({
    Name: '',
    Email: '',
    Password: '',
    Resume: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const {_id} = jwtDecode(token);
        // console.log(decoded)
        const response = await fetch(`http://localhost:5000/jobseeker/jobseekers/${_id}`, {
        });
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to fetch profile. Please try again.');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(profileData)
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const { _id } = jwtDecode(token);
      const response = await fetch(`http://localhost:5000/jobseeker/jobseekers/${_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Profile updated successfully!",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className='lg:px-40 md:px-20 sm:px-20 py-8'>
        <form className='flex flex-col gap-12' onSubmit={handleSubmit}>
          <div className='flex gap-2'>
            <label htmlFor="name" className='w-72'>Change your name:</label>
            <input type="text" name="Name" className='w-96 px-2 outline-none border-2 focus:border-background p-2 rounded-md' value={profileData.Name} onChange={handleChange} />
          </div>
          <div className='flex gap-2'>
            <label htmlFor="email" className='w-72'>Change your email:</label>
            <input type="email" name="Email" className='w-96 px-2 outline-none border-2 focus:border-background p-2 rounded-md' value={profileData.Email} onChange={handleChange} />
          </div>
          <div className='flex gap-2'>
            <label htmlFor="password" className='w-72'>Change your password:</label>
            <input type="password" name="Password" className='w-96 px-2 outline-none border-2 focus:border-background p-2 rounded-md' value={profileData.Password} onChange={handleChange} />
          </div>
          <div className='flex gap-2'>
            <label htmlFor="resume" className='w-72'>Change your CV (description):</label>
            <textarea name="Resume" className='w-96 h-40 px-2 outline-none border-2 focus:border-background p-2 rounded-md' value={profileData.Resume} onChange={handleChange} />
          </div>
          <div className='flex'>
            <button type="submit" className='text-center font-medium border-blue-500 text-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white outline-none border-2 w-50 self-center p-2 rounded-md'>
              Update
            </button>
          </div>
        </form>
      {error && <div className='text-red-500'>{error}</div>}
    </div>
  );
};

export default JobSeekerProfile;
