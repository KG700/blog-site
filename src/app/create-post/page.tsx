"use client";

import { withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import config from "../../aws-exports";
import BlogEditing from "../components/blog-editing";
import "easymde/dist/easymde.min.css";

Amplify.configure(config, { ssr: true });

function CreatePost(): JSX.Element {

  return (
    <div className="container px-10 mx-auto">
      <h1 className="text-3xl font-semibold tracking-wide mt-6">
        Create new post
      </h1>
      <BlogEditing />
    </div>
  );
}

export default withAuthenticator(CreatePost);
