import { validationSchema } from '~/app/home/Form';
import { publicProcedure, router } from '~/server/trpc';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const defaultRSVPSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  email: true,
  person: true,
});

const items: Map<string, z.infer<typeof validationSchema>> = new Map([
  [
    '794a84e0-32a6-46e4-9c2c-a7bceb292e39',
    {
      id: '794a84e0-32a6-46e4-9c2c-a7bceb292e39',
      email: 'kiers.bas@gmail.com',
      person: [
        {
          name: 'Bas',
          dietAlt: true,
          rsvpCeremony: true,
          rsvpReception: true,
          rsvpDinner: true,
          rsvpParty: true,
          dietMeat: true,
          dietFish: true,
          remark: 'dsfasdfas',
          dietAltText: 'DSFDf',
        },
        {
          name: 'Jessie',
          dietAlt: true,
          rsvpCeremony: true,
          rsvpReception: true,
          rsvpDinner: true,
          rsvpParty: true,
          dietMeat: true,
          dietFish: true,
          remark: 'sfasdfas',
          dietAltText: 'sdfsd',
        },
      ],
    },
  ],
]);

export const reactHookFormRouter = router({
  list: publicProcedure.query(async () => {
    return items;
  }),

  byId: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ input: { id } }) => {
      return items.get(id);
    }),

  upsert: publicProcedure.input(validationSchema).mutation(({ input }) => {
    const id = input.id || uuid();
    const item = {
      ...input,
      id,
    };
    items.set(item.id, item);

    return item;
  }),
});
