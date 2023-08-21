import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [cookies, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();
    const handleMobileNavClick = () => {
        setMobileNavOpen(!mobileNavOpen);
    };

    const closeMobileNav = () => {
        setMobileNavOpen(false);
    };

    const logout = () => {
        setCookies("access_token", "");
        window.localStorage.removeItem("userID");
        navigate("/auth");
    }

    return (
        <div className='navbar bg-red-950 p-4 text-center md:flex md:justify-center'>
            <div className="hidden md:flex items-center justify-between w-screen">
                <p className="text-white text-2xl font-bold mx-6">Jednostavni Recepti za Brzu Pripremu</p>
                <div>
                    {cookies.access_token ? (
                        // Render authenticated navigation
                        <React.Fragment>
                            <Link to="/" className="text-white text-2xl hover:text-gray-200 mx-6">Početna</Link>
                            <Link to="/createRecipes" className="text-white text-2xl hover:text-gray-200 mx-6">Kreiraj Recept</Link>
                            <Link to="/savedRecipes" className="text-white text-2xl hover:text-gray-200 mx-6">Spremljeni Recepti</Link>
                            <button
                                onClick={logout}
                                className="px-4 py-2 bg-red-800 hover:bg-white hover:text-black text-white rounded-md shadow-md transition duration-300 ease-in-out cursor-pointer"
                            >
                                Odjava
                            </button>
                        </React.Fragment>
                    ) : (
                        // Render registration/login link when not logged in
                        <Link to="/auth" className="text-white text-2xl hover:text-gray-200 mx-6">Registracija/Prijava</Link>
                    )}
                </div>
            </div>

            {/*Mobile version*/}
            <div className="md:hidden absolute top-0 right-0 mr-2 mt-2 ">
                <FaBars className="text-white text-xl cursor-pointer" onClick={handleMobileNavClick} />
            </div>
            {mobileNavOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                    <div className="bg-gradient-to-r from-red-500 to-red-800 bg-opacity-90 p-4 rounded shadow-lg flex flex-col items-center justify-center text-center transition-all transform scale-100 hover:scale-105">
                        <Link to="/" className="text-white font-bold text-lg my-2" onClick={closeMobileNav}>Početna</Link>
                        <Link to="/createRecipes" className="text-white font-bold text-lg my-2" onClick={closeMobileNav}>Kreiraj Recept</Link>
                        <Link to="/savedRecipes" className="text-white font-bold text-lg my-2" onClick={closeMobileNav}>Spremljeni Recepti</Link>
                        {!cookies.access_token ? (
                            <Link to="/auth" className="text-white font-bold text-lg my-2" onClick={closeMobileNav}>Registracija/Prijava</Link>
                        ) : (
                            <button
                                onClick={() => {
                                    logout();
                                    closeMobileNav();
                                }}
                                className="px-4 py-2 bg-red-800 hover:bg-white hover:text-black text-white rounded-md shadow-md transition duration-300 ease-in-out cursor-pointer my-2"
                            >
                                Odjava
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar;
