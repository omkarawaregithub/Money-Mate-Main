// src/lib/dateUtils.ts
// This file can be used for general date utility functions if needed for MoneyMate.
// The previous content was specific to the old Copilot quota tracker.

// Example function (can be expanded later):
export function getCurrentDateFormatted(formatString: string = "yyyy-MM-dd"): string {
  const { format } = require('date-fns'); // Using require here for lazy loading if preferred
  return format(new Date(), formatString);
}
