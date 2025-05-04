import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js';
import { useAuth } from '../contexts/AuthContext';

function Login(props) {
    const { resetSessionTimer } = useAuth();  // Add this line
    const [errors, setErrors] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [logininfo, setLoginInfo] = useState({
        username: '',
        password: '',
        keyword: ''
    });

    const navigate = useNavigate();

    const handlechange = (e) => {
        const { name, value } = e.target;
        setLoginInfo({ ...logininfo, [name]: value });
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const { username, password } = logininfo;
        if (!username.trim() || !password.trim()) {
            return handleError('Username and password are required');
        }
        const resIP = await fetch(`${import.meta.env.VITE_APP_HOST}/gs/api/v1/core/ip`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const ip = await resIP.json();
        const ipAdr = ip.data;
        console.log("Ip address : ", ip)
        const encryptedUsername = CryptoJS.AES.encrypt(username, ipAdr).toString();
        const encryptedPassword = CryptoJS.AES.encrypt(password, ipAdr).toString();

        setLoginInfo((prev) => ({
            ...prev,
            uname: encryptedUsername,
            upassword: encryptedPassword,
        }));

        try {
            setIsLoading(true);
            const url = `${import.meta.env.VITE_APP_HOST}/gs/api/v1/users/sign_in`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uname: encryptedUsername,
                    upassword: encryptedPassword,
                    keyword: ipAdr
                }), 
                credentials:"include"
            });

            const result = await response.json();

            if (result.success) {
                // handleSuccess(message);
                localStorage.setItem('accessToken',result.data.accessToken);
                props.showAlert("Login Successfull.", "success")
                // navigate(0);
                resetSessionTimer();
                navigate('/');
                window.location.reload();
            } else {
                setErrors("Try again");
            }
        } catch (error) {
            setErrors("Wait.. Don't move fast.. Pay attention while login to your account")
        } finally {
            setLoginInfo({
                username: "",
                password: ""
            })
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="flex items-center justify-center bg-gradient-to-br py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 p-10 rounded-2xl shadow-lg">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-400">Sign in to your account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Or{' '}
                            <Link to="/signup" className="font-medium text-gray-500 hover:text-gray-50 transition">
                                create a new account
                            </Link>
                        </p>
                    </div>
                    {errors.general && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{errors.general}</span>
                        </div>
                    )}
                    <form className="mt-8 space-y-6"
                        onSubmit={handleLogin}
                    >
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="username"
                                    onChange={handlechange}
                                    value={logininfo.username}
                                    disabled={isLoading}
                                    className={`appearance-none relative block w-full px-3 py-3 border placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                    placeholder="harshoslive"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    onChange={handlechange}
                                    value={logininfo.password}
                                    disabled={isLoading}
                                    className={`appearance-none relative block w-full px-3 py-3 border placeholder-gray-700 text-gray-400 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            {errors && (
                                props.showAlert(errors,"danger")
                                // <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                //     <span className="block sm:inline">{errors}</span>
                                // </div>
                            )}
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-yellow-950 hover:bg-yellow-900 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : 'Sign in'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {/* <div className='container'>
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            onChange={handlechange}
                            type="text"
                            name='username'
                            placeholder='Enter your username...'
                            value={logininfo.username}
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            onChange={handlechange}
                            type="password"
                            name='password'
                            placeholder='Enter your password...'
                            value={logininfo.password}
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <button type='submit' disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    <span>Don't have an account?{' '}
                        <Link to="/signup">Sign up</Link>
                    </span>
                </form>
            </div> */}
        </>
    )
}

export default Login;