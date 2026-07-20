import { useState, type ChangeEvent, type FormEvent } from "react";
import { Coffee, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // No auth endpoint/context exists yet — nothing real to call here
      if(formData.email === "mohammed0011@gmail.com" && formData.password === "123456789"){
          console.log("Admin login attempt", formData);
          await new Promise((resolve) => setTimeout(resolve, 800));
          navigate("/admin/dashboard")
      }
     
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center p-6">
      <div className="max-w-sm w-full">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#D97706] shadow-[0_12px_24px_-8px_rgba(217,119,6,0.45)] mb-4">
            <Coffee className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937] tracking-tight">
            Sankofa<span className="text-[#D97706]"> Brew</span>
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">Staff & Admin Access</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_1px_2px_rgba(31,41,55,0.06)] p-6 sm:p-7">
          <h2 className="text-lg font-bold text-[#1F2937] mb-1">Sign in</h2>
          <p className="text-sm text-[#6B7280] mb-6">
            Enter your credentials to manage orders
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-2xl mb-5">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#1F2937] mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] w-4 h-4" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@sankofabrew.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#FFFBF5] border border-[#E5E7EB] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/15 focus:border-[#D97706]/40 text-[#111827] placeholder-[#6B7280] transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#1F2937] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] w-4 h-4" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-[#FFFBF5] border border-[#E5E7EB] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#D97706]/15 focus:border-[#D97706]/40 text-[#111827] placeholder-[#6B7280] transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1F2937] transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#D97706] text-white font-semibold py-3.5 rounded-2xl shadow-[0_10px_20px_-8px_rgba(217,119,6,0.5)] hover:bg-[#78350F] hover:shadow-[0_12px_24px_-8px_rgba(120,53,15,0.45)] transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
