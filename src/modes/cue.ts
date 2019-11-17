
import { globby, shntool, through, concat, promisify } from '../assemblies';

function cuefileService(src: string | readonly string[], opt: CueOptions, cb: (err: Error, data: string[]) => void): void {
  opt = opt || {};
  const defaultargs = ['cue'];
  const files = globby.sync(src);
  const args = defaultargs.concat(files);
  //console.log('CMD = shntool ' + args.join(' '));
  let cuefile = '';
  let err = null;
  function accumulateFile(data: Buffer, enc: string, cb: (err: Error, data: Buffer) => void): void {
    //console.log('accumulating');
    cuefile += data;
    cb(null, data);
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
      // .map(function(str) { return str.trim(); })
      .filter(function (s) { return s; });
    cb(err, lines);
  }

  stream.on('end', callback);
  stream.on('error', callback);

  return;
}

const cuePromise = promisify(cuefileService);
export async function cuefile(src: string | readonly string[], opt?: CueOptions): Promise<string[]> {
  return cuePromise(src, opt);
}
