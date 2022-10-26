module.exports = function (source) {
  const json = JSON.stringify(source)
  .replace('John', 'John Bull')
  return `export default ${json}`
}