import Header from "@/app/components/header";
import TackleList from "./tackle-list";

export default async function TackleboxPage() {
  return (
    <>
      <Header />
      <main className="p-8 max-w-md">
        <h2 className="text-xl font-bold mb-4">Tacklebox</h2>
        <TackleList />
      </main>
    </>
  );
}
