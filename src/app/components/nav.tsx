"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Hub } from "aws-amplify/utils";
import { getCurrentUser } from "aws-amplify/auth"
import { usePathname } from "next/navigation";

export default function Nav() {
  const [signedInUser, setSignedInUser] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    authListener();
  }, []);

  async function authListener() {
    Hub.listen("auth", (data) => {
      console.log({ user: data.payload.event })
      switch (data.payload.event) {
        case "signedIn":
          return setSignedInUser(true);
        case "signedOut":
          return setSignedInUser(false);
      }
    });
    try {
      await getCurrentUser();
      setSignedInUser(true);
    } catch (error) {
      setSignedInUser(false);
    }
  }

  return (
    <nav className="p-6 border-b border-gray-300">
      <Link href="/" className={ pathname === '/' ? 'underline' : ''}>
        <span className="mr-6 cursor-pointer">Blog Posts</span>
      </Link>

      {signedInUser && (
        <Link href="/draft-posts" className={ pathname === '/draft-posts' ? 'underline' : ''}>
          <span className="mr-6 cursor-pointer">Draft Posts</span>
        </Link>
      )}

      {signedInUser && (
        <Link href="/create-post" className={ pathname === '/create-post' ? 'underline' : ''}>
          <span className="mr-6 cursor-pointer">Create Post</span>
        </Link>
      )}

      {signedInUser && (
        <Link href="/admin" className={ pathname === '/admin' ? 'underline' : ''}>
          <span className="mr-6 cursor-pointer">Admin</span>
        </Link>
      )}
    </nav>
  );
}
