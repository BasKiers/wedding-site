import React, { ReactElement } from 'react';

interface MenuItemProps {
  name: string;
  icon: ReactElement;
  onClick: () => any;
}

const MenuItem: React.FC<MenuItemProps> = ({ name, icon, onClick }) => {
  return (
    <div
      className="w-1/3 flex flex-col px-4 sm:px-8 md:px-16 xl:px-24 cursor-pointer items-center"
      onClick={onClick}
    >
      <div style={{ color: '#EBC300' }}>{icon}</div>
      <span className="text-center text-xl pt-2">{name}</span>
    </div>
  );
};

export default MenuItem;
