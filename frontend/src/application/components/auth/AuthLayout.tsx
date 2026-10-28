import type { ReactNode } from "react";
import AuthCarousel from "@/application/components/auth/AuthCarousel";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-2">
      <div className="flex flex-col px-6 py-10">
        <span className="font-heading text-lg font-semibold lg:hidden">
          StockFlow
        </span>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm animate-auth-in">{children}</div>
        </div>
      </div>

      <div className="hidden p-3 lg:block">
        <div className="sticky top-3 h-[calc(100svh-1.5rem)]">
          <AuthCarousel />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
