import diff from 'diff-sequences'

export const findCommonItems = (a: string, b: string) => {
  const array: string[] = [];
  diff(
    a.length,
    b.length,
    (aIndex, bIndex) => Object.is(a[aIndex], b[bIndex]),
    (nCommon, aCommon) => {
      for (; nCommon !== 0; nCommon -= 1, aCommon += 1) {
        array.push(a[aCommon]);
      }
    },
  );
  return array;
};