import "./globals.css";
import type {Metadata} from "next";
import {Roboto} from "next/font/google";

const robotoSerif = Roboto({subsets: ["latin"], weight: ["100", "300", "500", "700", "900"]});

export const metadata: Metadata = {
    title: "Pacific Ghost",
    description: "Pacific Ghost - Coast to coast",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={robotoSerif.className}>{children}</body>
        </html>
    );
}
