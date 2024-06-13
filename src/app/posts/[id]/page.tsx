"use client";

import type { Post, GetPostQuery } from "../../../API";
import { useEffect, useState } from "react";
import { API, Storage } from "aws-amplify";
import { getPost } from "@/graphql/queries";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import BlogDetails from "../../components/blog-details";

interface ParamsInterface {
  params: { id: string };
}

export default function Page({ params: { id } }: ParamsInterface) {
  const [post, setPost] = useState<Post | null>(null);
  const [coverImage, setCoverImage] = useState<any>(null);

  useEffect(() => {
    fetchPost();
    async function fetchPost() {
      if (!id) return;
      const { data } = (await API.graphql({
        query: getPost,
        variables: { id },
      })) as { data: GetPostQuery };
      setPost(data.getPost ?? null);
      await updateCoverImage();
    }
  }, [id, post?.coverImage]);

  if (!post) return null;

  async function updateCoverImage() {
    if (post?.coverImage) {
      const imageKey = await Storage.get(post.coverImage);
      setCoverImage(imageKey);
    }
  }

  return (
    <div className="container px-10 mx-auto">
      <h1 className="text-5xl mt-4 font-semibold tracking-wide text-center">
        {post.title}
      </h1>
      <BlogDetails 
        author={post.author ?? ""}
      />
      {coverImage && (
        <img
          src={coverImage}
          className="object-cover h-96 w-4/5 mt-4 mx-auto"
        />
      )}
      <div className="container mt-8 w-4/5 p-4 bg-white bg-opacity-75">
        <ReactMarkdown className="prose">{post.content}</ReactMarkdown>
      </div>
    </div>
  );
}
