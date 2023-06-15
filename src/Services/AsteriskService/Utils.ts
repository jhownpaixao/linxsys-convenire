export const stringHasLength = function (line: any) {
  return line && line.length;
};

export const defaultCallback = (callback?: (...args: any[]) => void) => {
  return 'function' === typeof callback ? callback : (): undefined => undefined;
};

export const removeSpaces = function (string: string) {
  return (string || '').replace(/^\s*|\s*$/g, '');
};
