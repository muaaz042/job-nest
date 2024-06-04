import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import JobCard from '../components/JobCard';
import { AiOutlineSearch } from "react-icons/ai";


const Jobs = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [jobListings, setJobListings] = useState([]);

  const categories = [
    { value: "All", label: "All" },
    { value: "Web Development", label: "Web Development" },
    { value: "App Development", label: "App Development" },
    { value: "Game Development", label: "Game Development" },
    { value: "Figma", label: "Figma" },
    { value: "Machine Learning", label: "Machine Learning" },
    { value: "Artificial Intelligence", label: "Artificial Intelligence" },
  ];

  const handleCategoryChange = (selectedOption) => {
    setCategory(selectedOption.value);
  };

  useEffect(() => {
    // setJobListings(jb)
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/jobs/jobs');
        setJobListings(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching job listings:', error);
      }
    };
    console.log("called")

    fetchJobs();
  }, []);
  const filteredJobs = jobListings.filter(job => {
    const matchesCategory = category === 'All' || job.Category === category;
    const matchesSearch = job.Title && job.Title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  
  return (
    <div>
      <div className='z-10 bg-white py-3 rounded-b-xl rounded-br-xl shadow'>
        <div className='flex gap-10 justify-center w-full my-8 flex-wrap'>
          <div className='flex flex-col items-center '>
            <h1 className='text-5xl font-bold'>Discover The Job</h1>
            <div className='flex relative items-center justify-center gap-3 mt-5'>
              <AiOutlineSearch className='absolute bg-white w-10 h-10 left-80'/>
              <input className='border border-gray-800 lg:w-96 sm:w-76 rounded-full px-8 lg:h-16 sm:h-16' type="text" name="search" placeholder='Search' onChange={(e) => setSearch(e.target.value)} />
              <label htmlFor="category">Select the category: </label>
              <Select className='w-52'
                options={categories}
                onChange={handleCategoryChange}
                value={categories.find(cat => cat.value === category)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col items-center pt-16 gap-5'>
        {filteredJobs.map((job, index) => <JobCard key={index} data={job} />)}
      </div>
    </div>
  );
}

export default Jobs;