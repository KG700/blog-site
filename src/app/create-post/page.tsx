"use client";

import { withAuthenticator } from "@aws-amplify/ui-react";
import { useState } from 'react';
import { API } from 'aws-amplify';
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/navigation';
import SimpleMDE from 'react-simplemde-editor';
// import 'easymde/dist/easymde.min.css';
import { createPost } from '../../graphql/mutations';
import { Amplify } from "aws-amplify";
import config from '../../aws-exports'

Amplify.configure({ ...config, ssr: true });

const initialState = { id: '', title: '', content: '' };

function CreatePost() {
    const [ post, setPost ] = useState(initialState);
    const { title, content } = post;
    const router = useRouter();

    function onChange(e: any) {
        setPost(() => ({ ...post, [e.target.name]: e.target.value }))
    }

    async function createNewPost() {
        if (!title || !content) return;
        const id = uuid();
        post.id = id;

        await API.graphql({
            query: createPost,
            variables: { input: post },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        })

        router.push(`/posts/${id}`);
    }

    return (
        <div>
            <h1>Create new post</h1>
        </div>
    )
}

export default withAuthenticator(CreatePost);