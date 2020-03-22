'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');

process.argv = ['node', 'index.js', './test/integration/input-test.txt'];

describe('Index', () => {
  const sandbox = sinon.createSandbox();
  before(function() {
    sandbox.stub(console, 'log');
  });
  afterEach(() => {
    sandbox.reset();
  });
  after(() => {
    sandbox.restore();
  });

  it('should print final position of each mowers', () => {
    require('../../index.js');

    expect(console.log.getCall(0).args[0]).to.equals('1 3 N => GAGAAAGA => 1 0 E');
    expect(console.log.getCall(1).args[0]).to.equals('2 3 E => AADDAGA => 3 2 S');
  });

  it('should throw if first argument is not a path', () => {
    process.argv = ['node', 'index.js', 'notAPath'];
    // Force reload module
    delete require.cache[require.resolve('../../index.js')];
    const indexThatWillThrow = () => require('../../index.js');
    expect(indexThatWillThrow).to.throw(Error, 'Please give a path to the input file as first argument.');
  });
});
