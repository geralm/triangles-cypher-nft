import createCache from '@emotion/cache';

const createEmotionCache = () => {
  return createCache({
    key: 'css',
    // prepend: true, // Optional: Prepend the styles to the head
  });
};

export default createEmotionCache;
