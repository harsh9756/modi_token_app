import CopyIcon from "@/components/icons/CopyIcon";
import { Button } from "@/components/ui/button";
import { $http } from "@/lib/http";
import { compactNumber } from "@/lib/utils";
import { useStore } from "@/store";
import { useUserStore } from "@/store/user-store";
import { PaginationResponse } from "@/types/Response";
import { UserType } from "@/types/UserType";
import { useQuery } from "@tanstack/react-query";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useMemo} from "react";
import { toast } from "react-toastify";

const shareMessage = encodeURI(
  "Mine Modi Coin with me!"
);

export default function Friends() {
  const [, copy] = useCopyToClipboard();
  const { telegram_id } = useUserStore();
  const { referral } = useStore();


  const referralLink = useMemo(
    () => `${import.meta.env.VITE_BOT_URL}/?start=${telegram_id}`,
    [telegram_id]
  );

  const referredUsers = useQuery({
    queryKey: ["referredUsers"],
    queryFn: () => $http.$get<PaginationResponse<UserType>>("/referred-users"),
  });

  return (
    <div className="flex flex-col justify-end bg-slate-300 text-black flex-1">
      <div className="flex flex-col flex-1 w-full h-full px-6 py-8 pb-24 mt-12 modal-body">
        <h1 className="text-2xl font-bold text-center uppercase">Friends</h1>
        <p className="mt-2.5 font-medium text-center">
          You and your friend will receive bonuses.
        </p>
        <div className="mt-4 space-y-2">
          <button className="flex items-center w-full gap-4 px-4 py-2 bg-black/15 rounded-xl">
            <img
              src="/images/bounty.png"
              alt="bounty"
              className="object-contain w-9 h-9 mix-blend-screen"
            />
            <div className="text-sm font-medium text-left">
              <p>Invite a friend</p>
              <div className="flex items-center space-x-1">
                <img
                  src="/images/coin.png"
                  alt="coin"
                  className="object-contain w-5 h-5"
                />
                <span className="font-bold ">
                  +{referral.base.welcome.toLocaleString()}
                </span>
                <span className="text-sm">for you and your friend receives Welcome Bonus</span>
              </div>
            </div>
          </button>
          <button className="flex items-center text-left w-full gap-4 px-4 py-2 bg-black/15 rounded-xl">
            <img
              src="/images/bounty.png"
              alt="bounty"
              className="object-contain w-9 h-9 mix-blend-screen"
            />
            <div className="text-sm font-medium">
              <p>Invite a friend with Telegram premium</p>
              <div className="flex items-center space-x-1">
                <img
                  src="/images/coin.png"
                  alt="coin"
                  className="object-contain w-5 h-5"
                />
                <span className="font-bold ">
                  +{referral.premium.welcome.toLocaleString()}
                </span>
                <span className="text-sm">for you and your friend receives Welcome Bonus</span>
              </div>
            </div>
          </button>
        </div>
        <div className="relative flex-1">
          <div className="absolute inset-0 w-full h-[calc(100%-1rem)] py-6 mt-4 overflow-y-scroll">
            <p className="mt-8 text-sm font-bold uppercase">
              List of your friends{" "}
              {referredUsers.data?.meta
                ? `(${referredUsers.data?.meta.total})`
                : null}
            </p>
            {referredUsers.isLoading ? (
              <div className="flex items-center justify-center w-full h-14">
                <div className="w-5 h-5 border-2 border-t-[#D9D9D9]/10 rounded-full border-t animate-spin"></div>
              </div>
            ) : referredUsers.data?.data?.length ? (
              <div className="mt-4 space-y-4">
                {referredUsers.data.data.map((item, key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between px-4 py-3 bg-black/15 rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src="/images/avatar.png"
                        alt="avatar"
                        className="object-contain w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {item.first_name} {item.last_name}
                        </p>
                        <p className="text-xs">{item.level?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <img
                        src="/images/coin.png"
                        alt="coin"
                        className="object-contain w-5 h-5"
                      />
                      <span className="text-sm font-medium ">
                        {compactNumber(item.balance)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center px-4 mt-4 border-2 border-dashed rounded-xl border-black/40 h-14">
                <p className="text-xs font-medium text-center text-black/70">
                  You didn’t invite anyone yet
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button
            className="flex-shrink-0"
            onClick={() => {
              copy(referralLink);
              toast.success("Referral link copied to clipboard");
            }}
          >
            <CopyIcon className="w-5 h-5" />
          </Button>
          <Button
            className="flex-1"
            onClick={() =>
              Telegram.WebApp.openTelegramLink(
                `https://t.me/share/url?text=${shareMessage}&url=${referralLink}`
              )
            }
          >
            Invite a friend
          </Button>
        </div>
      </div>
    </div>
  );
}
