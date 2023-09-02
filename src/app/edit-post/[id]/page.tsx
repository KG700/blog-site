"use client";

import type { Post } from '@/app/types';
import { withAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic";
import { updatePost } from '../../../graphql/mutations';
import { getPost } from '../../../graphql/queries';
import { Amplify } from "aws-amplify";
import config from '../../../aws-exports'
import 'easymde/dist/easymde.min.css';

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false })

Amplify.configure({ ...config, ssr: true });

function EditPost({
    params: { id },
  }: {
    params: { id: string }
  }) {
    const [ post, setPost ] = useState<Post | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchPost();
        async function fetchPost() {
            if (!id) return;
            const { data } = await API.graphql({
                query: getPost, variables: { id }
            }) as { data: { getPost: Post } }
            setPost(data.getPost);
        }
    }, [id])

    if (!post) return null;

    function onChange(e: any) {
        setPost(() => ({ ...post, [e.target.name]: e.target.value } as Post))
    }

    const { title, content } = post;

    async function updateEditedPost() {
        if (!title || !content) return;

        await API.graphql({
            query: updatePost,
            variables: { input: { id, title, content } },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        })
        
        router.push(`/posts/${id}`);
    }

    return (
        <div>
            <h1 className="text-3xl font-semibold tracking-wide mt-6">Edit post</h1>
            <input 
                onChange={onChange}
                name="title"
                placeholder="Title"
                value={post.title}
                className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
            />
            <SimpleMDE value={post.content} onChange={value => setPost({ ...post, content: value })} />
            <button 
                className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg" 
                onClick={updateEditedPost}
            >Update Post</button>
        </div>
    )
}

export default withAuthenticator(EditPost);