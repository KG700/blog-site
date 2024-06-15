"use client";

import type { Post, UpdatePostInput, GetPostQuery } from "../../../API";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState, useRef } from "react";
import { API, Storage } from "aws-amplify";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { updatePost } from "../../../graphql/mutations";
import { getPost } from "../../../graphql/queries";
import { Amplify } from "aws-amplify";
import config from "../../../aws-exports";
import BlogButton from "../../components/blog-button";
import "easymde/dist/easymde.min.css";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

Amplify.configure({ ...config, ssr: true });

function EditPost({ params: { id } }: { params: { id: string } }) {
  const [post, setPost] = useState<UpdatePostInput | null>(null);
  const [coverImage, setCoverImage] = useState<any>(null);
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchPost();
    async function fetchPost() {
      if (!id) return;
      const { data } = (await API.graphql({
        query: `
          query GetPost($id: ID!) {
            getPost(id: $id) {
              title
              content
              coverImage
              isPublished
              author
              id
            }
          }
        `,
        variables: { id },
      })) as { data: GetPostQuery };
      if (data.getPost?.coverImage) {
        const imageKey = await Storage.get(data.getPost.coverImage);
        setCoverImage(imageKey);
      }
      setPost(data.getPost ?? null);
    }
  }, [id, post?.coverImage]);

  if (!post) return null;

  function onChange(e: any) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value } as UpdatePostInput));
  }

  async function uploadImage() {
    hiddenFileInput.current && hiddenFileInput.current.click();
  }

  function handleChange(e: any) {
    const fileUploaded = e.target.files[0];
    if (!fileUploaded) return;
    setCoverImage(fileUploaded);
  }

  const { title, content } = post;

  async function updateBlogPost(isPublishing: boolean = false) {
    if (!title || !content) return;
     
    if(post && isPublishing) {
      post.publishedAt = new Date().toISOString();
    }

    if (coverImage && typeof coverImage !== "string") {
      const fileName = `${coverImage.name}_${uuid()}`;
      if (post) post.coverImage = fileName;
      await Storage.put(fileName, coverImage);
    }

    try {
      await API.graphql({
        query: updatePost,
        variables: { input: post },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });
    } catch (error) {
      console.log({ error });
    }

    if (isPublishing) {
      router.push(`/posts/${id}`);
    } else {
      // TODO - display a messge to say page has been saved
    }
  }

  return (
    <div className="container px-10 mx-auto">
      <h1 className="text-3xl font-semibold tracking-wide mt-6">Edit post</h1>
      <BlogButton
        label="Upload Image"
        type="secondary"
        onClickFn={uploadImage}
      />
      <BlogButton
        label="Save"
        type="secondary"
        onClickFn={() => updateBlogPost(false)}
      />
      <BlogButton
        label="Publish"
        type="primary"
        onClickFn={() => updateBlogPost(true)}
      />
      <input
        onChange={onChange}
        name="author"
        placeholder="Author's name"
        value={post.author ?? ""}
        className="border-b pb-2 text-2xl my-4 focus:outline-none w-full font-bold text-gray-500 placeholder-gray-500 y-2"
      />
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={post.title ?? ""}
        className="border-b pb-2 text-2xl my-4 focus:outline-none w-full font-bold text-gray-500 placeholder-gray-500 y-2"
      />
      {coverImage && (
        <img
          src={
            typeof coverImage !== "string"
              ? URL.createObjectURL(coverImage)
              : coverImage
          }
          className="object-cover h-96 w-4/5 my-4 mx-auto"
        />
      )}
      <SimpleMDE
        value={post.content ?? ""}
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

export default withAuthenticator(EditPost);
