"use client";

import { Authenticator, useAuthenticator, useTheme } from '@aws-amplify/ui-react';
// import "../styles.css";
import '@aws-amplify/ui-react/styles.css';
// import { Auth } from 'aws-amplify';
// import { useState, useEffect } from 'react';
import { View, Heading, Button } from '@aws-amplify/ui-react';
import { Amplify } from "aws-amplify";
import config from '../../aws-exports'
import BlogButton from '../components/blog-button';

Amplify.configure(config, { ssr: true });

export default function Admin() {

    // const components = {
    //     SignUp: {
    //         Header() {
    //             const { tokens } = useTheme();

    //             return (
    //               <Heading
    //                 padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
    //                 level={3}
    //               >
    //                 Create a new account
    //               </Heading>
    //             );
    //           },
    //           Footer() {
    //             const { toSignIn } = useAuthenticator();

    //             return (
    //               <View textAlign="center">
    //                 <Button
    //                   fontWeight="normal"
    //                   onClick={toSignIn}
    //                   size="small"
    //                   variation="link"
    //                 >
    //                   Head Back to Sign In
    //                 </Button>
    //               </View>
    //             );
    //           },
    //     }
    // };

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
