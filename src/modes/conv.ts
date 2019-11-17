
import { globby, shntool, through, promisify, safeString } from '../assemblies';

function parameters(src: string | readonly string[], opt: ConvOptions): ConvParameters {
  opt = opt || {};
  const outputType = safeString(opt.fmt) || 'wav';
  const outputDirArgs = opt.dir ? ['-d', opt.dir] : [];
  const args = ['conv', '-O', 'never', '-P', 'none', '-o', outputType];
  args.push(...outputDirArgs);
  const files = globby.sync(src) || [];
  args.push(...files);
  return {
    args,
    files,
    outputType,
  };
}

function convertService(src: string | readonly string[], opt: ConvOptions, cb: (err: Error, data?: string[]) => void): void {
  const { args, files } = parameters(src, opt);
  const outfiles = [];
  let errorline = 'unknown';
  let err = null;
  let curline = '';
  function parseOutput(data, enc, cb): void {
    curline += data;
    const barelines = curline.split(/\r?\n/);
    curline = barelines.pop();
    if (barelines.length > 0) {
      outfiles.push(...(barelines.filter((line) => {
        if (line.indexOf(']: error:') > 0 || line.indexOf(']: warning') > 0 || line.endsWith('ERROR')) {
          errorline += (errorline.length > 0 ? '; ' : '') + line;
        }
        return line.endsWith('OK');
      }).map((line) => {
        const parts = line.split(/\s-->\s|\s:\s/);
        const outfile = parts.length > 2 && parts[1];
        return outfile.substr(1, outfile.length - 2);
      })));
    }
    cb(null, data);
  }

  if (files.length < 1) {
    cb(new Error('no files match'));
    return;
  }
  const proc = shntool(args),
    output = through(parseOutput),
    stream = through(),
    error = through(parseOutput);
  proc.on('error', stream.getMaxListeners.bind(stream, 'error'));
  proc.stdout.pipe(output);
  proc.stderr.pipe(error);
  proc.on('close', function (code) {
    if (code === 0) {
      stream.emit('end');
    } else {
      err = new Error(errorline);
      stream.emit('error');
    }
  });

  function callback(): void {
    cb(err, outfiles);
  }

  stream.on('end', callback);
  stream.on('error', callback);

  return;
}

const convertPromise = promisify(convertService);
export function convert(src: string | readonly string[], opt?: ConvOptions): Promise<string[]> {
  return convertPromise(src, opt);
}
