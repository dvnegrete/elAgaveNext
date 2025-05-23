"use client";

import { Payment } from "@/shared/interfaces/Payment.interface";
import { PaymentItem } from "./../PaymentItem";

interface PaymentListProps {
  payments: Payment[];
  showPaid: boolean;
}

export const PaymentList = ({ payments, showPaid }: PaymentListProps) => {
  const filteredPayments = showPaid
    ? payments
    : payments.filter((payment) => payment.status !== "pagado");

  return (
    <div className="space-y-1">
      {filteredPayments.map((payment) => (
        <PaymentItem key={payment.id} payment={payment} />
      ))}
    </div>
  );
};