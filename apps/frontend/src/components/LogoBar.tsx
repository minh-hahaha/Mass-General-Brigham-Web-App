import msgLogo from '../assests/msgLogo.jpeg'

const LogoBar = () => {

    return (
        <>
            <header>
                <h1 className = "flex items-center justify-center p-4 bg-gray-200">
                    Mass General Brigham
                </h1>
                <img src = {msgLogo} alt="MASS GENERAL BRINGHAM LOGO" className="h-20 20 mr-5"/>

            </header>





        </>
    )

}

export default LogoBar;