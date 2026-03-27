import Header from "@/app/components/header";
import TackleList from "./tackle-list";

export default async function TackleboxPage() {
  return (
    <>
      <Header />
      <main className="p-8 max-w-2xl mx-auto w-full">
        <TackleList />
      </main>
    </>
  );
}
