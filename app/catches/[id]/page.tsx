import Header from "@/app/components/header";
import FishDetail from "./fish-detail";

export default async function CatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header />
      <main>
        <FishDetail id={id} />
      </main>
    </>
  );
}
