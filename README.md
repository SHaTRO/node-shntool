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

### Running the tests

If you want you can run the test from the installed directory to make sure it works.

```
cd node_modules/node-shntool
npm test
```

## Code Examples

This is the first release of this interface, it is currently experimental.
It currently supports 'CUE file' generation and joining files.
The first argument to the promise calls is a string or list of strings used by the 'globby' module to locate the input files.
The second argument to the promise calls is any options for the function itself.

### Include the module

```
var shntool = require('shntool');
```

### CUE File Generation

The cuefile function is a promise.
The generated cue file result is an array of text lines.

```
shntool.cuefile('prefix-*.wav').then(
  function(cuelines) {
      // each line of the CUE lines is available here
      console.log(cuelines.join('\n'));
  }
);
```

### Create a Joined file

The joined function is a promise.
The file path of the created file is the result.

```
// note that the options here are actually the defaults so you can omit them
shntool.joined('prefix-*.wav', { destfile: 'joined.wav', dir: '.' }).then(
  function(joinedfile) {
    // the joinedfile is actually on the file system at this point
    // if you combine the CUE file with the joined file you can burn a CD
  }
);
```

## License

This module itself is MIT licensed. Feel free.
The 'shntool' and its helper applications have their own licenses.
