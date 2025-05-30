import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Orbitron } from "next/font/google";
import { Press_Start_2P } from "next/font/google";
import { SessionStart } from "@/src/components/SessionStart";
import { currentUser } from "./lib/prisma/actions/userActions";
import { cookies } from "next/headers";

const orbitron = Orbitron({
  variable:"--font-orb",
  subsets:['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({ 
  weight: '400',
  variable: "--font-press",
  subsets: ['latin'],
  display: 'swap',
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) 

{
 let user;
  try{
   user = await currentUser();
  }catch(err:any){
    if(err.name==='TokenExpiredError'){
      (await cookies()).delete('gameit_token');
    }
  }


  return (
    <html lang="en">
      <body
        className={`${orbitron.className} ${geistMono.variable} ${pressStart2P.variable} antialiased`}
      >
        <SessionStart user={user} key={1} />
    <div className="fixed  inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px]" />
      </div>

        {children}
      </body>
    </html>
  );
}
