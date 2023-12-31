// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const { env } = require('./src/server/env');

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function getConfig(config) {
  return config;
}

/**
 * @link https://nextjs.org/docs/api-reference/next.config.js/introduction
 */
module.exports = getConfig({
  /**
   * Dynamic configuration available for the browser and server.
   * Note: requires `ssr: true` or a `getInitialProps` in `_app.tsx`
   * @link https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration
   */
  publicRuntimeConfig: {
    NODE_ENV: env.NODE_ENV,
    NEXT_PUBIC_CONTENTFUL_SPACE_ID: env.NEXT_PUBIC_CONTENTFUL_SPACE_ID,
    NEXT_PUBIC_CONTENTFUL_API_TOKEN: env.NEXT_PUBIC_CONTENTFUL_API_TOKEN,
  },
  /** We run eslint as a separate task in CI */
  eslint: { ignoreDuringBuilds: !!process.env.CI },

  async rewrites() {
    return [
      {
        source: '/',
        destination: '/home',
      },
      {
        source: '/programma',
        destination: '/home',
      },
      {
        source: '/cadeautips',
        destination: '/home',
      },
      {
        source: '/locatie',
        destination: '/home',
      },
      {
        source: '/rsvp',
        destination: '/home',
      },
    ];
  },
});
