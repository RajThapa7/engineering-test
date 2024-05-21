import { InputHTMLAttributes, RefObject } from "react";

interface NumberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputRef?: RefObject<HTMLInputElement>;
  isError: boolean;
}

const NumberInput = ({ inputRef, isError, ...props }: NumberInputProps) => {
  return (
    <input
      className={`h-12 w-12 rounded-[10px] border-none bg-gray-100 text-center text-3xl text-gray-600 outline-none ring-blue-500 ${
        isError && "ring-2 ring-red-500"
      } focus:ring-2 sm:h-16 sm:w-16 sm:text-4xl`}
      type="text"
      maxLength={1}
      ref={inputRef}
      {...props}
    />
  );
};

export default NumberInput;
