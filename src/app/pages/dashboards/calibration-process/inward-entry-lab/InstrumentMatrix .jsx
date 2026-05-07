import React, { useState, useEffect } from 'react';
import axios from 'utils/axios';
import { useParams } from 'react-router';
import { toast } from "sonner";
import { Input } from "components/ui";
import ReactSelect from "react-select";

const InstrumentMatrix = () => {
  // State variables
  const [instrumentData, setInstrumentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('matrix');
  const [selectedMatrix, setSelectedMatrix] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [priceMatrix, setPriceMatrix] = useState([]);
  const [addMatrixList, setAddMatrixList] = useState([]);
  const [matrixList, setMatrixList] = useState([]);
  const [unitTypes, setUnitTypes] = useState([]);
  const [units, setUnits] = useState([]);
  const [modeList, setModeList] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [matrixData, setMatrixData] = useState([]);
  console.log(matrixData);
  const [calibrationPoints, setCalibrationPoints] = useState({});
 console.log(calibrationPoints);
  const { id: inwardId, itemId: instId } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const caliblocation = searchParams.get("caliblocation") || "Lab";
  const calibacc = searchParams.get("calibacc") || "Nabl";

  const urlParams = {
    hakuna: '123', // inwardid
    matata: '456', // instid
    caliblocation: 'Lab',
    calibacc: 'Nabl'
  };

  const employeeId = 'emp123';

  useEffect(() => {
    const loadDatalist = async () => {
      try {
        const apiUrl = `/calibrationprocess/getcrf_matrix-details?inward_id=${inwardId}&instid=${instId}&caliblocation=${caliblocation}&calibacc=${calibacc}`;
        const res = await axios.get(apiUrl);

        setPriceMatrix(res.data.price_matrix || []);
        setAddMatrixList(res.data.add_matrix_list || []);
        setMatrixList(res.data.matrix_list || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error?.response?.data?.message || 'Error fetching matrix data ❌');
        setLoading(false);
      }
    };

    const unitList = async () => {
      try {
        const res = await axios.get('/master/units-list');
        setUnits(res.data.data || []);
      } catch (error) {
        console.error('Error fetching units list:', error);
        toast.error(error?.response?.data?.message || 'Error fetching units list ❌');
      }
    };

    const fetchModeList = async () => {
      try {
        const res = await axios.get('/master/mode-list');
        setModeList(res.data.data || []);
      } catch (error) {
        console.error('Error fetching mode list:', error);
        toast.error(error?.response?.data?.message || 'Error fetching mode list ❌');
      }
    };

    const unitTypeList = async () => {
      try {
        const result = await axios.get('/master/unit-type-list');
        setUnitTypes(result.data.data || []);
      } catch (error) {
        console.error('Error fetching unit type list:', error);
        toast.error(error?.response?.data?.message || 'Error fetching unit type list ❌');
      }
    };

    fetchModeList();
    unitTypeList();
    unitList();
    loadDatalist();
  }, [inwardId, instId, caliblocation, calibacc]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setInstrumentData({
          id: urlParams.matata,
          instid: 'inst789',
          allotedto: 'emp123',
          status: 1
        });

        setMatrixData([
          {
            id: 'matrix1',
            unittype: 'Temperature',
            unit: 'celsius',
            unitName: '°C',
            instrangemin: '-50',
            instrangemax: '150',
            operangemin: '-40',
            operangemax: '140',
            mode: 'Direct',
            leastcount: '0.1',
            status: 1,
            pricematrixid: 'pm001'
          },
          {
            id: 'matrix2',
            unittype: 'Pressure',
            unit: 'bar',
            unitName: 'Bar',
            instrangemin: '0',
            instrangemax: '100',
            operangemin: '0',
            operangemax: '95',
            mode: 'Indirect',
            leastcount: '0.01',
            status: 1,
            pricematrixid: 'pm001'
          }
        ]);

        setCalibrationPoints({
          'matrix1': [
            { id: 'cp1', unittype: 'Temperature', mode: 'Direct', calculationunit: 'celsius', point: '-40' },
            { id: 'cp2', unittype: 'Temperature', mode: 'Direct', calculationunit: 'celsius', point: '0' },
            { id: 'cp3', unittype: 'Temperature', mode: 'Direct', calculationunit: 'celsius', point: '100' }
          ],
          'matrix2': [
            { id: 'cp4', unittype: 'Pressure', mode: 'Indirect', calculationunit: 'bar', point: '10' },
            { id: 'cp5', unittype: 'Pressure', mode: 'Indirect', calculationunit: 'bar', point: '50' }
          ]
        });

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error(error?.response?.data?.message || 'Error loading initial data ❌');
        setLoading(false);
      }
    };

    loadData();
  }, [urlParams.hakuna, urlParams.matata]);

  const validateForm = () => {
    const errors = {};

    if (!editFormData.matrixType?.trim()) {
      errors.matrixType = "Matrix Type is required.";
    }

    if (!editFormData.unittype) {
      errors.unittype = "Unit Type is required.";
    }

    if (!editFormData.unit) {
      errors.unit = "Unit is required.";
    }

    if (!editFormData.instrangemin) {
      errors.instrangemin = "Instrument range min is required.";
    }

    if (!editFormData.instrangemax) {
      errors.instrangemax = "Instrument range max is required.";
    }

    if (!editFormData.operangemin) {
      errors.operangemin = "Operating range min is required.";
    }

    if (!editFormData.operangemax) {
      errors.operangemax = "Operating range max is required.";
    }

    if (!editFormData.leastcount) {
      errors.leastcount = "Least-count is required.";
    }

    if (!editFormData.mode) {
      errors.mode = "Mode is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const editMatrix = async (matrixId) => {
    try {
      const response = await axios.get(`/calibrationprocess/get-edit-matrix-data`, {
        params: {
          inwardid: inwardId,
          instid: instId,
          matrixid: matrixId,
          caliblocation,
          calibacc
        }
      });

      const matrix = response.data.data.matrix_data;

      if (matrix) {
        setEditFormData({
          id: matrix.id,
          matrixType: matrix.matrixtype || '',
          unittype: matrix.unittype,
          unit: matrix.unit,
          unitName: matrix.calculationunit || '',
          instrangemin: matrix.instrangemin,
          instrangemax: matrix.instrangemax,
          operangemin: matrix.operangemin,
          operangemax: matrix.operangemax,
          mode: matrix.mode,
          leastcount: matrix.leastcount,
          pricematrixid: matrix.pricematrixid || ''
        });
        setCurrentView('editMatrix');
      } else {
        toast.error('No matrix data found ❌');
      }
    } catch (error) {
      console.error("Failed to fetch matrix data:", error);
      toast.error(error?.response?.data?.message || 'Failed to fetch matrix data ❌');
    }
  };

  const showAddCalibrationPoint = (matrixId, instrangemin, instrangemax) => {
    setSelectedMatrix({ id: matrixId, min: Number(instrangemin), max: Number(instrangemax) });
    setCurrentView('addCalibrationPoint');
  };

  const addMatrix = (unittype = '', unit = '', unittext = '', instrangemin = '', instrangemax = '', mode = '', pricematrixid = '') => {
    setEditFormData({
      id: `matrix_${Date.now()}`,
      matrixType: '',
      unittype,
      unit,
      unitName: unittext,
      instrangemin,
      instrangemax,
      operangemin: instrangemin,
      operangemax: instrangemax,
      mode,
      leastcount: '',
      pricematrixid
    });
    setCurrentView('addMatrix');
  };

  const addCalibrationPoint = async (matrixId, points) => {
    const validPoints = points.map(p => Number(p)).filter(p => !isNaN(p));
    const actualMatrixId = matrixId.id || matrixId;

    const payload = {
      inwardid: inwardId,
      id: instId,
      matrixid: parseInt(actualMatrixId, 10),
      caliblocation,
      calibacc,
      calibpoint: validPoints
    };

    try {
      const response = await axios.post('/calibrationprocess/create-calibration-points', payload);
      setMatrixList(prev =>
        prev.map(matrix =>
          matrix.id === actualMatrixId
            ? {
                ...matrix,
                calibration_points: [
                  ...(matrix.calibration_points || []),
                  ...validPoints.map((point, index) => ({
                    id: `cp${Date.now() + index}`,
                    unittype: matrix.unittype,
                    mode: matrix.mode,
                    unit: matrix.unit,
                    point: point.toString()
                  }))
                ]
              }
            : matrix
        )
      );
      toast.success(response?.data?.message || 'Calibration points added successfully ✅');
      setCurrentView('matrix');
    } catch (error) {
      console.error('Error adding calibration points:', error);
      toast.error(error?.response?.data?.message || 'Error adding calibration points ❌');
    }
  };

  const deleteMatrix = async (matrixId) => {
    try {
      const response = await axios.delete(`/calibrationprocess/delete-matrix/${matrixId}/${inwardId}`);
      setMatrixData(prev => prev.filter(m => m.id !== matrixId));
      setCalibrationPoints(prev => {
        const updated = { ...prev };
        delete updated[matrixId];
        return updated;
      });
      toast.success(response?.data?.message || 'Matrix deleted successfully ✅');
    } catch (error) {
      console.error('Error deleting matrix:', error);
      toast.error(error?.response?.data?.message || 'Error deleting matrix ❌');
    }
  };

  const deleteCalibrationPoint = async (matrixId, pointId) => {
    try {
      await axios.delete(`/calibrationprocess/delete-calibration-point/${pointId}/${inwardId}`);
      setMatrixList(prev =>
        prev.map(matrix =>
          matrix.id === matrixId
            ? {
                ...matrix,
                calibration_points: matrix.calibration_points.filter(p => p.id !== pointId),
              }
            : matrix
        )
      );
      toast.success('Calibration point deleted ✅');
    } catch (error) {
      toast.error('Failed to delete calibration point ❌');
      console.error(error);
    }
  };

  const saveMatrix = async () => {
    if (!validateForm()) return;

    const payload = {
      id: instId,
      inwardid: inwardId,
      instid: instId,
      caliblocation,
      calibacc,
      pricematrixid: editFormData.pricematrixid,
      matrixno: [1],
      matrixtype: [editFormData.matrixType],
      unittype: [editFormData.unittype],
      unit: [editFormData.unit],
      defaultrangemin: [editFormData.instrangemin],
      defaultrangemax: [editFormData.instrangemax],
      instrangemin: [editFormData.instrangemin],
      instrangemax: [editFormData.instrangemax],
      operangemin: [editFormData.operangemin],
      operangemax: [editFormData.operangemax],
      leastcount: [editFormData.leastcount],
      mode: [String(editFormData.mode)],
      matrixid: [editFormData.id]
    };

    try {
      const response = await axios.post('/calibrationprocess/add-insert-inward-matrix', payload);
      setMatrixData(prev => [
        ...prev,
        {
          id: editFormData.id,
          unittype: editFormData.unittype,
          unit: editFormData.unit,
          unitName: editFormData.unitName,
          instrangemin: editFormData.instrangemin,
          instrangemax: editFormData.instrangemax,
          operangemin: editFormData.operangemin,
          operangemax: editFormData.operangemax,
          mode: editFormData.mode,
          leastcount: editFormData.leastcount,
          matrixtype: editFormData.matrixType,
          pricematrixid: editFormData.pricematrixid,
          status: 1
        }
      ]);
      setMatrixList(prev => [
        ...prev,
        {
          id: editFormData.id,
          unittype: editFormData.unittype,
          unit: editFormData.unit,
          instrangemin: editFormData.instrangemin,
          instrangemax: editFormData.instrangemax,
          operangemin: editFormData.operangemin,
          operangemax: editFormData.operangemax,
          mode: editFormData.mode,
          leastcount: editFormData.leastcount,
          matrixtype: editFormData.matrixType,
          pricematrixid: editFormData.pricematrixid,
          calibration_points: []
        }
      ]);
      toast.success(response?.data?.message || 'Matrix saved successfully ✅');
      setCurrentView('matrix');
    } catch (error) {
      console.error("Error saving matrix:", error);
      toast.error(error?.response?.data?.message || 'Failed to save matrix ❌');
    }
  };

  const saveEditedMatrix = async () => {
    if (!validateForm()) return;

    const payload = {
      inwardid: inwardId,
      instid: instId,
      id: parseInt(editFormData.id),
      caliblocation,
      calibacc,
      mode: editFormData.mode,
      unittype: editFormData.unittype,
      unit: editFormData.unit,
      operangemin: editFormData.operangemin,
      operangemax: editFormData.operangemax,
      instrangemin: editFormData.instrangemin,
      instrangemax: editFormData.instrangemax,
      leastcount: editFormData.leastcount,
      matrixtype: editFormData.matrixType,
      pricematrixid: editFormData.pricematrixid
    };

    try {
      const response = await axios.post('/calibrationprocess/updateMatrix', payload);
      setMatrixData(prev =>
        prev.map(matrix =>
          matrix.id === editFormData.id
            ? {
                ...matrix,
                unittype: editFormData.unittype,
                unit: editFormData.unit,
                unitName: editFormData.unitName,
                instrangemin: editFormData.instrangemin,
                instrangemax: editFormData.instrangemax,
                operangemin: editFormData.operangemin,
                operangemax: editFormData.operangemax,
                mode: editFormData.mode,
                leastcount: editFormData.leastcount,
                matrixtype: editFormData.matrixType,
                pricematrixid: editFormData.pricematrixid
              }
            : matrix
        )
      );
      setMatrixList(prev =>
        prev.map(matrix =>
          matrix.id === editFormData.id
            ? {
                ...matrix,
                unittype: editFormData.unittype,
                unit: editFormData.unit,
                instrangemin: editFormData.instrangemin,
                instrangemax: editFormData.instrangemax,
                operangemin: editFormData.operangemin,
                operangemax: editFormData.operangemax,
                mode: editFormData.mode,
                leastcount: editFormData.leastcount,
                matrixtype: editFormData.matrixType,
                pricematrixid: editFormData.pricematrixid
              }
            : matrix
        )
      );
      toast.success(response?.data?.message || 'Matrix updated successfully ✅');
      setCurrentView('matrix');
    } catch (error) {
      console.error('Error updating matrix:', error);
      toast.error(error?.response?.data?.message || 'Failed to update matrix ❌');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const canEdit = employeeId === instrumentData.allotedto && 
                 (instrumentData.status === 0 || instrumentData.status === 1);

  const MatrixForm = ({ isAdd = false }) => {
    return (
      <div className="min-h-screen bg-gray-50" style={{ background: "white", margin: "10px" }}>
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">{isAdd ? 'Add Matrix Form' : 'Edit Matrix Form'}</h2>
            <button 
              onClick={() => setCurrentView('matrix')}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              &lt;&lt; Back to Matrix List
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 mb-2">
                  <Input
                    label="Matrix Type (Optional)"
                    name="matrixType"
                    value={editFormData.matrixType || ""}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        matrixType: e.target.value,
                      }))
                    }
                  />
                  {formErrors.matrixType && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.matrixType}</p>
                  )}
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <ReactSelect
                    name="unittype"
                    options={unitTypes.map((type) => ({
                      value: type.id,
                      label: type.name,
                    }))}
                    value={
                      unitTypes
                        .map((type) => ({
                          value: type.id,
                          label: type.name,
                        }))
                        .find((opt) => opt.value === editFormData.unittype) || null
                    }
                    onChange={(selected) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        unittype: selected?.value || "",
                      }))
                    }
                    placeholder="Select Unit Type / Parameter"
                  />
                  {formErrors.unittype && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.unittype}</p>
                  )}
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <ReactSelect
                    name="unit"
                    options={units.map((unit) => ({
                      value: unit.id,
                      label: `${unit.name} (${unit.description})`,
                    }))}
                    value={
                      units
                        .map((unit) => ({
                          value: unit.id,
                          label: `${unit.name} (${unit.description})`,
                        }))
                        .find((opt) => opt.value === parseInt(editFormData.unit)) || null
                    }
                    onChange={(selected) => {
                      const selectedUnit = units.find(
                        (unit) => unit.id === selected?.value
                      );
                      setEditFormData((prev) => ({
                        ...prev,
                        unit: selected?.value || "",
                        unitName: selectedUnit ? selectedUnit.description : "",
                      }));
                    }}
                    placeholder="Select Unit"
                  />
                  {formErrors.unit && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.unit}</p>
                  )}
                </div>
                <div className="mb-2">
                  <Input
                    type="number"
                    label="Instrument range min"
                    name="instrangemin"
                    value={editFormData.instrangemin || ""}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        instrangemin: e.target.value,
                      }))
                    }
                  />
                  {formErrors.instrangemin && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.instrangemin}</p>
                  )}
                </div>
                <div className="mb-2">
                  <Input
                    type="number"
                    label="Instrument range max"
                    name="instrangemax"
                    value={editFormData.instrangemax || ""}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        instrangemax: e.target.value,
                      }))
                    }
                  />
                  {formErrors.instrangemax && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.instrangemax}</p>
                  )}
                </div>
                <div className="mb-2">
                  <Input
                    type="number"
                    label="Operating range min"
                    name="operangemin"
                    value={editFormData.operangemin || ""}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        operangemin: e.target.value,
                      }))
                    }
                  />
                  {formErrors.operangemin && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.operangemin}</p>
                  )}
                </div>
                <div className="mb-2">
                  <Input
                    type="number"
                    label="Operating range max"
                    name="operangemax"
                    value={editFormData.operangemax || ""}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        operangemax: e.target.value,
                      }))
                    }
                  />
                  {formErrors.operangemax && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.operangemax}</p>
                  )}
                </div>
                <div className="mb-2">
                  <Input
                    type="number"
                    step="0.001"
                    label="Least Count"
                    name="leastcount"
                    value={editFormData.leastcount || ""}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        leastcount: e.target.value,
                      }))
                    }
                  />
                  {formErrors.leastcount && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.leastcount}</p>
                  )}
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                  <ReactSelect
                    name="mode"
                    options={modeList.map((mode) => ({
                      value: mode.id,
                      label: mode.name,
                    }))}
                    value={
                      modeList
                        .map((mode) => ({
                          value: mode.id,
                          label: mode.name,
                        }))
                        .find((opt) => opt.value === editFormData.mode) || null
                    }
                    onChange={(selected) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        mode: selected?.value || "",
                      }))
                    }
                    placeholder="Select Mode"
                  />
                  {formErrors.mode && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.mode}</p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={isAdd ? saveMatrix : saveEditedMatrix}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded text-base font-medium transition-colors"
                >
                  Save Matrix
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  if (currentView === 'editMatrix') {
    return <MatrixForm isAdd={false} />;
  }

  if (currentView === 'addMatrix') {
    return <MatrixForm isAdd={true} />;
  }

  if (currentView === 'addCalibrationPoint') {
    return (
      <CalibrationPointForm
        onBack={() => setCurrentView('matrix')}
        onSave={(points) => {
          const validPoints = points.map(p => Number(p)).filter(p => !isNaN(p));
          if (validPoints.some(p => p < selectedMatrix.min || p > selectedMatrix.max)) {
            toast.error(`Calibration points must be within instrument range: ${selectedMatrix.min} to ${selectedMatrix.max} ❌`);
            return;
          }
          addCalibrationPoint(selectedMatrix, validPoints);
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Price Matrix</h3>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            &lt;&lt; Back to Perform Calibration
          </button>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Sr no</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Package Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Package Description</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Accreditation</th>
                </tr>
              </thead>
              <tbody>
                {priceMatrix.length > 0 ? (
                  priceMatrix.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.packagename}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.packagedesc}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.accreditation}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-2">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {canEdit && (
            <div className="mt-6 border border-gray-300 p-4 rounded">
              <div className="grid grid-cols-5 gap-4 mb-4 font-semibold">
                <div>Unit Type</div>
                <div>Unit</div>
                <div>Range</div>
                <div>Mode</div>
                <div>Add</div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  {addMatrixList.length > 0 ? (
                    addMatrixList.map((item, index) => (
                      <div
                        key={item.matrix_id || index}
                        className="grid grid-cols-5 gap-4 items-center border-b border-gray-200 py-2"
                      >
                        <div>{item.unittype}</div>
                        <div>
                          {item.unit} {item.unit_text}
                        </div>
                        <div>
                          {item.instrangemin} to {item.instrangemax}
                        </div>
                        <div>{item.mode || "-"}</div>
                        <div>
                          <button
                            type="button"
                            onClick={() =>
                              addMatrix(
                                item.unittype,
                                item.unit,
                                item.unit_text,
                                item.instrangemin,
                                item.instrangemax,
                                item.mode,
                                item.pricematrixid
                              )
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded text-sm transition-colors"
                          >
                            Add Matrix
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No Matrix Data Found</div>
                  )}
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  type="button"
                  onClick={saveMatrix}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition-colors"
                >
                  Save Matrix
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Matrix</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Sr no</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Matrix type</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Mode</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Unit</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Instrument Range</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Operating Range</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Least count</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {matrixList.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.matrixtype}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.unittype}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.mode}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.unit}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.instrangemin} to {item.instrangemax}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.operangemin} to {item.operangemax}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.leastcount}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2 flex-wrap">
                          {canEdit && (
                            <>
                              <button
                                onClick={() => editMatrix(item.id)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => showAddCalibrationPoint(item.id, item.instrangemin, item.instrangemax)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                              >
                                Add Calibration Point
                              </button>
                              <button
                                onClick={() => deleteMatrix(item.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="9" className="border border-gray-300 p-0">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-blue-50">
                              <th className="border border-gray-300 px-4 py-2 text-left">Sr no</th>
                              <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                              <th className="border border-gray-300 px-4 py-2 text-left">Mode</th>
                              <th className="border border-gray-300 px-4 py-2 text-left">Unit</th>
                              <th className="border border-gray-300 px-4 py-2 text-left">Point</th>
                              <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(item.calibration_points || []).map((point, pointIndex) => (
                              <tr key={point.id || pointIndex} className="hover:bg-blue-25">
                                <td className="border border-gray-300 px-4 py-2">{pointIndex + 1}</td>
                                <td className="border border-gray-300 px-4 py-2">{point.unittype}</td>
                                <td className="border border-gray-300 px-4 py-2">{point.mode}</td>
                                <td className="border border-gray-300 px-4 py-2">{point.unit}</td>
                                <td className="border border-gray-300 px-4 py-2">{point.point}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                  {canEdit && (
                                    <button
                                      onClick={() => deleteCalibrationPoint(item.id, point.id)}
                                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                    >
                                      Delete
                                    </button>
                                    
                                  )}
                                  
                                </td>
                              </tr>
                            ))}
                            {(!item.calibration_points || item.calibration_points.length === 0) && (
                              <tr>
                                <td
                                  colSpan="6"
                                  className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                                >
                                  No calibration points added
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
                {matrixList.length === 0 && (
                  <tr>
                    <td
                      colSpan="9"
                      className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                    >
                      No matrix data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const CalibrationPointForm = ({ onBack, onSave }) => {
  const [calibPoints, setCalibPoints] = useState(['']);
  const [pointErrors, setPointErrors] = useState([]);

  const addCalibPointField = () => {
    setCalibPoints(prev => [...prev, '']);
    setPointErrors(prev => [...prev, '']);
  };

  const removeCalibPointField = (index) => {
    if (calibPoints.length > 1) {
      setCalibPoints(prev => prev.filter((_, i) => i !== index));
      setPointErrors(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateCalibPoint = (index, value) => {
    setCalibPoints(prev => prev.map((point, i) => (i === index ? value : point)));
    setPointErrors(prev => prev.map((error, i) => (i === index ? '' : error)));
  };

  const handleSave = () => {
    const validPoints = calibPoints
      .map(p => Number(p))
      .filter(p => !isNaN(p));

    if (validPoints.length === 0) {
      toast.error('Please enter at least one valid calibration point ❌');
      return;
    }

    onSave(validPoints);
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ background: "white", margin: "10px" }}>
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <button
          onClick={onBack}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          &lt;&lt; Back to Matrix List
        </button>
      </div>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calibration point
                </label>
                {calibPoints.map((point, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <div className="flex-1">
                      <input
                        type="number"
                        value={point}
                        onChange={(e) => updateCalibPoint(index, e.target.value)}
                        placeholder="Enter calibration point"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {pointErrors[index] && (
                        <p className="text-red-500 text-sm mt-1">{pointErrors[index]}</p>
                      )}
                    </div>
                    {calibPoints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCalibPointField(index)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCalibPointField}
                  className="text-green-600 hover:text-green-700 text-sm font-medium mt-2"
                >
                  + Calib Points
                </button>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded text-lg font-medium transition-colors"
                style={{ width: "20%" }}
              >
                Save CRF
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InstrumentMatrix;