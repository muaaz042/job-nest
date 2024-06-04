import React, { useState } from 'react';
import axios from 'axios';

const ApplicationCard = ({ data }) => {
  const { Title, Location, Salary, Type, Category, Description, Name, Email, Resume, applicationId } = data;

  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');

  const handleScheduleInterview = async () => {
    if (!interviewDate || !interviewTime) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Please select a date and time for the interview!",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/interviews`, {
        applicationId,
        date: interviewDate,
        time: interviewTime,
        location: 'Company HQ', 
        feedback: 'Please prepare accordingly'
      });

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Interview scheduled successfully!",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Error scheduling interview:', error);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Failed to schedule interview! Please try again.",
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <div className='flex flex-col w-2/3 px-4 py-2 bg-gray-200 rounded-lg shadow'>
      <div className='mt-3 flex justify-between'>
        <h1 className='text-5xl'>{Title}</h1>
        <div>
          <input
            className='outline-none border-2 focus:border-background w-full p-2 rounded-md'
            type="date"
            name="date"
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
          />
          <input
            className='outline-none border-2 focus:border-background w-full p-2 rounded-md mt-2'
            type="time"
            name="time"
            value={interviewTime}
            onChange={(e) => setInterviewTime(e.target.value)}
          />
        </div>
      </div>
      <div className='flex items-center gap-3 mt-3'>
        <p>{Location}</p>
        <p>{Salary}</p>
        <p>{Type}</p>
      </div>
      <div className='bg-blue-200 w-52 p-1 my-3 flex items-center justify-center rounded-lg'>{Category}</div>
      <p>{Description}</p>

      <div className='mt-4'>
        <h2 className='text-2xl'>Job Seeker Details</h2>
        <p><strong>Name:</strong> {Name}</p>
        <p><strong>Email:</strong> {Email}</p>
        <p><strong>Resume:</strong> {Resume}</p>
      </div>

      <button
        className='mt-4 p-2 bg-blue-500 text-white rounded-md'
        onClick={handleScheduleInterview}
      >
        Schedule Interview
      </button>
    </div>
  );
};

export default ApplicationCard;
