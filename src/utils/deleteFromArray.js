export default (arr, deleteItem) => {
  const index = arr.indexOf(deleteItem);

  if (index > -1) {
    const newArr = [...arr];
    newArr.splice(index, 1);

    return newArr;
  }

  return arr;
};
