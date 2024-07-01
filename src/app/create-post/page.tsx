"use client";

import type { CreatePostInput } from "../../API";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { useState, useRef } from "react";
import { uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/api";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { createPost } from "../../graphql/mutations";
import { Amplify } from "aws-amplify";
import config from "../../aws-exports";
import BlogButton from "../components/blog-button";
import BlogInput from "../components/blog-input";
import BlogSummary from "../components/blog-summary";
import "easymde/dist/easymde.min.css";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
const client = generateClient()

Amplify.configure(config, { ssr: true });

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
  const [image, setImage] = useState<any>(null);
  const [hasSaved, setHasSaved] = useState<boolean>(false)
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
    post.status = 'Published'

    if (image) {
      const fileName = `${image.name}_${uuid()}`;
      post.coverImage = fileName;
      try {
        await uploadData({
          key: fileName,
          data: image
        });
      } catch (error) {
        console.log({ error });
      }
    }

    await client.graphql({
      query: createPost,
      variables: { input: post },
      authMode: "userPool",
    });

    router.push(`/posts/${id}`);
  }

  async function savePost() {
    if (!title || !content) return;
    const id = uuid();
    post.id = id;
    post.isPublished = false;
    post.status = 'Draft';

    if (image) {
      const fileName = `${image.name}_${uuid()}`;
      post.coverImage = fileName;
      try {
        await uploadData({
          key: fileName,
          data: image
        });
      } catch (error) {
        console.log({ error });
      }
    }

    await client.graphql({
      query: createPost,
      variables: { input: post },
      authMode: "userPool",
    });

    setHasSaved(true)
    setTimeout(() => {
      setHasSaved(false)
      router.push(`/edit-post/${id}`);
    }, 1500)

  }

  return (
    <div className="container px-10 mx-auto">
      <p className={`text-light-red mt-4 block + ${hasSaved ? " visible" : "invisible"}`}>Saving and redirecting to edit page</p>
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
      <BlogInput
        name="author"
        label="Author"
        value={post.author ?? ""}
        placeholder="Enter name of author"
        onChange={onChange}
      />
      <BlogInput
        name="title"
        label="Title"
        value={post.title ?? ""}
        placeholder="Enter blog title"
        isboldFont={true}
        onChange={onChange}
      />
      <BlogSummary
         onChange={onChange}
      />
      {image &&
        <Image
          src={URL.createObjectURL(image)}
          className="object-cover h-96 w-4/5 my-4 mx-auto"
          alt="blog picture"
          width={800}
          height={800}
        />}
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
