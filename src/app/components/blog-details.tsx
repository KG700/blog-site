interface Props {
  author: string
}

export default function BlogDetails({ author }: Props) {

    return (
        <div className="m-8 flex items-center">
        <img className="h-16 w-16 p-2 rounded-full inline-block content-center" src="../../../pexels-olly-3824771.jpg" alt="smiling man" />
        <div className="p-2 inline-block h-full">
          <h2 className="text-lg">By { author }</h2>
          <p className="text-sm">Published: 12th November 2023</p>
        </div>
      </div>
    )
}