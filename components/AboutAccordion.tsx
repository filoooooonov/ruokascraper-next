import React, { ReactElement } from "react";
import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";
import { useState } from "react";

interface AccordionProps {
  title: string;
  text: ReactElement;
}

const AboutAccordion = ({ title, text }: AccordionProps) => {
  const [sectionOpen, setSectionOpen] = useState(false);

  return (
    <div>
      <button
        className="py-2 pl-2 text-gray-500 flex items-center cursor-pointer"
        onClick={() => setSectionOpen(!sectionOpen)}
      >
        {title}
        {sectionOpen ? (
          <GoTriangleUp size={18} />
        ) : (
          <GoTriangleDown size={18} />
        )}
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          sectionOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <p className="text-gray-500 text-md pl-2 mb-2 w-[90%] leading-6 overflow-hidden">
          <text />
        </p>
      </div>
    </div>
  );
};

export default AboutAccordion;
