import Header from "@/app/components/header";
import LocationList from "./location-list";

export default async function LocationsPage() {
  return (
    <>
      <Header />
      <main className="p-8 max-w-2xl mx-auto w-full">
        <LocationList />
      </main>
    </>
  );
}
