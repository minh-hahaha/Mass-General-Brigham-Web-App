import msgLogo from '../assets/msgLogo.png'

const LogoBar = () => {

    return (
        <>
            <header className = "flex items-center justify-center bg-gray-200">

                <img src = {msgLogo} alt="MASS GENERAL BRINGHAM " className="h-15 20 mr-2"/>
                <h1 className = "text-3xl font bold">

                    Mass General Brigham
                </h1>

            </header>

        </>
    )

}

export default LogoBar;