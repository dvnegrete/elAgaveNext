import { NextResponse } from "next/server";

export const error400 = () => {
    return NextResponse.json(
        { error: '⛔ERROR❗ Verifica que TODA la información sea correcta.' },
        { status: 400 }
    );
}

export const error401 = () => {
    return NextResponse.json(
        { error: '⛔ No Autorizado' },
        { status: 401 }
    );
}

export const error404 = () => {
    return NextResponse.json(
        { error: 'notFound' },
        { status: 404 }
    );
}

export const error405 = (type: string) => {
    const error = type === "email" ? '⛔ERROR❗Formato incorrecto en el correo' : '⛔ERROR❗ Formato incorrecto en el número de WhatsApp';
    return NextResponse.json(
        { error },
        { status: 405 }
    );
}

export const error500 = (error: unknown) => {
    console.error(error);
    return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
    );
}