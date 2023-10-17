import React from "react";
import Image from "next/image";
import Typography from '@mui/material/Typography';

export default function Home() {
    return (
        <main className="flex flex-col items-center min-h-screen p-24">
            <Image
                width={500}
                height={100}
                src="/images/pac-ghost-logo.png"
                alt="Pacific Ghost logo"
            />
            <Typography className={"uppercase font-extrabold"} variant="h3">Coming soon</Typography>
        </main>
    );
}
