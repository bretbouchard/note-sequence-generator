export const arrayToString = (arr: (number | string)[]) => arr.join(',')
export const stringToArray = (str: string) => str.split(',').map(Number)
export const objectToString = (obj: object) => JSON.stringify(obj)
export const stringToObject = (str: string) => JSON.parse(str) 