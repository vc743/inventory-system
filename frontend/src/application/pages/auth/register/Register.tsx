import RegisterForm from "@/application/components/auth/RegisterForm";
import { Box } from "lucide-react";

const Register = () => {
  return (
    <div className="flex flex-col gap-4 p-6 md:p-6 h-screen">
      <div className="flex justify-center gap-2 md:justify-start">
        <a href="#" className="flex items-center gap-2 font-semibold">
          <div className="flex size-6 items-center justify-center rounded-md bg-blue-500 text-primary-foreground">
            <Box className="size-4" />
          </div>
          Inventory System
        </a>
      </div>
      <div className="flex flex-1 items-center justify-center">
          <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
