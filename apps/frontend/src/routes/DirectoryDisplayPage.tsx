
const DirectoryDisplayPage = () => {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!loggedIn) {window.location.href = '/Login';}
    return (
        <div>

        </div>

    );
};

export default DirectoryDisplayPage;

