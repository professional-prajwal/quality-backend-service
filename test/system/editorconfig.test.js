/**
 * @fileOverview Ensures that editorconfig settings are appropriate
 */

const path = require('path'),

  expect = require('chai').expect,
  editorconfig = require('editorconfig'),

  /**
   * The width (in spaces) of tabs used for indentation throughout the project
   *
   * @type {Number}
   */
  TAB_WIDTH = 2,
  PROJECT_ROOT = path.join(__dirname, '..', '..');

describe('.editorconfig', function () {
  const config = editorconfig.parseSync(path.join(PROJECT_ROOT, '.editorconfig')); // eslint-disable-line no-sync

  it(`should have a tab_width of ${TAB_WIDTH}`, function () {
    expect(config.tab_width).to.equal(TAB_WIDTH);
  });

  it('should have a charset of utf-8', function () {
    expect(config.charset).to.equal('utf-8');
  });

  it(`should have an indent_size of ${TAB_WIDTH}`, function () {
    expect(config.indent_size).to.equal(TAB_WIDTH);
  });

  it('should have an indent_style of space', function () {
    expect(config.indent_style).to.equal('space');
  });

  it('should have a truthy insert_final_newline value', function () {
    expect(config.insert_final_newline).to.equal(true);
  });

  it('should have a truthy trim_trailing_whitespace', function () {
    expect(config.trim_trailing_whitespace).to.equal(true);
  });
});
