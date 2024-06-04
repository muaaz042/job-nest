import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import DashCard from '../components/DashCard';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get token from local storage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        // Decode the token to get the ID
        const decoded = jwtDecode(token);
        console.log(decoded)
        const employerId = decoded._id;

        // Send request to the API endpoint
        const response = await axios.get(`http://localhost:5000/employer/employer/stats/664f5a202f4d3ca9e6473fb1`);
        setStats(response.data);
        console.log(stats.numberOfApplications);
        console.log(stats.numberOfInterviewsScheduled);
        console.log(stats.numberOfJobsPosted);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className='lg:px-40 md:px-20 sm:px-20 py-8'>
      <div className="flex flex-col mx-3">
        <h2 className="mb-4 text-2xl font-bold">Dashboard</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {stats ? (
            <>
              <DashCard title="Jobs Posted" value={stats.numberOfJobsPosted} />
              <DashCard title="Applications Submitted" value={stats.numberOfApplications} />
              <DashCard title="Interviews Scheduled" value={stats.numberOfInterviewsScheduled} />
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
