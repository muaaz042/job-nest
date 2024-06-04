import {useEffect, useState} from 'react';
import ApplicationCard from '../components/InterviewCard.jsx';
// import jobListings from '../assets/JobListings.js';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { getUserFromToken } from './../components/utils';


const Interviews = () => {
  const [jobListings, setJobListings] = useState([]);
  useEffect(() => {
    const fetchJobs = async () => {
      const user = getUserFromToken();
      const id = user._id;
      try {
        const Jobs = await axios.get(`http://localhost:5000/employer/664f5a202f4d3ca9e6473fb1/job-applications`);
        // const Applications = await axios.get(`http://localhost:5000/jobs/employers/${id}/jobs`);

        console.log(Jobs.data)
        setJobListings(Jobs.data);
      } catch (error) {
        console.error('Error fetching job listings:', error);
      }
    };

    fetchJobs();
  }, []);
  return (
    <div>
      <div className='flex flex-col items-center py-16 gap-5 bg-card'>
        {jobListings.map((job, index) => (
          <ApplicationCard key={index} data={job} />
        ))}
      </div>
    </div>
  );
}

export default Interviews;
