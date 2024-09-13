'use client';

import { ChangeEvent, useState } from 'react';
import { getAPI, putAPI, postAPI } from './service/fetchAPI';
import { Loader } from './components/Loader/page';

export default function Home() {
  const [showInputMail, setShowInputMail] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [registerDB, setRegisterDB] = useState(false);
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [message, setMessage] = useState('');

  const totalHouse = 66;

  const resetState = () => {
    setShowLoader(true);
    setShowInputMail(false);
    setRegisterDB(false);
    setIsError(false);
    setMessage("");
  }

  const handleNumberHouseVerify = async (e: ChangeEvent<HTMLSelectElement>) => {
    resetState();
    const houseSelect = e.target.value;
    e.preventDefault();
    if (houseSelect !== null) {
      setHouseNumber(houseSelect);
      const API = `/api/verifyHouse/${houseSelect}`;
      const res = await getAPI(API);
      if (!res) {
        setEmail('')
      } else {
        setEmail(res.email);
        setId(res.id);
        setRegisterDB(true);
      }
      setShowInputMail(true);
      setShowLoader(false);
    }
  }

  const handleSubmit = async (e: SubmitEvent) => {
    setShowLoader(true);
    e.preventDefault();
    const API = '/api/register';

    const res = registerDB ? await putAPI(API, { email, id }) : await postAPI(API, { email, houseNumber });
    if (res.error) {
      setMessage(res.error || 'Ocurrió un error');
      setIsError(true);
    }
    if (res.result && res.result.affectedRows === 1) {
      setMessage(`Registro exitoso del correo: ${email}`);
      setShowInputMail(false);
      setRegisterDB(false)
    }
    setEmail('');
    setShowLoader(false);
  };

  const messageMail = (email: string) => {
    return registerDB && !isError ?
      (<>
        <p className='text-sm'>
          Ya existe un correo registrado para la casa {houseNumber}:
        </p>
        <p className='text-xl text-emerald-600'> {email} </p>
        <p className='text-red-700 text-xs'>
          * Caracteres ocultos por seguridad.
        </p>
        <p className='mt-5'>
          Si necesitas modificarlo introduce el correo electrónico correcto y registralo nuevamente:
        </p>
        <hr />
      </>)
      :
      (<></>);
  }


  return (
    <div className='flex flex-col items-center justify-items-center min-h-screen m-8 pb-20 gap-16 sm:m-1 font-[family-name:var(--font-geist-sans)] text-pretty'>
      <div className='text-center'>
        <h1 className='mt-6 text-4xl font-bold text-gray-900 sm:text-5xl md:text-5xl dark:text-white'>
          Condominio El Agave 1
        </h1>
        <p className='mt-6 text-3xl font-bold text-gray-900 sm:text-5xl md:text-4xl dark:text-white'>
          Registro de correos electrónicos.
        </p>
      </div>

      {
        showLoader ?

          <Loader />

          :

          <main
            className="flex flex-col place-content-center gap-4 md:w-9/12 sm:w-5/6 row-start-2 md:items-center sm:items-start bg-slate-900 p-10 rounded-md"
          >
            
            <div className='flex justify-evenly items-center w-full py-5'>
              <label htmlFor="houseNumber" className='pr-3'>Número de casa:</label>
              <select
                className="rounded-md border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                id="houseNumber"
                value={houseNumber}
                onChange={(e) => handleNumberHouseVerify(e)}
              >
                {Array.from({ length: totalHouse }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

            </div>
            <hr />
            {
              messageMail(email)
            }
            {
              showInputMail && !isError &&
              <form
                className='text-center'
                onSubmit={handleSubmit}>
                <label htmlFor="email">Correo electrónico:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-md border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                />
                <br /><br />
                <button
                  className="rounded-full border border-solid p-5 bg-slate-200 text-slate-950"
                  type="submit">
                  Registrar
                </button>
              </form>
            }
            {message && <p className='text-yellow-500'>{message}</p>}

          </main>
      }
    </div>
  );
}
