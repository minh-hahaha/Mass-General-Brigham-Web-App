import mgblogotransparent from '../assets/mgblogotransparent.png';

const Footer = ()=> {
    return (
        <div className="grid grid-cols-5 max-w-full overflow-hidden bg-mgbblue justify-center items-center">
            <div></div>
            <div></div>
            <img src={mgblogotransparent} alt="logo" className="justify-center items-center"/>
            <div></div>
            <div></div>
        </div>
    )
}

export default Footer;