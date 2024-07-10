import { useEffect, useState, useRef, type ChangeEvent } from "react";
import type { GetPostQuery } from "../../API";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { uploadData } from "aws-amplify/storage";
import { getUrl } from "aws-amplify/storage/server";
import { generateClient } from "aws-amplify/api";
import { getPost } from '../../graphql/queries';
import { createPost, updatePost } from "../../graphql/mutations";
import { v4 as uuid } from "uuid";
import { getDisplayDate } from '../utils/getDisplayDate';
import { runWithAmplifyServerContext } from '../utils/amplifyServerUtils';
import BlogButton from "./blog-button";
import BlogInput from "./blog-input";
import BlogSummary from "./blog-summary";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
    ssr: false,
});

interface Props {
    id?: string
}

export default function BlogEditing({ id }: Readonly<Props>) {
    const client = generateClient();

    const [blogId, setBlogId] = useState<string | null>(null)
    const [author, setAuthor] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [summary, setSummary] = useState<string>('');
    const [content, setContent] = useState<string>('');

    const [coverImage, setCoverImage] = useState<any>(null);
    const [displayImage, setDisplayImage] = useState<string | null>(null)
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    const [saving, setSaving] = useState<boolean>(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (id) {
            setBlogId(id);
            fetchPost();
        }
    }, []);

    async function fetchPost() {
        if (!id) return;

        const { data } = await client.graphql({
          query: getPost,
          variables: { id },
        }) as { data: GetPostQuery };

        const { author, title, summary, coverImage, content, updatedAt } = data.getPost ?? {};

        if (author) setAuthor(author);
        if (title) setTitle(title);
        if (summary) setSummary(summary);
        if (content) setContent(content);
        if (updatedAt) setLastSaved(getDisplayDate(updatedAt, true));

        if (coverImage) {
          const imageUrl = await runWithAmplifyServerContext({
            nextServerContext: null,
            operation: (contextSpec: any) =>
              getUrl(contextSpec, {
                key: coverImage ?? ""
              })
          })
          setCoverImage(coverImage);
          setDisplayImage(imageUrl.url.toString());
        }
      }

    async function uploadImage() {
        hiddenFileInput.current && hiddenFileInput.current.click();
      }

    async function handleImageSelection(e: ChangeEvent & { target: HTMLInputElement }) {
        const fileUploaded = e.target.files?.[0];
        if (!fileUploaded) return;

        setNewImageFile(fileUploaded);
        setCoverImage(`${fileUploaded.name}_${uuid()}`);
        setDisplayImage(URL.createObjectURL(fileUploaded));
    }

    async function updateBlogPost(isPublishing: boolean = false) {
        if (!title || !content) return;

        const status = isPublishing ? 'Published' : 'Draft';
        const publishedAt = isPublishing ? new Date().toISOString() : null;
        if (newImageFile) await saveNewImage();

        const input = { author, title, summary, coverImage, content, status, publishedAt }

        try {
          if (blogId) {
            const response = await client.graphql({
              query: updatePost,
              variables: { input: { ...input, id: blogId } },
              authMode: 'userPool',
            });
            saveUpdatedAtAndId(response.data?.updatePost)
            if (isPublishing) router.push(`/posts/${blogId}`);
          } else {
            const response = await client.graphql({
              query: createPost,
              variables: { input },
              authMode: 'userPool',
            });
            const { id } = saveUpdatedAtAndId(response.data?.createPost)
            if (isPublishing) router.push(`/posts/${id}`);
          }
        } catch (error) {
          console.log({ error });
        }


        setSaving(true)
        setTimeout(() => setSaving(false), 3000)
    }

    async function saveNewImage() {
        try {
          if (newImageFile) {
            await uploadData({
              key: coverImage,
              data: newImageFile
            });
          }
        } catch (error) {
          console.log({ error });
        }
    }

    function saveUpdatedAtAndId(data: { updatedAt: string, id: string}) {
      const { updatedAt, id: savedBlogId } = data ?? {};

      setLastSaved(updatedAt ? getDisplayDate(updatedAt, true) : null);
      if(!blogId && savedBlogId) setBlogId(savedBlogId);
      return{ id: savedBlogId };
    }

    return (
        <div>
            <div className="container">
                <p className={`text-light-red mt-4 block ${saving ? " visible" : "invisible"}`}>Changes have been saved</p>
                <p className={"float-right"}>Last updated: {lastSaved}</p>
            </div>
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
            <BlogInput
                name="author"
                label="Author"
                value={author ?? ""}
                placeholder="Enter name of author"
                onChange={((e: Event & { target: HTMLInputElement }) => setAuthor(e.target.value))}
            />
            <BlogInput
                name="title"
                label="Title"
                value={title ?? ""}
                placeholder="Enter blog title"
                isBoldFont={true}
                onChange={((e: Event & { target: HTMLInputElement }) => setTitle(e.target.value))}
            />
            <BlogSummary
                value={summary ?? ""}
                onChange={((e: Event & { target: HTMLInputElement }) => setSummary(e.target.value))}
            />
            {displayImage && (
                <Image
                    src={displayImage}
                    className="object-cover h-96 w-4/5 my-4 mx-auto"
                    alt="blog image"
                    width={800}
                    height={800}
                />
            )}
            <SimpleMDE
                value={content ?? ""}
                onChange={(value) => setContent(value)}
            />
            <input
                type="file"
                ref={hiddenFileInput}
                className="absolute w-0 h-0"
                onChange={handleImageSelection}
                data-testid='file-input'
            />
        </div>
    )
}
