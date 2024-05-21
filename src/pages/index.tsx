import {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  createRef,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/Button/Button";
import NumberInput from "../components/NumberInput/NumberInput";
import api from "../helper/axios";

function Home() {
  const navigate = useNavigate();
  const otpBoxLength = 6;
  const numberRegex = new RegExp(`^\\d{${otpBoxLength}}$`);

  const inputRefs = Array.from({ length: otpBoxLength }, () =>
    createRef<HTMLInputElement>()
  );

  const [otpValue, setOtpValue] = useState<string[]>(
    Array(otpBoxLength).fill("")
  );

  const [errorIndex, setErrorIndex] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async () => {
    if (otpValue.length < otpBoxLength) {
      toast.error("Please complete the otp");
      return;
    }

    const otp = otpValue.join("");

    if (!numberRegex.test(otp)) {
      const array: number[] = [];
      toast.error("Please enter a valid OTP");
      otpValue.forEach((item, index) => {
        if (isNaN(parseInt(item))) {
          array.push(index);
        }
      });
      setErrorIndex(array);
      inputRefs[array[array.length - 1]].current?.focus();
      return;
    }

    setErrorIndex([]);

    setIsLoading(true);
    await api
      .post("otp/validate", {
        otp,
      })
      .then((res) => {
        toast.success(res.data.message);
        navigate("/success");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
        setOtpValue(Array(otpBoxLength).fill(""));
      });
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    //get the copied value and extract length equal to otp box length and set the otp value
    const copiedValue = e.clipboardData.getData("Text") as string;
    const copiedValueArray = copiedValue.slice(0, otpBoxLength).split("");
    setOtpValue(copiedValueArray);
    inputRefs[inputRefs.length - 1].current?.focus();
  };

  return (
    <div className="flex gap-8 flex-col items-center justify-center min-h-screen">
      <ToastContainer autoClose={1500} />
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
          isLoading={isLoading}
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

export default Home;
