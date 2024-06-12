import { Post } from "@/app/types";
import { useEffect, useState } from "react";
import { Storage } from "aws-amplify";
import Link from "next/link";
import BlogDetails from "./blog-details";

interface Props extends Post {
  signedInUser: boolean;
  deleteFn: (id: string) => {};
}

export default function BlogTile({
  id,
  title,
  content,
  coverImage,
  isPublished,
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
          <img
            className="object-cover h-60 w-full p-3"
            src={coverImageUrl}
            alt="Sunset in the mountains"
          />
        )}
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{title}</div>
          <BlogDetails />
          <p className="text-gray-700 text-base">{content}</p>
          <p>This post has been published: {isPublished.toString()}</p>
        </div>
        <div className="px-6 pt-4 pb-2">
          {/* <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span> */}
        </div>
      </Link>
      {signedInUser && (
        <Link href={`/edit-post/${id}`} className="text-sm mr-4 text-blue-500">
          Edit Post
        </Link>
      )}
      {signedInUser && (
        <button
          className="text-sm mr-4 text-red-500"
          onClick={() => {
            deleteFn(id);
          }}
        >
          Delete Post
        </button>
      )}
    </div>
  );
}
