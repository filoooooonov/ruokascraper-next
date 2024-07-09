import React from "react";
import CardItem from "./CardItem";
import klogo from "../public/kesko-logo.svg";
import Image from "next/image";

interface KeskoProps {
  finalProducts: Record<string, [string, string, string]>;
  className?: string;
}

const Kesko = ({ finalProducts, className }: KeskoProps) => {
  return (
    <div className={className}>
      {Object.keys(finalProducts).length === 0 ? (
        <p className="mt-8 text-xl font-medium text-gray-700 flex items-center gap-2">
          Nothing to buy in K-Group!
          <Image src={klogo} alt="🟠" />
        </p>
      ) : (
        <>
          <p className="mb-3 text-xl font-medium text-gray-700 flex items-center gap-2">
            Buy in K-Group
            <Image src={klogo} alt="🟠" />
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
    </div>
  );
};

export default Kesko;
