import {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  createRef,
  useEffect,
  useState,
} from "react";
import Button from "./components/Button/Button";
import NumberInput from "./components/NumberInput/NumberInput";

function App() {
  const otpBoxLength = 6;
  const numberRegex = new RegExp(`^\\d{${otpBoxLength}}$`);

  const inputRefs = Array.from({ length: otpBoxLength }, () =>
    createRef<HTMLInputElement>()
  );

  const [otpValue, setOtpValue] = useState<string[]>(
    Array(otpBoxLength).fill("")
  );

  const [errorIndex, setErrorIndex] = useState<number[]>([]);

  //shifts focus on the first otp input on page load
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    const value = e.target.value;
    // if pressed key is non numeric do nothing
    if (!/\d/.test(value)) {
      e.target.value = "";
      return;
    }

    // remove the red ring when value is changed
    if (errorIndex?.includes(currentIndex) && /\d/.test(value)) {
      setErrorIndex((prev) => {
        const newErrorIndex = [...prev];
        const indexToRemove = newErrorIndex.indexOf(currentIndex);

        if (indexToRemove !== -1) {
          newErrorIndex.splice(indexToRemove, 1);
        }

        return newErrorIndex;
      });
    }

    setOtpValue((prev) => {
      const newOtpValue = [...prev];
      newOtpValue[currentIndex] = value;
      return newOtpValue;
    });

    const nextIndex = currentIndex + 1;
    if (nextIndex < inputRefs.length && inputRefs[nextIndex].current) {
      inputRefs[nextIndex].current?.focus();
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    // handle backspace and delete key press
    if (e.key === "Backspace" || e.key === "Delete") {
      //clear the current otp value
      setOtpValue((prev) => {
        const newOtpValue = [...prev];
        newOtpValue[currentIndex] = "";
        return newOtpValue;
      });

      //shift focus to prev otp box
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        inputRefs[prevIndex].current?.focus();
      }
      return;
    }

    //handle key press when you have pressed backspace previously
    const nextIndex = currentIndex + 1;
    if (otpValue[currentIndex] !== "" && /\d/.test(e.key)) {
      //focus to next otp box
      inputRefs[nextIndex].current?.focus();
      //set the value of next otp box to current pressed key
      setOtpValue((prev) => {
        const newOtpValue = [...prev];
        newOtpValue[nextIndex] = "";
        return newOtpValue;
      });
      return;
    }

    //focus to next box when pressed left arrow or up arrow
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      inputRefs[currentIndex + 1].current?.focus();
      return;
    }

    //focus to previous box when pressed right arrow or down arrow
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      inputRefs[currentIndex - 1].current?.focus();
      return;
    }

    // when focus on last opt box and pressed enter call handleSubmit
    if (currentIndex === otpBoxLength - 1 && e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (otpValue.length < otpBoxLength) {
      alert("please complete the otp");
      return;
    }

    const otp = otpValue.join("");

    if (!numberRegex.test(otp)) {
      const array: number[] = [];
      alert("only no ma h bor");
      otpValue.forEach((item, index) => {
        if (isNaN(parseInt(item))) {
          array.push(index);
        }
      });
      setErrorIndex(array);
      inputRefs[array[array.length - 1]].current?.focus();
      return;
    }

    alert(otp);
    setErrorIndex([]);
  };

  console.log(errorIndex, "error index");
  console.log(otpValue, "otp value");

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    //get the copied value and extract length equal to otp box length and set the otp value
    const copiedValue = e.clipboardData.getData("Text") as string;
    const copiedValueArray = copiedValue.slice(0, otpBoxLength).split("");
    setOtpValue(copiedValueArray);
    inputRefs[inputRefs.length - 1].current?.focus();
  };

  return (
    <div className="flex gap-8 flex-col items-center justify-center min-h-screen">
      <h2 className="font-semibold text-2xl">Verification code:</h2>
      <div className="flex flex-row gap-4">
        {Array.from({ length: otpBoxLength }).map((_, index) => (
          <NumberInput
            key={index}
            isError={errorIndex?.includes(index) || false}
            onPaste={(e) => handlePaste(e)}
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
          className="!w-32"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default App;
