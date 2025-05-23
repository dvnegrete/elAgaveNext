export interface Payment {
    id: string;
    type: string;
    period: string;
    amount: number;
    status: "vencido" | "pendiente" | "pagado";
    dueDate: string;
}