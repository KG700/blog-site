"use client";

import type { Post } from '@/app/types';
import { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { Amplify } from "aws-amplify";
import config from '../aws-exports'
import { listPosts } from '@/graphql/queries';
import { deletePost } from '@/graphql/mutations'
import { authListener } from '@/app/utils/authListener';
import Card from '@/app/components/card';

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
    <div className='container px-10'>
      <h1 className='text-3xl font-semibold tracking-wide mt-6 mb-2 text-center'>Blog Posts:</h1>
      {
        posts.map((post, index) => (
          <Card 
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
            coverImage={post.coverImage}
            signedInUser={signedInUser}
            deleteFn={deleteBlogPost}
          />
        ))
      }
    </div>
  )
}