import { validationSchema } from '~/app/home/Form';
import { publicProcedure, router } from '~/server/trpc';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '~/server/prisma';
import { sendRSVPMail } from '~/server/mailer';

const defaultRSVPSubmissionSelect =
  Prisma.validator<Prisma.RSVPSubmissionSelect>()({
    id: true,
    email: true,
    type: true,
    persons: {
      select: {
        id: true,
        submissionId: true,
        name: true,
        dietAlt: true,
        rsvpCeremony: true,
        rsvpReception: true,
        rsvpDinner: true,
        rsvpParty: true,
        dietMeat: true,
        dietFish: true,
        remark: true,
        dietAltText: true,
        dinnerKind: true,
        dinnerStarter: true,
        dinnerMain: true,
        dinnerDesert: true,
        createdAt: true,
        updatedAt: true,
      },
    },
  });

export const reactHookFormRouter = router({
  list: publicProcedure.query(async () => {
    return await prisma.rSVPSubmission.findMany({
      select: defaultRSVPSubmissionSelect,
      // get an extra item at the end which we'll use as next cursor
      take: 10,
      where: {},
      orderBy: {
        createdAt: 'desc',
      },
    });
  }),

  byId: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ input: { id } }) => {
      const submission = await prisma.rSVPSubmission.findUnique({
        where: { id },
        select: defaultRSVPSubmissionSelect,
      });

      return submission;
    }),

  createOrUpdate: publicProcedure
    .input(validationSchema)
    .mutation(async ({ input: { id, ...submission } }) => {
      if (id) {
        const update = {
          ...submission,
          persons: {
            deleteMany: {
              id: {
                not: {
                  in: submission.persons.map(({ id }) => id).filter(Boolean),
                },
              },
            },
            upsert: submission.persons.map(({ id: personId, ...person }) => ({
              where: { id: personId || uuid() },
              create: person,
              update: person,
            })),
          },
        };

        const result = await prisma.rSVPSubmission
          .update({
            where: {
              id,
            },
            data: update,
            select: defaultRSVPSubmissionSelect,
          })
          .catch((error) => {
            if (error.code === 'P2025') {
              return undefined;
            }
            throw error;
          });

        if (result) {
          return result;
        }
      }

      const create = {
        ...submission,
        persons: {
          create: submission.persons.map(({ id, ...person }) => person),
        },
      };

      return await prisma.rSVPSubmission
        .create({
          data: create,
          select: defaultRSVPSubmissionSelect,
        })
        .then((result) => {
          sendRSVPMail({
            id: result.id,
            email: result.email,
          });

          return result;
        });
    }),
});
