import React from "react";

const CardItem = ({ name, price_kpl, price_kilo, imageUrl }) => {
  return (
    <div className="bg-card-item h-[auto] p-2 rounded-lg w-full flex flex-row items-center ">
      <div className="flex flex-row w-full items-center gap-4">
        <img
          className="rounded-md h-12 w-12 object-contain bg-white"
          src={imageUrl}
          alt={name}
        />
        <p className="font-medium leading-5">{name}</p>
        <div className="ml-auto pr-4 flex flex-col">
          <p className="font-medium text-sm text-gray-500  text-nowrap">
            {price_kpl}
          </p>
          <p className="font-medium text-lg  text-nowrap">{price_kilo}</p>
        </div>
      </div>
    </div>
  );
};

export default CardItem;
