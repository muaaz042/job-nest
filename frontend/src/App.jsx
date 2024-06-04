import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Interviews from './pages/Interviews';
import Jobs from './pages/Jobs';
import Login from './pages/Login';
import Signup from './pages/Signup';
import JoBSeekerProfile from './pages/JoBSeekerProfile';
import EmployerProfile from './pages/EmployerProfile';
import PostJob from './pages/PostJob';

function App() {
  return (
    <Router>
          <Navbar />
          <Routes>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/jobs' element={<Jobs/>}/>
            <Route path='/interviews' element={<Interviews/>}/>
            <Route path='/joBSeekerProfile' element={<JoBSeekerProfile/>}/>
            <Route path='/employerProfile' element={<EmployerProfile/>}/>
            <Route path='/postjob' element={<PostJob/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
          </Routes>
    </Router>
  );
}

export default App;
