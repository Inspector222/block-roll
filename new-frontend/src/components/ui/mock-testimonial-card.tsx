"use client";

import { cn } from "@/lib/utils";

interface TestimonialData {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  text: string;
  verified?: boolean;
}

interface MockTestimonialCardProps {
  testimonial: TestimonialData;
  className?: string;
}

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g>
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"></path>
    </g>
  </svg>
);

const VerifiedIcon = ({ className }: { className?: string }) => (
  <svg
    aria-label="Verified Account"
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="currentColor">
      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
    </g>
  </svg>
);

export const MockTestimonialCard: React.FC<MockTestimonialCardProps> = ({
  testimonial,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative flex w-full h-full max-w-lg flex-col gap-2 overflow-hidden rounded-3xl border border-[#252525] p-4 pb-8 backdrop-blur-md",
        className,
      )}
    >
      {/* Header */}
      <div className="flex flex-row justify-between tracking-tight">
        <div className="flex items-center space-x-2">
          <img
            src={testimonial.avatar}
            alt={`Profile picture of ${testimonial.name}`}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center whitespace-nowrap font-semibold">
              {testimonial.name}
              {testimonial.verified && (
                <VerifiedIcon className="ml-1 inline size-4 text-blue-500" />
              )}
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-500 transition-all duration-75">
                @{testimonial.handle}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-start">
          <TwitterIcon className="size-5 items-start text-[#3BA9EE] transition-all ease-in-out hover:scale-105" />
        </div>
      </div>

      {/* Body */}
      <div className="break-words leading-normal tracking-tighter">
        <span className="text-sm font-normal text-white">
          {testimonial.text}
        </span>
      </div>
    </div>
  );
};

export default MockTestimonialCard;
