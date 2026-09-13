import { parseArgs } from "./cli/parseArgs.js";
import { getCityCoordinates } from "./api/getCityCoordinates.js";

try {
  const options = parseArgs(process.argv);
  console.log(options);
  const data = await getCityCoordinates(options.cities[0]);

} catch (error) {
  console.error(error.message);
  process.exit(1);
}
