import { Icons } from "@/components/icons";

export const AuthHeader = () => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex size-20 items-center justify-center rounded-lg">
        <Icons.logo className="size-32" />
      </div>
    </div>
  );
};
