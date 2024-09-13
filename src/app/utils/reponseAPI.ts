import { NextResponse } from "next/server";

export const error400 = () => {
    return NextResponse.json(
        { error: 'falta email y/o numero de casa' },
        { status: 400 }
    );
}

export const error404 = () => {
    return NextResponse.json(
        { error: 'notFound' },
        { status: 404 }
    );
}

export const error405 = () => {
    return NextResponse.json(
        { error: 'Formato incorrecto en el correo' },
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