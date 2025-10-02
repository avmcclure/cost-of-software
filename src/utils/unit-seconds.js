// Conversion factors for time units in seconds
import { TimeUnit } from './time-unit';

export const UnitSeconds = {
  [TimeUnit.SECONDS]: 1,
  [TimeUnit.MINUTES]: 60,
  [TimeUnit.HOURS]: 3600,
  [TimeUnit.DAYS]: 86400,
  [TimeUnit.WEEKS]: 604800,
  [TimeUnit.MONTHS]: 2629746, // avg month ~30.44 days
  [TimeUnit.YEARS]: 31556952, // avg year ~365.24 days
};
