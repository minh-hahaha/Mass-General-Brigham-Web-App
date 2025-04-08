import LoginComponent from '../components/LoginComponent';
import { useState } from 'react';
import MGBButton from '@/components/MGBButton.tsx';

export default function LoginPage() {
    const [displayLogin, setDisplayLogin] = useState(false);
    return (
        <>
            {!displayLogin && (
                <section className="h-screen relative bg-[url('/mgbhero.jpeg')] bg-cover bg-center flex flex-col justify-center">
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 z-0"></div>
                <div className="relative z-10 flex flex-col items-center gap-3">
                    <h1 className="text-white text-7xl font-semibold font-serif text-center drop-shadow-xl">
                        Find Your Way.
                    </h1>
                    <h2 className="text-white text-2xl font-serif text-center drop-shadow-lg">
                        Use the kiosk to quickly locate departments, clinics, and services throughout
                        the hospital.
                    </h2>
                </div>

                <div className="relative z-10 flex flex-col items-center mt-5">
                    <MGBButton
                        onClick={() => setDisplayLogin(true)}
                        variant={'primary'}
                        disabled={false}
                    >
                        Login To My Account
                    </MGBButton>
                </div>
            </section>)}
            {displayLogin && (
                <section className="h-screen relative bg-[url('/mgbhero.jpeg')] bg-cover bg-center flex flex-col justify-center">
                    <LoginComponent />
                </section>
            )}
        </>
    );
}
