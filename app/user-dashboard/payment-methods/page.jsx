import dynamic from "next/dynamic";

const PaymentPageClient = dynamic(() => import("./PaymentPageClient"), {
  ssr: false,
});

export default function PaymentPage() {
  return <PaymentPageClient />;
}
