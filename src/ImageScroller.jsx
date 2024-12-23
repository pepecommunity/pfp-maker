import React, { useRef } from "react";

const ImageScroller = ({
  canvas,
  categorizedImages,
  handleAddImage,
  changeBackgroundImage,
}) => {
  const refs = useRef({});

  const scrollLeft = (category) => {
    if (refs.current[category]) {
      refs.current[category].scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = (category) => {
    if (refs.current[category]) {
      refs.current[category].scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full mt-10">
      {Object.keys(categorizedImages).map((category) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl text-center text-white mb-4 capitalize">
            {category}
          </h2>
          <div className="relative flex items-center">
            <button
              className="absolute left-0 z-10 p-2 bg-gray-300 rounded-full hover:bg-gray-400"
              onClick={() => scrollLeft(category)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#000"
                  d="m6.523 12.5l3.735 3.735q.146.146.153.344q.006.198-.153.363q-.166.166-.357.168t-.357-.162l-4.382-4.383q-.243-.242-.243-.565t.243-.566l4.382-4.382q.147-.146.347-.153q.201-.007.367.159q.16.165.162.353q.003.189-.162.354L6.523 11.5h12.38q.214 0 .358.143t.143.357t-.143.357t-.357.143z"
                />
              </svg>
            </button>
            <div
              className="flex h-[100px] overflow-x-auto no-scrollbar scroll-smooth px-4" // Add padding to the container
              ref={(scrollRef) => (refs.current[category] = scrollRef)}
            >
              <div className="flex-shrink-0 w-10"></div>{" "}
              {/* Spacer at the beginning */}
              {categorizedImages[category].map((img, i) => (
                <img
                  src={img}
                  key={i}
                  onClick={() => {
                    if (category.toLowerCase() == "backgrounds") {
                      changeBackgroundImage(img, canvas);
                    } else {
                      handleAddImage(img);
                    }
                  }}
                  className="w-auto h-[80px] m-2 cursor-pointer transition-transform duration-0 ease-in-out transform hover:scale-125"
                  alt={`img-${i}`}
                />
              ))}
              <div className="flex-shrink-0 w-10"></div>{" "}
              {/* Spacer at the end */}
            </div>
            <button
              className="absolute right-0 z-10 p-2 bg-gray-300 rounded-full hover:bg-gray-400"
              onClick={() => scrollRight(category)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#000"
                  d="M17.073 12.5H5.5q-.213 0-.357-.143T5 12t.143-.357t.357-.143h11.573l-3.735-3.734q-.146-.147-.152-.345t.152-.363q.166-.166.357-.168t.357.162l4.383 4.383q.13.13.183.267t.053.298t-.053.298t-.183.268l-4.383 4.382q-.146.146-.347.153t-.367-.159q-.16-.165-.162-.354t.162-.354z"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageScroller;
