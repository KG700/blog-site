"use client";

import type { Post } from '@/app/types';
import { withAuthenticator } from "@aws-amplify/ui-react";
import { useState, useRef } from 'react';
import { API, Storage } from 'aws-amplify';
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic";
import { createPost } from '../../graphql/mutations';
import { Amplify } from "aws-amplify";
import config from '../../aws-exports'
import 'easymde/dist/easymde.min.css';

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false })

Amplify.configure({ ...config, ssr: true });

const initialState: Post = { id: '', title: '', content: '' };

function CreatePost() {
    const [ post, setPost ] = useState<Post>(initialState);
    const [ image, setImage ] = useState<Blob | null>(null)
    const hiddenFileInput = useRef<HTMLInputElement>(null)
    const router = useRouter();
    
    const { title, content } = post;
    
    function onChange(e: any) {
        setPost(() => ({ ...post, [e.target.name]: e.target.value }))
    }
    
    async function uploadImage() {
        hiddenFileInput.current && hiddenFileInput.current.click()
    }

    function handleChange(e: any) {
        const fileUploaded = e.target.files[0];
        if (!fileUploaded) return;
        setImage(fileUploaded);
    }

    async function createNewPost() {
        if (!title || !content) return;
        const id = uuid();
        post.id = id;

        if (image) {
            const fileName = `${image.name}_${uuid()}`;
            post.coverImage = fileName;
            await Storage.put(fileName, image)
        }

        await API.graphql({
            query: createPost,
            variables: { input: post },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        })
        
        router.push(`/posts/${id}`);
    }
    
    return (
        <div>
            <h1 className="text-3xl font-semibold tracking-wide mt-6">Create new post</h1>
            <input 
                onChange={onChange}
                name="title"
                placeholder="Title"
                value={post.title}
                className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
            />
            { image && <img src={URL.createObjectURL(image)} className='my-4' /> }
            <SimpleMDE value={post.content} onChange={value => setPost({ ...post, content: value })} />
            <input 
                type='file'
                ref={hiddenFileInput}
                className='absolute w-0 h-0'
                onChange={handleChange}
            />
            <button
                className='bg-purple-600 text-white font-semibold px-8 py-2 rounded-lg mr-2'
                onClick={uploadImage}
            >Upload Cover Image</button>
            <button type="button" className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg" onClick={createNewPost}
            >Create Post</button>
        </div>
    )
}

export default withAuthenticator(CreatePost);