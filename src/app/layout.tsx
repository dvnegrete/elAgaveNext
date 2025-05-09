import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "El Agave",
  description: "App para Condominio El Agave",
};

const imgAlt = "El Agave logo";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className='text-center'>
          <div className="flex flex-col justify-center items-center md:flex-row md:justify-evenly p-8">
            <h1 className='flex items-center mt-6 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white md:order-1'>
              <span>Condominio El Agave</span>
              <Image
                className="md:mt-0 mx-2"
                src="/images/logo_el_agave.png"
                alt={imgAlt}
                width={60}
                height={60}

              />
            </h1>
            <Image
              className="rounded-full mt-3 md:mt-0"
              src="/images/el-agave(1).png"
              alt={imgAlt}
              width={150}
              height={100}
            />
          </div>


        </div>
        {children}
      </body>
    </html>
  );
}
