"use client";

import type { Post, PostsByStatusAndUpdatedAtQuery } from "../../API";
import { ModelSortDirection } from "../../API";
import { useState, useEffect } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { postsByStatusAndUpdatedAt } from "@/graphql/queries";
import { deletePost } from "@/graphql/mutations";
import BlogTile from "../components/blog-tile";

const client = generateClient();

function DraftPosts() {
  const [posts, setPosts] = useState<(Post | null)[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const variables = {
      status: 'Draft',
      sortDirection: ModelSortDirection.DESC
    }
    const { data } = (await client.graphql({
      query: postsByStatusAndUpdatedAt,
      variables: variables,
    })) as { data: PostsByStatusAndUpdatedAtQuery };
    setPosts(data.postsByStatusAndUpdatedAt?.items ?? []);
  }

  async function deleteBlogPost(id: string) {
    await client.graphql({
      query: deletePost,
      variables: { input: { id } },
      authMode: "userPool",
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
          <BlogTile
            key={post?.id ?? ""}
            id={post?.id ?? ""}
            author={post?.author ?? ""}
            title={post?.title ?? ""}
            summary={post?.summary ?? ""}
            lastUpdatedAt={post?.updatedAt ?? undefined}
            coverImage={post?.coverImage ?? null}
            signedInUser={true}
            deleteFn={deleteBlogPost}
          />
        );
      })}
    </div>
  );
}

export default withAuthenticator(DraftPosts);
