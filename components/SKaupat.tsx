import React from "react";
import CardItem from "./CardItem";
import slogo1 from "../public/s-kaupat.svg";
import slogo2 from "../public/prisma-logo.svg";
import slogo3 from "../public/alepa-logo.svg";

interface SKaupatProps {
  finalProducts: Record<string, [string, string, string]>;
}

const SKaupat = ({ finalProducts }: SKaupatProps) => {
  return (
    <>
      {Object.keys(finalProducts).length === 0 ? (
        <p className="mt-8 text-xl font-medium text-gray-700 flex items-center">
          Nothing to buy in S-Group!
          <img className="ml-2" src={slogo1} alt="🟢" />
          <img src={slogo2} alt="" />
          <img src={slogo3} alt="" />
        </p>
      ) : (
        <>
          <p className="mb-3 text-xl font-medium text-gray-700 flex items-center">
            Buy in S-Group
            <img className="ml-2" src={slogo1} alt="🟢" />
            <img src={slogo2} alt="" />
            <img src={slogo3} alt="" />
          </p>
          <div className="bg-secondary h-auto rounded-2xl p-2 space-y-2 mb-2">
            {Object.entries(finalProducts).map(
              ([name, [price_kpl, price_kilo, imageUrl]]) => {
                return (
                  <CardItem
                    key={name}
                    name={name}
                    price_kpl={price_kpl}
                    price_kilo={price_kilo}
                    imageUrl={imageUrl}
                  />
                );
              }
            )}
          </div>
        </>
      )}
    </>
  );
};

export default SKaupat;
