import { findPostById } from '@/api-lib/db';
import { getMongoDb } from '@/api-lib/mongodb';
import { UserPost } from '@/page-components/UserPost';
import Head from 'next/head';
import { useSession } from 'next-auth/react';

export async function getServerSideProps(context) {
  const { postId } = context.params;
  const db = await getMongoDb();
  const post = await findPostById(db, postId);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)), // Ensure dates are serialized
    },
  };
}

export default function UserPostPage({ post }) {
  const { data: session } = useSession();

  if (typeof post.createdAt !== 'string') {
    post.createdAt = new Date(post.createdAt);
  }

  const isAuthor = session?.user?.name === post.author;

  return (
    <>
      <Head>
        <title>
          {post.author} ({post.author}): {post.albumTitle}
        </title>
      </Head>
      <UserPost post={post} isAuthor={isAuthor} />
    </>
  );
}
