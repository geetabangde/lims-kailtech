const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'AddQuotations.jsx',
  'AddQuoteItemCalibration.jsx',
  'EditQuoteItem.jsx',
  'QuotationFollowUp.jsx',
  'RowActions.jsx',
  'Toolbar.jsx',
  'ViewQuotation.jsx'
];

const folderPath = 'c:\\Users\\pc-obe\\Desktop\\kailtech\\labkailtech\\src\\app\\pages\\dashboards\\sales\\calibration-quotations';

filesToUpdate.forEach(file => {
  const filePath = path.join(folderPath, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/calibrations-quotations/g, 'calibration-quotations');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated ${file}`);
    } else {
      console.log(`No changes needed for ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});
