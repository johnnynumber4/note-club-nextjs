import { fetcher } from '@/lib/fetch';
import useSWRInfinite from 'swr/infinite';

// Common hook logic
function usePosts({ author, limit = 10, endpoint = '/api/posts' } = {}) {
  const { data, error, size, ...props } = useSWRInfinite(
    (index, previousPageData) => {
      // Reached the end
      if (previousPageData && previousPageData.posts.length === 0) return null;

      const searchParams = new URLSearchParams();
      searchParams.set('limit', limit);

      if (author) searchParams.set('by', author);

      if (index !== 0) {
        // Using oldest posts createdAt date as cursor
        const before = new Date(
          new Date(
            previousPageData.posts[previousPageData.posts.length - 1].createdAt
          ).getTime()
        );
        searchParams.set('before', before.toJSON());
      }

      return `${endpoint}?${searchParams.toString()}`;
    },
    fetcher,
    {
      // refreshInterval: 10000,
      // revalidateAll: false,
    }
  );

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.posts?.length < limit);

  return {
    data,
    error,
    size,
    isLoadingMore,
    isReachingEnd,
    ...props,
  };
}

// Hooks using the common logic
export function usePostPages(params) {
  return usePosts(params);
}

export function useLastPost(params) {
  return usePosts({ ...params, limit: 1 });
}
