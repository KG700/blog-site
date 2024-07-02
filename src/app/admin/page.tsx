"use client";

import { Authenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { generateClient } from "aws-amplify/api";
import { useState, useEffect } from "react";
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from "aws-amplify";
import { getAdminProfile } from "../../graphql/queries";
import { createAdminProfile, updateAdminProfile } from "../../graphql/mutations";
import type { GetAdminProfileQuery } from "../../API";
import config from '../../aws-exports';
import BlogButton from '../components/blog-button';
import BlogInput from '../components/blog-input';

Amplify.configure(config, { ssr: true });
const client = generateClient();

export default function Admin() {
    const [userId, setUserId] = useState<string>("");
    const [displayName, setDisplayName] = useState<string | null>(null)
    const [isNewUser, setIsNewUser] = useState<boolean>(false)

    useEffect(() => {
        getUserAttributes();
    }, [])

    async function getUserAttributes() {
        try {
          const { sub } = await fetchUserAttributes();
          if (!sub) throw new Error()
          setUserId(sub);
          fetchAdminProfile(sub);
        } catch (error) {
          console.log(error);
        }
    }

    async function fetchAdminProfile(userId: string) {
        const { data } = await client.graphql({
            query: getAdminProfile,
            variables: { id: userId }
        }) as { data: GetAdminProfileQuery }
        if (data.getAdminProfile) {
            setDisplayName(data.getAdminProfile?.displayName ?? null);
        } else {
            setIsNewUser(true);
        }
    }

    function onChange(e: any) {
        setDisplayName(e?.target.value as string);
    }

    async function saveProfile() {
        const query = isNewUser ? createAdminProfile : updateAdminProfile;
        await client.graphql({
            query: query,
            variables: { input: { id: userId, displayName: displayName ?? user?.username ?? 'no-name' }}
        })
    }

    return (
        <Authenticator hideSignUp >
            {({ signOut, user }) => (
                <main className='container'>
                    <h1>Hello {isNewUser ? user?.username : displayName}</h1>
                    <BlogInput
                        name='displayName'
                        label="Display Name"
                        width='short'
                        value={displayName ?? user?.username}
                        onChange={onChange}
                    />
                    <BlogButton
                        label="Save"
                        type="primary"
                        onClickFn={saveProfile}
                    />

                    <BlogButton
                        label="Sign out"
                        type="primary"
                        onClickFn={signOut}
                    />
                </main>
            )}
        </Authenticator>

    )
}

// export default withAuthenticator(Admin);
