
import * as concat from 'concat-stream';
import * as fs from 'fs';
import * as globby from 'globby';
import * as path from 'path';
import * as through from 'through2';
import { promisify } from 'util';

import { shntool } from '../shntool';

function parameters(src: string | readonly string[], opt: CueOptions): CueParameters {   // eslint-disable-line @typescript-eslint/no-unused-vars
  opt = opt || {}
  const args = ['cue'];
  const files = globby.sync(src) || [];
  const destfile = opt.destfile ? path.normalize(opt.destfile) : undefined;
  args.push(...files);
  return {
    args,
    files,
    destfile,
  };
}

function cuefileService(src: string | readonly string[], opt: CueOptions, cb: (err: Error, data?: string[]) => void): void {
  const { args, files, destfile } = parameters(src, opt);
  //console.log('CMD = shntool ' + args.join(' '));
  if (destfile) {
    try {
      fs.accessSync(destfile, fs.constants.F_OK);
      cb(new Error('destfile already exists'));
      return;
    } catch (err) {
      // ignore error because we were checking existence
    }
  }
  let cuefile = '';
  let err = null;
  function accumulateFile(data: Buffer, enc: string, cb: (err: Error, data: Buffer) => void): void {
    //console.log('accumulating');
    cuefile += data;
    cb(null, data);
  }

  if (files.length < 1) {
    cb(new Error('no files match'));
    return;
  }
  const proc = shntool(args),
    output = through(accumulateFile),
    stream = through(),
    error = concat();
  proc.on('error', stream.emit.bind(stream, 'error'));
  proc.stdout.pipe(output);
  proc.stderr.pipe(error);
  proc.on('close', function (code: number): void {
    if (code === 0) {
      //console.log('emitting: end');
      stream.emit('end');
    } else {
      err = new Error(error.getBody().toString());
      //console.log('emitting: error');
      stream.emit('error');
    }
  });

  function callback(): void {
    //console.log('callback called');
    const lines = cuefile
      .split(/[\r\n]+/)
      .filter(function (s) { return s; });
    if (destfile && lines.length > 0) {
      fs.writeFile(destfile, cuefile, (e) => {
        cb(e, lines);
      });
    } else {
      cb(err, lines);
    }
  }

  stream.on('end', callback);
  stream.on('error', callback);

  return;
}

const cuePromise = promisify(cuefileService);
export async function cuefile(src: string | readonly string[], opt?: CueOptions): Promise<string[]> {
  return cuePromise(src, opt);
}
