import { useEffect, useState } from "react";
import { getUrl } from "aws-amplify/storage/server";
import Link from "next/link";
import Image from "next/image";
import BlogDetails from "./blog-details";
import BlogButton from "./blog-button";
import { runWithAmplifyServerContext } from '@/app/utils/amplifyServerUtils';

interface Props {
  id: string,
  author: string,
  title: string,
  summary: string,
  coverImage: string | null,
  isPublished: boolean,
  publishedAt?: string,
  signedInUser: boolean;
  deleteFn: (id: string) => {};
}

export default function BlogTile({
  id,
  author,
  title,
  summary,
  coverImage,
  isPublished,
  publishedAt,
  signedInUser,
  deleteFn,
}: Props) {
  const [coverImageUrl, setCoverImageUrl] = useState<any>(null);

  useEffect(() => {
    updateCoverImage();
  }, []);

  async function updateCoverImage() {
    if (coverImage) {
      try {
        const coverImageUrl = await runWithAmplifyServerContext({
          nextServerContext: null,
          operation: (contextSpec: any) => getUrl(contextSpec, {
            key: coverImage
          })
        })
        setCoverImageUrl(coverImageUrl.url.toString());
      } catch (error) {
        console.log({ error });
      }
    }
  }

  return (
    <div className="bg-white text-blog-blue max-w-lg rounded overflow-hidden shadow-lg mb-8 mx-auto">
      <Link href={`/posts/${id}`}>
        {coverImageUrl && (
          <Image
            className="object-cover h-60 w-full p-3"
            src={coverImageUrl}
            alt="Sunset in the mountains"
            width={800}
            height={800}
          />
        )}
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{title}</div>
          <BlogDetails
            author={author}
            publishedAt={publishedAt}
          />
          <p className="text-gray-700 text-base">{summary}</p>
        </div>

      </Link>
      {signedInUser && (
        <BlogButton
          label="Edit Post"
          type="secondary"
          onClickFn={() => {location.href = `/edit-post/${id}`}}
        />
      )}
      {signedInUser && (
        <BlogButton
          label="Delete Post"
          type="warning"
          onClickFn={() => {
            deleteFn(id);
          }}
        />
      )}
    </div>
  );
}
