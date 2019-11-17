
import * as cp from 'child_process';
import { globby } from './external';
import { SUPPORTED_AUDIO_FILES } from './config';

export function shntool(args: string[]): cp.ChildProcessWithoutNullStreams { 
  return cp.spawn('shntool', args, { detached : true }); 
}

export async function audiofiles(src: string|readonly string[], opt?: globby.GlobbyOptions): Promise<string[]> {
  const files = globby.sync(src, opt).filter( (v) => {
    for (let i=0; i<SUPPORTED_AUDIO_FILES.length; i++) {
      if (v.toLowerCase().endsWith(SUPPORTED_AUDIO_FILES[i])) {
        return true;
      }
    }
    return false;
  });
  return files;
}
