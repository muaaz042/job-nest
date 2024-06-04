// Navbar.js
import React, { useEffect } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FiMenu } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { getUserFromToken } from "./utils";

const Navbar = () => {
  const [isMenu, setMenu] = React.useState(false);
  const navigate = useNavigate();
  const user = getUserFromToken();
  console.log(user);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user]);

  const jobSeekerLinks = [
    { label: "Dashboard", link: "/dashboard" },
    { label: "Jobs", link: "/jobs" },
    { label: "Profile", link: "/jobSeekerProfile" },
    { label: "Interviews", link: "/interviews" },
  ];

  const employerLinks = [
    { label: "Dashboard", link: "/dashboard" },
    { label: "Interviews", link: "/interviews" },
    { label: "Profile", link: "/employerProfile" },
    { label: "Post a Job", link: "/postjob" },
  ];

  const navlinks =
    user?.userType === "job_seeker" ? jobSeekerLinks : employerLinks;

  return (
    <nav>
      <nav className="lg:px-24 flex justify-between items-center py-6 px-8 shadow">
        <div className="flex items-center gap-8">
          <section className="flex items-center gap-4">
            <FiMenu
              onClick={() => setMenu(true)}
              className="text-3xl cursor-pointer lg:hidden"
            />
            <div className="flex items-center gap-1">
              <img
                src="./src/assets/logo.jpg"
                alt="Logo"
                className="w-9 h-9 rounded-full"
              />
              <Link to={"/"} className="text-3xl font-mono">
                JobNest
              </Link>
            </div>
          </section>
          {navlinks.map((d, i) => (
            <Link
              key={i}
              to={d.link}
              className="hidden lg:block text-gray-400 hover:text-black"
            >
              {d.label}
            </Link>
          ))}
        </div>

        <div
          className={`fixed h-full w-screen lg:hidden bg-black/50 backdrop-blur-sm top-0 right-0 transition-all ${isMenu ? "-translate-x-0" : "-translate-x-full"
            }`}
        >
          <section className="text-black bg-white h-screen flex-col absolute top-0 left-0 p-8 gap-8 z-50 flex w-56">
            <IoCloseCircleOutline
              onClick={() => setMenu(false)}
              className="text-3xl mt-0 mb-8 cursor-pointer"
            />
            {navlinks.map((d, i) => (
              <Link key={i} to={d.link} className="font-bold">
                {d.label}
              </Link>
            ))}
          </section>
        </div>
        <section>
          {user ? (
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="drop-shadow-xl text-center font-medium border-blue-500 text-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white outline-none border-2 self-center w-28 p-2 rounded-md"
            >
              LOG OUT
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/login")}
                className="drop-shadow-xl text-center font-medium border-blue-500 text-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white outline-none border-2 self-center w-20 p-2 rounded-md"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="drop-shadow-xl text-center font-medium border-blue-500 text-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white outline-none border-2 self-center w-20 p-2 rounded-md"
              >
                signup
              </button>
            </div>
          )}
        </section>
      </nav>
    </nav>
  );
};

export default Navbar;
