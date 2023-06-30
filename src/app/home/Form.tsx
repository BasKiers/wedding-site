import React from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

const Form: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'person',
  });
  const persons = useWatch({ name: 'person', control });

  const getFormDefaults = () => {
    const { rsvpCeremony, rsvpReception, rsvpDinner, rsvpParty } =
      persons?.at?.(-1) ?? {};
    return {
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

  console.log(persons);

  const inputCls =
    'mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0';

  return (
    <div className="w-5/6 m-auto">
      <form onSubmit={handleSubmit((data) => console.log(data))}>
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
                {...register('email', {
                  required: true,
                  pattern:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                })}
              />
            </div>
          </div>
          <div className="mx-6 flex items-end">
            <input
              className="shadow bg-blue-500 cursor-pointer hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
              value="Opslaan"
            />
          </div>
        </div>
        {errors.email && (
          <p className="text-xs text-red-600">Het email adres in incorrect.</p>
        )}
        <div className="overflow-x-scroll snap-x snap-mandatory mt-6">
          <div className="flex flex-row w-max flex-nowrap">
            {fields.map((field, index, arr) => (
              <div
                className="snap-center w-96 max-w-full p-4 bg-white border border-gray-200 rounded-lg shadow mr-8 relative sm:p-6"
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
                          {...register(`person.${index}.name` as const, {
                            required: true,
                          })}
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
                          {...register(`person.${index}.rsvpParty` as const, {
                            value: persons?.[index - 1]?.rsvpParty,
                          })}
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
                          {...register(`person.${index}.remark` as const, {
                            required: true,
                          })}
                        />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            ))}
            <div className="snap-center w-96 max-w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 flex items-center justify-center">
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
