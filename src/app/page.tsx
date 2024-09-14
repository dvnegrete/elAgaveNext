'use client';

import { useState } from 'react';
import { getAPI, putAPI, postAPI } from '../service/fetchAPI';
import { Loader } from '@/components/Loader/Loader';

export default function Home() {
  const [showInputMail, setShowInputMail] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [registerDB, setRegisterDB] = useState(false);
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [houseNumber, setHouseNumber] = useState(0);
  const [message, setMessage] = useState('');

  const totalHouse = 66;

  const resetState = () => {
    setShowLoader(true);
    setShowInputMail(false);
    setRegisterDB(false);
    setIsError(false);
    setMessage("");
  }

  const handleNumberHouseVerify = async () => {
    resetState();
    const houseSelect = document.getElementById('houseNumber') as HTMLInputElement;
    const numberHouse = Number(houseSelect.value);
    if (numberHouse !== null && numberHouse > 0 && numberHouse <= totalHouse) {
      setHouseNumber(numberHouse);
      const API = `/api/verifyHouse/${numberHouse}`;
      const res = await getAPI(API);
      if (!res) {
        setEmail('');
        setMessage('Escribe el correo en el campo en verde, y presiona Registrar.')
      } else {
        setEmail(res.email);
        setId(res.id);
        setRegisterDB(true);
      }
      setShowInputMail(true);
      setShowLoader(false);
    } else {
      setHouseNumber(0);
      setMessage('Numero de casa no valido');
      setShowLoader(false);
    }
  }

  const handleRegister = async () => {
    setShowLoader(true);
    const API = '/api/register';

    const res = registerDB ? await putAPI(API, { email, id }) : await postAPI(API, { email, houseNumber });
    if (res.error) {
      setMessage(res.error || 'Ocurrió un error');
      setIsError(true);
    }
    if (res.result && res.result.affectedRows === 1) {
      setMessage(`Registro exitoso para la casa ${houseNumber} con el correo: ${email} `);
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
        <p className='text-xl text-green-600'> {email} </p>
        <p className='text-red-800 text-xs'>
          * Caracteres ocultos por seguridad.
        </p>
        <p className='mt-5'>
          Si necesitas modificarlo introduce el correo electrónico correcto y actualizalo a continuación:
        </p>
        <hr />
      </>)
      :
      (<></>);
  }


  return (
    <div className='flex flex-col items-center justify-items-center min-h-screen m-8 pb-20 gap-16 sm:m-1 font-[family-name:var(--font-geist-sans)] text-pretty'>
      

      {
        showLoader ?

          <Loader />

          :

          <main
            className="flex flex-col place-content-center gap-4 md:w-9/12 sm:w-5/6 row-start-2 md:items-center sm:items-start bg-slate-900 p-10 rounded-md"
          >

            <div className='flex justify-evenly items-center w-full py-5'>
              <label htmlFor="houseNumber" className='pr-1 text-center'>Número de casa:</label> 
              <span className='pr-3 text-xl'>{houseNumber > 0 && houseNumber <= totalHouse ? houseNumber : '' }</span>
              <input
                className="rounded-md border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                type="number"
                id="houseNumber"
                max={totalHouse}
                min='1'
              />

            </div>
            <button
              onClick={handleNumberHouseVerify}
              className="rounded-full border border-solid p-2 bg-slate-200 text-slate-950 self-center"
              type="submit">
              Verificar Casa
            </button>
            <hr />
            {
              messageMail(email)
            }
            {
              showInputMail && !isError &&
              <form
                className='text-center'                >
                <label htmlFor="email" className='text-green-600'>Correo electrónico:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-md border-4 border-solid border-green-800 transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#cccccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                />
                <br /><br />
                <button
                  onClick={handleRegister}
                  className="rounded-full border border-solid p-4 bg-slate-200 text-slate-950"
                  type="submit">
                  {registerDB ? 'Actualizar correo' : 'Registrar'}
                </button>
              </form>
            }
            {message && <p className='text-yellow-500'>{message}</p>}

          </main>
      }
    </div>
  );
}
