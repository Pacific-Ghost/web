import React from "react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen p-24">
      <Image
        width={500}
        height={100}
        src="/images/pac-ghost-logo.png"
        alt="Pacific Ghost logo"
      />
      <h3 className="text-xl">Coming soon...</h3>
    </main>
  );
}
