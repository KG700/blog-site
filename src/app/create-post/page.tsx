"use client";

import type { CreatePostInput } from "../../API";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { useState, useRef } from "react";
import { API, Storage } from "aws-amplify";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createPost } from "../../graphql/mutations";
import { Amplify } from "aws-amplify";
import config from "../../aws-exports";
import BlogButton from "../components/blog-button";
import "easymde/dist/easymde.min.css";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

Amplify.configure({ ...config, ssr: true });

const initialState: CreatePostInput = {
  id: "",
  author: "",
  title: "",
  content: "",
  coverImage: null,
  isPublished: false
};

function CreatePost() {
  const [post, setPost] = useState<CreatePostInput>(initialState);
  const [image, setImage] = useState<Blob | null>(null);
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { title, content } = post;

  function onChange(e: any) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }));
  }

  async function uploadImage() {
    hiddenFileInput.current && hiddenFileInput.current.click();
  }

  function handleChange(e: any) {
    const fileUploaded = e.target.files[0];
    if (!fileUploaded) return;
    setImage(fileUploaded);
  }

  async function publishPost() {
    if (!title || !content) return;
    const id = uuid();
    post.id = id;
    post.isPublished = true;
    post.publishedAt = new Date().toISOString();

    if (image) {
      const fileName = `${image.name}_${uuid()}`;
      post.coverImage = fileName;
      await Storage.put(fileName, image);
    }

    await API.graphql({
      query: createPost,
      variables: { input: post },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });

    router.push(`/posts/${id}`);
  }

  async function savePost() {
    if (!title || !content) return;
    const id = uuid();
    post.id = id;
    post.isPublished = false;

    if (image) {
      const fileName = `${image.name}_${uuid()}`;
      post.coverImage = fileName;
      await Storage.put(fileName, image);
    }

    await API.graphql({
      query: createPost,
      variables: { input: post },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });

    router.push(`/edit-post/${id}`);
  }

  return (
    <div className="container px-10 mx-auto">
      <h1 className="text-3xl font-semibold tracking-wide mt-6">
        Create new post
      </h1>
      <BlogButton
        label="Upload Image"
        type="secondary"
        onClickFn={uploadImage}
      />
      <BlogButton
        label="Save"
        type="secondary"
        onClickFn={savePost}
      />
      <BlogButton
        label="Publish"
        type="primary"
        onClickFn={publishPost}
      />
      <input
        onChange={onChange}
        name="author"
        placeholder="Author's name"
        value={post.author ?? ""}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      />
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={post.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      />
      {image && <img src={URL.createObjectURL(image)} className="object-cover h-96 w-4/5 my-4 mx-auto" />}
      <SimpleMDE
        value={post.content}
        onChange={(value) => setPost({ ...post, content: value })}
      />
      <input
        type="file"
        ref={hiddenFileInput}
        className="absolute w-0 h-0"
        onChange={handleChange}
      />
    </div>
  );
}

export default withAuthenticator(CreatePost);
