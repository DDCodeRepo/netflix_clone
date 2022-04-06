import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Head from 'next/head';
import Image from 'next/image';

import styles from '../styles/Login.module.css';
import { magic } from '../lib/magic-client';

const Login = () => {

    const [email, setEmail] = useState('');
    const [userMsg, setUserMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {

        const handleComplete = () => {
            setIsLoading(false);
        };

        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);


    const handleLoginWithEmail = async (e) => {
        e.preventDefault();

        if (email){
            try {
                setIsLoading(true);
                const didToken = await magic.auth.loginWithMagicLink({ email });
                console.log({ didToken });

                if(didToken){
                    router.push('/')
                }
            } catch(error) {
                // Handle errors if required!
                setIsLoading(false);
                console.error('Something went wrong logging in', error);
            }
        }
        else {
            setIsLoading(false);
            setUserMsg('Enter a valid email address');
        }
    }

    const handleOnChangeEmail = (e) => {
        setUserMsg("");
        const email = e.target.value;
        setEmail(email);
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Netflix SignIn</title>
            </Head>
            <header className={styles.header}>
                <div className={styles.headerWrapper}>
                    <a className={styles.logoLink} href="/">
                        <div className={styles.logoWrapper}>
                            <Image
                                src={'/static/netflix.svg'}
                                alt="Netflix logo"
                                width="128px"
                                height="34px"
                            />
                        </div>
                    </a>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.mainWrapper}>
                    <h1 className={styles.signinHeader}>
                        Sign In
                    </h1>
                    <input 
                        type="text"
                        placeholder='Email address'
                        className={styles.emailInput}
                        onChange={handleOnChangeEmail}
                    />
                    <p className={styles.userMsg}>{ userMsg }</p>
                    <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
                        { isLoading ? 'Loading...' : 'Sign In' }
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Login;