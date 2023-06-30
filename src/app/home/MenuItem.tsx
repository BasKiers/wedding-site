import React from 'react';

interface MenuItemProps {
  name: string;
  icon: string;
  onClick: () => any;
}

const MenuItem: React.FC<MenuItemProps> = ({ name, icon, onClick }) => {
  return (
    <div className="w-1/5 flex flex-col px-8 cursor-pointer" onClick={onClick}>
      <div className="m-auto py-8 text-7xl">{icon.trim()}</div>
      <span className="text-center">{name}</span>
    </div>
  );
};

export default MenuItem;
