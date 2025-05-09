import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: JSX.Element;
  image?: string;
  title: string | JSX.Element;
  subtitle?: string | JSX.Element;
  action?: string | JSX.Element | false;
};

export default function ListItem({
  image,
  title,
  subtitle,
  className,
  action,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "group flex items-center w-full gap-4 px-4 py-2 bg-black/20 rounded-xl",
        className
      )}
      type="button"
      {...props}
    >
      {image && (
        <img
          src={image}
          alt={title}
          className="w-10 object-cover h-10"
        />
      )}
      <div className="text-sm font-medium text-left">
        <p>{title}</p>
        {subtitle}
      </div>
      <div className="ml-auto">{action}</div>
    </button>
  );
}
