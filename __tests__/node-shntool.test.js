
var path = require('path');
var fs = require('fs');

var shntool = require('../dist');

var DATA_DIR = './__tests__/data';

describe('verify module supoprts features', () => {
  it('.cuefile function exists', () => {
    expect.assertions(1);
    expect(shntool.cuefile).toBeTruthy();
  });

  it('.joined function exists', () => {
    expect.assertions(1);
    expect(shntool.joined).toBeTruthy();
  });

  it('.audiofiles function exists', () => {
    expect.assertions(1);
    expect(shntool.audiofiles).toBeTruthy();
  });
});

describe('test utility methods', () => {
  beforeAll(() => {
    unlinkFile('joined.wav');
    unlinkFile('FLACTEST.wav');
  });

  it('verify testdata audio files exist', async () => {
    expect.assertions(1);
    return shntool.audiofiles(DATA_DIR + '/gd*').then(
      (files) => {
        expect(files.length).toEqual(4);
      }
    )
  });

  it('verify cuefile can be created', async () => {
    expect.assertions(4);
    var cuefile = await shntool.cuefile(DATA_DIR + '/*.wav');
    expect(cuefile[0]).toContain('joined.wav');
    expect(cuefile[1]).toContain('TRACK 01 AUDIO');
    expect(cuefile[2]).toContain('INDEX 01 0:00:00');
    expect(cuefile[8]).toContain('INDEX 01 1:43:09');
  });

  it('verify joined file can be created', async () => {
    expect.assertions(1);
    var joinedFile = await shntool.joined(DATA_DIR + '/*.wav', {
      dir: DATA_DIR
    });
    expect(joinedFile).toEqual(path.normalize(path.join(DATA_DIR, 'joined.wav')));
  });

  it('verify converted wav file can be created', async () => {
    expect.assertions(2);
    var convertedFiles = await shntool.convert(DATA_DIR + '/FLACTEST.flac', { 
      fmt: 'wav'
    });
    expect(convertedFiles.length).toEqual(1);
    expect(convertedFiles[0]).toEqual(DATA_DIR + '/FLACTEST.wav');
  });

});

function unlinkFile(f) {
  var filepath = path.join(DATA_DIR, f);
  try {
    var stats = fs.statSync(filepath);
    if (stats.isFile()) {
      fs.unlinkSync(filepath);
    }
  } catch (e) {
    var msg = e.message;
    console.log(`Ignoring unlink: ${msg}`);
  }
}
