'use strict';
const orientations = require('./constant/orientation');
const movements = require('./constant/movement');
const rotations = require('./constant/rotation');

function MotionService(limitX, limitY) {
  function move(posX, posY, orientationLabel, movementLabel) {
    const currentOrientation = orientations.find(o => o.label === orientationLabel);

    if (!currentOrientation) {
      throw new Error(`Cannot move, orientationLabel ${orientationLabel} is unknown.`);
    }

    if (!movements[movementLabel]) {
      throw new Error(`Cannot move, movementLabel ${movementLabel} is unknown.`);
    }

    const newPosX = (posX + currentOrientation.coefPosX) * movements[movementLabel].coefMultiplierPosition;
    const newPosY = (posY + currentOrientation.coefPosY) * movements[movementLabel].coefMultiplierPosition;

    if (newPosX < 0 || newPosX > limitX || newPosY < 0 || newPosY > limitY) {
      return { posX, posY };
    }

    return { posX: newPosX, posY: newPosY };
  }

  function rotate(orientationLabel, rotationLabel) {
    const orientationIndex = orientations.findIndex(o => o.label === orientationLabel);

    if (orientationIndex === -1) {
      throw new Error(`Cannot rotate, orientationLabel ${orientationLabel} is unknown.`);
    }

    if (!rotations[rotationLabel]) {
      throw new Error(`Cannot rotate, rotationLabel ${rotationLabel} is unknown.`);
    }

    const newOrientationIndex =
      (orientationIndex + rotations[rotationLabel].clockOrientationModifier + orientations.length) %
      orientations.length;
    return orientations[newOrientationIndex].label;
  }

  function perform(initialX, initialY, initialOrientationLabel, instructions) {
    let posX = initialX;
    let posY = initialY;
    let orientationLabel = initialOrientationLabel;
    for (const instruction of instructions) {
      if (movements[instruction]) {
        const newPosition = move(posX, posY, orientationLabel, instruction);
        posX = newPosition.posX;
        posY = newPosition.posY;
      }
      else if(rotations[instruction]){
        orientationLabel = rotate(orientationLabel, instruction);
      }
      else{
        throw new Error(`Unknown instruction ${instruction}, cannot perform movement`);
      }
    }
    return {posX,posY, orientationLabel };
  }

  return {
    move,
    rotate,
    perform,
  };
}

module.exports = MotionService;
