
import { path, fs, globby, through, concat, shntool, promisify } from '../assemblies';

function joinService(src: string | readonly string[], opt: JoinOptions, cb: (err: Error, data?: string) => void): void {
  opt = opt || {};
  let err = null;
  const joinfile = opt.dir ? path.join(opt.dir, 'joined.wav') : 'joined.wav';
  //console.log('joinfile: ' + joinfile);
  const destfile = opt.destfile ? opt.dir ? path.join(opt.dir, opt.destfile)
    : opt.destfile
    : joinfile;
  //console.log('destfile: ' + destfile);

  function callback(): void {
    const stats = fs.statSync(joinfile);
    if (stats.isFile()) {
      if (!opt.destfile) {
        cb(err, path.normalize(joinfile));
      } else {
        fs.renameSync(joinfile, destfile);
        cb(err, path.normalize(destfile));
      }
    }
  }

  const outputType = opt.fmt || 'wav';
  const outputDirArgs = opt.dir ? ['-d', opt.dir] : [];
  const defaultargs = ['join', '-O', 'always', '-P', 'none', '-o', outputType, '-q'].concat(outputDirArgs);
  const files = globby.sync(src);
  if (files == null || files.length < 1) {
    cb(new Error('no files match'));
    return null;
  } else {
    const args = defaultargs.concat(files);
    //console.log('CMD = shntool ' + args.join(' '));

    const proc = shntool(args),
      output = through(),
      stream = through(),
      error = concat();

    proc.on('error', stream.emit.bind(stream, 'error'));
    proc.stdout.pipe(output);
    proc.stderr.pipe(error);
    proc.on('close', function (code) {
      if (code === 0) {
        stream.emit('end');
      } else {
        err = new Error(error.getBody().toString());
        stream.emit('error');
      }
    });

    stream.on('end', callback);
    stream.on('error', callback);
  }
  return;
}

const joinPromise = promisify(joinService);
export async function joined(src: string | readonly string[], opt?: JoinOptions): Promise<string> {
  return joinPromise(src, opt);
} 
