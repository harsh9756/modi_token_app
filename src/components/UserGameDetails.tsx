import { cn, compactNumber } from "@/lib/utils";
import { useUserStore } from "@/store/user-store";

export default function UserGameDetails({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLDivElement>) {
  const user = useUserStore();
  return (
    <div
      className={cn("flex items-stretch justify-between gap-2", className)}
      {...props}
    >
      <div className="flex flex-col items-center justify-center flex-1 p-2 select-none bg-black/20 rounded-xl">
        <p className="mb-1 text-xs text-center text-black">Earn per tap</p>
        <div className="inline-flex items-center space-x-1.5 text-black font-bold">
          <img className="object-contain w-5 h-5" src="/images/coin.png" />{" "}
          <span className="text-sm">+{user?.earn_per_tap}</span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 p-2 select-none bg-black/20 rounded-xl">
        <p className="mb-1 text-xs text-center text-black">Gems to level up</p>
        {user.level && (
          <div className="inline-flex items-center space-x-1.5 text-black font-bold">
            <span className="text-sm">
              {compactNumber(user.level.to_balance)}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-center flex-1 p-2 select-none bg-black/20 rounded-xl">
        <p className="mb-1 text-xs text-center text-black">Profit per hour</p>
        <div className="inline-flex items-center space-x-1.5 text-black font-bold">
          <img className="object-contain w-5 h-5" src="/images/coin.png" />
          <span className="text-sm">
            +{user.production_per_hour.toLocaleString("en-US", { maximumFractionDigits: 3 })}
          </span>
        </div>
      </div>
    </div>
  );
}
