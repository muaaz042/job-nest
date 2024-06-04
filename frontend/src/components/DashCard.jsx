import React from 'react';

const DashCard = ({ title, value }) => {
  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-2xl">{value}</p>
    </div>
  );
};

export default DashCard;
