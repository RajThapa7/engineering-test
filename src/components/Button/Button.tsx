import { ButtonHTMLAttributes, ReactNode } from "react";
import { ClipLoader } from "react-spinners";
import classNames from "../../utils/classNames";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: ReactNode;
  isLoading?: boolean;
}

export default function Button({
  children,
  className,
  isLoading = false,
  ...props
}: ButtonProps) {
  // disable button if isLoading is true
  if (isLoading) props.disabled = true;

  return (
    <button
      {...props}
      className={classNames(
        className,
        props.disabled
          ? "bg-blue-900 text-white"
          : "bg-blue-800 text-white hover:bg-blue-900",
        "flex w-full flex-row items-center justify-center gap-5 rounded-[10px] font-bold uppercase transition-colors py-3 px-6"
      )}
    >
      {isLoading && <ClipLoader size={27} color={"#ffffff"} />}
      {!isLoading && children}
    </button>
  );
}
