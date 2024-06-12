"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Auth, Hub } from "aws-amplify";
import { usePathname } from "next/navigation";

export default function Nav() {
  const [signedInUser, setSignedInUser] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    authListener();
  }, []);

  async function authListener() {
    Hub.listen("auth", (data) => {
      switch (data.payload.event) {
        case "signIn":
          return setSignedInUser(true);
        case "signOut":
          return setSignedInUser(false);
      }
    });
    try {
      await Auth.currentAuthenticatedUser();
      setSignedInUser(true);
    } catch (error) {}
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
