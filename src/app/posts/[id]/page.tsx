"use client";

import type { Post } from '@/app/types';
import { useEffect, useState } from 'react';
import { API, Storage } from "aws-amplify";
import { getPost } from "@/graphql/queries";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
 
export default function Page({
  params: { id },
}: {
  params: { id: string }
}) {
    const [ post, setPost ] = useState<Post | null>(null);
    const [ coverImage, setCoverImage ] = useState<any>(null)

    useEffect(() => {
        fetchPost();
        async function fetchPost() {
            if (!id) return;
            const { data } = await API.graphql({
                query: getPost, variables: { id }
            }) as { data: { getPost: Post } }
            setPost(data.getPost);
            await updateCoverImage()
        }
    }, [id, post?.coverImage])

    if (!post) return null;

    async function updateCoverImage() {
        if (post?.coverImage) {
            const imageKey = await Storage.get(post.coverImage);
            setCoverImage(imageKey);
        }
    }

    return (
        <div>
            <h1 className="text-5xl mt-4 font-semibold tracking-wide">{post.title}</h1>
            { coverImage && <img src={coverImage} className='mt-4' /> }
            <div className="mt-8">
                <ReactMarkdown className="prose">{post.content}</ReactMarkdown>
            </div>
        </div>
    )
}
