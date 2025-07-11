// import { DEFAULT_DATE_RANGE } from "@/lib/constants/date.constants";

type SearchParams = {
  selectedRange?: "day" | "week" | "month" | "trimester" | "year";
};

export default async function Dashboard({}: // searchParams,
{
  searchParams: Promise<SearchParams>;
}) {
  // const { selectedRange = "day" } = await searchParams;

  return (
    <div className="flex-col space-y-8">
      <h1>Tableau de bord</h1>
    </div>
  );
}
