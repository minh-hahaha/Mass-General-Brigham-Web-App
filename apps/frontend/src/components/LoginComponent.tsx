import { API_ROUTES } from "common/src/constants.ts";
import axios from "axios";

const LoginComponent = () => {


    async function validateUser(email: string, enteredPassword: string) {
        try {
            const res = await axios.get(API_ROUTES.VALIDATE(email))
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <section className="h-screen flex flex-col justify-center space-y-10 my-2 mx-5 items-center">
            <div className="max-w-90">
                <img
                    src="https://mms.businesswire.com/media/20250225612382/en/2391490/5/MassGeneralBrigham_stacked.jpg?download=1"
                    alt=""
                />
            </div>
            <div className="relative flex my-5 items-center w-90 mt-2">
                <div className="flex-grow border-t border-gray-800"></div>
                <span className="flex-shrink mx-2 font-semibold text-slate-800">Sign In</span>
                <div className="flex-grow border-t border-gray-800"></div>
            </div>
            <div className="grid grid-cols-1 gap-5 my-1">
                <input
                    className="text-sm w-90 px-4 py-2 border border-solid border-blue-800 rounded-md"
                    type="text"
                    placeholder="Email Address"
                />
                <input
                    className="text-sm w-90 px-4 py-2 border border-solid border-blue-800 rounded-md"
                    type="password"
                    placeholder="Password"
                />
            </div>
            <div className="mt-4 flex justify-between font-semibold text-sm w-90">
                <label className="flex text-slate-800 hover:text-slate-900 cursor-pointer">
                    <input className="mr-1" type="checkbox" />
                    <span>Remember Me</span>
                </label>
                <a
                    className="text-blue-800 hover:text-blue-900 hover:underline hover:underline-offset-4"
                    href="/"
                >
                    Forgot Password?
                </a>
            </div>
            <div className="text-center">
                <button
                    className="bg-blue-800 hover:bg-blue-900 py-2 px-4 cursor-pointer text-white rounded-md text-sm tracking-wider"
                    type="submit"
                >
                    Login
                </button>
            </div>
        </section>
    );
};

export default LoginComponent;