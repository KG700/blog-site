import { useEffect, useState } from "react";
import { Storage } from "aws-amplify";
import Link from "next/link";
import Image from "next/image";
import BlogDetails from "./blog-details";
import BlogButton from "./blog-button";

interface Props {
  id: string,
  author: string,
  title: string,
  content: string,
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
  content,
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
      const imageKey = await Storage.get(coverImage);
      setCoverImageUrl(imageKey);
    }
  }

  console.log({ coverImage });
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
          <p className="text-gray-700 text-base">{content}</p>
          <p>This post has been published: {isPublished?.toString()}</p>
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
