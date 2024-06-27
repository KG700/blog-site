"use client";

import type { Post, GetPostQuery } from "../../../API";
import { useEffect, useState } from "react";
import Image from "next/image";
import { generateClient } from "aws-amplify/api";
import { getUrl } from "aws-amplify/storage/server";
import { getPost } from "@/graphql/queries";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import BlogDetails from "../../components/blog-details";
import { authListener } from "@/app/utils/authListener";
import BlogButton from "@/app/components/blog-button";
import { runWithAmplifyServerContext } from '@/app/utils/amplifyServerUtils';

interface ParamsInterface {
  params: { id: string };
}

const client = generateClient();

export default function Page({ params: { id } }: ParamsInterface) {
  const [post, setPost] = useState<Post | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null | undefined>(null);
  const [signedInUser, setSignedInUser] = useState(false);

  useEffect(() => {
    getSignedInUser();
    fetchPost();
    async function fetchPost() {
      if (!id) return;
      const { data } = (await client.graphql({
        query: getPost,
        variables: { id },
      })) as { data: GetPostQuery };
      setPost(data.getPost ?? null);
    }
  }, [id]);

  useEffect(() => {
    updateCoverImage();
  }, [post?.coverImage])

  if (!post) return null;

  async function updateCoverImage() {
    console.log({ coverImage: post?.coverImage })
    if (post?.coverImage) {
      try {
        const coverImageUrl = await runWithAmplifyServerContext({
          nextServerContext: null,
          operation: (contextSpec: any) =>
            getUrl(contextSpec, {
              key: post.coverImage ?? ""
            })
        });
        setCoverImageUrl(coverImageUrl.url.toString());
      } catch (error) {
        console.log({ error });
      }
    }
  }

  async function getSignedInUser() {
    const isSignedIn = await authListener();
    setSignedInUser(isSignedIn);
  }

  return (
    <div className="container px-10 mx-auto">
      {signedInUser &&
        <BlogButton
          label="Edit Post"
          type="primary"
          onClickFn={() => {location.href = `/edit-post/${id}`}}
        />
      }
      <h1 className="text-5xl mt-4 font-semibold tracking-wide text-center">
        {post.title}
      </h1>
      <div className="container w-4/5">
        <BlogDetails
          author={post.author ?? ""}
          publishedAt={post.publishedAt ?? undefined}
        />
      </div>
      <p className="container text-xl mt-8 w-4/5 p-4 font-semibold">{post.summary ?? ""}</p>
      {coverImageUrl && <Image
          className="object-cover h-96 w-4/5 mt-4 mx-auto"
          src={coverImageUrl}
          alt="blog image"
          width={800}
          height={800}
        />
      }
      <div className="container mt-8 w-4/5 p-4 bg-white bg-opacity-75">
        <ReactMarkdown className="prose">{post.content}</ReactMarkdown>
      </div>
    </div>
  );
}
