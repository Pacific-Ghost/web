import { PropsWithChildren } from "react";

function Brand({ children }: PropsWithChildren) {
  return (
    <div className="text-center font-brand uppercase text-primary">
      <div
        className="text-background md:text-9xl text-7xl"
        style={{
          textShadow:
            "-1px -1px 0 #2a07bf, 1px -1px 0 #2a07bf, -1px 1px 0 #000, 1px 1px 0 #2a07bf",
        }}
      >
        Pacific
      </div>
        <div className="bg-primary text-background font-sans lg:mb-3 mb-2">
            {children}
        </div>
      <div className="md:text-9xl text-7xl">Ghost</div>
    </div>
  );
}

export default Brand;
