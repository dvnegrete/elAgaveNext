"use client";

import { useState } from "react";

import { Header, TabNavigation, SummaryCard, ToggleShowPaid, PaymentList } from "@/components/Payments";
import { dummyPayments, dummyReceivedPayments } from "@/libs/dummy-data";

export default function PagosPage() {
  const [activeTab, setActiveTab] = useState<"cuotas" | "pagos">("cuotas");
  const [showPaid, setShowPaid] = useState(false);
  const [isAmountHidden, setIsAmountHidden] = useState(false);

  const totalPending = dummyPayments
    .filter((p) => p.status !== "pagado")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const balanceInFavor = 3900;

  return (
    <div className="max-w-md mx-auto px-4 pb-20 bg-background text-foreground">
      <Header />

      <TabNavigation onTabChange={setActiveTab} />

      <SummaryCard
        totalPending={totalPending}
        balance={balanceInFavor}
        isHidden={isAmountHidden}
        toggleVisibility={() => setIsAmountHidden(!isAmountHidden)}
      />

      {activeTab === "cuotas" ? (
        <>
          <ToggleShowPaid
            showPaid={showPaid}
            onToggle={() => setShowPaid(!showPaid)}
          />
          <PaymentList
            payments={dummyPayments}
            showPaid={showPaid}
          />
        </>
      ) : (
        <div className="mt-6">
          <h3 className="font-medium text-lg mb-4">Historial de pagos</h3>
          <div className="space-y-4">
            {dummyReceivedPayments.map((payment) => (
              <div key={payment.id} className="bg-[#1a1a1c] p-4 rounded-lg shadow-sm">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{payment.concept}</p>
                    <p className="text-sm text-gray-400">{payment.date}</p>
                  </div>
                  <p className="font-medium text-green-400">
                    ${payment.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}