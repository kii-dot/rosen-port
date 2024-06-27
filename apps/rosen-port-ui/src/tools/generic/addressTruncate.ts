export const truncate = (str: string, len: number, sep: string) => {
  if (str.length < len) {
    return str;
  } else {
    return str.toString().substring(0, len / 2) + sep + str.toString().substring(str.length - len / 2, str.length);
  }
};
