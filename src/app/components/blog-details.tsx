import Image from "next/image";
import { getDisplayDate } from '@/app/utils/getDisplayDate';

interface Props {
  author: string
  publishedAt?: string
}

export default function BlogDetails({ author, publishedAt }: Props) {

    return (
        <div className="m-8 flex items-center">
        <Image
          className="h-16 w-16 p-2 rounded-full inline-block content-center"
          src="/pexels-olly-3824771.jpg"
          alt="smiling man"
          width={800}
          height={800}
        />
        <div className="p-2 inline-block h-full">
          <h2 className="text-lg">By { author }</h2>
          {publishedAt &&
            <p className="text-sm">Published: {getDisplayDate(publishedAt)}</p>
          }
        </div>
      </div>
    )
}
