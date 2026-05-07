
import { Input, Select } from "components/ui";

function CustomFormatFields({ formData, handleInputChange }) {
  return (
    <>
      <div className="col-span-1 md:col-span-2">
        <h1 className="text-lg font-semibold">For Custom Formats Only</h1>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Setpoint
        </label>
        <Select
          name="setpoint"
          value={formData.setpoint}
          onChange={handleInputChange}
        >
          <option value="UUC">UUC</option>
          <option value="Master">Master</option>
          <option value="Separate">Separate</option>
        </Select>
      </div>

      <Input
        label="UUC Repeatable"
        name="uuc"
        type="number"
        value={formData.uuc}
        onChange={handleInputChange}
      />

      <Input
        label="Master Repeatable"
        name="master"
        type="number"
        value={formData.master}
        onChange={handleInputChange}
      />

      <Input
        label="Set Point Heading"
        name="setpointheading"
        value={formData.setpointheading}
        onChange={handleInputChange}
      />

      <Input
        label="Parameter Heading"
        name="parameterheading"
        placeholder="Enter Parameter Heading"
        value={formData.parameterheading}
        onChange={handleInputChange}
      />

      <Input
        label="UUC Heading"
        name="uucheading"
        value={formData.uucheading}
        onChange={handleInputChange}
      />

      <Input
        label="Master Heading"
        name="masterheading"
        value={formData.masterheading}
        onChange={handleInputChange}
      />

      <Input
        label="Error Heading"
        name="errorheading"
        value={formData.errorheading}
        onChange={handleInputChange}
      />

      <Input
        label="Remark Heading"
        name="remarkheading"
        value={formData.remarkheading}
        onChange={handleInputChange}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Setpoint To Show On Certificate
        </label>
        <Select
          name="setpointtoshow"
          value={formData.setpointtoshow}
          onChange={handleInputChange}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Parameter To Show On Certificate
        </label>
        <Select
          name="parametertoshow"
          value={formData.parametertoshow}
          onChange={handleInputChange}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          UUC To Show On Certificate
        </label>
        <Select
          name="uuctoshow"
          value={formData.uuctoshow}
          onChange={handleInputChange}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Master To Show On Certificate
        </label>
        <Select
          name="mastertoshow"
          value={formData.mastertoshow}
          onChange={handleInputChange}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Error To Show On Certificate
        </label>
        <Select
          name="errortoshow"
          value={formData.errortoshow}
          onChange={handleInputChange}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Remark To Show On Certificate
        </label>
        <Select
          name="remarktoshow"
          value={formData.remarktoshow}
          onChange={handleInputChange}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
          Specification To Show On Certificate
        </label>
        <Select
          name="specificationtoshow"
          value={formData.specificationtoshow}
          onChange={handleInputChange}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </Select>
      </div>
    </>
  );
}

export default CustomFormatFields;