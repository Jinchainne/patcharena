import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
 metadataBase: new URL("https://patcharena-three.vercel.app"),
 title: "PatchArena — prove the patch",
 description: "Consensus-reviewed software bounties on GenLayer",
 icons: { icon: "/patcharena-logo.png", apple: "/patcharena-logo.png" },
 openGraph: { title: "PatchArena — prove the patch", description: "Bonded software bounties decided by GenLayer consensus.", images: ["/patcharena-logo.png"] }
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
