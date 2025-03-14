import dynamic from 'next/dynamic';

const DisabilityInsuranceComparison = dynamic(
  () => import('../components/DisabilityInsuranceComparison'),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <DisabilityInsuranceComparison />
    </main>
  );
}
