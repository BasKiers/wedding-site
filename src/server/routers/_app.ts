/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../trpc';
import { postRouter } from './post';
import { reactHookFormRouter } from '~/server/routers/reactHookForm';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  post: postRouter,

  form: reactHookFormRouter,
});

export type AppRouter = typeof appRouter;
