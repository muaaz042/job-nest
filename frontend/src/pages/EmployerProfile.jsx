import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import Swal from 'sweetalert2';

const EmployerProfile = () => {
  const [profileData, setProfileData] = useState({
    CompanyName: '',
    Email: '',
    Password: '',
    Address: ''
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
        const response = await fetch(`http://localhost:5000/employer/employers/${_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
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
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const { _id } = jwtDecode(token);
      const response = await fetch(`http://localhost:5000/employer/employers/${_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
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
            <label htmlFor="CompanyName" className='w-72'>Change your company name:</label>
            <input type="text" name="CompanyName" className='w-96 px-2 outline-none border-2 focus:border-background p-2 rounded-md' value={profileData.CompanyName} onChange={handleChange} />
          </div>
          <div className='flex gap-2'>
            <label htmlFor="Email" className='w-72'>Change your email:</label>
            <input type="email" name="Email" className='w-96 px-2 outline-none border-2 focus:border-background p-2 rounded-md' value={profileData.Email} onChange={handleChange} />
          </div>
          <div className='flex gap-2'>
            <label htmlFor="Password" className='w-72'>Change your password:</label>
            <input type="password" name="Password" className='w-96 px-2 outline-none border-2 focus:border-background p-2 rounded-md' value={profileData.Password} onChange={handleChange} />
          </div>
          <div className='flex gap-2'>
            <label htmlFor="Address" className='w-72'>Change your address:</label>
            <input type="text" name="Address" className='w-96 px-2 outline-none border-2 focus:border-background p-2 rounded-md' value={profileData.Address} onChange={handleChange} />
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

export default EmployerProfile;
