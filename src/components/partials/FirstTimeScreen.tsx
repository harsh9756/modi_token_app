import { Button } from "../ui/button";

type Props = {
  startGame: () => void;
};

export default function FirstTimeScreen({ startGame }: Props) {
  return (
    <div
      className="flex flex-col flex-1 justify-between bg-cover bg-center w-full max-w-lg min-h-[--tg-viewport-height] mx-auto px-6 py-8"
      style={{ backgroundImage: `url('/images/bg.png')` }}>
      <div className="rounded-3xl p-6 w-full shadow-xl border border-white/20 space-y-6 text-white text-center">
        {/* Title */}
        <h2 className="text-xl font-semibold tracking-wide">
          Your Starting Balance
        </h2>
      </div>
      <div className="rounded-3xl p-6 w-full shadow-xl border border-white/20 space-y-6 text-white text-center">
        <p className="text-sm text-gray-300 font-medium">
          You will receive 5 Bounty Coins to start your adventure!
        </p>
        <div className="flex justify-center items-center space-x-3">
          <img
            src="/images/bounty.png"
            alt="Diamond"
            className="w-8 h-8 object-contain"
          />
          <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 text-transparent bg-clip-text drop-shadow-lg">
            5
          </span>
        </div>
        <Button
          className="w-full uppercase font-semibold tracking-wide bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-500 text-black rounded-xl py-3 text-lg hover:scale-105 transition-transform duration-200"
          onClick={startGame}
        >
          Join the Journey!
        </Button>
      </div>
    </div>
  );
}
