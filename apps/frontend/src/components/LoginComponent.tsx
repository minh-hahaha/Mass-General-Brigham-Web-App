import MGBButton from '../elements/MGBButton.tsx';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ROUTES } from 'common/src/constants.ts';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [wrongPassword, setWrongPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Check sessionStorage for loggedIn state on initial load
    useEffect(() => {
        const storedLoginState = sessionStorage.getItem('loggedIn');

        if (storedLoginState === 'true') {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }

        return () => {
            sessionStorage.removeItem('loggedIn');
        };
    }, []);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEnteredPassword(e.target.value);
    };

    async function validateUser() {
        //This function will change when we start using OAuth
        //For now, any entered email and password will be saved to the browser locally
        try {
            const res = await axios.get(ROUTES.VALIDATE, {
                params: { email: email },
            });
            if (res.status === 200) {
                if (res.data.password == enteredPassword) {
                    setLoggedIn(true);
                    sessionStorage.setItem('loggedIn', JSON.stringify(true));
                    sessionStorage.setItem('position',res.data.position);
                    sessionStorage.setItem('currentUser', res.data.firstName + ' ' + res.data.lastName);
                    window.location.href = '/MapPage';
                } else {
                    setWrongPassword(true);
                }
            } else {
                console.error(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <section className="h-screen flex flex-col justify-center mb-10">
            <div className="bg-white w-full max-w-lg flex flex-col space-y-8 shadow-xl rounded-lg p-15 border-1">
                <div className="flex-grow border-t border-mgbblue w-25 border-2" />
                <div className="max-w-90 mb-5">
                    <h1 className="font-black text-5xl text-slate-800">Welcome!</h1>
                </div>
                <div className="max-w-90 text-xl font-serif text-gray-900">
                    <h2>Log in to use hospital tools</h2>
                </div>
                {wrongPassword && (
                    <div className="bg-red-600 text-white px-4 py-2 rounded-md mt-2 text-sm font-semibold text-center shadow">
                        Wrong Password
                    </div>
                )}
                <div className="grid grid-cols-1 my-2 gap-6">
                    <div className="relative w-90">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-800">
                            <User />
                        </span>
                        <input
                            className="text-sm w-90 px-11 py-2 border border-solid border-mgbblue rounded-sm"
                            type="text"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Email Address"
                        />
                    </div>
                    <div className="relative w-90">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-800">
                            <Lock />
                        </span>
                        <input
                            className="text-sm w-90 px-11 py-2 border border-solid border-mgbblue rounded-sm"
                            type={showPassword ? 'text' : 'password'}
                            value={enteredPassword}
                            onChange={handlePasswordChange}
                            placeholder="Password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-800"
                            onClick={() => setShowPassword((prev) => !prev)}
                            tabIndex={-1}
                        >
                            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                    </div>
                </div>
                <div className="flex justify-between font-semibold text-sm w-90 mt-6">
                    <label className="flex text-slate-800 hover:text-slate-900 cursor-pointer">
                        <input className="mr-1" type="checkbox" />
                        <span>Remember Me</span>
                    </label>
                    <a
                        className="text-mgbblue hover:text-blue-900 hover:underline hover:underline-offset-4"
                        href="/"
                    >
                        Forgot Password?
                    </a>
                </div>
                <div className="">
                    <button
                        className="bg-mgbblue hover:bg-blue-950 py-2 px-4 cursor-pointer text-white rounded-sm text-sm tracking-wider w-90"
                        onClick={() => validateUser()}
                    >
                        Login
                    </button>
                </div>
                <div className="flex justify-start space-x-6 mt-8 text-slate-600">
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 transition"
                    >
                        <i className="text-2xl">
                            <FaFacebookF />
                        </i>
                    </a>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-sky-500 transition"
                    >
                        <i className="text-2xl">
                            <FaTwitter />
                        </i>
                    </a>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-pink-500 transition"
                    >
                        <i className="text-2xl">
                            <FaInstagram />
                        </i>
                    </a>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-700 transition"
                    >
                        <i className="text-2xl">
                            <FaLinkedinIn />
                        </i>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default LoginComponent;
