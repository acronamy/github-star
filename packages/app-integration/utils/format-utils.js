module.exports = {
    /**
   * Detect if a number is positve or negative
   * @param {*} number 
   */
    isUnsigned(n) {
        return /^\+?(0|[1-9]\d*)$/.test((n).toString());
    },
}