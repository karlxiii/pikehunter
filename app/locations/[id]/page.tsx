import Header from "@/app/components/header";
import LocationFishes from "./location-fishes";

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header />
      <main className="p-8 max-w-2xl mx-auto w-full">
        <LocationFishes locationId={id} />
      </main>
    </>
  );
}
