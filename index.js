
"use strict";

module.exports = function() {
    var SUPPORTED_AUDIO_FILES = [
      'wav', 'flac', 'shn'
    ];
    var spawn = require("child_process").spawn,
        shntool = spawn.bind(null, process.env.SHNTOOL_PATH || 'shntool'),
        fs = require('fs-extra'),
        path = require('path'),
        globby = require('globby'),
        through = require('through'),
        util = require('util'),
        concat = require('concat-stream');

    function audioFileService(src, opt, cb) {
        if (cb==null) {
            cb = opt;
            opt = {};
        }
        try {
          var files = globby.sync(src, opt).filter( (v) => {
            for (var i=0; i<SUPPORTED_AUDIO_FILES.length; i++) {
              if (v.toLowerCase().endsWith(SUPPORTED_AUDIO_FILES[i])) {
                return true;
              }
            }
            return false;
          });
          cb(null, files);
        } catch (e) {
          cb(e);
        }
    }

    function convertService(src, opt, cb) {
        if (cb==null) {
          cb = opt;
          opt = {};
        }
        var outputType = opt.fmt || 'wav';
        var outputDirArgs = opt.dir ? [ '-d', opt.dir ] : [];
        var defaultargs = [ 'conv', '-O', 'never', '-P', 'none', '-o', outputType ].concat(outputDirArgs);
        var files = globby.sync(src);
        var args = defaultargs.concat(files);
        var proc = spawnCmd(args),
            output = through(parseOutput),
            stream = through(),
            error = through(parseOutput);
        var outfiles = [];
        var errorline = 'unknown';
        var err = null;
        proc.on('error', stream.getMaxListeners.bind(stream, 'error'));
        proc.stdout.pipe(output);
        proc.stderr.pipe(error);
        proc.on('close', function(code) {
            if (code===0) {
                stream.emit('end');
            } else {
                err = new Error(errorline);
                stream.emit('error');
            }
        });

        function callback() {
            cb(err, outfiles);
        }

        stream.on('end', callback);
        stream.on('error', callback);

        var curline = '';
        function parseOutput(data){
            curline += data;
            var barelines = curline.split(/\r?\n/);
            curline = barelines.pop();
            if (barelines.length > 0) {
                outfiles.push(...(barelines.filter( (line) => { 
                    if (line.indexOf(']: error:') > 0 || line.indexOf(']: warning') > 0 || line.endsWith('ERROR')) {
                        errorline += (errorline.length > 0 ? '; ' : '') + line;
                    }
                    return line.endsWith('OK');
                }).map( (line) => {
                    var parts = line.split(/\s-->\s|\s:\s/);
                    var outfile = parts.length>2 && parts[1];
                    return outfile.substr(1, outfile.length-2);
                })));
            }
        }
        return stream;
    }

    function cuefileService(src, opt, cb) {
        if (cb==null) {
            cb = opt;
            opt = {};
        }
        var defaultargs = [ 'cue' ];
        var files = globby.sync(src);
        var args = defaultargs.concat(files);
        //console.log('CMD = shntool ' + args.join(' '));
        var proc = spawnCmd(args),
            output = through(accumulateFile),
            stream = through(),
            error = concat();

        var cuefile = '';
        var err = null;

        proc.on('error', stream.emit.bind(stream, 'error'));
        proc.stdout.pipe(output);
        proc.stderr.pipe(error);
        proc.on('close', function(code) {
            if (code===0) {
                //console.log('emitting: end');
                stream.emit('end');
            } else {
                err = new Error(error.getBody().toString());
                //console.log('emitting: error');
                stream.emit('error');
            }
        });

        function callback() {
            //console.log('callback called');
            var lines = cuefile
                .split(/[\r\n]+/)
                // .map(function(str) { return str.trim(); })
                .filter(function(s) { return s; });
            cb(err, lines);
        }

        stream.on('end', callback);
        stream.on('error', callback);

        function accumulateFile(data) {
            //console.log('accumulating');
            cuefile += data;
        }
        return stream;
    }

    function joinService(src, opt, cb) {
        if (cb==null) {
            cb = opt;
            opt = {};
        }
        var err = null;
        var joinfile = opt.dir ? path.join(opt.dir, 'joined.wav') : 'joined.wav';
        //console.log('joinfile: ' + joinfile);
        var destfile = opt.destfile ? opt.dir ? path.join(opt.dir, opt.destfile)
                                              : opt.destfile
                                    : joinfile;
        //console.log('destfile: ' + destfile);

        function callback(err) {
            var stats = fs.statSync(joinfile);
            if (stats.isFile()) {
                if (!opt.destfile) {
                    cb(err, path.normalize(joinfile));
                } else {
                    fs.renameSync(joinfile, destfile);
                    cb(err, path.normalize(destfile));
                }
            }
        }

        var outputType = opt.fmt || 'wav';
        var outputDirArgs = opt.dir ? [ '-d', opt.dir ] : [];
        var defaultargs = [ 'join', '-O', 'always', '-P', 'none', '-o', outputType, '-q' ].concat(outputDirArgs);
        var files = globby.sync(src);
        if (files==null || files.length<1) {
          cb(new Error('no files match'));
          return null;
        } else {
          var args = defaultargs.concat(files);
          //console.log('CMD = shntool ' + args.join(' '));

          var proc = spawnCmd(args),
              output = through(),
              stream = through(),
              error = concat();

          proc.on('error', stream.emit.bind(stream, 'error'));
          proc.stdout.pipe(output);
          proc.stderr.pipe(error);
          proc.on('close', function(code) {
              if (code===0) {
                  stream.emit('end');
              } else {
                  err = new Error(error.getBody().toString());
                  stream.emit('error');
              }
          });

          stream.on('end', callback);
          stream.on('error', callback);
        }
        return stream;
    }


    function spawnCmd(args) {
        var cproc = shntool(args, { detached : true, encoding : 'binary' });
        //console.log('PROC: ' + cproc);
        return cproc;
    }

    return {
        convert : util.promisify(convertService),
        cuefile : util.promisify(cuefileService),
        joined  : util.promisify(joinService),
        audiofiles : util.promisify(audioFileService)
    }
}();
