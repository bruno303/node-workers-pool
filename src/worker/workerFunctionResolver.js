/* eslint no-eval: 0 */

const evaluate = eval;

function resolve (method) {
  let func = null;
  try {
    func = evaluate(`(${method})`);
  } catch (err) { }
  return func;
}

module.exports = resolve;
