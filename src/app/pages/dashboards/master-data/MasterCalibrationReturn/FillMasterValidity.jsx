import  { useState} from 'react';
import { useNavigate } from 'react-router-dom';


import { Button ,Input} from 'components/ui';



const CalibrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceProvider: '',
    typeOfService: 'Calibration',
    certificateNo: '',
    startDate: '',
    endDate: '',
    certificateFile: null,
    adjustment1: '',
    adjustment2: '',
    meetsAcceptance: '',
    remark: '',
    checklist: {
      1: { yes: true, no: false, remark: '' },
      2: { yes: true, no: false, remark: '' },
      3: { yes: true, no: false, remark: '' },
      4: { yes: true, no: false, remark: '' },
      5: { yes: true, no: false, remark: '' },
      6: { yes: true, no: false, remark: '' },
      7: { yes: true, no: false, remark: '' },
      8: { yes: true, no: false, remark: '' },
      9: { yes: true, no: false, remark: '' },
      10: { yes: true, no: false, remark: '' },
      11: { yes: true, no: false, remark: '' },
      12: { yes: true, no: false, remark: '' },
      13: { yes: true, no: false, remark: '' },
      14: { yes: true, no: false, remark: '' },
      15: { yes: true, no: false, remark: '' },
      16: { yes: true, no: false, remark: '' },
      17: { yes: true, no: false, remark: '' },
    }
  });

  const checklistItems = [
    { id: 1, text: 'Certificate Traceable to National or International Standards (NABL/NPL/ILAC/PTB etc.)' },
    { id: 2, text: 'Company Name and Address' },
    { id: 3, text: 'Our Instrument ID' },
    { id: 4, text: 'Make' },
    { id: 5, text: 'Model' },
    { id: 6, text: 'Serial Number' },
    { id: 7, text: 'Least Count' },
    { id: 8, text: 'Date of Calibration' },
    { id: 9, text: 'Suggested/Due Date of Calibration' },
    { id: 10, text: 'Required Parameter' },
    { id: 11, text: 'Required Range' },
    { id: 12, text: 'Review of Calibration Result (Error of our Equipment within relevant referred std. or manual)' },
    { id: 13, text: 'Measurement Uncertainty' },
    { id: 14, text: 'Master Instrument Calibration Certificate No.' },
    { id: 15, text: 'Master Instrument Calibration Due Date' },
    { id: 16, text: 'Coverage Factor k' },
    { id: 17, text: 'Certificate Acceptable (if above points are satisfactory)' },
  ];

  const handleRadioChange = (itemId, field) => {
    setFormData(prev => ({
      ...formData,
      checklist: {
        ...prev.checklist,
        [itemId]: {
          ...prev.checklist[itemId],
          yes: field === 'yes',
          no: field === 'no'
        }
      }
    }));
  };

  const handleRemarkChange = (itemId, value) => {
    setFormData(prev => ({
      ...formData,
      checklist: {
        ...prev.checklist,
        [itemId]: {
          ...prev.checklist[itemId],
          remark: value
        }
      }
    }));
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow">
         {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            
            <span className="text-gray-800 ">Add New Instrument</span>
          </div>
          <Button  className="h-8 space-x-1.5 rounded-md px-3 text-xs "
          color="primary"
            onClick={() =>
              navigate("/dashboards/master-data/master-calibration-return")
            }>
            ← Back to Master Validity List
          </Button>
        </div>
        {/* Top Form Section */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-[200px_1fr] gap-4 mb-4">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              Name and Address of Service Provider
            </label>
            <Input
              type="text"
              className="w-full border border-blue-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.serviceProvider}
              onChange={(e) => setFormData({ ...formData, serviceProvider: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-[200px_1fr] gap-4 mb-4">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              Type of Service
            </label>
            <select
              className="w-full border border-blue-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.typeOfService}
              onChange={(e) => setFormData({ ...formData, typeOfService: e.target.value })}
            >
              <option>Calibration</option>
            </select>
          </div>

          <div className="grid grid-cols-[200px_1fr] gap-4 mb-4">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              Certificate No
            </label>
            <Input
              type="text"
              placeholder="Instrument Name"
              className="w-full border border-blue-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.certificateNo}
              onChange={(e) => setFormData({ ...formData, certificateNo: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-[200px_1fr] gap-4 mb-4">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              Start Date
            </label>
            <Input
              type="date"
              className="w-full border border-blue-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-[200px_1fr] gap-4 mb-4">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              End Date
            </label>
            <Input
              type="date"
              className="w-full border border-blue-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
<div className="grid grid-cols-[200px_1fr] gap-4 mb-4">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              Certificate File
            </label>
            <div className="flex items-center">
              <input
                type="file"
                id="certificateFile"
                className="hidden"
                onChange={(e) => setFormData({ ...formData, certificateFile: e.target.files[0] })}
              />
              <label
                htmlFor="certificateFile"
                className="px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm mr-2 cursor-pointer hover:bg-gray-200"
              >
                Choose File
              </label>
              <span className="text-sm text-gray-500">
                {formData.certificateFile ? formData.certificateFile.name : 'No file chosen'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[200px_1fr] gap-4 mb-4">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              Adjustment If Any
            </label>
            <select
              className="w-full border border-blue-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.adjustment1}
              onChange={(e) => setFormData({ ...formData, adjustment1: e.target.value })}
            >
              <option value=""></option>
            </select>
          </div>

          <div className="grid grid-cols-[200px_1fr] gap-4 mb-4">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              Adjustment If Any
            </label>
            <select
              className="w-full border border-blue-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.adjustment2}
              onChange={(e) => setFormData({ ...formData, adjustment2: e.target.value })}
            >
              <option value=""></option>
            </select>
          </div>

          <div className="grid grid-cols-[200px_1fr] gap-4 mb-4">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              MEETS ACCEPTANCE CRITERIA
            </label>
            <select
              className="w-full border border-blue-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.meetsAcceptance}
              onChange={(e) => setFormData({ ...formData, meetsAcceptance: e.target.value })}
            >
              <option value=""></option>
            </select>
          </div>

          <div className="grid grid-cols-[200px_1fr] gap-4">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              Remark
            </label>
            <Input
              type="text"
              className="w-full border border-blue-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.remark}
              onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
            />
          </div>
        </div>

        {/* Checklist Table Section
        <div className="overflow-x-auto">
          <Table className="w-full">
            <THead className="bg-gray-50 border-b">
              <Tr>
                <Th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border-r">
                  S.NO.
                </Th>
                <Th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border-r">
                  CHECK LIST
                </Th>
                <Th className="px-4 py-3 text-center text-xs font-medium text-gray-700 border-r w-32">
                  Yes or No
                </Th>
                <Th className="px-4 py-3 text-left text-xs font-medium text-gray-700 w-96">
                  REMARK,IF ANY
                </Th>
              </Tr>
            </THead>
            <TBody className="bg-white divide-y divide-gray-200">
              {checklistItems.map((item) => (
                <Tr key={item.id} className="hover:bg-gray-50">
                  <Td className="px-4 py-3 text-sm text-gray-900 border-r">
                    {item.id}
                  </Td>
                  <Td className="px-4 py-3 text-sm text-gray-900 border-r">
                    {item.text}
                  </Td>
                  <Td className="px-4 py-3 text-center border-r">
                    <div className="flex items-center justify-center gap-3">
                      <label className="flex items-center cursor-pointer">
                        <Input
                          type="radio"
                          name={`checklist-${item.id}`}
                          checked={formData.checklist[item.id].yes}
                          onChange={() => handleRadioChange(item.id, 'yes')}
                          className="w-4 h-4 text-blue-600"
                        />
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <Input
                          type="radio"
                          name={`checklist-${item.id}`}
                          checked={formData.checklist[item.id].no}
                          onChange={() => handleRadioChange(item.id, 'no')}
                          className="w-4 h-4 text-blue-600"
                        />
                      </label>
                    </div>
                  </Td>
                  <Td className="px-4 py-3">
                    <textarea
                      rows="2"
                      className="w-full border border-blue-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.checklist[item.id].remark}
                      onChange={(e) => handleRemarkChange(item.id, e.target.value)}
                    />
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </div> */}


{/* Checklist Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border-r">
                  S.NO.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 border-r">
                  CHECK LIST
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 border-r w-32">
                  Yes or No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 w-96">
                  REMARK,IF ANY
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {checklistItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 border-r">
                    {item.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-r">
                    {item.text}
                  </td>
                  <td className="px-4 py-3 text-center border-r">
                    <div className="flex items-center justify-center gap-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`checklist-${item.id}`}
                          checked={formData.checklist[item.id].yes}
                          onChange={() => handleRadioChange(item.id, 'yes')}
                          className="w-4 h-4 text-blue-600"
                        />
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`checklist-${item.id}`}
                          checked={formData.checklist[item.id].no}
                          onChange={() => handleRadioChange(item.id, 'no')}
                          className="w-4 h-4 text-blue-600"
                        />
                      </label>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <textarea
                      rows="2"
                      className="w-full border border-blue-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.checklist[item.id].remark}
                      onChange={(e) => handleRemarkChange(item.id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Save Button */}
        <div className="p-6 border-t flex justify-end">
          <Button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
            Save Master Validity
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalibrationForm;