export const ValidateProps = {
  user: {
    username: { type: 'string', minLength: 4, maxLength: 20 },
    name: { type: 'string', minLength: 1, maxLength: 50 },
    email: { type: 'string', minLength: 1 }, // Removed password validation
    bio: { type: 'string', minLength: 0, maxLength: 160 },
  },
  post: {
    albumTitle: { type: 'string', minLength: 1, maxLength: 280 },
    albumArtist: { type: 'string', minLength: 1, maxLength: 280 },
    wikiDesc: { type: 'string', minLength: 1 },
    yt: { type: 'string', minLength: 1, maxLength: 280 },
    theme: { type: 'string', minLength: 1, maxLength: 100 },
    albumArt: { type: 'string', minLength: 1, maxLength: 280 },
  },
  comment: {
    content: { type: 'string', minLength: 1, maxLength: 280 },
  },
};
