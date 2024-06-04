import React from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import Swal from 'sweetalert2';

const JobCard = ({ data }) => {
  const { Title, Location, Salary, Type, Category, Description, _id: jobId } = data;

  const handleApply = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const jobSeekerId = decodedToken._id;

      const response = await axios.post(`http://localhost:5000/application/applications`, { JobSeekerID: jobSeekerId, JobID: jobId });

      console.log('Applied for the job:', response.data);
    } catch (error) {
      console.error('Error applying for the job:', error);
    }
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Applied successfully!",
      showConfirmButton: false,
      timer: 1500
    });
  };

  return (
    <div className='flex flex-col w-2/3 px-4 py-2 bg-white rounded-lg shadow1'>
      <div className='mt-3 flex justify-between'>
        <h1 className='text-5xl'>{Title}</h1>
        <div className='flex items-center justify-center gap-4'>
          <button
            className='drop-shadow-xl text-center font-medium border-background text-background cursor-pointer hover:bg-background hover:text-white w-24 outline-none border-2 self-center p-2 rounded-md'
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>
      <div className='flex items-center gap-3 mt-3'>
        <p>{Location}</p>
        <p>{Salary}</p>
        <p>{Type}</p>
      </div>
      <div className='bg-blue-200 w-52 p-1 my-3 flex items-center justify-center rounded-lg'>{Category}</div>
      <p>{Description}</p>
    </div>
  );
};

export default JobCard;
