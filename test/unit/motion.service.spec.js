'use strict';
const expect = require('chai').expect;
const MotionService = require('../../lib/motion.service');

describe('Motion Service', () => {
  describe('move', () => {
    const { move } = MotionService(5, 5);

    it('should return new position if it do not cross limit', () => {
      const newPosition = move(2, 2, 'N', 'A');
      expect(newPosition).to.deep.equal({ posX: 2, posY: 3 });
    });

    it('should return the same position if it cross upper limit', () => {
      const newPosition = move(5, 5, 'N', 'A');
      expect(newPosition).to.deep.equal({ posX: 5, posY: 5 });
    });

    it('should return the same position if it cross lower limit', () => {
      const newPosition = move(0, 0, 'S', 'A');
      expect(newPosition).to.deep.equal({ posX: 0, posY: 0 });
    });

    it('should throw exception if orientationLabel is unknown', () => {
      const moveThatWillThrow = () => move(0, 0, 'wrongOrientation', 'A');
      expect(moveThatWillThrow).to.throw(Error, 'Cannot move, orientationLabel wrongOrientation is unknown.');
    });

    it('should throw exception if movementLabel is unknown', () => {
      const moveThatWillThrow = () => move(0, 0, 'N', 'wrongMovement');
      expect(moveThatWillThrow).to.throw(Error, 'Cannot move, movementLabel wrongMovement is unknown.');
    });
  });

  describe('rotate', () => {
    const { rotate } = MotionService(5, 5);

    it('should return new orientation based on rotation', () => {
      const newOrientationLabel1 = rotate('N', 'G');
      expect(newOrientationLabel1).to.equal('W');

      const newOrientationLabel2 = rotate('N', 'D');
      expect(newOrientationLabel2).to.equal('E');
    });

    it('should throw if orientationLabel is unknown', () => {
      const rotateThatWillThrow = () => rotate('wrongOrientation', 'D');
      expect(rotateThatWillThrow).to.throw(Error, 'Cannot rotate, orientationLabel wrongOrientation is unknown.');
    });

    it('should throw if rotationLabel is unknown', () => {
      const rotateThatWillThrow = () => rotate('N', 'wrongRotation');
      expect(rotateThatWillThrow).to.throw(Error, 'Cannot rotate, rotationLabel wrongRotation is unknown.');
    });
  });

  describe('perform', () => {
    const { perform } = MotionService(5, 5);

    it('should return final position based on instructions', () => {
      const finalPosition = perform(1, 3, 'N', ['A', 'G', 'A', 'D', 'A']);
      expect(finalPosition).to.deep.equal({ posX: 0, posY: 5, orientationLabel: 'N' });
    });

    it('should throw if instruction is not recognized', () => {
      const performThatWillThrow = () => perform(1, 3, 'N', ['A', 'F', 'A', 'D', 'A']);
      expect(performThatWillThrow).to.throw(Error);
    });
  });
});
