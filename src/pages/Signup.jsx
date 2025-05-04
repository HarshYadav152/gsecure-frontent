import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

function Signup(props) {
    const [errors, setErrors] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [signupinfo, setsignupInfo] = useState({
        uname: '',
        uemail: '',
        upassword: '',
        keyword: ''
    })

    const navigate = useNavigate();

    const handlechange = (e) => {
        const { name, value } = e.target;
        setsignupInfo({ ...signupinfo, [name]: value })
    }

    const handlesignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const { uname, uemail, upassword, keyword } = signupinfo

        if (!uname || !uemail || !upassword || !keyword) {
            setErrors("Fill all credentials, Carefully.")
        }

        const encryptedUsername = CryptoJS.AES.encrypt(uname, keyword).toString();
        const encryptedPassword = CryptoJS.AES.encrypt(upassword, keyword).toString();
        const encryptedEmail = CryptoJS.AES.encrypt(uemail, keyword).toString();

        // setsignupInfo((prev) => ({
        //     ...prev,
        //     uname: encryptedUsername,
        //     upassword: encryptedPassword,
        //     uemail: encryptedEmail,
        //     keyword: keyword
        // }));

        try {
            const url = `${import.meta.env.VITE_APP_HOST}/gs/api/v1/users/sign_up`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uname: encryptedUsername,
                    uemail: encryptedEmail,
                    upassword: encryptedPassword,
                    keyword: keyword
                }),
                credentials:"include"
            });

            const result = await response.json();

            console.log(result);
            if (result.ok) {
                if (result.success) {
                    // handleSuccess(message);
                    navigate('/login')
                    props.showAlert("Account created successfully","success")
                }
            } else {
                navigate("/login")
            }
        } catch (error) {
                setErrors("Wait.. Don't move fast.. Pay attention while creating account")
        } finally {
            setIsLoading(false)
            setsignupInfo({
                uname: "",
                upassword: "",
                uemail: "",
                keyword: ""
            })
        }
    }

    return (
        <>

            <div className="flex items-center justify-center bg-gradient-to-br px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 rounded-2xl shadow-lg">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-400">Create a new account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-gray-500 hover:text-gray-50">
                                Sign in
                            </Link>
                        </p>
                    </div>
                    {errors && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{errors}</span>
                        </div>
                    )}
                    <form className="mt-8 space-y-6" onSubmit={handlesignup}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    id="uname"
                                    name="uname"
                                    type="text"
                                    value={signupinfo.uname}
                                    onChange={handlechange}
                                    className={`appearance-none relative block w-full px-3 py-3 border  placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                    placeholder="harshoslive"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email address
                                </label>
                                <input
                                    id="uemail"
                                    name="uemail"
                                    type="email"
                                    value={signupinfo.uemail}
                                    onChange={handlechange}
                                    className={`appearance-none relative block w-full px-3 py-3 border placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    id="upassword"
                                    name="upassword"
                                    type="password"
                                    value={signupinfo.upassword}
                                    onChange={handlechange}
                                    className={`appearance-none relative block w-full px-3 py-3 border  placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Keyword
                                </label>
                                <input
                                    id="keyword"
                                    name="keyword"
                                    type="text"
                                    value={signupinfo.keyword}
                                    onChange={handlechange}
                                    className={`appearance-none relative block w-full px-3 py-3 border  placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                                    placeholder="Your favourite word"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                required
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                                I agree to the{' '}
                                <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                                    Privacy Policy
                                </Link>
                            </label>
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
                                        Creating account...
                                    </>
                                ) : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* <div className='container'>
            <h1>Signup</h1>
            <form onSubmit={handlesignup}>
                <div>
                    <label htmlFor="name">Username</label>
                    <input
                        onChange={handlechange}
                        type="text"
                        name='username'
                        autoFocus
                        placeholder='Enter your username'
                        value={signupinfo.username}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        onChange={handlechange}
                        type="email"
                        name='email'
                        placeholder='Enter your email'
                        value={signupinfo.email}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        onChange={handlechange}
                        type="password"
                        name='password'
                        placeholder='Enter your password...'
                        value={signupinfo.password}
                    />
                </div>
                <div>
                    <label htmlFor="password">Keyword</label>
                    <input
                        onChange={handlechange}
                        type="text"
                        name='keyword'
                        placeholder='Enter your keyword...'
                        value={signupinfo.keyword}
                    />
                </div>
                <button type='submit'>Signup</button>
                <span>Already have an account ?
                    <Link to="/login">Login</Link>
                </span>
            </form>

        </div> */}

        </>
    )
}

export default Signup