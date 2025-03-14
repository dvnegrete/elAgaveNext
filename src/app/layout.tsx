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
  description: "App para Condominio El Agave 1",
};

const imgAlt = "El Agave 1"

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
          <div className="flex flex-col justify-center items-center md:flex-row md:justify-evenly p-5">
            <h1 className='mt-6 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white md:order-1'>
              Condominio El Agave 1
            </h1>
            <Image
              className="rounded-full mt-3 md:mt-0"
              src="/images/el-agave(1).png"
              alt={imgAlt}
              width={150}
              height={100}
            />
          </div>

          <p className='mt-6 text-xl font-bold text-gray-900 md:text-2xl dark:text-white'>
            Registro de correos electrónicos y números de WhatsApp.
          </p>
        </div>
        {children}
      </body>
    </html>
  );
}
