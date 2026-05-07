// components/CalibrateStep3/ValidationLogic.jsx
import { useState } from 'react';

export const useValidationLogic = (temperatureRange, humidityRange, selectedTableData, tableInputValues, leastCountData) => {
  const [errors, setErrors] = useState({});
  const [observationErrors, setObservationErrors] = useState({});

  const validateForm = (formData) => {
    let newErrors = {};

    // Temperature validation
    if (!formData.tempend || formData.tempend.trim() === '') {
      newErrors.tempend = 'This field is required';
    } else {
      const temp = parseFloat(formData.tempend);
      if (temperatureRange) {
        if (temperatureRange.min !== undefined && temperatureRange.max !== undefined) {
          if (isNaN(temp) || temp < temperatureRange.min || temp > temperatureRange.max) {
            newErrors.tempend = `Temperature must be between ${temperatureRange.min} and ${temperatureRange.max}`;
          }
        }
      }
    }

    // Humidity validation
    if (!formData.humiend || formData.humiend.trim() === '') {
      newErrors.humiend = 'This field is required';
    } else {
      const humi = parseFloat(formData.humiend);
      if (humidityRange) {
        if (humidityRange.min !== undefined && humidityRange.max !== undefined) {
          if (isNaN(humi) || humi < humidityRange.min || humi > humidityRange.max) {
            newErrors.humiend = `Humidity must be between ${humidityRange.min} and ${humidityRange.max}`;
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateObservationFields = () => {
    let newErrors = {};

    if (!selectedTableData || !selectedTableData.staticRows) {
      return true;
    }

    selectedTableData.staticRows.forEach((row, rowIndex) => {
      if (selectedTableData.id === 'observationmm') {
        const calibPointId = selectedTableData.hiddenInputs?.calibrationPoints?.[rowIndex];
        const leastCount = leastCountData[calibPointId];
        
        if (!leastCount) {
          console.warn(`⚠️ Least count not found for calibration point ${calibPointId}`);
          return;
        }

        // Range validation
        const rangeKey = `${rowIndex}-2`;
        const rangeValue = tableInputValues[rangeKey] ?? (row[2]?.toString() || '');
        if (!rangeValue.trim()) {
          newErrors[rangeKey] = 'This field is required';
        }

        // Observations validation
        for (let col = 5; col <= 9; col++) {
          const key = `${rowIndex}-${col}`;
          const value = tableInputValues[key] ?? (row[col]?.toString() || '');

          if (!value.trim()) {
            newErrors[key] = 'This field is required';
          } else {
            const numValue = parseFloat(value);
            if (numValue < leastCount) {
              newErrors[key] = `Please enter a value within leastcount ${leastCount}`;
            } else if (numValue % leastCount !== 0) {
              newErrors[key] = `Please Enter Value divisible by ${leastCount}`;
            }
          }
        }
      }
      // Add other observation type validations here...
    });

    setObservationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { 
    errors, 
    observationErrors, 
    validateForm, 
    validateObservationFields, 
    setErrors, 
    setObservationErrors 
  };
};