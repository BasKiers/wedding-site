import { ContentfulClientApi, createClient } from 'contentful';

const getContentAPI = (): ContentfulClientApi<undefined> => {
  const {
    NEXT_PUBIC_CONTENTFUL_SPACE_ID: space,
    NEXT_PUBIC_CONTENTFUL_API_TOKEN: accessToken,
  } = process.env;

  if (!space || !accessToken) {
    console.log('NO ENV', process.env);
    return (() => {
      throw new Error(
        'Could not call content API, env variables not configured',
      );
    }) as any;
  }

  return createClient({
    space,
    accessToken,
  });
};

export const contentAPI = getContentAPI();
