'use client';

import { NextPage } from 'next';
import { motion, useScroll, useTransform, cubicBezier } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useWindowSize } from '@uidotdev/usehooks';

const mbs = {
  width: 2866,
  height: 1612,
  get ratio() {
    return this.width / this.height;
  },
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
  return <div>Form</div>;
};

enum PageEnum {
  SCHEDULE,
  LOCATION,
  RSVP,
}

const IndexPage: NextPage = () => {
  const size = useWindowSize();
  const [height, setHeight] = useState(0);
  const [page, setPage] = useState<PageEnum | undefined>();
  const ref = useRef<any>(null);
  const bottomRef = useRef<any>(null);
  const scheduleRef = useRef<any>(null);
  const locationRef = useRef<any>(null);
  const rsvpRef = useRef<any>(null);

  useLayoutEffect(() => {
    const { clientHeight = 0, clientWidth = mbs.width } = ref.current || {};

    console.log(clientWidth);
    const imageHeight = Math.min(1, clientWidth / mbs.width) * mbs.height;
    console.log(
      clientHeight,
      imageHeight,
      size.height * 0.3,
      imageHeight * 0.4,
    );
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
    setTimeout(() =>
      bottomRef.current?.scrollIntoView({
        behavior: 'smooth',
      }),
    );
  }, [page]);

  const openPage = (pageName: PageEnum) => () => {
    setPage(pageName);
    if (pageName === page) {
      bottomRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <section className="w-screen h-screen">
        <div className="flex flex-col h-screen place-content-between">
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
            ref={ref}
          >
            <img
              style={{
                maxWidth: '100%',
                marginLeft: '50%',
                transform: 'translateX(-50%)',
              }}
              src="/menubar.webp"
            />
          </motion.div>
        </div>
      </section>

      {page === undefined ? (
        <div className="w-screen h-screen" />
      ) : (
        <section ref={bottomRef} className="w-screen h-screen">
          <motion.div
            ref={scheduleRef}
            className="flex flex-col h-screen place-content-between w-full h-full content-center"
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
            className="flex flex-col h-screen place-content-between w-full h-full px-28"
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
            className="flex flex-col h-screen place-content-between w-full h-full"
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
      )}
    </>
  );
};

export default IndexPage;
