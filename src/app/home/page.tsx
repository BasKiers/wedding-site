'use client';

import { NextPage } from 'next';
import { motion, useScroll, useTransform, cubicBezier } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
// @ts-ignore
import { useWindowSize } from '@uidotdev/usehooks';
import MenuItem from '~/app/home/MenuItem';
import Programma from '~/app/home/Programma';
import Map from '~/app/home/Map';
import Form from '~/app/home/Form';
import { trpc } from '~/utils/trpc';

const SCROLL_DELAY = 600;

const MENU_BAR_DIMENSIONS = {
  width: 2866,
  height: 1612,
};

enum PageEnum {
  SCHEDULE,
  LOCATION,
  RSVP,
}

let locTimeout: any;

const IndexPage: NextPage = () => {
  const size = useWindowSize();
  const [[height, fromTopHeight, animateMenuBar], setHeight] = useState([
    0,
    0,
    {},
  ]);
  const [page, setPage] = useState<PageEnum | undefined>();
  const [loc, setLoc] = useState<0 | 1 | 2 | 3>(0);
  const ref = useRef<any>(null);
  const bottomRef = useRef<any>(null);
  const scheduleRef = useRef<any>(null);
  const locationRef = useRef<any>(null);
  const rsvpRef = useRef<any>(null);

  useLayoutEffect(() => {
    if (!ref.current?.clientHeight) {
      return;
    }
    const { clientHeight = 0, clientWidth = MENU_BAR_DIMENSIONS.width } =
      ref.current || {};

    const imageHeight =
      Math.min(1, clientWidth / MENU_BAR_DIMENSIONS.width) *
      MENU_BAR_DIMENSIONS.height;
    setHeight([
      Math.min(
        -imageHeight +
          clientHeight +
          Math.min(size.height * 0.2, imageHeight * 0.3),
        0,
      ),
      size.height - clientHeight,
      {
        bottom: {
          y: -clientHeight,
        },
        top: {
          y: -clientHeight,
        },
      },
    ]);
  }, [size, loc]);

  const { scrollYProgress } = useScroll();
  // const animateMenuBar = {
  //   bottom: {
  //     y: -ref.current?.clientHeight ?? 0,
  //   },
  //   top: {
  //     y: height,
  //   },
  // };
  const menuY = useTransform(scrollYProgress, [0, 0.9], ['0vh', '45vh'], {
    // ease: cubicBezier(0.68, 0.08, 0.41, 0.95),
  });
  const bottomY = useTransform(scrollYProgress, [0, 0.9], ['-20vh', '0vh'], {
    // ease: cubicBezier(0.68, 0.08, 0.41, 0.95),
  });

  const handleLocChange = (scrollToTop: boolean) => {
    clearTimeout(locTimeout);
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        if (scrollToTop) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          locTimeout = setTimeout(() => {
            window.requestAnimationFrame(() => setLoc(0));
          }, SCROLL_DELAY);
        } else {
          bottomRef.current?.scrollIntoView({
            block: 'end',
            behavior: 'smooth',
          });
          locTimeout = setTimeout(
            () => window.requestAnimationFrame(() => setLoc(2)),
            SCROLL_DELAY,
          );
        }
      });
    }, 100);
  };

  useEffect(() => handleLocChange(page === undefined), [page]);

  const openPage = (pageName: PageEnum | undefined) => () => {
    if (pageName === undefined) {
      setLoc(3);
      handleLocChange(true);
      return;
    }
    setLoc(1);
    if (pageName === page) {
      handleLocChange(false);
    }
    setPage(pageName);
  };

  return (
    <>
      <section className={`w-full h-screen ${loc === 2 ? 'hidden' : 'snap'}`}>
        <div className="flex flex-col h-full place-content-between">
          <motion.div
            className={`flex flex-row place-content-center min-h-[50%] place-items-center my-auto  ${
              loc === 2 ? 'hidden' : ''
            }`}
            style={{ y: loc === 0 ? 0 : menuY }}
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
          <div
            className="w-full flex-grow"
            style={{
              maxHeight: `min(45vh, ${Math.round(
                MENU_BAR_DIMENSIONS.height * 0.6,
              )}px, 100vw/${MENU_BAR_DIMENSIONS.width}*${
                MENU_BAR_DIMENSIONS.height
              }*0.6)`,
              zIndex: 9001,
            }}
            ref={ref}
          ></div>
        </div>
      </section>
      <div className="h-0">
        <motion.div
          className="w-full"
          variants={animateMenuBar}
          transition={{
            type: 'tween',
            delay: SCROLL_DELAY / 1.5 / 1000,
            duration: SCROLL_DELAY / 1000,
          }}
          initial="bottom"
          animate="bottom"
          // animate={loc === 0 || loc === 3 ? 'bottom' : 'top'}
          style={{
            maxHeight: `min(45vh, ${Math.round(
              MENU_BAR_DIMENSIONS.height * 0.6,
            )}px, 100vw/${MENU_BAR_DIMENSIONS.width}*${
              MENU_BAR_DIMENSIONS.height
            }*0.6)`,
            position: 'relative',
            zIndex: 9001,
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
        </motion.div>
      </div>
      <span
        className={`sticky top-0 font-normal text-xl block m-auto w-min h-0 ${
          loc === 0 ? 'hidden' : ''
        }`}
        style={{ zIndex: 9002 }}
        onClick={openPage(undefined)}
      >
        Menu
      </span>

      <section
        ref={bottomRef}
        className={`w-full h-screen min-h-fit ${loc === 0 ? 'hidden' : 'snap'}`}
        style={{ marginTop: 'calc(100svh - 100lvh)', height: '100svh' }}
      >
        <motion.div
          ref={scheduleRef}
          className="flex flex-col place-content-between w-full h-full content-center"
          style={{
            paddingTop: '20vh',
            paddingBottom: '10vh',
            y: loc === 2 ? 0 : bottomY,
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
            y: loc === 2 ? 0 : bottomY,
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
            y: loc === 2 ? 0 : bottomY,
            display: page === PageEnum.RSVP ? 'flex' : 'none',
          }}
        >
          <Form />
        </motion.div>
      </section>
    </>
  );
};

export default trpc.withTRPC(IndexPage);
