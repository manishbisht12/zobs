"use client";
import Image from "next/image";

const images = ["/c1.png", "/c2.png", "/c3.png", "/c4.png", "/c5.png", "/c6.png", "/c7.png"];

const Banner = () => {
  return (
    <div className="w-full bg-white py-6">
      <div className="flex justify-center px-8 gap-3">
        {images.map((src, i) => (
          <div
            key={i}
            className="w-[100px] h-[70px] bg-white rounded-xl shadow-md flex items-center justify-center"
          >
            <Image
              src={src}
              alt={`Image ${i}`}
              width={90}
              height={60}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banner;
