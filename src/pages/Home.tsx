import UserTap from "../components/UserTap";
import { useUserStore } from "../store/user-store";
import { Link } from "react-router-dom";
import UserGameDetails from "@/components/UserGameDetails";
import { useStore } from "@/store";
import Drawer from "@/components/ui/drawer";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {

  const user = useUserStore();
  const data = useStore();
  const [open, setOpen] = useState(false);
  const [pe, setPe] = useState(""); // Use state for `pe`

  if (data.passive_earning > 0) {
    setOpen(true);
    setPe(`${data.passive_earning.toLocaleString("en-US", { maximumFractionDigits: 6 })}`); // Update state
    data.passive_earning = 0;
  }

  const { maxLevel } = useStore();

  return (
    <div className="flex-1 px-5 pb-20 bg-slate-300">
      <header className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 px-3 py-2 border-2 rounded-full bg-black/25 border-black/10">
          <img
            src="/images/avatar.png"
            alt="user-avatar"
            className="object-cover w-8 h-8 rounded-full"
          />
          <p className="text-sm font-medium uppercase text-black">
            {user?.first_name}
          </p>
        </div>
        <div className="flex items-center gap-2 pl-2 pr-3 py-2 border-2 rounded-full bg-black/25 border-black/10">
          <img
            src="/images/coins.png"
            alt="coins"
            className="object-contain w-10 h-10"
          />
          <span className="text-2xl font-bold text-black">
            {user.balance.toLocaleString("en-US", { maximumFractionDigits: 6 })}
          </span>
        </div>
      </header>
      <UserGameDetails className="mt-6" />
      <div className="mt-6">
        <Link
          to={"/leaderboard"}
          className="flex items-center font-bold justify-between gap-2"
        >
          <div className="flex items-center text-black">
            <span>{user.level?.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-black">Level</span>
            <span className="font-bold text-black">
              {user.level?.level}/{maxLevel}
            </span>
          </div>
        </Link>
        <div className="bg-black/15 border overflow-hidden border-black/10 rounded-full mt-2 h-4 w-full">
          <div
            className="bg-[linear-gradient(180deg,#FBEDE0_0%,#F7B87D_21%,#F3A155_52%,#E6824B_84%,#D36224_100%)] h-full"
            style={{
              width: `${(user.balance! / user.level!.to_balance) * 100}%`,
            }}
          ></div>
        </div>
      </div>
      <UserTap />
      <Drawer open={open} onOpenChange={setOpen}>
        <div className="relative flex flex-col items-center justify-center w-full h-full p-6 space-y-4 bg-gray-100 rounded-t-3xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">🎉 You have earned</h2>
          <h1 className="text-4xl font-bold text-blue-600">{pe}</h1>
          <h4 className="text-md text-gray-600">from Passive earning</h4>

          <Button
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
