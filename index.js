'use strict';

const path = require('path');
const { readFile } = require('./lib/read-file');
const MotionService = require('./lib/motion.service');
const args = process.argv.slice(2);
const filePath = args[0];

if (!filePath || filePath === path.basename(filePath)) {
  throw new Error('Please give a path to the input file as first argument.');
}

const { lawn, mowers } = readFile(filePath);
const { perform } = MotionService(lawn.limitX, lawn.limitY);
mowers.forEach(mower => {
  const { posX, posY, orientationLabel } = perform(mower.posX, mower.posY, mower.orientationLabel, mower.instructions);
  console.log(
    `${mower.posX} ${mower.posY} ${mower.orientationLabel} => ` +
      `${mower.instructions.join('')} => ` +
      `${posX} ${posY} ${orientationLabel}`,
  );
});
