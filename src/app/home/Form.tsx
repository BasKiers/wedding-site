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
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export enum SubmissionType {
  FULL_DAY = 1,
  EVENING = 2,
}

export const validationSchema = z.object({
  id: z.string().uuid().optional().or(z.literal('')),
  email: z.string().email().min(1).max(1000),
  type: z.nativeEnum(SubmissionType),
  persons: z
    .array(
      z.object({
        id: z.string().uuid().optional().or(z.literal('')),
        name: z.string().min(1).max(1000),
        dietAlt: z.boolean().default(false),
        rsvpCeremony: z.boolean().default(false),
        rsvpReception: z.boolean().default(false),
        rsvpDinner: z.boolean().default(false),
        rsvpParty: z.boolean().default(false),
        dietMeat: z.boolean().default(false),
        dietFish: z.boolean().default(false),
        dinnerKind: z.boolean().nullish().default(false),
        dinnerStarter: z.string().nullish(),
        dinnerMain: z.string().nullish(),
        dinnerDesert: z.string().nullish(),
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
    const saved =
      (!globalThis || globalThis.localStorage) && localStorage.getItem('rsvp');
    // @ts-ignore
    return (saved && JSON.parse(saved)?.id) || '';
  });

  useEffect(() => {
    if ((!globalThis || globalThis.localStorage) && id) {
      localStorage.setItem('rsvp', JSON.stringify({ id }));
    }
  }, [id]);

  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const idSearchParam = searchParams && searchParams.get('id');
  if (idSearchParam && z.string().uuid().safeParse(idSearchParam).success) {
    if (idSearchParam !== id) {
      setId(idSearchParam);
    }
    if (pathname) {
      router.push(pathname);
    }
  }

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState,
    getFieldState,
    getValues,
    setValue,
  } = useZodForm({
    schema: validationSchema,
  });
  const { errors, isDirty } = formState;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'persons',
  });
  const persons = useWatch({ name: 'persons', control });

  const utils = trpc.useContext().form;
  const rsvp = trpc.form.byId.useQuery(
    { id },
    { enabled: Boolean(id) && !isDirty },
  );

  const mutation = trpc.form.createOrUpdate.useMutation({
    onSuccess: async () => {
      await utils.list.invalidate();
    },
  });

  const isLoading = formState.isLoading || (id && rsvp.isLoading);

  useEffect(() => {
    if (rsvp.data) {
      reset(rsvp.data);
    }
  }, [rsvp.data, reset]);

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
      dinnerKind: false,
    };
  };
  if (fields.length === 0) {
    append(getFormDefaults());
  }

  const inputCls =
    'mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0';

  register('type');

  const type = {
    ...getFieldState('type'),
    value: getValues('type'),
  };

  return (
    <div className="w-5/6 mx-auto h-full pointer-events-auto">
      <form
        className="h-full flex flex-col"
        onSubmit={handleSubmit(async (data) => {
          const mutationResult = await mutation.mutateAsync(data);
          setId(mutationResult.id);
          reset(data);
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
              className={`shadow bg-gray-400 hover:bg-gray-500 cursor-pointer focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded`}
              type="button"
              value="Reset"
              disabled={!isDirty}
              onClick={() =>
                reset(undefined, {
                  keepDefaultValues: true,
                })
              }
            />
            <input
              className={`shadow ${
                isLoading || type.value === undefined
                  ? 'bg-gray-500'
                  : isDirty
                  ? 'bg-blue-500 hover:bg-blue-400 cursor-pointer'
                  : 'bg-blue-300'
              } ml-6 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded`}
              type="submit"
              value="Opslaan"
              disabled={type.value === undefined || isLoading || !isDirty}
            />
          </div>
        </div>
        {errors.email && (
          <p className="text-xs text-red-600">Het email adres in incorrect.</p>
        )}
        <div
          className={`${
            type.value !== undefined ? 'hidden' : ''
          } flex flex-col pt-24`}
        >
          <span className="text-xl m-auto pb-8">Ik ben uitgenodigd als</span>
          <div className="flex flex-row place-content-around">
            <input
              className={`shadow bg-blue-500 hover:bg-blue-400 cursor-pointer focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded`}
              type="button"
              value="Daggast"
              onClick={() =>
                setValue('type', SubmissionType.FULL_DAY, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
            <input
              className={`shadow bg-blue-500 hover:bg-blue-400 cursor-pointer focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded`}
              type="button"
              value="Avondgast"
              onClick={() =>
                setValue('type', SubmissionType.EVENING, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
          </div>
        </div>
        <div
          className={`mt-6 overflow-y-auto ${
            type.value === undefined ? 'hidden' : ''
          }`}
        >
          <div
            className="grid w-full gap-4 auto-rows-fr"
            style={{
              gridTemplateColumns: 'repeat( auto-fill, minmax(330px, 1fr) )',
            }}
          >
            {fields.map((field, index, arr) => (
              <div
                className="w-96 max-w-full h-full p-4 bg-white border border-gray-200 rounded-lg shadow mr-8 relative sm:p-6 flex flex-dir-col"
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
                <ul className="my-4 space-y-3 w-full">
                  <li>
                    <input
                      type="hidden"
                      id="personId"
                      {...register(`persons.${index}.id`)}
                    />
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
                          {...register(`persons.${index}.name` as const)}
                        />
                        {/* @ts-ignore */}
                        {errors.persons?.[index]?.name && (
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
                      {type.value === SubmissionType.FULL_DAY && (
                        <>
                          <label className="inline-flex items-center">
                            <input
                              className="form-checkbox"
                              type="checkbox"
                              {...register(
                                `persons.${index}.rsvpCeremony` as const,
                              )}
                            />
                            <span className="ml-2">Ceremonie</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              className="form-checkbox"
                              type="checkbox"
                              {...register(
                                `persons.${index}.rsvpReception` as const,
                              )}
                            />
                            <span className="ml-2">Receptie</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              className="form-checkbox"
                              type="checkbox"
                              {...register(
                                `persons.${index}.rsvpDinner` as const,
                              )}
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
                                      `persons.${index}.dietMeat` as const,
                                    )}
                                  />
                                  <span className="mb-2">Vlees</span>
                                </label>
                                <label className="inline-flex items-center flex-col-reverse">
                                  <input
                                    className="form-checkbox"
                                    type="checkbox"
                                    {...register(
                                      `persons.${index}.dietFish` as const,
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
                                      `persons.${index}.dietAlt` as const,
                                    )}
                                  />
                                  <span className="mb-2">Bijzonderheden</span>
                                </label>
                              </div>
                              {persons?.[index]?.dietAlt && (
                                <div>
                                  <textarea
                                    className={inputCls}
                                    id="dietAltText"
                                    {...register(
                                      `persons.${index}.dietAltText` as const,
                                    )}
                                  />
                                </div>
                              )}
                              <div className="mb-3">
                                <label className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4">
                                  Diner Keuzes
                                </label>
                              </div>
                              <div className="flex flex-col place-content-between mb-2">
                                {(
                                  [
                                    [
                                      'dinnerKind',
                                      null,
                                      [
                                        [
                                          null,
                                          undefined,
                                          'Kindermenu',
                                          'Tomatensoep, pasta pesto en een ijsje',
                                        ],
                                      ],
                                    ],
                                    [
                                      'dinnerStarter',
                                      'Voorgerecht',
                                      [
                                        [
                                          'dietMeat',
                                          'Vlees',
                                          'Carpaccio',
                                          'met het mes gesneden rundvlees, pitten, truffelmayo & oude kaas',
                                        ],
                                        [
                                          'dietFish',
                                          'Vis',
                                          'Gerookte zalm',
                                          'citroen aioli, rettich, groene asperge & mosterd',
                                        ],
                                        [
                                          null,
                                          'Vega',
                                          'Burrata',
                                          'groene gazpacho, basilicum & pompoenpitten',
                                        ],
                                      ],
                                    ],
                                    [
                                      'dinnerMain',
                                      'Hoofdgerecht',
                                      [
                                        [
                                          'dietMeat',
                                          'Vlees',
                                          'Bavette',
                                          'van de grill met sjalot jus',
                                        ],
                                        [
                                          'dietFish',
                                          'Vis',
                                          'Kabeljauw',
                                          'met risotto, doperwten & groene kruiden crème',
                                        ],
                                        [
                                          null,
                                          'Vega',
                                          'Bloemkool steak',
                                          'met kerrie, yoghurt & amandel',
                                        ],
                                      ],
                                    ],
                                    [
                                      'dinnerDesert',
                                      'Desert',
                                      [
                                        [
                                          null,
                                          'Kaas',
                                          'Kaasplank',
                                          'met garnituur',
                                        ],
                                        [
                                          null,
                                          'Chocola',
                                          'Lava cake',
                                          'met vanille ijs & pecan',
                                        ],
                                        [
                                          null,
                                          'Ananas',
                                          'Tarte tatin',
                                          'van ananas met tijmroomijs',
                                        ],
                                      ],
                                    ],
                                  ] as const
                                ).map(
                                  ([id, title, options], i) =>
                                    (i === 0 ||
                                      !persons?.[index]?.dinnerKind) && (
                                      <div
                                        key={`${index}${id}`}
                                        className="flex flex-col"
                                      >
                                        {title && (
                                          <span className="mb-2 mx-auto">
                                            {title}
                                          </span>
                                        )}
                                        {options.map(
                                          ([
                                            condition,
                                            value,
                                            name,
                                            description,
                                          ]) =>
                                            (!condition ||
                                              persons?.[index]?.[
                                                condition
                                              ]) && (
                                              <div
                                                key={`${index}${id}${value}`}
                                              >
                                                <input
                                                  {...register(
                                                    `persons.${index}.${id}`,
                                                  )}
                                                  type={
                                                    value ? 'radio' : 'checkbox'
                                                  }
                                                  value={value}
                                                  id={`${index}${id}${value}`}
                                                  className="invisible absolute"
                                                />
                                                <label
                                                  htmlFor={`${index}${id}${value}`}
                                                  className={`pointer block border border-gray-300 rounded-lg p-3 mb-2 select-none ${
                                                    persons?.[index]?.[id] ===
                                                      true ||
                                                    persons?.[index]?.[id] ===
                                                      value
                                                      ? 'border-blue-600 shadow bg-blue-100'
                                                      : ''
                                                  }`}
                                                >
                                                  <span className="font-bold">
                                                    {name}
                                                  </span>
                                                  <span className="block italic text-sm pl-3">
                                                    {description}
                                                  </span>
                                                </label>
                                              </div>
                                            ),
                                        )}
                                      </div>
                                    ),
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      <label className="inline-flex items-center">
                        <input
                          className="form-checkbox"
                          type="checkbox"
                          {...register(`persons.${index}.rsvpParty` as const)}
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
                          {...register(`persons.${index}.remark` as const)}
                        />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            ))}
            <div className="w-96 max-w-full h-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 flex items-center justify-center">
              <div
                className="cursor-pointer  flex flex-col h-full justify-between"
                onClick={() => append(getFormDefaults())}
              >
                <span className="h-0 text-gray-600">Persoon toevoegen</span>
                <svg
                  className="h-32 w-32 text-black hover:text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {' '}
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />{' '}
                  <circle cx="8.5" cy="7" r="4" />{' '}
                  <line x1="20" y1="8" x2="20" y2="14" />{' '}
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
