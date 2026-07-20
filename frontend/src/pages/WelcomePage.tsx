import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleStartMenu = () => {
    navigate("/menu");
  };

  return (
    <section className="min-h-screen bg-[#FFFBF5] flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto text-center space-y-10">
        {/* Logo/Brand */}
        <div className="inline-block">
          <h1 className="text-6xl md:text-7xl font-bold text-[#1F2937] tracking-tight">
            Sankofa<span className="text-[#D97706]"> Brew</span>
          </h1>
          <div className="h-0.75 w-14 bg-[#D97706] mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111827] leading-[1.15] tracking-tight">
            Your Café, Running
            <span className="block text-[#D97706]">Itself</span>
          </h2>

          <p className="text-lg md:text-xl text-[#6B7280] leading-relaxed max-w-xl mx-auto">
            Take orders, track your menu, and keep customers happy — all from
            one simple screen. No training manuals, no confusing menus. Just
            tap, order, done.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleStartMenu}
          className="bg-[#D97706] hover:bg-[#78350F] text-white font-semibold text-lg px-12 py-4 rounded-full transition-all duration-300 shadow-[0_12px_24px_-8px_rgba(217,119,6,0.45)] hover:shadow-[0_16px_32px_-8px_rgba(120,53,15,0.4)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#D97706]/30"
        >
          Start Ordering
        </button>

        {/* Decorative elements */}
        <div className="flex justify-center items-center gap-2.5 pt-4">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D97706]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#1F2937]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#78350F]"></div>
        </div>
      </div>
    </section>
  );
};

export default WelcomePage;
