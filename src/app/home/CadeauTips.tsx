import React from 'react';
import { UnresolvedLink } from 'contentful';
import { trpc } from '~/utils/trpc';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const CadeauTips = () => {
  const { data: categories } = trpc.content.list.useQuery(undefined, {});

  if (!categories) {
    return <div></div>;
  }

  return (
    <div className="mt-6 flex flex-col overflow-y-auto mx-auto w-5/6 px-3">
      {categories.items
        .sort(({ fields: { order: a } }, { fields: { order: b } }) => a - b)
        .map(({ fields: { name, suggestions } }, i) => {
          return (
            <div className={`${i === 0 ? '' : 'pt-3'}`} key={i}>
              <h1 className="flex items-center text-5xl font-extrabold  pb-5 sticky top-0 bg-white">
                {name}
              </h1>
              <ul>
                {suggestions
                  .filter(
                    (
                      suggestion,
                    ): suggestion is Exclude<
                      typeof suggestion,
                      UnresolvedLink<'Entry'>
                    > => 'fields' in suggestion,
                  )
                  .map(
                    (
                      { reserved, fields: { title, description, image } },
                      j,
                    ) => {
                      return (
                        <li
                          key={j}
                          className="flex flex-col mb-5 items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row hover:bg-gray-100"
                        >
                          {image &&
                            'fields' in image &&
                            'file' in image.fields && (
                              <img
                                className="object-cover w-full rounded-t-lg h-96 md:w-2/6 md:rounded-none md:rounded-l-lg"
                                src={image.fields.file!.url}
                                alt=""
                              />
                            )}
                          <div
                            className="flex flex-col justify-between p-4 leading-normal"
                            style={{ alignSelf: 'baseline' }}
                          >
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
                              {title}
                            </h5>
                            <div className="mb-3 font-normal text-gray-700">
                              {documentToReactComponents(description)}
                            </div>
                          </div>
                        </li>
                      );
                    },
                  )}
              </ul>
            </div>
          );
        })}
    </div>
  );
};
export default CadeauTips;
