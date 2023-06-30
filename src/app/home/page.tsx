'use client';

import { NextPage } from 'next';
import { motion, useScroll, useTransform, cubicBezier } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
// @ts-ignore
import { useWindowSize } from '@uidotdev/usehooks';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

const mbs = {
  width: 2866,
  height: 1612,
};

const MenuItem = ({
  name,
  icon,
  onClick,
}: {
  name: string;
  icon: string;
  onClick: () => any;
}) => {
  return (
    <>
      <div
        className="w-1/5 flex flex-col px-8 cursor-pointer"
        onClick={onClick}
      >
        <div className="m-auto py-8 text-7xl">{icon.trim()}</div>
        <span className="text-center">{name}</span>
      </div>
    </>
  );
};

const Programma = () => {
  const tdCls = 'border-b border-slate-100 p-4 pl-8 text-slate-500';
  return (
    <>
      <div className="flex flex-row place-content-center min-h-[50%] place-items-center my-auto">
        <table className="table-auto border-collapse w-56">
          <tbody>
            <tr>
              <td className={tdCls}>Aanvang</td>
              <td className={tdCls}>Ceremonie</td>
              <td className={tdCls}>Receptie</td>
              <td className={tdCls}>Diner</td>
              <td className={tdCls}>Avondfeest</td>
              <td className={tdCls}>Einde</td>
            </tr>
            <tr>
              <td className={tdCls}>13:30</td>
              <td className={tdCls}>14:00</td>
              <td className={tdCls}>15:30</td>
              <td className={tdCls}>18:00</td>
              <td className={tdCls}>21:00</td>
              <td className={tdCls}>00:00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

const Map = () => (
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2419.03561641692!2d6.998176877308135!3d52.67739462456392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b7ef9909aa8249%3A0xd191032d0fd5e83!2sRestaurant%20Wollegras!5e0!3m2!1sen!2snl!4v1688042566546!5m2!1sen!2snl"
    style={{ border: 0, width: '100%', height: '100%' }}
    allowFullScreen={false}
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
);

const Form = () => {
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

enum PageEnum {
  SCHEDULE,
  LOCATION,
  RSVP,
}

let locTimeout: any;

const IndexPage: NextPage = () => {
  const size = useWindowSize();
  const [height, setHeight] = useState(0);
  const [page, setPage] = useState<PageEnum | undefined>();
  const [loc, setLoc] = useState<0 | 1 | 2 | 3>(0);
  const ref = useRef<any>(null);
  const bottomRef = useRef<any>(null);
  const scheduleRef = useRef<any>(null);
  const locationRef = useRef<any>(null);
  const rsvpRef = useRef<any>(null);

  useLayoutEffect(() => {
    const { clientHeight = 0, clientWidth = mbs.width } = ref.current || {};

    const imageHeight = Math.min(1, clientWidth / mbs.width) * mbs.height;
    setHeight(
      Math.min(
        -imageHeight +
          clientHeight +
          Math.min(size.height * 0.2, imageHeight * 0.3),
        0,
      ),
    );
  }, [size]);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.9], [0, height], {
    ease: cubicBezier(0.68, 0.08, 0.41, 0.95),
  });
  const menuY = useTransform(scrollYProgress, [0, 0.9], ['0vh', '45vh'], {
    // ease: cubicBezier(0.68, 0.08, 0.41, 0.95),
  });
  const bottomY = useTransform(scrollYProgress, [0, 0.9], ['-20vh', '0vh'], {
    // ease: cubicBezier(0.68, 0.08, 0.41, 0.95),
  });

  useEffect(() => {
    clearTimeout(locTimeout);
    setTimeout(
      () =>
        window.requestAnimationFrame(() => {
          if (page === undefined) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            locTimeout = setTimeout(
              () => window.requestAnimationFrame(() => setLoc(0)),
              500,
            );
          } else {
            bottomRef.current?.scrollIntoView({
              block: 'end',
              behavior: 'smooth',
            });
            locTimeout = setTimeout(() => setLoc(2), 500);
          }
        }),
      100,
    );
  }, [page]);

  const openPage = (pageName: PageEnum | undefined) => () => {
    console.log('setPage', pageName);
    if (pageName === undefined) {
      setLoc(3);
      setTimeout(
        () =>
          window.requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            locTimeout = setTimeout(
              () => window.requestAnimationFrame(() => setLoc(0)),
              500,
            );
          }),
        100,
      );
      return;
    }
    setLoc(1);
    setPage(pageName);
    if (pageName === page) {
      clearTimeout(locTimeout);
      setTimeout(
        () =>
          window.requestAnimationFrame(() => {
            bottomRef.current?.scrollIntoView({
              block: 'end',
              behavior: 'smooth',
            });
            locTimeout = setTimeout(
              () => window.requestAnimationFrame(() => setLoc(2)),
              500,
            );
          }),
        100,
      );
    }
  };

  return (
    <>
      {loc !== 0 && (
        <span
          className="sticky top-0"
          style={{ zIndex: 9002 }}
          onClick={openPage(undefined)}
        >
          Menu
        </span>
      )}
      <section className={`w-full h-screen ${loc === 2 ? 'nosnap' : 'snap'}`}>
        <div className="flex flex-col h-full place-content-between">
          <motion.div
            className="flex flex-row place-content-center min-h-[50%] place-items-center my-auto"
            style={{ y: menuY }}
          >
            <MenuItem
              name="Programma"
              icon="🗓️"
              onClick={openPage(PageEnum.SCHEDULE)}
            />
            <MenuItem
              name="Locatie"
              icon="📍"
              onClick={openPage(PageEnum.LOCATION)}
            />
            <MenuItem name="RSVP" icon="🖊️" onClick={openPage(PageEnum.RSVP)} />
          </motion.div>
          <motion.div
            className="w-full flex-grow"
            style={{
              maxHeight: `min(45vh, ${Math.round(mbs.height * 0.6)}px, 100vw/${
                mbs.width
              }*${mbs.height}*0.6)`,
              y,
              zIndex: 9001,
            }}
            onAnimationComplete={console.log}
            ref={ref}
          >
            <img
              style={{
                maxWidth: '100%',
                marginLeft: '50%',
                transform: 'translateX(-50%)',
              }}
              alt="menu"
              src="/menubar.webp"
            />
          </motion.div>
        </div>
      </section>

      <section
        ref={bottomRef}
        className={`w-full h-screen min-h-fit ${loc === 0 ? 'nosnap' : 'snap'}`}
      >
        <motion.div
          ref={scheduleRef}
          className="flex flex-col place-content-between w-full h-full content-center"
          style={{
            paddingTop: '20vh',
            paddingBottom: '10vh',
            y: bottomY,
            display: page === PageEnum.SCHEDULE ? 'flex' : 'none',
          }}
        >
          <Programma />
        </motion.div>
        <motion.div
          ref={locationRef}
          className="flex flex-col place-content-between w-full h-full"
          style={{
            paddingTop: 'calc(20vh + 3rem)',
            y: bottomY,
            display: page === PageEnum.LOCATION ? 'flex' : 'none',
          }}
        >
          <Map />
        </motion.div>
        <motion.div
          ref={rsvpRef}
          className="flex flex-col place-content-between w-full h-full"
          style={{
            paddingTop: '20vh',
            paddingBottom: '10vh',
            y: bottomY,
            display: page === PageEnum.RSVP ? 'flex' : 'none',
          }}
        >
          <Form />
        </motion.div>
      </section>
    </>
  );
};

export default IndexPage;
