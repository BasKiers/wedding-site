/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../trpc';
import { postRouter } from './post';
import { reactHookFormRouter } from '~/server/routers/reactHookForm';
import { contentRouter } from '~/server/routers/content';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  post: postRouter,

  form: reactHookFormRouter,

  content: contentRouter,
});

export type AppRouter = typeof appRouter;
