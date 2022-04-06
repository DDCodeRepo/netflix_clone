import styles from './navbar.module.css';
import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import Link from 'next/Link';
import Image from 'next/image';

import { magic } from '../../lib/magic-client';

const NavBar = () => {

    const [showDropdown, setShowDropdown] = useState(false);
    const [username, setUsername] = useState('');

    const router = useRouter();

    useEffect(() => {
        return async () => {
            try {
                const { email } = await magic.user.getMetadata();

                if(email){
                    setUsername(email);
                }
            } catch (error) {
                console.error('Error retirving email', error);
            }
        }
    }, []);

    const handleOnClickHome = (e) => {
        e.preventDefault();
        router.push('/');
    }

    const handleOnClickMyList = (e) => {
        e.preventDefault();
        router.push('/browse/my-list');
    }

    const handleShowDropdown = (e) => {
        e.preventDefault();
        setShowDropdown(!showDropdown);
    }

    const handleSignOut = async (e) => {
        e.preventDefault();
        console.log("@@$$$$@@@$$$")

        try {
            await magic.user.logout();
            console.log(await magic.user.isLoggedIn());
            router.push('/login');
          } catch (error) {
            console.error('Error retirving email', error);
            //router.push('/login');
          }
    }


    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
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
                <ul className={styles.navItems}>
                    <li className={styles.navItem} onClick={handleOnClickHome}>Home</li>
                    <li className={styles.navItem2} onClick={handleOnClickMyList}>My List</li>
                </ul>
                <nav className={styles.navContainer}>
                    <div>
                        <button className={styles.usernameBtn} onClick={handleShowDropdown}>
                            <p className={styles.username}>{username}</p>
                            <Image
                                src={"/static/expand_more.svg"}
                                alt="Expand dropdown"
                                width="24px"
                                height="24px"
                            />
                        </button>
                        {showDropdown && (
                            <div className={styles.navDropdown}>
                                <div>
                                    <a className={styles.linkName} onClick={handleSignOut}>
                                        Sign Out
                                    </a>
                                    <div className={styles.lineWrapper} />
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default NavBar;