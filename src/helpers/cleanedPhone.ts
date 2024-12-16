import { z } from "zod";

const phoneSchema = z
    .string()
    .nonempty("El número de teléfono es obligatorio")
    .regex(/^\d+$/, "El número de teléfono debe contener solo dígitos")
    .min(10, "El número de teléfono debe tener al menos 10 dígitos")
    .max(15, "El número de teléfono no puede exceder los 15 dígitos");

export const cleanedPhone = (phone: string)=> {
    const clean = phone.replace(/\D/g, "");
     phoneSchema.parse(clean);
     return clean;
}