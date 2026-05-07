// ==========================================
// ValidationHandler.jsx
// ==========================================
export const ValidationHandler = ({
  formData,
  temperatureRange,
  humidityRange,
  observations,
  dynamicHeadings,
  tableInputValues,
  setErrors,
  setObservationErrors,
}) => {
  const validateForm = () => {
    let newErrors = {};

    if (!formData.tempend || formData.tempend.trim() === '') {
      newErrors.tempend = 'This field is required';
    } else {
      const temp = parseFloat(formData.tempend);
      if (temperatureRange) {
        if (temperatureRange.min !== undefined && temperatureRange.max !== undefined) {
          if (isNaN(temp) || temp < temperatureRange.min || temp > temperatureRange.max) {
            newErrors.tempend = `Temperature must be between ${temperatureRange.min} and ${temperatureRange.max}`;
          }
        } else if (temperatureRange.value !== undefined) {
          if (isNaN(temp) || temp !== temperatureRange.value) {
            newErrors.tempend = `Temperature must be ${temperatureRange.value}`;
          }
        }
      }
    }

    if (!formData.humiend || formData.humiend.trim() === '') {
      newErrors.humiend = 'This field is required';
    } else {
      const humi = parseFloat(formData.humiend);
      if (humidityRange) {
        if (humidityRange.min !== undefined && humidityRange.max !== undefined) {
          if (isNaN(humi) || humi < humidityRange.min || humi > humidityRange.max) {
            newErrors.humiend = `Humidity must be between ${humidityRange.min} and ${humidityRange.max}`;
          }
        } else if (humidityRange.value !== undefined) {
          if (isNaN(humi) || humi !== humidityRange.value) {
            newErrors.humiend = `Humidity must be ${humidityRange.value}`;
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateObservationFields = () => {
    let newErrors = {};

    if (!dynamicHeadings?.mainhading?.calibration_settings) {
      return true;
    }

    const sortedSettings = [...dynamicHeadings.mainhading.calibration_settings]
      .filter(col => col.checkbox === 'yes')
      .sort((a, b) => a.field_position - b.field_position);

    observations.forEach((point, rowIndex) => {
      let colIndex = 1;

      sortedSettings.forEach((setting) => {
        if (setting.fieldname === 'master' || setting.fieldname.includes('observation')) {
          const obsSettings = dynamicHeadings?.observation_heading?.observation_settings || [];
          const obsCount = obsSettings.filter(obs => obs.checkbox === 'yes').length;
          
          for (let i = 0; i < obsCount; i++) {
            const key = `${rowIndex}-${colIndex}`;
            const value = tableInputValues[key] ?? '';
            if (!value.trim()) {
              newErrors[key] = 'This field is required';
            }
            colIndex++;
          }
        } else if (!['averagemaster', 'error', 'hysterisis', 'repeatability'].includes(setting.fieldname)) {
          const key = `${rowIndex}-${colIndex}`;
          const value = tableInputValues[key] ?? '';
          if (!value.trim()) {
            newErrors[key] = 'This field is required';
          }
          colIndex++;
        } else {
          colIndex++;
        }
      });
    });

    setObservationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { validateForm, validateObservationFields };
};
