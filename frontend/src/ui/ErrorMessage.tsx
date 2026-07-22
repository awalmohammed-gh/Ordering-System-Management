import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorMessage = ({
  title = "Something went wrong",
  message = "Unable to load content. Please try again.",
  onRetry,
}: ErrorMessageProps) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_2px_rgba(31,41,55,0.06)] p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
          <AlertCircle size={20} className="text-red-500" />
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[#1F2937]">{title}</h3>
          <p className="text-sm text-[#6B7280] mt-1">{message}</p>

          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 flex items-center gap-1.5 px-4 py-2 bg-[#D97706] text-white text-sm font-medium rounded-xl hover:bg-[#78350F] transition-colors duration-200"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
