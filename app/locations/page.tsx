import Header from "@/app/components/header";
import LocationList from "./location-list";

export default async function LocationsPage() {
  return (
    <>
      <Header />
      <main className="p-8 max-w-md">
        <h2 className="text-xl font-bold mb-4">Locations</h2>
        <LocationList />
      </main>
    </>
  );
}
