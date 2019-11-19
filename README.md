# node-shntool
Node interface to shntool application (http://www.etree.org/shnutils/shntool/)

## Synopsis

The 'shntool' application is a multi-purpose WAV file data processing tool. It can process any file that contains WAVE type data, compressed or not, provided there is a format module to handle that particular file time.

This node module acts as a Node.js interface to that application.

## Getting Started

You will need have installed the shntool software to use this module.
It can be obtained here: http://www.etree.org/shnutils/shntool

### Installation

Just install the node module into your project from NPM

```
npm install --save node-shntool
```

## Code Examples

This is the first release of this interface, it is currently experimental.
It currently supports 'CUE file' generation, joining files, and rudimentary format conversion.
The first argument to the promise calls is a string or list of strings used by the 'globby' module to locate the input files.
The second argument to the promise calls is any options for the function itself.

### Include the module

```
// TYPESCRIPT (async)
import * as shntool from 'node-shntool';

// JAVASCRIPT (Promise)
var shntool = require('node-shntool');
```

### List of Supported Audio files

This service function returns a list of supported audio files, filtered from the supplied globby globs.

```
// TYPESCRIPT (async)
const files = await shntool.audiofiles('path/to/files/*');

// JAVASCRIPT (promise)
shntool.audiofiles('path/to/files/*').then(
  function(files) {
    // files is an array of paths to supported audio files
    console.log(filelist.join('\n'));
  }
).catch( (err) => {
  // handle error
});
```

### CUE File Generation

This service function result is an array of text lines.

```
// TYPESCRIPT (async)
const cuelines = await shntool.cuefile('prefix-*.wav');


// JAVASCRIPT (Promise)
shntool.cuefile('prefix-*.wav').then(
  function(cuelines) {
      // each line of the CUE lines is available here
      console.log(cuelines.join('\n'));
  }
).catch( (err) => { 
  // handle error
});
```

### Create a Joined file

This service function joins the specified files into a destination file.

```
// note that the options here are actually the defaults so you can omit them

// TYPESCRIPT (async)
const joinfile = await shntool.joined('prefix-*.wav', { destfile: 'joined.wav', dir: '.' });


// JAVASCRIPT (Promise)
shntool.joined('prefix-*.wav', { destfile: 'joined.wav', dir: '.' }).then(
  function(joinedfile) {
    // the joinedfile is actually on the file system at this point
    // if you combine the CUE file with the joined file you can burn a CD
  }
).catch( (err) => { 
  // handle error
});
```

### Convert FLAC Files

This service function converts the files specified as specified.

The result is an array of the target file paths as parsed from the conversion.  
Currently only converting FLAC files to WAV files is supported (tested).

```
// note that the options here are actually the defaults so you can omit them

// TYPESCRIPT (async)
const convertedFiles = await shntool.convert('prefix-*.wav', { dir: '.' });


// JAVASCRIPT (Promise)
shntool.convert('prefix-*.wav', { dir: '.' }).then(
  function(convertedFiles) {
    // convertedFiles is an array of file paths (the target files)
  }
).catch( (err) => { 
  // handle error
});
```

## License

This module itself is MIT licensed. Feel free.
The 'shntool' and its helper applications have their own licenses.
