export default (arr: Array<string | number | boolean>, deleteItem: string | number | boolean) => {
  const index = arr.indexOf(deleteItem);

  if (index > -1) {
    const newArr = [...arr];
    newArr.splice(index, 1);

    return newArr;
  }

  return arr;
};
