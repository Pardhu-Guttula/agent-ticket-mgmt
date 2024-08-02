import React from "react";

const AlertMessage = ({ message, onClose }) => {
  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white py-2 px-4 rounded shadow-lg">
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-xl font-bold">&times;</button>
      </div>
    </div>
  );
};

export default AlertMessage;
 