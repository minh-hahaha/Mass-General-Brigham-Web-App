
import MGBButton from "./MGBButton.tsx";
import {useState} from "react";

const LoginComponent = () => {

    const [email, setEmail] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEnteredPassword(e.target.value);
    }

    async function validateUser() {
        //This function will change when we start using OAuth
        //For now, any entered email and password will be saved to the browser locally
        localStorage.setItem(email, enteredPassword);
    }

    return (
        <section className="h-screen flex flex-col justify-center space-y-10 my-2 mx-5 items-center">
            <div className="max-w-90">
                <img
                    src="https://mms.businesswire.com/media/20250225612382/en/2391490/5/MassGeneralBrigham_stacked.jpg?download=1"
                    alt=""
                />
            </div>
            <div className="items-center relative flex my-5 w-90 mt-2">
                <div className="flex-grow border-t border-gray-800"></div>
                <span className="flex-shrink mx-2 font-semibold text-slate-800">Sign In</span>
                <div className="flex-grow border-t border-gray-800"></div>
            </div>
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
                <MGBButton onClick={() => validateUser()} variant={'primary'} disabled={false}>Login</MGBButton>
            </div>
        </section>
    );
};

export default LoginComponent;