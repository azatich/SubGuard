import React from "react";

export const AuthSplitScreen = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-zinc-950 text-zinc-50">
      <div className="hidden lg:flex flex-col justify-center px-20 relative overflow-hidden border-r border-zinc-900 bg-zinc-950">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="absolute inset-0 pointer-events-none z-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]">
          <svg
            className="absolute h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="auth-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-green-500/10"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auth-grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-xl">
          <h1 className="text-4xl font-semibold leading-tight mb-8 text-white text-balance">
            "Перестаньте сливать бюджет. Наведите порядок в своих подписках
            сегодня."
          </h1>
          <div className="flex items-center gap-4 text-green-500 font-medium tracking-widest text-sm uppercase">
            <span className="w-8 h-[2px] bg-green-500"></span>
            Subguard
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
};
