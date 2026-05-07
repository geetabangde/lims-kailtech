import React from 'react';

function DynamicModeAlert({ dynamicHeadings, suffix }) {
  if (!dynamicHeadings) return null;

  return (
    <React.Fragment>
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
        <p className="text-sm text-green-800">
            <strong>Dynamic Mode Active:</strong> Using custom column names for suffix &quot;{suffix}&quot;
        </p>
        </div>
    </React.Fragment>
    
  );
}

export default DynamicModeAlert;