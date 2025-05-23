'use client';
import { useState } from "react";
import { getAPI } from "@/service/fetchAPI";

export default function Login() {
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);

    const handlerClick = async () => {
        const inputPass = document.getElementById('pass') as HTMLInputElement;
        const pass = inputPass.value.trim();
        if (pass === "") {
            setShowMessage(true);
            setMessage("Introduce el código de acceso");
            return;
        }
        setShowMessage(false)
        if (pass !== undefined) {
            const API = `/api/login/${pass}`;
            const res = await getAPI(API);
            if (res.error) {
                setShowMessage(true);
                setMessage(res.error)
            }
            if (res.success) {
                setShowMessage(true);
                setMessage("Acceso concedido ✅, redirigiendo...");
                setTimeout(() => {
                    window.location.href = "/";
                }, 2500);
            }
        }
    }

    return (
        <section>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">

                <div className="w-full bg-gray-200 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-neutral-900 dark:border-emerald-400">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-base dark:text-white">
                            Inicia sesión para tener acceso a las funciones restringidas
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label htmlFor="pass" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Tu código
                                </label>
                                <input type="password" name="pass" id="pass"
                                    className="bg-gray-50 border border-gray-500 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:border-emerald-400 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="contraseña..." required />
                            </div>


                            <button type="button" onClick={handlerClick}
                                className="w-full  focus:ring-4 bg-gray-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600">
                                Iniciar Sesión
                            </button>
                        </form>

                        {
                            showMessage ?
                                <p className="text-emerald-600 dark:text-emerald-300 text-center text-2xl">{message}</p>
                                : <></>
                        }

                    </div>
                </div>
            </div>
        </section>
    )
}
