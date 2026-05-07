/**
 * Generating Financial Years from 2020-21 up to the current financial year.
 * Financial year starts in April.
 */
export function getFinancialYears() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed
  const finYears = [];

  let startYear;
  if (currentMonth >= 4) {
    // April or later: current year is the start of the current FY
    startYear = currentYear;
  } else {
    // Before April: previous year was the start of the current FY
    startYear = currentYear - 1;
  }

  // Current FY
  finYears.push(`${startYear}-${String(startYear + 1).slice(2)}`);

  // Previous years down to 2020
  for (let year = startYear - 1; year >= 2020; year--) {
    finYears.push(`${year}-${String(year + 1).slice(2)}`);
  }

  return finYears;
}

/**
 * Get from and to dates for a given financial year string (e.g., "2026-27")
 */
export function getFinYearDates(finYear) {
  const [yearStr] = finYear.split("-");
  const startYear = parseInt(yearStr);
  const endYear = startYear + 1;

  return {
    finfromdate: `${startYear}-04-01`,
    fintodate: `${endYear}-03-31`,
  };
}
