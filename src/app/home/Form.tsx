import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useFieldArray,
  useForm,
  UseFormProps,
  useWatch,
} from 'react-hook-form';
import { z } from 'zod';
import { trpc } from '~/utils/trpc';

export const validationSchema = z.object({
  id: z.string().uuid().optional().or(z.literal('')),
  email: z.string().email().min(1).max(1000),
  person: z
    .array(
      z.object({
        name: z.string().min(1).max(1000),
        dietAlt: z.boolean().default(false),
        rsvpCeremony: z.boolean().default(false),
        rsvpReception: z.boolean().default(false),
        rsvpDinner: z.boolean().default(false),
        rsvpParty: z.boolean().default(false),
        dietMeat: z.boolean().default(false),
        dietFish: z.boolean().default(false),
        remark: z.string().max(10000).default(''),
        dietAltText: z.string().max(10000).default(''),
      }),
    )
    .max(10),
});

function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema['_input']>, 'resolver'> & {
    schema: TSchema;
  },
) {
  const form = useForm<TSchema['_input']>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
  });

  return form;
}

const Form: React.FC = () => {
  const [id, setId] = useState(() => {
    const saved = localStorage.getItem('rsvp');
    return (saved && JSON.parse(saved).id) || '';
  });

  useEffect(() => {
    if (id) {
      localStorage.setItem('rsvp', JSON.stringify({ id }));
    }
  }, [id]);

  const utils = trpc.useContext().form;
  const rsvp = trpc.form.byId.useQuery({ id }, { enabled: Boolean(id) });
  console.log('Query', rsvp.data);

  const mutation = trpc.form.upsert.useMutation({
    onSuccess: async () => {
      await utils.list.invalidate();
    },
  });

  const { register, reset, handleSubmit, control, formState } = useZodForm({
    schema: validationSchema,
  });
  const { errors } = formState;
  const isLoading = formState.isLoading || (id && rsvp.isLoading);
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'person',
  });
  const persons = useWatch({ name: 'person', control });

  useEffect(() => {
    if (rsvp.data) {
      reset(rsvp.data);
    }
  }, [rsvp.data]);

  const getFormDefaults = () => {
    const { rsvpCeremony, rsvpReception, rsvpDinner, rsvpParty } =
      persons?.at?.(-1) ?? {};
    return {
      name: '',
      rsvpCeremony,
      rsvpReception,
      rsvpDinner,
      rsvpParty,
      dietMeat: true,
      dietFish: true,
    };
  };
  if (fields.length === 0) {
    append(getFormDefaults());
  }

  formState;

  const inputCls =
    'mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0';

  return (
    <div className="w-5/6 mx-auto mt-12">
      <form
        onSubmit={handleSubmit(async (data) => {
          const mutationResult = await mutation.mutateAsync(data);
          setId(mutationResult.id);
          return new Promise((resolve) => setTimeout(resolve, 10000));
        })}
      >
        <input type="hidden" id="id" {...register('id')} />
        <div className="flex flex-row">
          <div className="grow">
            <div className="md:w-1/3">
              <label
                className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4"
                htmlFor="email"
              >
                Email
              </label>
            </div>
            <div className="max-w-xl">
              <input
                type="email"
                id="email"
                placeholder="mijn@email.nl"
                className={inputCls}
                {...register('email')}
              />
            </div>
          </div>
          <div className="mx-6 flex items-end">
            <input
              className={`shadow ${
                isLoading
                  ? 'bg-gray-500'
                  : 'bg-blue-500 hover:bg-blue-400 cursor-pointer'
              }  focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded`}
              type="submit"
              value="Opslaan"
              disabled={isLoading}
            />
          </div>
        </div>
        {errors.email && (
          <p className="text-xs text-red-600">Het email adres in incorrect.</p>
        )}
        <div className="snap-x snap-mandatory mt-6">
          <div className="grid grid-flow-col auto-cols-min auto-rows-min w-full">
            {fields.map((field, index, arr) => (
              <div
                className="snap-center w-96 max-w-full p-4 bg-white border border-gray-200 rounded-lg shadow mr-8 relative sm:p-6 h-min"
                key={field.id}
              >
                {(index !== 0 || arr.length > 1) && (
                  <span
                    className="absolute right-7 cursor-pointer"
                    onClick={() => remove(index)}
                  >
                    🗑️
                  </span>
                )}
                <ul className="my-4 space-y-3">
                  <li>
                    <div className="mb-6">
                      <div className="">
                        <label
                          className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4"
                          htmlFor="name"
                        >
                          Naam
                        </label>
                      </div>
                      <div>
                        <input
                          className={inputCls}
                          type="text"
                          id="name"
                          {...register(`person.${index}.name` as const)}
                        />
                        {/* @ts-ignore */}
                        {errors.person?.[index]?.name && (
                          <p className="text-xs text-red-600">
                            Een naam is verplicht.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-6 flex flex-col">
                      <div className="">
                        <label className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4">
                          Is aanwezig bij
                        </label>
                      </div>
                      <label className="inline-flex items-center">
                        <input
                          className="form-checkbox"
                          type="checkbox"
                          {...register(`person.${index}.rsvpCeremony` as const)}
                        />
                        <span className="ml-2">Ceremonie</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          className="form-checkbox"
                          type="checkbox"
                          {...register(
                            `person.${index}.rsvpReception` as const,
                          )}
                        />
                        <span className="ml-2">Receptie</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          className="form-checkbox"
                          type="checkbox"
                          {...register(`person.${index}.rsvpDinner` as const)}
                        />
                        <span className="ml-2">Diner</span>
                      </label>
                      {persons?.[index]?.rsvpDinner && (
                        <div className="my-2 ml-4">
                          <div className="">
                            <label className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4">
                              Dieetwensen
                            </label>
                          </div>
                          <div className="flex flex-row place-content-between mb-2">
                            <label className="inline-flex items-center flex-col-reverse">
                              <input
                                className="form-checkbox"
                                type="checkbox"
                                {...register(
                                  `person.${index}.dietMeat` as const,
                                )}
                              />
                              <span className="mb-2">Vlees</span>
                            </label>
                            <label className="inline-flex items-center flex-col-reverse">
                              <input
                                className="form-checkbox"
                                type="checkbox"
                                {...register(
                                  `person.${index}.dietFish` as const,
                                )}
                              />
                              <span className="mb-2">Vis</span>
                            </label>
                            <label className="inline-flex items-center flex-col-reverse">
                              <input
                                className="form-checkbox text-gray-500"
                                type="checkbox"
                                checked={true}
                                disabled={true}
                              />
                              <span className="mb-2">Groente</span>
                            </label>
                            <label className="inline-flex items-center flex-col-reverse">
                              <input
                                className="form-checkbox"
                                type="checkbox"
                                {...register(
                                  `person.${index}.dietAlt` as const,
                                )}
                              />
                              <span className="mb-2">Anders</span>
                            </label>
                          </div>
                          {persons?.[index]?.dietAlt && (
                            <div>
                              <textarea
                                className={inputCls}
                                id="dietAltText"
                                {...register(
                                  `person.${index}.dietAltText` as const,
                                )}
                              />
                            </div>
                          )}
                        </div>
                      )}
                      <label className="inline-flex items-center">
                        <input
                          className="form-checkbox"
                          type="checkbox"
                          {...register(`person.${index}.rsvpParty` as const)}
                        />
                        <span className="ml-2">Avondfeest</span>
                      </label>
                    </div>

                    <div className="mb-6">
                      <div className="">
                        <label
                          className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4"
                          htmlFor="name"
                        >
                          Eventuele bijzonderheden
                        </label>
                      </div>
                      <div>
                        <textarea
                          className={inputCls}
                          id="remark"
                          {...register(`person.${index}.remark` as const)}
                        />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            ))}
            <div className="snap-center w-96 max-w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 flex items-center justify-center h-min">
              <span
                className="text-9xl"
                onClick={() => append(getFormDefaults())}
              >
                ⊕
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
