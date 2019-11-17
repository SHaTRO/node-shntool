
import * as external from './external';
import { shntool, audiofiles } from './shntool';
import { safeString, safeBoolean } from './utils';

// workaround for type declaration (tsc)
import * as globby from 'globby';

const { fs, path, through, concat, promisify } = external;

export {
  // external assemblies
  fs, path, globby, through, concat, promisify,
  // tooling assemblies
  safeString, safeBoolean,
  shntool, audiofiles,
};
