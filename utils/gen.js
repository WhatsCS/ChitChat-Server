/**
 * General utilities file, just a collection of small functions for everyone to use.
 * @module utils/general
 */

/**
 * @desc converts sequelize models to their json format
 * @param {sequelize.Model} model
 * @returns {object | array<object>}
 */
exports.modelToJSON = (model) => {
  if (model.length === 1) {
    const ret = model[0].toJSON()
    return ret
  }
  const usrList = []
  for (const ele of model) {
    usrList.push(ele.toJSON())
  }
  return usrList
}
