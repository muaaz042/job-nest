import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import {jwtDecode} from 'jwt-decode';
import Swal from 'sweetalert2';

const PostJob = () => {
    const navigate = useNavigate();
    const [cat, setCat] = useState('');
    const [jobType, setJobType] = useState('');
    const [data, setData] = useState({
        EmployerID:'',
        Title: '',
        Location: '',
        Salary: '',
        Category: '',
        Type: '',
        Description: ''
    });

    const categories = [
        { value: "Web Development", label: "Web Development" },
        { value: "App Development", label: "App Development" },
        { value: "Game Development", label: "Game Development" },
        { value: "Figma", label: "Figma" },
        { value: "Machine Learning", label: "Machine Learning" },
        { value: "Artificial Intelligence", label: "Artificial Intelligence" },
    ];

    const jobTypes = [
        { value: "partTime", label: "Part Time" },
        { value: "fullTime", label: "Full Time" },
        { value: "remote", label: "Remote" },
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log('Decoded Token:', decoded);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        } else {
            console.error('No token found in localStorage');
        }
    }, []);

    const handleCategoryChange = (selectedOption) => {
        setCat(selectedOption.value);
        setData(prevState => ({
            ...prevState,
            Category: selectedOption.value
        }));
    };

    const handleJobTypeChange = (selectedOption) => {
        setJobType(selectedOption.value);
        setData(prevState => ({
            ...prevState,
            Type: selectedOption.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const decoded = jwtDecode(token);
            if (!decoded) {
                throw new Error('Failed to decode token');
            }

            const EmployerID = decoded._id; // Extract the EmployerID from the token
            console.log('User ID:', EmployerID);
            console.log("Decoded ", decoded)

            const jobData = { ...data, EmployerID };
            console.log(jobData)

            const response = await fetch('http://localhost:5000/jobs/job', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jobData)
            });
            navigate('/dashboard');

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // const responseData = await response.json();
            console.log(response.status);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Job Posted Successfully!",
                showConfirmButton: false,
                timer: 1500
              });
            

        } catch (error) {
            console.log('Error:', error);
            // setError('Failed to post job. Please try again.'); // Assuming you have an error state
        }
        setData({
            EmployerID:'',
            Title: '',
            Location: '',
            Salary: '',
            Category: '',
            Type: '',
            Description: ''
        })
        
    };

    const handleDataChange = (e) => {
        const { name, value } = e.target;
        setData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className='lg:px-40 md:px-20 sm:px-10 py-8'>
            <form className='flex flex-col gap-12' onSubmit={handleSubmit}>
                <div className='flex flex-wrap gap-2'>
                    <label htmlFor="title" className='w-72'>Title :</label>
                    <input type="text" name="Title" className='w-96 px-2 outline-none border-2 focus:border-background p-2 rounded-md' value={data.Title} onChange={handleDataChange} />
                </div>
                <div className='flex flex-wrap gap-2'>
                    <label htmlFor="location" className='w-72'>Location:</label>
                    <input type="text" name="Location" className='w-96 px-2 outline-none border-2 focus:border-background p-2 rounded-md' value={data.Location} onChange={handleDataChange} />
                </div>
                <div className='flex flex-wrap gap-2'>
                    <label htmlFor="salary" className='w-72'>Salary:</label>
                    <input type="number" name="Salary" className='w-96 px-2 outline-none border-2 focus:border-background p-2 rounded-md' value={data.Salary} onChange={handleDataChange} />
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                    <label htmlFor="Category" className='w-72'>Category : </label>
                    <Select className='w-96'
                        options={categories}
                        onChange={handleCategoryChange}
                        value={categories.find(ct => ct.value === cat)}
                    />
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                    <label htmlFor="Type" className='w-72'>Job Type : </label>
                    <Select className='w-96'
                        options={jobTypes}
                        onChange={handleJobTypeChange}
                        value={jobTypes.find(jb => jb.value === jobType)}
                    />
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                    <label htmlFor="description" className='w-72'>Description:</label>
                    <textarea type='text' name="Description" className='w-96 h-40 px-2 outline-none border-2 focus:border-background p-2 rounded-md' value={data.Description} onChange={handleDataChange} />
                </div>
                <div className='flex'>
                    <button type="submit" className='text-center font-medium border-blue-500 text-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white outline-none border-2 w-50 self-center p-2 rounded-md'>Post Job</button>
                </div>
            </form>
        </div>
    );
};

export default PostJob;
