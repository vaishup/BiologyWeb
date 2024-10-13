import React, { ReactNode } from 'react';

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
}) => {
  return (
    <div className="rounded-lg border border-stroke bg-white shadow-md dark:border-strokedark dark:bg-boxdark w-full max-w-sm">
      <div className="flex items-center justify-between py-6 px-6 ">
        <div className="flex flex-row">
          <div className="flex items-center justify-start mb-4">
            <div className="h-12 w-12 mt-2 flex items-center justify-center rounded-full bg-[#33adff] dark:bg-meta-4">
              {children}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="mt-1  ml-3 text-lg font-medium text-gray-500 dark:text-gray-400">
              {title}
            </span>
            <h4 className="text-3xl   ml-4 font-extrabold text-black dark:text-white">
              {total}
            </h4>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-[#f2f2f2] p-4">
        <a href="#" className="text-[#33adff] text-md font-bold">
          View all
        </a>
      </div>
    </div>
  );
};

export default CardDataStats;
