import { findPostById } from '@/api-lib/db';
import { getMongoDb } from '@/api-lib/mongodb';
import { UserPost } from '@/page-components/UserPost';
import Head from 'next/head';
import { useSession } from 'next-auth/react'; // Import useSession

export default function UserPostPage({ post }) {
  const { data: session } = useSession(); // Get the session data

  // Convert the post's createdAt field to a Date object if it's not a string
  if (typeof post.createdAt !== 'string') {
    post.createdAt = new Date(post.createdAt);
  }

  // Ensure the post creator is the authenticated user
  const isAuthor = session?.user?.name === post.creator.username;
  console.log('isAuthor:', isAuthor);

  return (
    <>
      <Head>
        <title>
          {post.creator.name} ({post.creator.username}): {post.albumTitle}
        </title>
      </Head>
      <UserPost post={post} isAuthor={isAuthor} />
    </>
  );
}

export async function getServerSideProps(context) {
  const db = await getMongoDb();

  const post = await findPostById(db, context.params.postId);
  if (!post) {
    return {
      notFound: true,
    };
  }

  // Ensure the post's creator username matches the URL params
  if (context.params.username !== post.creator.username) {
    return {
      redirect: {
        destination: `/user/${post.creator.username}/post/${post._id}`,
        permanent: false,
      },
    };
  }

  // Convert ObjectIDs and Dates to strings for easier handling in the client
  post._id = String(post._id);
  post.author = String(post.author);
  post.creator._id = String(post.creator._id);
  post.createdAt = post.createdAt.toJSON();

  return { props: { post } };
}
