/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { router, publicProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import { prisma } from '~/server/prisma';
import { contentAPI } from '~/lib/contentAPI';
import { TypeGiftSuggestionCategorySkeleton } from '../../../typegen';

const defaultReserveGiftSuggestionSelect =
  Prisma.validator<Prisma.ReserveGiftSuggestionSelect>()({
    id: true,
    suggestionId: true,
    reserved: true,
  });

export const contentRouter = router({
  list: publicProcedure.query(async () => {
    const reservedMap = Object.fromEntries(
      (
        await prisma.reserveGiftSuggestion.findMany({
          select: defaultReserveGiftSuggestionSelect,
          // get an extra item at the end which we'll use as next cursor
          take: 100,
          where: {},
          orderBy: {
            createdAt: 'desc',
          },
        })
      ).map(({ suggestionId, ...rest }) => [suggestionId, rest]),
    );

    const entries =
      await contentAPI.getEntries<TypeGiftSuggestionCategorySkeleton>({
        content_type: 'giftSuggestionCategory',
        locale: 'en-US',
      });

    return {
      ...entries,
      items: entries.items.map((entry) => ({
        ...entry,
        fields: {
          ...entry.fields,
          suggestions: entry.fields.suggestions.map((suggestion) => ({
            ...suggestion,
            reserved: reservedMap[suggestion.sys.id],
          })),
        },
      })),
    };
  }),
});
