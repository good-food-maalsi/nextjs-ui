import { Icons } from "@/components/icons";

export const AuthHeader = () => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex size-20 items-center justify-center rounded-lg bg-primary">
        <Icons.logo className="size-14" />
      </div>
      <p className="text-2xl font-bold uppercase italic">Lena</p>
    </div>
  );
};
