'use strict';

const fs = require('fs');
const orientations = require('./constant/orientation');
const movements = require('./constant/movement');
const rotations = require('./constant/rotation');

function readFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const rawSplitted = raw.split('\n');
  // Remove empty lines
  const rawTrimmed = rawSplitted.filter(Boolean);
  if (rawTrimmed.length % 2 === 0) {
    throw new Error('The file format is not correct, each mower line must have instructions line');
  }

  const mowers = [];
  const lawn = readLawn(rawTrimmed[0]);

  for (let i = 1; i < rawTrimmed.length - 1; i += 2) {
    const mower = readMower(rawTrimmed[i]);
    const instructions = readMowerInstructions(rawTrimmed[i + 1]);
    mowers.push({ ...mower, instructions });
  }

  return { lawn, mowers };
}

function readLawn(string) {
  const lawnRegex = /^(\d+) (\d+)$/;
  const [, limitX, limitY] = lawnRegex.exec(string) || [];
  if (!limitX || !limitY) {
    throw new Error('The file format is not correct, cannot parse the limit of the lawn');
  }
  return { limitX: parseInt(limitX, 10), limitY: parseInt(limitY, 10) };
}

function readMower(string) {
  const orientationsRegex = `[${orientations.map(orientation => orientation.label).join('')}]`;
  const mowerRegex = new RegExp(`^(\\d+) (\\d+) (${orientationsRegex})$`);
  const [, posX, posY, orientationLabel] = mowerRegex.exec(string) || [];
  if (!posX || !posY || !orientationLabel) {
    throw new Error('The file format is not correct, cannot parse mower');
  }
  return { posX: parseInt(posX, 10), posY: parseInt(posY, 10), orientationLabel };
}

function readMowerInstructions(string) {
  const instructionsRegex = new RegExp(`^([${Object.keys(movements).join('') + Object.keys(rotations).join('')}]+)$`);
  const [, ...instructions] = instructionsRegex.exec(string) || [];
  if (!instructions || instructions.length === 0) {
    throw new Error('The file format is not correct, cannot parse mower instruction');
  }
  return instructions[0].split('');
}

module.exports = { readFile, readLawn, readMower, readMowerInstructions };
