
import * as external from './external';
import { shntool, audiofiles } from './shntool';

import * as globby from 'globby';

const { fs, path, through, concat, promisify } = external;

export {
  // external assemblies
  fs, path, globby, through, concat, promisify,
  // tooling assemblies
  shntool, audiofiles,
};
