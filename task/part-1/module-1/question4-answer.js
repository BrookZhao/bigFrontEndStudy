const { Container, Maybe } = require('./functor.js')
const { add, map, first, 
    curry } = require('lodash/fp')

// 一个能让functor里的值增加的函数
let maybe = Maybe.of([5, 6, 1])
const ex1 = (num) => {
    return function (value) {
        return map(add(num), value)
    }
}
console.log(maybe.map(ex1(3)))

// 获取列表的第一个元素
let xs = Container.of(['do', 'ray', 'me', 
    'fa', 'so', 'la', 'ti', 'do'])
let ex2 = () => {
    return function (value) {
        return first(value)
    }
}
console.log(xs.map(ex2()))

// 找到user的名字的首字母
let safeProp = curry(function (x, o) {
    return Maybe.of(o[x])
})
let user = {
    id: 2,
    name: 'Albert'
}
let ex3 = (key) => {
    return safeProp(key)(user).map(first)
}
console.log(ex3('name'))

// 使用Maybe重写ex4
let ex4 = function (n) {
    if (n) {
        return parseInt(n)
    }
}

let ex4Maybe = function (n) {
    return Maybe.of(n).map(parseInt)
}

console.log(ex4Maybe('5'))