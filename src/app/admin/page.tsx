"use client";

import { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import { Authenticator } from '@aws-amplify/ui-react';
import { AuthUser, fetchUserAttributes } from 'aws-amplify/auth';
import { generateClient } from "aws-amplify/api";
import { getAdminProfile } from "../../graphql/queries";
import { createAdminProfile, updateAdminProfile } from "../../graphql/mutations";
import type { GetAdminProfileQuery } from "../../API";
import config from '../../aws-exports';
import BlogButton from '../components/blog-button';
import BlogInput from '../components/blog-input';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(config, { ssr: true });

export default function Admin(): JSX.Element {
    const client = generateClient();

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

    async function saveProfile(user: AuthUser | undefined) {
        const query = isNewUser ? createAdminProfile : updateAdminProfile;
        try {
            await client.graphql({
                query: query,
                variables: { input: { id: userId, displayName: displayName ?? user?.username ?? 'no-name' }}
            })
        } catch (error) {
            console.log({ error })
        }
    }

    return (
        <Authenticator hideSignUp >
            {({ signOut, user }) => (
                <main className='container'>
                    <h1>Hello {displayName ?? user?.username}</h1>
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
                        onClickFn={(user: AuthUser | undefined) => saveProfile(user)}
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
