import Header from "@/app/components/header";
import TackleFishes from "./tackle-fishes";

export default async function TackleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header />
      <main className="p-8 max-w-md">
        <TackleFishes tackleId={id} />
      </main>
    </>
  );
}
