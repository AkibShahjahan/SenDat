var uniqueCourseCode = function(arr, obj) {
  var len = arr.length;
  for(var i = 0; i < len; i++) {
    if (arr[i].title === obj.coursecode) {
        return false;
    }
  }
  return true;
}

module.exports = {
  uniqueCourseCode: uniqueCourseCode
}
