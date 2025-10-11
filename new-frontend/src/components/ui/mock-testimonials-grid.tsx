import * as React from "react";
import { cn } from "@/lib/utils";
import { MockTestimonialCard } from "./mock-testimonial-card";
import { Marquee } from "./marquee";

export interface TestimonialData {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  text: string;
  verified?: boolean;
}

export interface MockTestimonialsGridProps {
  testimonials: TestimonialData[];
  className?: string;
  speed?: "slow" | "normal" | "fast";
  columns?: number;
}

export const MockTestimonialsGrid: React.FC<MockTestimonialsGridProps> = ({
  testimonials,
  className,
  speed = "slow",
  columns = 3,
}) => {
  const getDuration = () => {
    const map = { slow: 120, normal: 30, fast: 15 };
    return `${map[speed]}s`;
  };

  const cols = Array.from({ length: columns }, (_, colIdx) =>
    testimonials.filter((_, testimonialIdx) => testimonialIdx % columns === colIdx)
  );

  const colsMd = Array.from({ length: 2 }, (_, colIdx) =>
    testimonials.filter((_, testimonialIdx) => testimonialIdx % columns === colIdx)
  );

  return (
    <div className={cn("flex w-full h-full relative overflow-hidden px-4 max-w-[1240px] mx-auto", className)}>
      <div className="absolute -top-16 w-full h-1/3 z-20 bg-gradient-to-b from-[#101010] via-[#101010]/90 to-transparent"></div>
      <div className="absolute -bottom-8 w-full h-1/3 z-20 bg-gradient-to-t from-[#101010] via-[#101010]/90 to-transparent"></div>
      
      {/* Desktop - 3 columns */}
      <div className="w-full hidden lg:flex">
        {cols.map((colTestimonials, colIdx) => (
          <Marquee
            key={colIdx}
            vertical
            reverse={colIdx % 2 === 1}
            repeat={2}
            className=""
            style={
              {
                "--duration": getDuration(),
              } as React.CSSProperties
            }
          >
            {colTestimonials.map((testimonial, i) => (
              <div
                key={`col${colIdx}-testimonial${i}`}
                className="flex-none min-h-[154px] transition-transform"
              >
                <MockTestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </Marquee>
        ))}
      </div>

      {/* Tablet - 2 columns */}
      <div className="w-full hidden md:flex lg:hidden">
        {colsMd.map((colTestimonials, colIdx) => (
          <Marquee
            key={colIdx}
            vertical
            reverse={colIdx % 2 === 1}
            repeat={2}
            className=""
            style={
              {
                "--duration": getDuration(),
              } as React.CSSProperties
            }
          >
            {colTestimonials.map((testimonial, i) => (
              <div
                key={`col${colIdx}-testimonial${i}`}
                className="flex-none min-h-[154px] transition-transform"
              >
                <MockTestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </Marquee>
        ))}
      </div>

      {/* Mobile - 1 column */}
      <div className="w-full flex flex-col md:hidden items-center justify-center">
        <Marquee
          vertical
          repeat={2}
          className=""
          style={
            {
              "--duration": getDuration(),
            } as React.CSSProperties
          }
        >
          {testimonials.map((testimonial, i) => (
            <div
              key={`col-testimonial${i}`}
              className="flex-none !min-h-[154px] transition-transform"
            >
              <MockTestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default MockTestimonialsGrid;
