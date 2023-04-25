const R = require('ramda');
const sizeInKB = require('./kbsize.js');

const REPLACE_WITH = '...';

const limitObjectSize = (obj, maxKBytes) => {
  if (obj === null || typeof obj !== 'object' || R.isEmpty(obj)) return {};

  // Get the current size of the object
  const initialSize = sizeInKB(JSON.stringify(obj));

  // Check if the object is already within the byte limit
  if (initialSize <= maxKBytes) {
    return obj;
  }

  let propsBySize = getSize('', obj);

  // Sort the object properties by size
  propsBySize.sort((a, b) => b[1] - a[1]);

  // Remove the largest attributes until the object is within the byte limit
  let trimmedObj = R.clone(obj);
  let newSize = initialSize;
  for (const [key, size] of propsBySize) {
    const pathName = key.split('.').map(JSON.parse);
    const valueEval = JSON.stringify(R.path(pathName, trimmedObj));
    const keyEval = JSON.stringify(key);
    let removedSize = 0;
    if (sizeInKB(valueEval) > sizeInKB(keyEval)) {
      // remove the value
      removedSize = sizeInKB(JSON.stringify({
        [R.last(pathName)]: R.path(pathName, trimmedObj)
      }));
      removedSize = removedSize - sizeInKB(JSON.stringify({
        [R.last(pathName)]: REPLACE_WITH,
      }));
      trimmedObj = R.modifyPath(pathName, e => REPLACE_WITH, trimmedObj);
    } else {
      // remove the name
      trimmedObj = R.dissocPath(pathName, trimmedObj);
      removedSize = size;
    }
    newSize = newSize - removedSize;
    if (newSize <= maxKBytes) {
      break;
    }
  }
  return trimmedObj;
}

const getSize  = (parent, obj) => {
  let returnValue = [];
  if (obj === null || typeof obj !== 'object' || R.isEmpty(obj)) return returnValue;
  Object.entries(obj).forEach(([attributeParam, value]) => {
    if (Array.isArray(obj)) {
      attribute = attributeParam;
    } else {
      attribute = `"${attributeParam}"`;
    }
    const descriptor = [parent, attribute].filter(e => e !== '').join('.');
    if (typeof value === 'object') {
      returnValue = returnValue.concat(getSize(descriptor, value));
    } else {
      returnValue.push([descriptor, sizeInKB(JSON.stringify(descriptor + value))])
    }
  });
  return returnValue;
}

module.exports =  { limitObjectSize, sizeInKB };
