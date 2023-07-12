import { auth, provider } from './config/index'
import { signInWithPopup } from 'firebase/auth'
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function SignIn() {

    const [email, setEmail] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setEmail(localStorage.getItem('email'))
    }, []);

    const login = async () => {
        try {
            const data = await signInWithPopup(auth, provider);

            setEmail(data.user.email);
            setPhotoUrl(data.user.photoURL)
            setName(data.user.displayName)
            localStorage.setItem('email', data.user.email);
            navigate('/home', {
                state: {
                    userName: data.user.displayName,
                    userPhoto: data.user.photoURL
                }
            })
        } catch (error) {
            //exibe uma mensagem de falha no login
            console.log('DEU ERRO: ', error)
        }
    }

    return (
        <>
            <button onClick={login}>Login</button>
        </>
    );
}

export default SignIn;