// ==========================================
// TableLogicHandler.jsx
// ==========================================
import { useCallback } from 'react';

export const TableLogicHandler = ({ 
  dynamicHeadings, 
  observations, 
  observationTemplate 
}) => {
  const safeGetValue = (item) => {
    if (!item) return '';
    if (typeof item === 'object' && item !== null) {
      return item.value !== null && item.value !== undefined ? item.value : '';
    }
    return item.toString();
  };

  const generateDynamicTableStructure = useCallback((headings) => {
    if (!headings || !Array.isArray(headings)) return null;

    const sortedHeadings = [...headings].sort((a, b) => (a.field_position || 0) - (b.field_position || 0));
    const headers = [];
    const subHeadersRow = [];

    headers.push({ name: 'SR NO', colspan: 1 });
    subHeadersRow.push(null);

    sortedHeadings.forEach((heading) => {
      if (heading.checkbox === 'yes') {
        const headerName = heading.field_heading || heading.fieldname;
        
        if (heading.fieldname === 'master' || heading.fieldname.includes('observation')) {
          const observationSettings = dynamicHeadings?.observation_heading?.observation_settings || [];
          const observationCount = observationSettings.filter(obs => obs.checkbox === 'yes').length;
          
          if (observationCount > 0) {
            headers.push({ name: headerName, colspan: observationCount });
            
            observationSettings.forEach((obsSetting) => {
              if (obsSetting.checkbox === 'yes') {
                let subHeaderName = obsSetting.field_heading || obsSetting.fieldname;
                
                if (observationTemplate === 'observationppg') {
                  const obsNumber = parseInt(obsSetting.fieldname.replace('observation', ''));
                  if (!isNaN(obsNumber)) {
                    subHeaderName += obsNumber % 2 === 1 ? ' (up)' : ' (down)';
                  }
                }
                
                subHeadersRow.push(subHeaderName);
              }
            });
          } else {
            let defaultCount = 3;
            if (observationTemplate === 'observationmg' || observationTemplate === 'observationavg') {
              defaultCount = 2;
            }
            if (observationTemplate === 'observationppg') {
              defaultCount = 6;
            }
            
            headers.push({ name: headerName, colspan: defaultCount });
            for (let i = 1; i <= defaultCount; i++) {
              let subHeaderName = `M${i}`;
              if (observationTemplate === 'observationppg') {
                subHeaderName += i % 2 === 1 ? ' (up)' : ' (down)';
              }
              subHeadersRow.push(subHeaderName);
            }
          }
        } else {
          headers.push({ name: headerName, colspan: 1 });
          subHeadersRow.push(null);
        }
      }
    });

    return { headers, subHeadersRow };
  }, [dynamicHeadings, observationTemplate]);

  const calculateRowValues = (rowData) => {
    const parsedValues = rowData.map((val) => {
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    });

    const result = { average: '', error: '', repeatability: '', hysteresis: '' };

    if (!dynamicHeadings?.mainhading?.calibration_settings) return result;

    const sortedSettings = [...dynamicHeadings.mainhading.calibration_settings]
      .filter(col => col.checkbox === 'yes')
      .sort((a, b) => a.field_position - b.field_position);

    let obsStartIndex = 1;
    let masterValueIndex = -1;

    sortedSettings.forEach((setting, idx) => {
      if (setting.fieldname === 'master' || setting.fieldname.includes('observation')) {
        obsStartIndex = idx + 1;
      } else if (setting.fieldname === 'calculatedmaster' || setting.fieldname === 'uuc') {
        masterValueIndex = idx + 1;
      }
    });

    const obsSettings = dynamicHeadings?.observation_heading?.observation_settings || [];
    const obsCount = obsSettings.filter(obs => obs.checkbox === 'yes').length;

    const observations = [];
    for (let i = 0; i < obsCount; i++) {
      observations.push(parsedValues[obsStartIndex + i]);
    }

    const validReadings = observations.filter((val) => val !== 0);

    result.average = validReadings.length
      ? (validReadings.reduce((sum, val) => sum + val, 0) / validReadings.length).toFixed(3)
      : '';

    if (masterValueIndex > 0 && result.average) {
      const masterValue = parsedValues[masterValueIndex];
      result.error = (masterValue - parseFloat(result.average)).toFixed(3);
    }

    result.repeatability = validReadings.length
      ? ((Math.max(...validReadings) - Math.min(...validReadings)) / 2).toFixed(3)
      : '';

    result.hysteresis = validReadings.length
      ? (Math.max(...validReadings) - Math.min(...validReadings)).toFixed(3)
      : '';

    return result;
  };

  const createObservationRows = (observationData) => {
    if (!observationData || !dynamicHeadings?.mainhading?.calibration_settings) {
      return {
        rows: [],
        hiddenInputs: { calibrationPoints: [], types: [], repeatables: [], values: [] },
      };
    }

    const sortedSettings = [...dynamicHeadings.mainhading.calibration_settings]
      .filter(col => col.checkbox === 'yes')
      .sort((a, b) => a.field_position - b.field_position);

    const rows = [];
    const calibrationPoints = [];
    const types = [];
    const repeatables = [];
    const values = [];

    observationData.forEach((point) => {
      const row = [point.sequence_number?.toString() || point.sr_no?.toString() || ''];
      
      sortedSettings.forEach((setting) => {
        const fieldname = setting.fieldname;
        
        if (fieldname === 'uuc') {
          row.push(safeGetValue(point.set_pressure?.uuc_value || point.uuc_value));
        } else if (fieldname === 'calculatedmaster') {
          row.push(safeGetValue(point.set_pressure?.converted_value || point.converted_uuc_value));
        } else if (fieldname === 'master' || fieldname.includes('observation')) {
          const obsSettings = dynamicHeadings?.observation_heading?.observation_settings || [];
          const obsCount = obsSettings.filter(obs => obs.checkbox === 'yes').length;
          
          for (let i = 1; i <= obsCount; i++) {
            row.push(safeGetValue(point.observations?.[`master_${i}`] || point[`m${i}`]));
          }
        } else if (fieldname === 'averagemaster') {
          row.push(safeGetValue(point.calculations?.mean || point.average_master));
        } else if (fieldname === 'error') {
          row.push(safeGetValue(point.calculations?.error));
        } else if (fieldname === 'hysterisis') {
          row.push(safeGetValue(point.calculations?.hysteresis || point.hysterisis));
        }
      });
      
      rows.push(row);
      calibrationPoints.push(point.point_id?.toString() || '');
      types.push('master');
      repeatables.push('0');
      values.push(safeGetValue(point.set_pressure?.uuc_value) || '0');
    });
    
    return { rows, hiddenInputs: { calibrationPoints, types, repeatables, values } };
  };

  const generateTableStructure = () => {
    if (dynamicHeadings?.mainhading?.calibration_settings) {
      const dynamicStructure = generateDynamicTableStructure(
        dynamicHeadings.mainhading.calibration_settings
      );
      if (dynamicStructure) return dynamicStructure;
    }
    return null;
  };

  const selectedTableData = observations.length > 0 ? {
    id: observationTemplate,
    staticRows: createObservationRows(observations).rows,
    hiddenInputs: createObservationRows(observations).hiddenInputs,
  } : null;

  const tableStructure = generateTableStructure();

  return {
    tableStructure,
    selectedTableData,
    calculateRowValues,
  };
};
