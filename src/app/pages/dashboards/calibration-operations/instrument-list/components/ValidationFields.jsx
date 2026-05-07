
import { Input, Select } from "components/ui";
import ReactSelect from "react-select";

function ValidationFields({ 
  formData, 
  handleInputChange, 
  handleMultiSelectChange,
  subcategoryOne,
  subcategoryTwo,
  errors,
}) {
  return (
    <>
      <div className="col-span-1 md:col-span-2">
        <h1 className="text-lg font-semibold">Validation</h1>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Range Validation
        </label>
        <Select
          name="range"
          value={formData.range}
          onChange={handleInputChange}
          className={errors.range ? "border-red-500 bg-red-50" : ""}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
          {errors.range && (
            <p className="text-red-600 text-sm mt-1">This field is required</p>
          )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Leastcount Validation
        </label>
        <div>
          <Select
            name="leastcount"
            value={formData.leastcount}
            onChange={handleInputChange}
            className={errors.leastcount ? "border-red-500 bg-red-50" : ""}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Select>

          {errors.leastcount && (
            <p className="text-red-600 text-sm mt-1">This field is required</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Unittype
        </label>
        <Select
          name="unittype"
          value={formData.unittype}
          onChange={handleInputChange}
          className={errors.unittype ? "border-red-500 bg-red-50" : ""}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
        {errors.unittype && (
          <p className="text-red-600 text-sm mt-1">This field is required</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Mode
        </label>
        <Select
          name="mode"
          value={formData.mode}
          onChange={handleInputChange}
          className={errors.mode ? "border-red-500 bg-red-50" : ""}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
          {errors.mode && (
            <p className="text-red-600 text-sm mt-1">This field is required</p>
          )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Support Required
        </label>
        <Select
          name="supportmaster"
          value={formData.supportmaster}
          onChange={handleInputChange}
          className={errors.supportmaster ? "border-red-500 bg-red-50" : ""}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
        {errors.supportmaster && (
            <p className="text-red-600 text-sm mt-1">This field is required</p>
          )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Type Of Support
        </label>
        <ReactSelect
          isMulti
          name="typeofsupport"
          options={subcategoryOne}
          value={subcategoryOne.filter((opt) => formData.typeofsupport.includes(opt.value))}
          onChange={(selected) => handleMultiSelectChange(selected, "typeofsupport")}
          placeholder="Select Type Of Support"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Range Validation For Support
        </label>
        <Select
          name="supportrange"
          value={formData.supportrange}
          onChange={handleInputChange}
          className={errors.supportrange ? "border-red-500 bg-red-50" : ""}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
        {errors.supportrange && (
          <p className="text-red-600 text-sm mt-1">This field is required</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Leastcount Validation For Support
        </label>
        <Select
          name="supportleastcount"
          value={formData.supportleastcount}
          onChange={handleInputChange}
          className={errors.supportleastcount ? "border-red-500 bg-red-50" : ""}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
        {errors.supportleastcount && (
          <p className="text-red-600 text-sm mt-1">This field is required</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Unittype For Support
        </label>
        <Select
          name="supportunittype"
          value={formData.supportunittype}
          onChange={handleInputChange}
          className={errors.supportunittype ? "border-red-500 bg-red-50" : ""}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
        {errors.supportunittype && (
          <p className="text-red-600 text-sm mt-1">This field is required</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Mode For Support
        </label>
        <Select
          name="supportmode"
          value={formData.supportmode}
          onChange={handleInputChange}
          className={errors.supportmode ? "border-red-500 bg-red-50" : ""}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
        {errors.supportmode && (
          <p className="text-red-600 text-sm mt-1">This field is required</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Type Of Master Required
        </label>
        <ReactSelect
          isMulti
          name="typeofmaster"
          options={subcategoryTwo}
          value={subcategoryTwo.filter((opt) => formData.typeofmaster.includes(opt.value))}
          onChange={(selected) => handleMultiSelectChange(selected, "typeofmaster")}
          placeholder="Select Type Of Master"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Scope Matrix Validation
        </label>
        <Select
          name="scopematrixvalidation"
          value={formData.scopematrixvalidation}
          onChange={handleInputChange}
          className={errors.scopematrixvalidation ? "border-red-500 bg-red-50" : ""}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
          {errors.scopematrixvalidation && (
            <p className="text-red-600 text-sm mt-1">This field is required</p>
          )}
      </div>
      <Input
        label="No Of Digit in CMC"
        name="digitincmc"
        type="number"
        value={formData.digitincmc}
        onChange={handleInputChange}
      />
    </>
  );
}

export default ValidationFields;