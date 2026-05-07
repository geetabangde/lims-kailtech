// import { useNavigate } from "react-router";
// import { Button, Input } from "components/ui";
// import { Page } from "components/shared/Page";
// import axios from "utils/axios"; // Interceptor should attach token
// import { toast } from "sonner";
// import { useState } from "react";


// export default function AddCurrency() {
// const navigate = useNavigate();

//   // ✅ State for form and loading
//   const [formData, setFormData] = useState({ name: "", description: "" });
//   const [loading, setLoading] = useState(false);

//   // ✅ Input handler
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // ✅ Form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const form = new FormData();
//       form.append("name", formData.name);
//       form.append("description", formData.description);

//       await axios.post("/people/add-customer-types", form); // token attached via interceptor

//       toast.success("Customer created successfully ✅", {
//         duration: 1000,
//         icon: "✅",
//       });

//       navigate("/dashboards/people/customer-types");
//     } catch (err) {
//       console.error("Error creating mode:", err);
//       toast.error(err?.response?.data?.message || "Failed to create mode ❌");
//     } finally {
//       setLoading(false);
//     }
//   };


  

//   return (
//     <Page title="Add customer-types">
//       <div className="p-6">
//         {/* ✅ Header + Back Button */}
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold">Add Customer Types</h2>
//           <Button
//             variant="outline"
//             className="text-white bg-blue-600 hover:bg-blue-700"
//             onClick={() => navigate("/dashboards/people/customer-types")}
//           >
//             Back to List
//           </Button>
//         </div>

//         {/* ✅ Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Input
            
//             name="name"
//             label="Customer Type Name" 
//             placeholder="Customer Type Name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//           <Input
            
//             name="description"
//             label="Customer type Description" 
//             placeholder="Customer Type Description"
//             value={formData.description}
//             onChange={handleChange}
//             required
//           />
//           <Button type="submit" color="primary" disabled={loading}>
//             {loading ? (
//               <div className="flex items-center gap-2">
//                 <svg
//                   className="animate-spin h-4 w-4 text-white"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"
//                   ></path>
//                 </svg>
//                 Saving...
//               </div>
//             ) : (
//               "Save"
//             )}
//           </Button>
//         </form>
//       </div>
//     </Page>
//   );
// }





import { useNavigate } from "react-router";
import { Button, Input } from "components/ui";
import { Page } from "components/shared/Page";
import axios from "utils/axios"; // Interceptor should attach token
import { toast } from "sonner";
import { useState } from "react";

export default function AddCurrency() {
  const navigate = useNavigate();

  // ✅ State for form, loading, and validation errors
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", description: "" });

  // ✅ Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ✅ Validate form
  const validateForm = () => {
    const newErrors = { name: "", description: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "This is required field";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "This is required field";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // ✅ Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);

      await axios.post("/people/add-customer-types", form); // token attached via interceptor

      toast.success("Customer created successfully ✅", {
        duration: 1000,
        icon: "✅",
      });

      navigate("/dashboards/people/customer-types");
    } catch (err) {
      console.error("Error creating mode:", err);
      toast.error(err?.response?.data?.message || "Failed to create mode ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Add customer-types">
      <div className="p-6">
        {/* ✅ Header + Back Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add Customer Types</h2>
          <Button
            variant="outline"
            className="text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/dashboards/people/customer-types")}
          >
            Back to List
          </Button>
        </div>

        {/* ✅ Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate> {/* noValidate disables HTML5 validation */}
          {/* Currency Name Field */}
          <div>
            <Input
              name="name"
              label="Currency Name"
              placeholder="Enter Currency Name"
              value={formData.name}
              onChange={handleChange}
              // removed 'required' attribute to disable HTML5 validation
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Currency Description Field */}
          <div>
            <Input
              name="description"
              label="Currency Description / Symbol"
              placeholder="Enter Description or Symbol"
              value={formData.description}
              onChange={handleChange}
              // removed 'required' attribute to disable HTML5 validation
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <Button type="submit" color="primary" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                >
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
                Saving...
              </div>
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </div>
    </Page>
  );
}