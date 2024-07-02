"use client";

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from "aws-amplify";
import config from '../../aws-exports';
import BlogButton from '../components/blog-button';

Amplify.configure(config, { ssr: true });

export default function Admin() {
    return (
        <Authenticator>
            {({ signOut, user }) => (
                <main>
                    <h1>Hello {user?.username}</h1>
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
