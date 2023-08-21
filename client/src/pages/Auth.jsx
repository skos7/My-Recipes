import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Auth = () => {

  return (
    <div className='auth'>
      <div className="flex bg-gradient-to-b from-red-900 via-red-400 to-red-500">
        <div className="flex-1 sm:flex sm:flex-row">
          <Register />
          <Login />
        </div>
      </div>
    </div>
  )
};

const Register = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3001/auth/register", {
        username,
        password,
      });
      alert("Registracija uspijašni, nastavi na Prijavu!");
    } catch (err) {
      console.error(err);
    }
  }

  return <Form username={username} setUsername={setUsername} password={password} setPassword={setPassword} label="Registracija" onSubmit={onSubmit} />
};

const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        username,
        password,
      });

      setCookies("access_token", response.data.token);
      window.localStorage.setItem("userID", response.data.userId);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }

  return <Form username={username} setUsername={setUsername} password={password} setPassword={setPassword} label="Prijava" onSubmit={onSubmit} />
};

const Form = ({ username, setUsername, password, setPassword, label, onSubmit }) => {
  return (
    <div className="flex-1 min-h-screen py-6 flex flex-col justify-center sm:py-12 ">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div
          className="absolute inset-0 bg-red-900 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
        </div>
        <div className="text-white relative px-4 py-10 bg-gradient-to-b from-red-900 via-red-600 to-red-500-600 shadow-lg sm:rounded-3xl sm:p-20">
          <div className="text-center pb-6">
            <h1 className="text-4xl">{label}</h1>
            <p className="text-gray-300">
              Ispunite donji obrazac za prijavu - {label}
            </p>
          </div>
          <form onSubmit={onSubmit}>
            <h2>{label}</h2>
            <input
              className="shadow mb-4 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text" id='username' placeholder='Korisničko ime' value={username} onChange={(event) => setUsername(event.target.value)} />
            <input
              className="shadow mb-4 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password" id='password' placeholder='Lozinka' value={password} onChange={(event) => setPassword(event.target.value)} />
            <div className="flex justify-between">
              <button
                className="shadow bg-red-950 hover:bg-red-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit">{label}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Auth;
