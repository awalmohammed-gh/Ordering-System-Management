import { useEffect, useState } from "react";
import { Upload, X, Plus, Save } from "lucide-react";
import { createProduct } from "../../api/frontApis";
import type { AddProduct } from "../../type";
import Loading from "../../ui/Loading";
import Toast from "../../ui/Toast";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    isAvailable: true,
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState<{
    message:string;
    type:"success"|"error"|"info"
  } | null>(null)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
     try {
        const form = new FormData();

        form.append("name", formData.name);
        form.append("category", formData.category);
        form.append("price", formData.price);
        form.append("isAvailable", String(formData.isAvailable));

        if (image) {
          form.append("image", image);
        }

       const {data} = await createProduct(form);
       if(data.success){
         setToast({
          message:data.message,
          type:"success"
         })
          setFormData({
            name: "",
            category: "",
            price: "",
            isAvailable: true,
          });
          setImage(null);
          setPreview(null);
       }else{
         setToast({
           message: data.message,
           type: "error",
         });
       }
     } catch (error) {
      console.error(error);
       setToast({
         message: "Something went wrong",
         type: "success",
       });
     }finally{
      setIsLoading(false)
     }
   
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if(isLoading){
    return <Loading/>
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_2px_rgba(31,41,55,0.06)] p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#D97706]/10 flex items-center justify-center">
            <Plus size={20} className="text-[#D97706]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">
              Add New Product
            </h2>
            <p className="text-sm text-[#6B7280]">
              Fill in the details to add a new product to your menu
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-2">
              Product Image
            </label>
            <div className="flex items-center gap-4">
              <div
                className={`
                relative w-32 h-32 rounded-2xl border-2 border-dashed 
                ${preview ? "border-[#D97706]" : "border-[#E5E7EB]"}
                flex items-center justify-center overflow-hidden
                transition-all duration-200
                hover:border-[#D97706]/50
              `}
              >
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setImage(null);
                      }}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-2">
                    <Upload size={28} className="text-[#6B7280] mx-auto mb-1" />
                    <p className="text-xs text-[#6B7280]">Upload image</p>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FFFBF5] border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#1F2937] hover:bg-white hover:border-[#D97706]/40 transition-all duration-200 cursor-pointer"
                >
                  <Upload size={18} />
                  Choose Image
                </label>
                <p className="text-xs text-[#6B7280] mt-2">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#1F2937] mb-2"
            >
              Product Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Cappuccino"
              required
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FFFBF5] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 focus:border-[#D97706] transition-all duration-200"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-[#1F2937] mb-2"
            >
              Category *
            </label>
            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Coffee, Tea, Pastry"
              required
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FFFBF5] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 focus:border-[#D97706] transition-all duration-200"
            />
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-[#1F2937] mb-2"
            >
              Price (GHS) *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#FFFBF5] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 focus:border-[#D97706] transition-all duration-200"
            />
          </div>

          {/* Availability */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="w-5 h-5 rounded-lg border-[#E5E7EB] text-[#D97706] focus:ring-[#D97706]/40 focus:ring-2 transition-all duration-200"
              />
              <span className="text-sm font-medium text-[#1F2937]">
                Product is available
              </span>
            </label>
          </div>
          {
            toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)}/>
          }

          {/* Submit */}
          <div className="flex items-center gap-3 pt-4 border-t border-[#E5E7EB]">
            <button
              type="submit"
              disabled={isLoading}
              className={`
                flex items-center justify-center gap-2 px-6 py-3 bg-[#D97706] text-white rounded-xl font-medium
                transition-all duration-200 active:scale-95
                ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#78350F] shadow-[0_4px_12px_rgba(217,119,6,0.3)] hover:shadow-[0_6px_16px_rgba(217,119,6,0.4)]"}
              `}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Add Product
                </>
              )}
            </button>

            <button
              type="reset"
              onClick={() => {
                setFormData({
                  name: "",
                  category: "",
                  price: "",
                  isAvailable: true,
                });
                setPreview(null);
                setImage(null);
              }}
              className="px-6 py-3 border border-[#E5E7EB] text-[#6B7280] rounded-xl font-medium hover:bg-[#FFFBF5] transition-all duration-200"
            >
              Clear All
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
