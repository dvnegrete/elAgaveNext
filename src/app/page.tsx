import { pagesData } from "@/shared/pagesData";
import Link from "next/link";
import Image from "next/image";

export default function Home() {

  return (
    <main className="flex min-h-full flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Bienvenido</h1>

      <h3 className="text-3xl my-5">Selecciona una opción:</h3>

      <section className="flex flex-col gap-4 p-5 text-xl text-blue-600">
        {
          pagesData.map((page) => (
            <Link
              key={page.title}
              className="hover:underline hover:text-blue-800"
              href={page.href}>
              {page.title}
            </Link>
          ))
        }

        <Image
        className="rounded-md mt-3 md:mt-0"
          width={300}
          height={300}
          src="/images/el-agave(2).png"
          alt="El Agave"
        />

      </section>
    </main>
  );
}
