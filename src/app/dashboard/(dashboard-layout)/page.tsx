// import { DEFAULT_DATE_RANGE } from "@/lib/constants/date.constants";

interface SearchParams {
  selectedRange?: "day" | "week" | "month" | "trimester" | "year";
}

export default async function Dashboard(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  console.log("🚀 ~ Dashboard ~ searchParams:", searchParams);
  // const { selectedRange = "day" } = searchParams;

  return (
    <div className="flex-col space-y-8">
      <h1>Tableau de bord</h1>
    </div>
  );
}
