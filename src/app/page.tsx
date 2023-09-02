"use client";

import type { Post } from '@/app/types';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { API } from 'aws-amplify';
import { Amplify } from "aws-amplify";
import config from '../aws-exports'
import { listPosts } from '@/graphql/queries';
import { deletePost } from '@/graphql/mutations'
import { authListener } from '@/app/utils/authListener';

Amplify.configure({ ...config, ssr: true });

export default function Home() {
  const [ posts, setPosts ] = useState<Post[]>([]);
  const [ signedInUser, setSignedInUser ] = useState(false)

  useEffect(() => {
    fetchPosts();
    getSignedInUser()
  }, [])

  async function fetchPosts() {
    const { data } = await API.graphql({
      query: listPosts
    }) as { data: { listPosts: { items: Post[] } } }
    setPosts(data.listPosts.items);
  }

  async function getSignedInUser() {
    const isSignedIn = await authListener()
    console.log(`from Home: ${isSignedIn}`)
    setSignedInUser(isSignedIn)
  }

  async function deleteBlogPost(id: string) {

    await API.graphql({
        query: deletePost,
        variables: { input: { id } },
        authMode: "AMAZON_COGNITO_USER_POOLS"
    })

    fetchPosts();
}

  return (
    <div>
      <h1 className='text-3xl font-semibold tracking-wide mt-6 mb-2'>Blog Posts:</h1>
      {
        posts.map((post, index) => (
          <div key={'post' + index} className='border-b border-gray-300 mt-8 pb-4'>
            <h2 className='text-xl font-semibold'>{post.title}</h2>
            <p className='text-gray-500 mt-2 mb-2'>Date created: </p>
            <Link key={'view' + index} href={`/posts/${post.id}`} className='text-sm mr-4 text-blue-500'>View Post</Link>
            {
              signedInUser && (
                <Link key={'edit' + index} href={`/edit-post/${post.id}`} className='text-sm mr-4 text-blue-500'>Edit Post</Link>
            )}
            {signedInUser && (
              <button
                className='text-sm mr-4 text-red-500'
                onClick={() => { deleteBlogPost(post.id) }}
              >Delete Post</button>
              )}
          </div>
        ))
      }
    </div>
  )
}