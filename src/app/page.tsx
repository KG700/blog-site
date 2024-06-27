"use client";

import type { Post, ListPostsQuery } from "../API";
import { useState, useEffect } from "react";
import { getUrl } from "aws-amplify/storage/server";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import config from "../aws-exports";
import Image from "next/image";
import { listPosts } from "@/graphql/queries";
import { deletePost } from "@/graphql/mutations";
import { authListener } from "@/app/utils/authListener";
import BlogTile from "@/app/components/blog-tile";
import { runWithAmplifyServerContext } from '@/app/utils/amplifyServerUtils';

Amplify.configure(config, { ssr: true });
const client = generateClient();

export default function Home() {
  const [posts, setPosts] = useState<(Post | null)[]>([]);
  const [signedInUser, setSignedInUser] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState("") as any;

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
    const { data } = (await client.graphql({
      query: listPosts,
      variables: variables,
    })) as { data: ListPostsQuery };
    setPosts(data.listPosts?.items ?? []);
  }

  async function getSignedInUser() {
    const isSignedIn = await authListener();
    setSignedInUser(isSignedIn);
  }

  async function getCoverImageUrl() {
    try {
      const coverImageUrl = await runWithAmplifyServerContext({
        nextServerContext: null,
        operation: (contextSpec: any) =>
          getUrl(contextSpec, {
            key: '20231020_175243.jpg'
          })
      });
      setCoverImageUrl(coverImageUrl.url.toString())
    } catch (error) {
      console.log({ error });
    }
  }

  async function deleteBlogPost(id: string) {
    await client.graphql({
      query: deletePost,
      variables: { input: { id } },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });

    fetchPosts();
  }

  return (
    <div>
      {coverImageUrl && <Image
        className="absolute -z-10 object-cover w-full h-96"
        src={coverImageUrl}
        alt="background image"
        width={800}
        height={800}
        priority={true}
      />}
      <div className="container px-10 mx-auto">
        <h1 className="text-3xl font-semibold tracking-wide mb-2 text-center">
          Blog Posts:
        </h1>
        <div className="mt-60">
          {posts.map((post, index) => (
            <BlogTile
              key={post?.id}
              id={post?.id ?? ""}
              author={post?.author ?? ""}
              title={post?.title ?? ""}
              summary={post?.summary ?? ""}
              isPublished={post?.isPublished ?? false}
              publishedAt={post?.publishedAt ?? undefined}
              coverImage={post?.coverImage ?? null}
              signedInUser={signedInUser}
              deleteFn={deleteBlogPost}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
