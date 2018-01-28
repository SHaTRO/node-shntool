
var path = require('path');
var fs = require('fs');

var shntool = require('..');

var DATA_DIR = './__tests__/data';


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
  return shntool.cuefile(DATA_DIR + '/*.wav').then(
    (cuefile) => {
      expect(cuefile[0]).toContain('joined.wav');
      expect(cuefile[1]).toContain('TRACK 01 AUDIO');
      expect(cuefile[2]).toContain('INDEX 01 0:00:00');
      expect(cuefile[8]).toContain('INDEX 01 1:43:09');
    }
  ).catch( (e) => {
    console.log(e);
  });
});

it('verify joined file can be created', async () => {
  expect.assertions(1);

  return shntool.joined(DATA_DIR + '/*.wav', {
    dir : DATA_DIR
  }).then(
    (joinedFile) => {
      expect(joinedFile).toEqual(path.normalize(path.join(DATA_DIR, 'joined.wav')));
    }
  ).catch( (e) => {
    console.log(e);
  });
});
