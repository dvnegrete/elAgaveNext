import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "El Agave 1",
  description: "App para control de email por casa",
};

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
        <h1 className='mt-6 text-4xl font-bold text-gray-900 sm:text-5xl md:text-5xl dark:text-white'>
          Condominio El Agave 1
        </h1>
        <p className='mt-6 text-3xl font-bold text-gray-900 sm:text-5xl md:text-4xl dark:text-white'>
          Registro de correos electrónicos.
        </p>
      </div>
        {children}
      </body>
    </html>
  );
}
