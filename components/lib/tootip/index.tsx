import React, { useState } from 'react';

const Tooltip = ({ message, children }: any) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="group relative flex flex-col items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute top-full mt-2 flex flex-col items-center">
          {/* <div className="-mt-1 h-3 w-3 -rotate-45 bg-gray-600"></div> */}
          <div className="whitespace-no-wrap relative z-10 rounded-md bg-gray-600 p-2 text-xs leading-none text-white shadow-lg">
            {message}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
