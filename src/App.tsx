import { ChangeEvent, KeyboardEvent, createRef, useEffect } from "react";
import Button from "./components/Button/Button";
import NumberInput from "./components/NumberInput/NumberInput";

function App() {
  const inputRefs = Array.from({ length: 6 }, () =>
    createRef<HTMLInputElement>()
  );

  // const [otpValue, setOtpValue] = useState<number[]>([]);
  const otpValue: number[] = [];

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, [inputRefs]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    if (!/\d/.test(e.target.value)) {
      inputRefs[currentIndex].current.value = "";
      return;
    }
    // setOtpValue((prev) => [...prev, parseInt(e.target.value)]);
    otpValue[currentIndex] = parseInt(e.target.value);
    const nextIndex = currentIndex + 1;
    if (nextIndex < inputRefs.length && inputRefs[nextIndex].current) {
      inputRefs[nextIndex].current?.focus();
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    const prevIndex = currentIndex - 1;
    if (e.key === "Backspace" || e.key === "Delete") {
      inputRefs[currentIndex].current.value = "";
      otpValue.pop();
      inputRefs[prevIndex].current?.focus();
      return;
    }
  };

  const handleSubmit = () => {
    const otp = parseInt(otpValue.join(""));
    alert(otp);
  };

  return (
    <div className="flex gap-8 flex-col items-center justify-center min-h-screen">
      <h2 className="font-semibold text-2xl">Verification code:</h2>
      <div className="flex flex-row gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <NumberInput
            value={otpValue[index]}
            inputRef={inputRefs[index]}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>
      <div>
        <Button
          onClick={() => {
            handleSubmit();
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default App;
