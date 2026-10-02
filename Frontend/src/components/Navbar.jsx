import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../Context/AppContent.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const { setToken, userData, setUserData, token } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    setToken(false);
    setUserData(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, [setToken]);

return (
  
  <div className="flex items-center justify-between py-4 mb-5 text-lg">
    <img onClick={() => navigate('/')} className="cursor-pointer w-44" src={assets.logo} alt="Logo" />

    
    <ul className="hidden gap-6 text-base font-medium md:flex">
      <NavLink to="/" className={({ isActive }) => isActive ? "active text-blue-500" : ""}> <li className="py-1 text-lg cursor-pointer">Home</li> </NavLink>
      <NavLink to="/doctors" className={({ isActive }) => isActive ? "active text-blue-500" : ""}> <li className="py-1 text-lg cursor-pointer">All Doctors</li> </NavLink>
      <NavLink to="/about"   className={({ isActive }) => isActive ? "active text-blue-500" : ""} > <li className="py-1 text-lg cursor-pointer">About</li> </NavLink>
      <NavLink to="/contact" className={({ isActive }) => isActive ? "active text-blue-500" : ""}> <li className="py-1 text-lg cursor-pointer">Contact</li> </NavLink>
    </ul>

    <div className="flex items-center gap-4">
      {
       token && userData ? (
        
        <div className="relative flex items-center gap-2 cursor-pointer group">
          
          <div className="px-1 bg-blue-300 rounded-full">
            <img className="w-8 rounded-full" src={userData.image} alt="User Profile" />
          </div>
          
          <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown" />

          <div className="absolute top-0 right-0 z-20 hidden text-base font-medium text-gray-600 pt-14 group-hover:block">
            <div className="flex flex-col gap-4 p-4 rounded min-w-48 bg-stone-100">
              <p onClick={() => navigate('/my-profile')} className="cursor-pointer hover:text-black">My Profile</p>
              <p onClick={() => navigate('/my-appointments')} className="cursor-pointer hover:text-black">My Appointments</p>
              <p onClick={logout} className="cursor-pointer hover:text-black">Logout</p>
            </div>
          </div>
        </div>
      ) 
      : 
      (
        <button onClick={() => navigate('/signup')} className="hidden px-8 py-3 font-light text-white rounded-full bg-primary md:block"> Create Account </button>
      )
      }

      {/* Mobile Menu */}
      <img onClick={() => setShowMenu(true)} className="w-6 md:hidden" src={assets.menu_icon} alt="Menu Icon" />

      <div className={`${  showMenu ? "fixed w-full" : "h-0 w-0"} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
        
        <div className="flex items-center justify-between px-5 py-6">
          <img className="w-36" src={assets.logo} alt="Logo" />
          <img className="w-7"  onClick={() => setShowMenu(false)}  src={assets.cross_icon}  alt="Close Menu" />
        </div>
        
        <ul className="flex flex-col items-center gap-2 px-5 mt-5 text-lg font-medium">
          <NavLink onClick={() => setShowMenu(false)} to="/"><p>Home</p></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/doctors"><p>All Doctors</p></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/about"><p>About</p></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/contact"><p>Contact</p></NavLink>
        </ul>
        
      </div>
    </div>
  </div>
);
};

export default Navbar;
