import { cn } from "@/lib/utils";
import React from "react";

type Props = React.HtmlHTMLAttributes<HTMLDivElement> & {
  amount: number | string;
  level: number | string;
  type: string;
  d: string;
};

export default function Price({ amount, className, level=0, d,type, ...props }: Props) {
  let numericLevel = Number(level);
  const numericAmount = Number(amount);
  let calculatedAmount = 0
  // Calculate amount based on the type
  if (numericLevel > 0) {
    calculatedAmount = type === "a"
    ? numericAmount * Math.pow(2, numericLevel+1) // Double the amount per level for type "a"
    : type === "p"
    ? numericAmount * Math.pow(1.25, numericLevel+1) // Increase by 1.25 times per level for type "p"
    : numericAmount; // Default case if type isn't "a" or "p"
  }
  else {
    calculatedAmount=numericAmount
  }
  return (
    <div className={cn("flex items-center space-x-1 text-primary", className)} {...props}>
      <img
        src="/images/coin.png"
        alt="coin"
        className="object-contain w-5 h-5"
      />
      <span className="font-bold">{ type=="p"?"+":""}{calculatedAmount.toLocaleString( "en-US",{ maximumFractionDigits: 0 })}</span>
    </div>
  );
}
