import { useState } from 'react';
import { useNavigate } from 'react-router';
import Select from 'react-select';

const EditVisualTest = () => {
  const navigate = useNavigate();

  // Form States
  const [description, setDescription] = useState('');
  const [minRange, setMinRange] = useState('');
  const [maxRange, setMaxRange] = useState('');
  const [unit, setUnit] = useState({ value: 'KJ/m²', label: 'KJ/m²' });
  const [safetyType, setSafetyType] = useState(null);
  const [tolerance, setTolerance] = useState(null);

  // Dropdown Options
  const unitOptions = [
    { value: 'KJ/m²', label: 'KJ/m²' },
    { value: 'V', label: 'V' },
    { value: 'A', label: 'A' },
    { value: 'Ω', label: 'Ω' },
  ];

  const safetyOptions = [
    { value: 'Basic Safety', label: 'Basic Safety' },
    { value: 'Electrical Safety', label: 'Electrical Safety' },
  ];

  const toleranceOptions = [
    { value: '±1%', label: '±1%' },
    { value: '±2%', label: '±2%' },
    { value: '±5%', label: '±5%' },
  ];

  const handleSave = () => {
    const payload = {
      description,
      minRange,
      maxRange,
      unit: unit?.value,
      safetyType: safetyType?.value,
      tolerance: tolerance?.value,
    };
    console.log('Saving:', payload);
    // Add API integration here
  };

  const handleVisualTestList = () => {
    navigate("/dashboards/calibration-operations/bio-medical-safety-test");
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <h1 className="text-3xl font-normal text-gray-800 mb-6">
        Edit Electrical Safety Form
      </h1>

      {/* Electrical Safety List Button */}
      <button
        onClick={handleVisualTestList}
        className="px-6 py-2.5 bg-cyan-500 text-white text-sm font-medium rounded hover:bg-cyan-600 transition-colors mb-8"
      >
       Back To Units
      </button>

      {/* Description */}
      <div className="flex items-start mb-6">
        <label className="w-56 pt-3 text-gray-800 font-medium">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Parameter Description"
          className="flex-1 px-4 py-3 border border-blue-600 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Min Range */}
      <div className="flex items-start mb-6">
        <label className="w-56 pt-3 text-gray-800 font-medium">
          Min range specification
        </label>
        <input
          type="text"
          value={minRange}
          onChange={(e) => setMinRange(e.target.value)}
          className="flex-1 px-4 py-3 border border-blue-600 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Max Range */}
      <div className="flex items-start mb-6">
        <label className="w-56 pt-3 text-gray-800 font-medium">
          Max range specification
        </label>
        <input
          type="text"
          value={maxRange}
          onChange={(e) => setMaxRange(e.target.value)}
          className="flex-1 px-4 py-3 border border-blue-600 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Unit (React Select) */}
      <div className="flex items-start mb-6">
        <label className="w-56 pt-3 text-gray-800 font-medium">Unit</label>
        <div className="flex-1">
          <Select
            options={unitOptions}
            value={unit}
            onChange={setUnit}
            className="text-gray-700"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: '#d1d5db',
                padding: '2px',
              }),
            }}
          />
        </div>
      </div>

      {/* Basic Safety or Electrical Safety (React Select) */}
      <div className="flex items-start mb-6">
        <label className="w-56 pt-3 text-gray-800 font-medium">
          Basic Safety Or Electrical Safety
        </label>
        <div className="flex-1">
          <Select
            options={safetyOptions}
            value={safetyType}
            onChange={setSafetyType}
            placeholder="Select an option"
            className="text-gray-700"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: '#d1d5db',
                padding: '2px',
              }),
            }}
          />
        </div>
      </div>

      {/* Tolerance (React Select) */}
      <div className="flex items-start mb-8">
        <label className="w-56 pt-3 text-gray-800 font-medium">Tolerance</label>
        <div className="flex-1">
          <Select
            options={toleranceOptions}
            value={tolerance}
            onChange={setTolerance}
            placeholder="Select an option"
            className="text-gray-700"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: '#d1d5db',
                padding: '2px',
              }),
            }}
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="px-6 py-2.5 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
      >
        Save changes
      </button>
    </div>
  );
};

export default EditVisualTest;
