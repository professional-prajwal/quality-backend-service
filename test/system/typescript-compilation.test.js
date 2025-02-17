const { exec } = require('child_process'),
  expect = require('chai').expect;

describe('TypeScript compilation', function () {
  it('should not have any errors', function (done) {
    exec('npm run build', (error, stdout, stderror) => {
      stdout && console.info('\n' + stdout + '\n\n');
      stderror && console.error('\n' + stderror + '\n\n');
      expect(error).to.be.null;

      done();
    });
  }, 1e4);
});

