export const checkEqualityOfDataObjects = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

export const deepCopyOfDataObject = obj => JSON.parse(JSON.stringify(obj));
