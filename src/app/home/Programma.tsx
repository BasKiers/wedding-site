import React from 'react';

const Programma: React.FC = () => {
  const tdCls = 'border-b border-slate-100 p-4 pl-8 text-slate-500';

  return (
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
  );
};

export default Programma;
