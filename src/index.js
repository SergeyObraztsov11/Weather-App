import { parseArgs } from './cli/parseArgs.js';

try {
  const options = parseArgs(process.argv);
  console.log(options);
  
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
