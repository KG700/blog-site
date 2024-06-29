"use client";

import type { UpdatePostInput, GetPostQuery, UpdatePostMutation } from "../../../API";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState, useRef } from "react";
import { uploadData } from "aws-amplify/storage";
import { getUrl } from "aws-amplify/storage/server";
import { generateClient } from "aws-amplify/api";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { updatePost } from "../../../graphql/mutations";
import { Amplify } from "aws-amplify";
import config from "../../../aws-exports";
import BlogButton from "@/app/components/blog-button";
import BlogInput from "@/app/components/blog-input";
import BlogSummary from "@/app/components/blog-summary";
import { assistWithSummary } from "../../../graphql/queries";
import { runWithAmplifyServerContext } from '@/app/utils/amplifyServerUtils';
import { getDisplayDate } from '@/app/utils/getDisplayDate';
import "easymde/dist/easymde.min.css";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

Amplify.configure(config, { ssr: true });
const client = generateClient();

function EditPost({ params: { id } }: { params: { id: string } }) {
  const [post, setPost] = useState<UpdatePostInput | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<any>(null);
  const [assistantSummary, setAssistantSummary] = useState("");
  const [saving, setSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<any>(null);
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchPost();
    async function fetchPost() {
      if (!id) return;
      const { data } = (await client.graphql({
        query: `
          query GetPost($id: ID!) {
            getPost(id: $id) {
              title
              summary
              content
              coverImage
              isPublished
              author
              id
              updatedAt
            }
          }
        `,
        variables: { id },
      })) as { data: GetPostQuery };
      const { updatedAt, ...post } = data.getPost ?? { updatedAt: null, id, title: "" };
      setPost(post ?? null);
      if (data.getPost?.coverImage) {
        const imageUrl = await runWithAmplifyServerContext({
          nextServerContext: null,
          operation: (contextSpec: any) =>
            getUrl(contextSpec, {
              key: data?.getPost?.coverImage ?? ""
            })
        })
        setCoverImageUrl(imageUrl.url.toString());
      }
      setLastSaved(updatedAt ? getDisplayDate(updatedAt) : null);
    }
  }, []);

  if (!post) return null;

  function onChange(e: any) {
    setPost(() => ({ ...post, [e?.target.name]: e?.target.value } as UpdatePostInput));
  }

  async function uploadImage() {
    hiddenFileInput.current && hiddenFileInput.current.click();
  }

  async function handleChange(e: any) {
    const fileUploaded = e.target.files[0];
    if (!fileUploaded) return;
    setNewImage(fileUploaded);
  }

  const { title, content } = post ?? {};

  async function updateBlogPost(isPublishing: boolean = false) {
    if (!title || !content || !post) return;

    post.isPublished = isPublishing;
    if(isPublishing) post.publishedAt = new Date().toISOString();

    if (newImage) {
      const fileName = `public/${newImage.name}_${uuid()}`;
      post.coverImage = fileName;
      try {
        await uploadData({
          key: fileName,
          data: newImage
        });
      } catch (error) {
        console.log({ error });
      }
    }

    try {
      const response = await client.graphql({
        query: updatePost,
        variables: { input: post },
        authMode: 'userPool',
      }) as { data: UpdatePostMutation};
      const { updatedAt } = response.data.updatePost ?? { updatedAt: null }
      setLastSaved(updatedAt ? getDisplayDate(updatedAt) : null);
    } catch (error) {
      console.log({ error });
    }

    if (isPublishing) {
      router.push(`/posts/${id}`);
    } else {
      setSaving(true)
      setTimeout(() => setSaving(false), 3000)
    }
  }

  async function getAssistantSummary() {
    const output = await client.graphql({
      query: assistWithSummary,
      variables: { summary: post?.content ?? "" },
    }) as { data: { assistWithSummary: string }};
    setAssistantSummary(output?.data.assistWithSummary);
  }

  return (
    <div className="container px-10 mx-auto">
      <div className="container">
        <p className={`text-light-red mt-4 block + ${saving ? " visible" : "invisible"}`}>Changes have been saved</p>
        <p className={"float-right"}>Last updated: {lastSaved}</p>
      </div>
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
      <BlogButton
        label="Assistant Summary"
        type="secondary"
        onClickFn={getAssistantSummary}
      />
      <p>{assistantSummary}</p>
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
        value={post.summary ?? ""}
        onChange={onChange}
      />
      {(coverImageUrl || newImage) && (
        <Image
          src={
            newImage
              ? URL.createObjectURL(newImage)
              : coverImageUrl
          }
          className="object-cover h-96 w-4/5 my-4 mx-auto"
          alt="blog image"
          width={800}
          height={800}
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
