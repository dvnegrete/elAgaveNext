import { Payment } from "@/shared/interfaces/Payment.interface";

export const dummyPayments: Payment[] = [
  {
    id: "1",
    type: "Cuota de mantenimiento",
    period: "Abril de 2025",
    amount: 1300.0,
    status: "vencido",
    dueDate: "30/04/2025",
  },
  {
    id: "2",
    type: "Cuota de mantenimiento",
    period: "Mayo de 2025",
    amount: 1300.0,
    status: "pendiente",
    dueDate: "31/05/2025",
  },
  {
    id: "3",
    type: "Cuota de mantenimiento",
    period: "Junio de 2025",
    amount: 1300.0,
    status: "pendiente",
    dueDate: "30/06/2025",
  },
  {
    id: "4",
    type: "Cuota de mantenimiento",
    period: "Marzo de 2025",
    amount: 1300.0,
    status: "pagado",
    dueDate: "31/03/2025",
  },
  {
    id: "5",
    type: "Cuota de mantenimiento",
    period: "Febrero de 2025",
    amount: 1300.0,
    status: "pagado",
    dueDate: "28/02/2025",
  },
];

export const dummyReceivedPayments = [
  {
    id: "p1",
    concept: "Pago cuota mantenimiento",
    date: "15/03/2025",
    amount: 1300.0,
  },
  {
    id: "p2",
    concept: "Pago cuota mantenimiento",
    date: "18/02/2025",
    amount: 1300.0,
  },
  {
    id: "p3",
    concept: "Abono a cuenta",
    date: "05/01/2025",
    amount: 3900.0,
  },
];