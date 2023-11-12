import { PropsWithChildren } from "react";

function Brand({ children }: PropsWithChildren) {
  return (
    <div className="text-center font-brand uppercase text-primary">
      <div
        className="text-background text-9xl"
        style={{
          textShadow:
            "-1px -1px 0 #2a07bf, 1px -1px 0 #2a07bf, -1px 1px 0 #000, 1px 1px 0 #2a07bf",
        }}
      >
        Pacific
      </div>
        <div className="bg-primary text-background font-sans mb-3">
            {children}
        </div>
      <div className="text-9xl">Ghost</div>
    </div>
  );
}

export default Brand;
