import { API } from "aws-amplify";
import { listPosts, getPost } from "@/graphql/queries";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
 
export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
    const { data } = await API.graphql({
        query: getPost, variables: { id }
    }) as any
    const post = data.getPost;

    return (
        <div>
            <h1 className="text-5xl mt-4 font-semibold tracking-wide">{post.title}</h1>
            <div className="mt-8">
                <ReactMarkdown className="prose">{post.content}</ReactMarkdown>
            </div>
        </div>
    )
}
