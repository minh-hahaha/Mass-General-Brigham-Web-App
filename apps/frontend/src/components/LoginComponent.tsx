import MGBButton from './MGBButton.tsx';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ROUTES } from 'common/src/constants.ts';

const LoginComponent = () => {

    const [email, setEmail] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [wrongPassword, setWrongPassword] = useState(false);


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
                    window.location.href = '/Home';
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
        <section className="h-screen flex flex-col justify-center space-y-10 my-2 mx-5 items-center">
            <div className="bg-white border-2 border-mgbblue rounded-2xl p-10 w-full max-w-lg shadow-lg flex flex-col items-center space-y-6">
                <div className="max-w-90">
                    <img
                        src="https://mms.businesswire.com/media/20250225612382/en/2391490/5/MassGeneralBrigham_stacked.jpg?download=1"
                        alt=""
                        className="w-full object-contain mix-blend-multiply"
                    />
                </div>
                <div className="items-center relative flex my-5 w-90 mt-2">
                    <div className="flex-grow border-t border-gray-800"></div>
                    <span className="flex-shrink mx-2 font-semibold text-slate-800">Sign In</span>
                    <div className="flex-grow border-t border-gray-800"></div>
                </div>
                {wrongPassword && (
                    <div className="bg-red-600 text-white px-4 py-2 rounded-md mt-2 text-sm font-semibold text-center shadow">
                        Wrong Password
                    </div>
                )}
                <div className="grid grid-cols-1 gap-5 my-1">
                    <input
                        className="text-sm w-90 px-4 py-2 border border-solid border-mgbblue rounded-md"
                        type="text"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Email Address"
                    />
                    <input
                        className="text-sm w-90 px-4 py-2 border border-solid border-mgbblue rounded-md"
                        type="password"
                        value={enteredPassword}
                        onChange={handlePasswordChange}
                        placeholder="Password"
                    />
                </div>
                <div className="mt-4 flex justify-between font-semibold text-sm w-90">
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
                <div className="text-center">
                    <MGBButton onClick={() => validateUser()} variant={'primary'} disabled={false}>
                        Login
                    </MGBButton>
                </div>
            </div>
        </section>
    );
};

export default LoginComponent;
