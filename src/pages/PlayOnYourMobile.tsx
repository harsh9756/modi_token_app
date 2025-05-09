export default function PlayOnYourMobile() {
    return (
      <div className="flex flex-col items-center justify-center gap-6 h-svh">
        <p className="text-2xl font-semibold uppercase">Play on Telegram!</p>
        <img
          src="/images/qrcode.jpg"
          alt="qrcode"
          className="object-contain max-w-xs rounded-xl"
        />
        <a href="#" className="text-2xl font-semibold">
          @ModiCoinBot
        </a>
      </div>
    );
  }
  