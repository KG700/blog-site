"use client";

import type { Post } from "@/app/types";
import { useState, useEffect } from "react";
import { Storage, API } from "aws-amplify";
import { Amplify } from "aws-amplify";
import config from "../aws-exports";
import { listPosts } from "@/graphql/queries";
import { deletePost } from "@/graphql/mutations";
import { authListener } from "@/app/utils/authListener";
import BlogTile from "@/app/components/blog-tile";

Amplify.configure({ ...config, ssr: true });

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [signedInUser, setSignedInUser] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState("");

  useEffect(() => {
    fetchPosts();
    getSignedInUser();
    getCoverImageUrl();
  }, []);

  async function fetchPosts() {
    const variables = {
      filter: {
        isPublished: { eq: true },
      },
    };
    const { data } = (await API.graphql({
      query: listPosts,
      variables: variables,
    })) as { data: { listPosts: { items: Post[] } } };
    setPosts(data.listPosts.items);
  }

  async function getSignedInUser() {
    const isSignedIn = await authListener();
    setSignedInUser(isSignedIn);
  }

  async function getCoverImageUrl() {
    const coverImageUrl = await Storage.get("20231020_175243.jpg");
    setCoverImageUrl(coverImageUrl);
    console.log(coverImageUrl);
  }

  async function deleteBlogPost(id: string) {
    await API.graphql({
      query: deletePost,
      variables: { input: { id } },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });

    fetchPosts();
  }

  return (
    <div>
      <img
        className="absolute -z-10 object-cover w-full h-96"
        src={coverImageUrl}
        alt="background image"
      />
      <div className="container px-10 mx-auto">
        <h1 className="text-3xl font-semibold tracking-wide mb-2 text-center">
          Blog Posts:
        </h1>
        <div className="mt-60">
          {posts.map((post, index) => (
            <BlogTile
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              isPublished={post.isPublished}
              coverImage={post.coverImage}
              signedInUser={signedInUser}
              deleteFn={deleteBlogPost}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
