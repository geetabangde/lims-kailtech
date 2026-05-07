
import { Select } from "components/ui";

function BiomedicalFields({ formData, handleInputChange }) {
  return (
    <>
      <div className="col-span-1 md:col-span-2">
        <h1 className="text-lg font-semibold">Biomedical Details</h1>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Bio Medical Format
        </label>
        <Select
          name="biomedical"
          value={formData.biomedical}
          onChange={handleInputChange}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Show Visual Test On Certificate
        </label>
        <Select
          name="showvisualtest"
          value={formData.showvisualtest}
          onChange={handleInputChange}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Show Electrical Safety Test on Certificate
        </label>
        <Select
          name="showelectricalsafety"
          value={formData.showelectricalsafety}
          onChange={handleInputChange}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Show Basic Safety Test on Certificate
        </label>
        <Select
          name="showbasicsafety"
          value={formData.showbasicsafety}
          onChange={handleInputChange}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Show Performance Test on Certificate
        </label>
        <Select
          name="showperformancetest"
          value={formData.showperformancetest}
          onChange={handleInputChange}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
      </div>
    </>
  );
}

export default BiomedicalFields;