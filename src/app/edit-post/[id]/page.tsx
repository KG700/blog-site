"use client";

import { withAuthenticator } from "@aws-amplify/ui-react";
import { useState } from "react";
import { generateClient } from "aws-amplify/api";
import { Amplify } from "aws-amplify";
import config from "../../../aws-exports";
import BlogButton from "../../components/blog-button";
import BlogEditing from '../../components/blog-editing';
import { assistWithSummary } from "../../../graphql/queries";
import "easymde/dist/easymde.min.css";

Amplify.configure(config, { ssr: true });

function EditPost({ params: { id } }: { params: { id: string } }) {
  const client = generateClient();

  // const [assistantSummary, setAssistantSummary] = useState("");

  // async function getAssistantSummary(content: string) {
  //   const output = await client.graphql({
  //     query: assistWithSummary,
  //     variables: { summary: content },
  //   }) as { data: { assistWithSummary: string }};
  //   setAssistantSummary(output?.data.assistWithSummary);
  // }

  return (
    <div className="container px-10 mx-auto">
      <h1 className="text-3xl font-semibold tracking-wide mt-6">Edit post</h1>
      {/* <BlogButton
          label="Assistant Summary"
          type="secondary"
          onClickFn={getAssistantSummary}
      /> */}
      {/* <p>{assistantSummary}</p> */}
      <BlogEditing id={id} />
    </div>
  );
}

export default withAuthenticator(EditPost);
