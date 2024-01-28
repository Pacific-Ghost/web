import { PropsWithChildren } from "react";

export function Glitch({ children }: PropsWithChildren) {
  return (
    <>
      <div className="glitch">
        <h1 className="glitch text-3xl sm:text-4xl md:text-7xl" data-text={children}>
          {children}
        </h1>
        <h1 className="glow text-7xl">{children}</h1>
      </div>
      <div className="scanlines"></div>
    </>
  );
}
