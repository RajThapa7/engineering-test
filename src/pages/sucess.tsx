import { useNavigate } from "react-router-dom";
import success from "../../public/success.png";
import Button from "../components/Button/Button";
const Success = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className=" font-semibold text-3xl">OTP Verified Successfully</p>
      <img src={success} alt="success" width={400} />
      <Button className="!w-48" onClick={() => navigate("/")}>
        Back home
      </Button>
    </div>
  );
};

export default Success;
