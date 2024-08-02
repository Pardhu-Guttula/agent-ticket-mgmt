import React from "react";

const CardGrid = ({ cardData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-center items-center">
      {cardData.map((card, index) => (
        <>
          <div className="flex items-center p-3 w-auto h-auto bg-white rounded-md shadow-lg">
            <section className="flex justify-center items-center w-14 h-14">
              <img
                src={card.imageurl}
                alt={card.title}
                className="object-cover rounded"
              />
            </section>

            <section className="block border-l border-gray-300 m-3">
              <div className="pl-3">
                <h3 className="text-gray-600 font-semibold text-sm">
                  {card.title}
                </h3>
                <h3 className="bg-clip-text text-transparent bg-gradient-to-l from-[#005BC4] to-[#27272A] text-3xl font-bold">
                  {card.content}
                </h3>
              </div>
            </section>
          </div>
        </>
      ))}
    </div>
  );
};

export default CardGrid;
 