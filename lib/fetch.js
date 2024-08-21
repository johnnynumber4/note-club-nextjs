export const fetcher = async (...args) => {
  try {
    const res = await fetch(...args);

    if (res.status === 204) return null; // 204 does not have body

    const payload = await res.json();

    if (res.ok) {
      return payload;
    } else {
      // If there is a payload error, use it; otherwise, use a generic error message
      throw new Error(payload.error || 'Something went wrong');
    }
  } catch (error) {
    console.error('Fetcher error:', error); // Log the error for debugging
    throw error; // Re-throw the error for further handling by SWR
  }
};
