"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';

export default function Nav() {
    const [ signedInUser, setSignedInUser ] = useState(false)

    useEffect(() => {
        authListener()
    }, [])
    
    async function authListener() {
        Hub.listen('auth', (data) => {
            switch (data.payload.event) {
                case 'signIn':
                    return setSignedInUser(true)
                case 'signOut':
                    return setSignedInUser(false)
            }
        })
        try {
            await Auth.currentAuthenticatedUser()
            setSignedInUser(true)
        } catch (error) {}
    }

    return (
        <nav className='p-6 border-b border-gray-300'>
            <Link href='/'>
                <span className='mr-6 cursor-pointer'>Posts</span>
            </Link>

            { signedInUser && (
                <Link href='/create-post'>
                    <span className='mr-6 cursor-pointer'>Create Post</span>
                </Link>
            )}

            { signedInUser && (    
                <Link href='/admin'>
                    <span className='mr-6 cursor-pointer'>Admin</span>
                </Link>
            )}
        </nav>
    )
}
