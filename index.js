const parser = require('./parser');

module.exports = (code, languageId) => {
  const tree = parser.parse(code, languageId);
  return JSON.parse(tree);
}