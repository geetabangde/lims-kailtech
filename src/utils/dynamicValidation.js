export const buildDynamicColumnMap = (dynamicHeadings) => {
  if (!dynamicHeadings?.mainhading?.calibration_settings) {
    return null;
  }

  const columnMap = {};
  const calibrationSettings = dynamicHeadings.mainhading.calibration_settings.filter(
    (col) => col.checkbox === 'yes'
  );

  const observationSettings = dynamicHeadings?.observation_heading?.observation_settings?.filter(
    (obs) => obs.checkbox === 'yes'
  ) || [];

  const observationFrom = dynamicHeadings?.observation_from || 'master';

  let currentCol = 1; // Start from 1 (0 is SR NO)

  calibrationSettings.forEach((setting) => {
    const fieldname = setting.fieldname;

    // Handle observation fields with multiple columns
    if (fieldname === 'master' || fieldname === 'uuc') {
      const needsMultipleColumns = 
        (observationFrom === 'master' && fieldname === 'master') ||
        (observationFrom === 'uuc' && fieldname === 'uuc') ||
        (observationFrom === 'separate');

      if (needsMultipleColumns && observationSettings.length > 0) {
        columnMap[fieldname] = {
          type: 'multi',
          startCol: currentCol,
          endCol: currentCol + observationSettings.length - 1,
          count: observationSettings.length,
          setting: setting
        };
        currentCol += observationSettings.length;
      } else {
        columnMap[fieldname] = {
          type: 'single',
          column: currentCol,
          setting: setting
        };
        currentCol++;
      }
    } else {
      // Regular single column
      columnMap[fieldname] = {
        type: 'single',
        column: currentCol,
        setting: setting
      };
      currentCol++;
    }
  });

  return columnMap;
};


/**
 * Get validation rules from dynamic headings
 */
export const getValidationRules = (dynamicHeadings) => {
  if (!dynamicHeadings?.mainhading?.calibration_settings) {
    return {};
  }

  const rules = {};
  const calibrationSettings = dynamicHeadings.mainhading.calibration_settings.filter(
    (col) => col.checkbox === 'yes'
  );

  calibrationSettings.forEach((setting) => {
    const fieldname = setting.fieldname;
    
    rules[fieldname] = {
      required: setting.required === 'yes' || setting.required === true || setting.required === 1,
      fieldname: fieldname,
      field_heading: setting.field_heading || fieldname,
      validation_type: setting.validation_type || 'text',
      min_value: setting.min_value,
      max_value: setting.max_value,
      formula: setting.formula,
      editable: setting.editable !== 'no' && setting.editable !== false && setting.editable !== 0,
      least_count: setting.least_count,
      precision: setting.precision
    };
  });

  return rules;
};


/**
 * Validate a single field value
 */
export const validateField = (fieldname, value, rule, leastCountData, calibPointId) => {
  // Skip validation for non-editable fields
  if (rule.editable === false) {
    return null;
  }

  // Skip validation for calculated fields (with formula)
  if (rule.formula && rule.formula.trim() !== '') {
    return null;
  }

  // Required field validation
  if (rule.required && (!value || value.trim() === '')) {
    return 'This field is required';
  }

  // If field is empty and not required, no further validation
  if (!value || value.trim() === '') {
    return null;
  }

  const numValue = parseFloat(value);

  // Numeric validation
  if (rule.validation_type === 'number' || rule.validation_type === 'numeric') {
    if (isNaN(numValue)) {
      return 'Please enter a valid number';
    }

    // Min/Max validation
    if (rule.min_value !== undefined && rule.min_value !== null) {
      const minVal = parseFloat(rule.min_value);
      if (numValue < minVal) {
        return `Value must be at least ${minVal}`;
      }
    }

    if (rule.max_value !== undefined && rule.max_value !== null) {
      const maxVal = parseFloat(rule.max_value);
      if (numValue > maxVal) {
        return `Value must not exceed ${maxVal}`;
      }
    }

    // Least count validation
    if (leastCountData && calibPointId) {
      const leastCount = leastCountData[calibPointId] || rule.least_count;
      
      if (leastCount) {
        const leastCountVal = parseFloat(leastCount);
        
        if (numValue < leastCountVal) {
          return `Please enter a value within least count ${leastCountVal}`;
        }
        
        if (numValue % leastCountVal !== 0) {
          return `Please enter value divisible by ${leastCountVal}`;
        }
      }
    }

    // Precision validation
    if (rule.precision) {
      const precisionVal = parseInt(rule.precision);
      const decimalPlaces = (value.split('.')[1] || '').length;
      if (decimalPlaces > precisionVal) {
        return `Maximum ${precisionVal} decimal places allowed`;
      }
    }
  }

  return null;
};


/**
 * Validate entire row based on dynamic headings
 */
export const validateRow = (rowIndex, rowData, dynamicHeadings, columnMap, leastCountData, calibPointId) => {
  const errors = {};
  const validationRules = getValidationRules(dynamicHeadings);

  if (!columnMap || !validationRules) {
    return errors;
  }

  Object.keys(columnMap).forEach((fieldname) => {
    const fieldInfo = columnMap[fieldname];
    const rule = validationRules[fieldname];

    if (!rule) return;

    if (fieldInfo.type === 'multi') {
      // Validate multiple observation columns
      for (let i = 0; i < fieldInfo.count; i++) {
        const colIndex = fieldInfo.startCol + i;
        const value = rowData[colIndex];
        const error = validateField(fieldname, value, rule, leastCountData, calibPointId);
        
        if (error) {
          errors[`${rowIndex}-${colIndex}`] = error;
        }
      }
    } else {
      // Validate single column
      const colIndex = fieldInfo.column;
      const value = rowData[colIndex];
      const error = validateField(fieldname, value, rule, leastCountData, calibPointId);
      
      if (error) {
        errors[`${rowIndex}-${colIndex}`] = error;
      }
    }
  });

  return errors;
};

/**
 * Validate all rows in the table
 */
export const validateAllRows = (rows, dynamicHeadings, tableInputValues, leastCountData, calibrationPoints) => {
  const allErrors = {};
  const columnMap = buildDynamicColumnMap(dynamicHeadings);

  if (!columnMap) {
    return allErrors;
  }

  rows.forEach((row, rowIndex) => {
    const calibPointId = calibrationPoints?.[rowIndex];
    
    // Build row data from tableInputValues
    const rowData = row.map((cell, colIndex) => {
      const key = `${rowIndex}-${colIndex}`;
      return tableInputValues[key] ?? (cell?.toString() || '');
    });

    const rowErrors = validateRow(rowIndex, rowData, dynamicHeadings, columnMap, leastCountData, calibPointId);
    Object.assign(allErrors, rowErrors);
  });

  return allErrors;
};