export const partial = (fn, ...args) => fn.bind(null, ...args)

//pipe takes 2 functions, f and g
//returns another function
const _pipe = (f, g) => (...args) => g(f(...args))

export const pipe = (...fns) => fns.reduce(_pipe)
