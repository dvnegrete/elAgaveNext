'use client';

import { ChangeEvent, useState } from 'react';
import { getAPI, putAPI, postAPI } from '../service/fetchAPI';
import { Loader } from '@/components/Loader/Loader';
import Swal from 'sweetalert2';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [registerDB, setRegisterDB] = useState(false);
  const [isError, setIsError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [id, setId] = useState("");
  const [houseNumber, setHouseNumber] = useState(0);
  const [message, setMessage] = useState('');

  const totalHouse = 66;

  const resetState = () => {
    setShowLoader(true);
    setShowForm(false);
    setRegisterDB(false);
    setIsError(false);
    setMessage("");
    cleanedInputs();
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
        setMessage('Registra tus datos de contacto en los campos en verde, y presiona en "Registrar" al terminar .')
        setShowForm(true);
      } else {
        setEmail(res.email);
        setPhone(res.phone)
        setId(res.id);
        setRegisterDB(true);
      }

      setShowLoader(false);
    } else {
      setHouseNumber(0);
      setMessage('⛔ Numero de casa no valido');
      setShowLoader(false);
    }
  }

  const handleButton = () => {
    if (!registerDB) {
      handleRegister()
    } else {
      Swal.fire({
        title: "Confirmar actualización.",
        text: `¿Estas seguro de modificar los datos de contacto de la casa ${houseNumber}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, quiero actualizar."
      })
        .then(res => res.isConfirmed ? handleRegister() : setShowForm(false))
    }
  }

  const handleRegister = async () => {
    setShowLoader(true);
    const API = '/api/register';

    const res = registerDB ? await putAPI(API, { name, email, phone, id }) : await postAPI(API, { name, email, phone, houseNumber });
    if (res.error) {
      setMessage(res.error || 'Ocurrió un error ⛔');
      setIsError(true);
    }
    if (res.result && res.result.affectedRows === 1) {
      setMessage(`✅ REGISTRO EXITOSO!🎉 Casa ${houseNumber} con el correo ${email}, y el número ${phone}. Si hay un error, ingresa nuevamente y modifica la información.`);
      setShowForm(false);
      setRegisterDB(false);
    }
    cleanedInputs();
    setShowLoader(false);
  };

  const cleanedInputs = () => {
    setEmail('');
    setPhone('');
    setName('');
  }

  const handlerPhone = (e: ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "");
    setPhone(cleaned);
  }

  const messageMail = (email: string, phone: string) => {
    return registerDB && !isError ?
      (<>
        <p className='text-sm'>
          ✅ Ya existe un registro para la casa {houseNumber}.
        </p>
        <p className='text-sm'>
          Correo electrónico:
        </p>
        <p className='text-xl text-green-600'>{email} </p>
        <p className='text-sm'>
          WhatsApp:
        </p>
        <p className='text-xl text-green-600'>{phone} </p>
        <p className='text-red-500 text-xs'>
          * Caracteres ocultos por seguridad 🚫.
        </p>
        <hr />
        {showForm ?
          (
            <p className='mt-5'>
              Introduce nuevamente TODA la información de la casa {houseNumber}. ⬇️
            </p>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="rounded-full border border-solid p-2 bg-yellow-400 text-slate-900 self-center"
              type="button">
              Modificar información
            </button>
          )
        }
      </>)
      :
      (<></>);
  }


  return (
    <div className='flex flex-col items-center justify-items-center m-8 mt-2 pb-20 gap-16 sm:m-1 font-[family-name:var(--font-geist-sans)] text-pretty'>


      {
        showLoader ?

          <Loader />

          :

          <main
            className="flex flex-col place-content-center gap-4 md:w-9/12 sm:w-5/6 row-start-2 md:items-center sm:items-start p-10 pt-3 rounded-md"
          >

            <div className='flex justify-evenly items-center w-full py-5'>
              <label htmlFor="houseNumber" className='pr-1 text-center'>Número de casa:</label>
              <span className='pr-3 text-xl'>{houseNumber > 0 && houseNumber <= totalHouse ? houseNumber : ''}</span>
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
              messageMail(email, phone)
            }
            {
              showForm && !isError &&
              <form
                className='text-center'>
                <label htmlFor="name" className='text-green-300'>Nombre:</label>
                <input
                  type="email"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="rounded-md border-4 border-solid border-green-600 transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#cccccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                />
                <label htmlFor="email" className='text-green-300'>Correo electrónico:</label>
                <input
                  type="email"
                  id="email"
                  onChange={(e => setEmail(e.target.value))}
                  required
                  className="rounded-md border-4 border-solid border-green-600 transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#cccccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                />
                <label htmlFor="whats" className='text-green-300'>WhatsApp:</label>
                <input
                  type="tel"
                  id="whats"
                  onChange={handlerPhone}
                  required
                  pattern="[0-9]{10}"
                  placeholder='Numero a 10 digitos'
                  maxLength={14}
                  className="rounded-md border-4 border-solid border-green-600 transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#cccccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                />
                <br /><br />
                <button
                  onClick={handleButton}
                  className="rounded-full border border-solid p-4 bg-slate-200 text-slate-950"
                  type="button">
                  {registerDB ? 'Actualizar información' : 'Registrar'}
                </button>
              </form>
            }
            {message && <p className='text-yellow-400'>{message}</p>}

          </main>
      }
    </div>
  );
}
