'use client';

import { NextPage } from 'next';
import { motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
// @ts-ignore
import { useWindowSize } from '@uidotdev/usehooks';
import MenuItem from '~/app/home/MenuItem';
import Programma from '~/app/home/Programma';
import Map from '~/app/home/Map';
import Form from '~/app/home/Form';
import { trpc } from '~/utils/trpc';
import { usePathname, useRouter } from 'next/navigation';
import CadeauTips from '~/app/home/CadeauTips';

const DURATION = 0.8;
const TRANSITION = {
  type: 'tween',
  duration: DURATION,
};

const MENU_BAR_DIMENSIONS = {
  width: 2866,
  height: 1612,
};

const IndexPage: NextPage = () => {
  const pathname = usePathname();
  const router = useRouter();

  const size = useWindowSize();
  const [[topHeight, animateMenuBar], setHeight] = useState<[number, any]>([
    0,
    undefined,
  ]);
  const ref = useRef<any>(null);

  const [bannerClosed, setBannerClosed] = useState(true);

  useEffect(() => {
    const saved = globalThis?.localStorage.getItem('banner');

    // @ts-ignore
    setBannerClosed((saved && JSON.parse(saved)?.invalidEmail) ?? false);
  }, []);

  useLayoutEffect(() => {
    if (!ref.current?.clientHeight) {
      return;
    }
    const { clientHeight = 0, clientWidth = MENU_BAR_DIMENSIONS.width } =
      ref.current || {};

    const imageHeight =
      Math.min(1, clientWidth / MENU_BAR_DIMENSIONS.width) *
      MENU_BAR_DIMENSIONS.height;

    const topHeight = Math.min(
      (size.height ?? 0) * 0.2,
      imageHeight * 0.3,
      clientHeight,
    );
    setHeight([
      topHeight,
      {
        bottom: {
          y: 0,
        },
        top: {
          y: -(size.height ?? 0) - imageHeight + clientHeight + topHeight,
        },
      },
    ]);
  }, [size, ref]);

  return (
    <>
      {!bannerClosed && (
        <motion.div
          className="absolute left-0 right-0 bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
          style={{ zIndex: 9002 }}
          initial={{ y: '-105%' }}
          animate={{ y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 1,
          }}
        >
          <div className="flex">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-teal-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">
                Incorrect email adres gedeeld in uitnodiging
              </p>
              <p className="text-sm">
                Het correcte email voor de getuigen is{' '}
                <b>getuigen@basenjessie.nl</b>. Heb je al een mail gestuurd,
                stuur deze dan opnieuw naar het correcte email adres.
              </p>
            </div>
            <div
              className="py-1 ml-auto cursor-pointer"
              onClick={() => {
                (!globalThis || globalThis.localStorage) &&
                  localStorage.setItem(
                    'banner',
                    JSON.stringify({ invalidEmail: true }),
                  );
                setBannerClosed(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      )}
      <section className={`w-full h-screen`}>
        <div className="flex flex-col h-full place-content-between">
          <motion.div
            className={`flex flex-row place-content-center min-h-[50%] max-w-3xl place-items-center m-auto`}
            variants={{
              visible: { y: 0 },
              hidden: { y: '-150%' },
            }}
            transition={TRANSITION}
            initial="visible"
            animate={pathname === '/' ? 'visible' : 'hidden'}
          >
            {/*<MenuItem*/}
            {/*  name="Programma"*/}
            {/*  icon={*/}
            {/*    <svg*/}
            {/*      className="h-16 w-16"*/}
            {/*      width="24"*/}
            {/*      height="24"*/}
            {/*      viewBox="0 0 24 24"*/}
            {/*      strokeWidth="2"*/}
            {/*      stroke="currentColor"*/}
            {/*      fill="none"*/}
            {/*      strokeLinecap="round"*/}
            {/*      strokeLinejoin="round"*/}
            {/*    >*/}
            {/*      <path stroke="none" d="M0 0h24v24H0z" />*/}
            {/*      <rect x="5" y="3" width="14" height="18" rx="2" />*/}
            {/*      <line x1="9" y1="7" x2="15" y2="7" />*/}
            {/*      <line x1="9" y1="11" x2="15" y2="11" />*/}
            {/*      <line x1="9" y1="15" x2="13" y2="15" />*/}
            {/*    </svg>*/}
            {/*  }*/}
            {/*  onClick={() => router.push('/programma')}*/}
            {/*/>*/}
            <MenuItem
              name="Cadeautips"
              icon={
                <svg
                  className="h-16 w-16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 12 20 22 4 22 4 12" />
                  <rect x="2" y="7" width="20" height="5" />
                  <line x1="12" y1="22" x2="12" y2="7" />
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                </svg>
              }
              onClick={() => router.push('/cadeautips')}
            />
            <MenuItem
              name="Locatie"
              icon={
                <svg
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              }
              onClick={() => router.push('/locatie')}
            />
            <MenuItem
              name="RSVP"
              icon={
                <svg
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              }
              onClick={() => router.push('/rsvp')}
            />
          </motion.div>
          <div
            className="w-full flex-grow"
            style={{
              maxHeight: `min(45vh, ${Math.round(
                MENU_BAR_DIMENSIONS.height * 0.6,
              )}px, 100vw/${MENU_BAR_DIMENSIONS.width}*${
                MENU_BAR_DIMENSIONS.height
              }*0.6)`,
            }}
            ref={ref}
          >
            <motion.div
              className="w-full"
              variants={animateMenuBar}
              transition={TRANSITION}
              initial="bottom"
              animate={pathname === '/' ? 'bottom' : 'top'}
              style={{
                maxHeight: `min(45vh, ${Math.round(
                  MENU_BAR_DIMENSIONS.height * 0.6,
                )}px, 100vw/${MENU_BAR_DIMENSIONS.width}*${
                  MENU_BAR_DIMENSIONS.height
                }*0.6)`,
                position: 'relative',
              }}
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
              <div
                className={`font-normal text-xl block m-auto w-min cursor-pointer p-5 flex flex-col items-center`}
                style={{
                  marginTop: -topHeight / 2,
                  position: 'inherit',
                  zIndex: 9001,
                }}
                onClick={() => router.push('/')}
              >
                <svg
                  className="h-12 w-12"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    marginBottom: '-5px',
                    color: '#EBC300',
                  }}
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <polyline points="6 15 12 9 18 15" />
                </svg>
                <span className={'w-min text-xl'}>Menu</span>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="w-full, h-full relative">
          <motion.div
            className="flex flex-col place-content-between w-full h-full content-center absolute"
            style={{
              paddingTop: '20vh',
              paddingBottom: '10vh',
              display: 'flex',
              height: '80vh',
            }}
            variants={{
              visible: { y: '-125%' },
              hidden: { y: 0 },
            }}
            transition={TRANSITION}
            initial="hidden"
            animate={pathname === '/programma' ? 'visible' : 'hidden'}
          >
            <div style={{ pointerEvents: 'all' }}>
              <Programma />
            </div>
          </motion.div>
          <motion.div
            className="flex flex-col place-content-between w-full h-full content-center absolute"
            style={{
              marginTop: '20vh',
              display: 'flex',
              height: '80vh',
            }}
            variants={{
              visible: { y: '-125%' },
              hidden: { y: 0 },
            }}
            transition={TRANSITION}
            initial="hidden"
            animate={pathname === '/cadeautips' ? 'visible' : 'hidden'}
          >
            <CadeauTips />
          </motion.div>
          <motion.div
            className="flex flex-col place-content-between w-full h-full absolute"
            style={{
              marginTop: 'calc(20vh + 3rem)',
              display: 'flex',
              height: '80vh',
            }}
            variants={{
              visible: { y: '-125%' },
              hidden: { y: 0 },
            }}
            transition={TRANSITION}
            initial="hidden"
            animate={pathname === '/locatie' ? 'visible' : 'hidden'}
          >
            <Map />
          </motion.div>
          <motion.div
            className="flex flex-col place-content-between w-full h-full absolute"
            style={{
              marginTop: '20vh',
              paddingBottom: '5vh',
              display: 'flex',
              height: '80vh',
            }}
            variants={{
              visible: { y: '-125%' },
              hidden: { y: 0 },
            }}
            transition={TRANSITION}
            initial="hidden"
            animate={pathname === '/rsvp' ? 'visible' : 'hidden'}
          >
            <Form />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default trpc.withTRPC(IndexPage);
