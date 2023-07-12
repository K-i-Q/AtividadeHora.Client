import { useLocation } from 'react-router-dom';

function Home() {

    const location = useLocation();
    let userName = location.state.userName;
    let userPhoto = location.state.userPhoto;

    return (
        <>
            LOGADO {userName}<br />
            <img src={userPhoto}  width={50} height={50}/>
        </>
    )
}

export default Home;