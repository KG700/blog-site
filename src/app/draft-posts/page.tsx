"use client";

import type { Post } from "@/app/types";
import { useState, useEffect } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { API } from "aws-amplify";
import { listPosts } from "@/graphql/queries";
import { deletePost } from "@/graphql/mutations";
import Card from "../components/card";

function DraftPosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const variables = {
      filter: {
        isPublished: { eq: false },
      },
    };
    const { data } = (await API.graphql({
      query: listPosts,
      variables: variables,
    })) as { data: { listPosts: { items: Post[] } } };
    setPosts(data.listPosts.items);
  }

  async function deleteBlogPost(id: string) {
    await API.graphql({
      query: deletePost,
      variables: { input: { id } },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });

    fetchPosts();
  }

  return (
    <div className="container px-10 mx-auto">
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2 text-center">
        Draft Blog Posts:
      </h1>
      {posts.map((post) => {
        return (
          <Card
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
            isPublished={post.isPublished}
            coverImage={post.coverImage}
            signedInUser={true}
            deleteFn={deleteBlogPost}
          />
        );
      })}
    </div>
  );
}

export default withAuthenticator(DraftPosts);
