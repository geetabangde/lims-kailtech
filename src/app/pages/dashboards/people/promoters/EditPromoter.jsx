import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Button, Input } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios";
import { toast } from "sonner";

export default function EditPromoter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    pname: "",
    pnumber: "",
    email: "",
    city: "",
    state: "",
    gstno: "",
    pan: "",
    discount: "",
    thumb_image: null,
  });

  // Required fields (excluding thumb_image)
  const requiredFields = {
    name: "Promoter Name",
    mobile: "Mobile",
    address: "Address",
    pname: "Contact Person Name",
    pnumber: "Contact Person Number",
    email: "Email",
    city: "City",
    state: "State",
    gstno: "GST No",
    pan: "PAN No",
    discount: "Discount %"
  };

  useEffect(() => {
    const fetchPromoter = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/people/get-promoter/${id}`);
        const result = response.data;

        if (result.status === "true" && result.data) {
          const data = result.data;

          setFormData({
            name: data.name || "",
            mobile: data.mobile || "",
            address: data.address || "",
            pname: data.pname || "", // ✅ from API
            pnumber: data.pnumber || "", // ✅ from API
            email: data.email || "",
            city: data.city || "",
            state: data.state || "",
            gstno: data.gstno || "", // ✅ key is gstno not gst_no
            pan: data.pan || "",
            discount: data.discount?.toString() || "",
            thumb_image: null, // Image upload is handled manually
          });
        } else {
          toast.error(result.message || "Failed to load promoter data.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Something went wrong while loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPromoter();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Check all required fields
    Object.keys(requiredFields).forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = true;
      }
    });

    setErrors(newErrors);

    // If there are errors, focus on the first error field
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "thumb_image") {
          if (value && value instanceof File) {
            const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
            if (allowedTypes.includes(value.type)) {
              form.append(key, value);
            } else {
              console.warn("Invalid image file type:", value.type);
              toast.error("Only jpg, jpeg, png, gif images are allowed.");
            }
          }
          // ⚠️ don't append if value is not File (i.e. already uploaded or untouched)
        } else {
          form.append(key, value);
        }
      });

      const response = await axios.post(`/people/update-promoter/${id}`, form);
      const result = response.data;

      if (result.status === "true") {
        toast.success(result.message || "Promoter updated successfully ✅");
        navigate("/dashboards/people/promoters");
      } else {
        toast.error(result.message || "Failed to update promoter ❌");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Edit Promoter">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Edit Promoter
          </h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/dashboards/people/promoters")}
          >
            Back to List
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input 
              label="Promoter Name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              className={errors.name ? "border-red-500 bg-red-50" : ""}
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">This field is required ✗</p>
            )}
          </div>

          <div>
            <Input 
              label="Mobile" 
              name="mobile" 
              value={formData.mobile} 
              onChange={handleChange}
              className={errors.mobile ? "border-red-500 bg-red-50" : ""}
            />
            {errors.mobile && (
              <p className="text-red-600 text-sm mt-1">This field is required ✗</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className={`mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring focus:border-primary-500 ${
                errors.address ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.address && (
              <p className="text-red-600 text-sm mt-1">This field is required ✗</p>
            )}
          </div>

          <div>
            <Input 
              label="Contact Person Name" 
              name="pname" 
              value={formData.pname} 
              onChange={handleChange}
              className={errors.pname ? "border-red-500 bg-red-50" : ""}
            />
            {errors.pname && (
              <p className="text-red-600 text-sm mt-1">This field is required ✗</p>
            )}
          </div>

          <div>
            <Input 
              label="Contact Person Number" 
              name="pnumber" 
              value={formData.pnumber} 
              onChange={handleChange}
              className={errors.pnumber ? "border-red-500 bg-red-50" : ""}
            />
            {errors.pnumber && (
              <p className="text-red-600 text-sm mt-1">This field is required ✗</p>
            )}
          </div>

          <div>
            <Input 
              label="Email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              type="email"
              className={errors.email ? "border-red-500 bg-red-50" : ""}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">This field is required ✗</p>
            )}
          </div>

          <div>
            <Input 
              label="City" 
              name="city" 
              value={formData.city} 
              onChange={handleChange}
              className={errors.city ? "border-red-500 bg-red-50" : ""}
            />
            {errors.city && (
              <p className="text-red-600 text-sm mt-1">This field is required ✗</p>
            )}
          </div>

          <div>
            <Input 
              label="State" 
              name="state" 
              value={formData.state} 
              onChange={handleChange}
              className={errors.state ? "border-red-500 bg-red-50" : ""}
            />
            {errors.state && (
              <p className="text-red-600 text-sm mt-1">This field is required ✗</p>
            )}
          </div>

          <div>
            <Input 
              label="GST No" 
              name="gstno" 
              value={formData.gstno} 
              onChange={handleChange}
              className={errors.gstno ? "border-red-500 bg-red-50" : ""}
            />
            {errors.gstno && (
              <p className="text-red-600 text-sm mt-1">This field is required ✗</p>
            )}
          </div>

          <div>
            <Input 
              label="PAN No" 
              name="pan" 
              value={formData.pan} 
              onChange={handleChange}
              className={errors.pan ? "border-red-500 bg-red-50" : ""}
            />
            {errors.pan && (
              <p className="text-red-600 text-sm mt-1">This field is required ✗</p>
            )}
          </div>

          <div>
            <Input 
              label="Discount %" 
              name="discount" 
              value={formData.discount} 
              onChange={handleChange} 
              type="number"
              className={errors.discount ? "border-red-500 bg-red-50" : ""}
            />
            {errors.discount && (
              <p className="text-red-600 text-sm mt-1">This field is required ✗</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              Upload Photo
            </label>
            <input
              type="file"
              name="thumb_image"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary-600 file:text-white hover:file:bg-primary-700"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <Button type="submit" color="primary" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                  Updating...
                </div>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
}