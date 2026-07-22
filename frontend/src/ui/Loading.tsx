import { Coffee } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      {/* Main loading container */}
      <div className="relative flex flex-col items-center">
        {/* Spinning coffee cup icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-[#D97706]/20 border-t-[#D97706] animate-spin"></div>
          <Coffee
            size={32}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#D97706]"
          />
        </div>

        {/* Loading text with dots animation */}
        <div className="mt-6 flex items-center gap-1">
          <span className="text-lg font-semibold text-[#1F2937]">Loading</span>
          <span className="text-lg font-semibold text-[#1F2937] animate-pulse">
            .
          </span>
          <span
            className="text-lg font-semibold text-[#1F2937] animate-pulse"
            style={{ animationDelay: "0.2s" }}
          >
            .
          </span>
          <span
            className="text-lg font-semibold text-[#1F2937] animate-pulse"
            style={{ animationDelay: "0.4s" }}
          >
            .
          </span>
        </div>

        {/* Optional subtext */}
        <p className="text-sm text-[#6B7280] mt-2">
          Preparing your café experience
        </p>
      </div>
    </div>
  );
};

export default Loading;
