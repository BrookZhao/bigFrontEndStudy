/**
 * 基于代码的练习
 */
const datalist = [
    {
        "name": "Ferrari FF",
        "horsepower": 660,
        "dollar_value": 70000,
        "in_stock": true
    }, {
        "name": "Spyker C12 Zagato",
        "horsepower": 650,
        "dollar_value": 648000,
        "in_stock": false
    }, {
        "name": "Jaguar XKR-S",
        "horsepower": 550,
        "dollar_value": 132400,
        "in_stock": false
    }, {
        "name": "Audi R8",
        "horsepower": 525,
        "dollar_value": 114200,
        "in_stock": false
    }, {
        "name": "Aston Martin One-77",
        "horsepower": 750,
        "dollar_value": 1350000,
        "in_stock": true
    }, {
        "name": "Pagani Huayra",
        "horsepower": 700,
        "dollar_value": 1600000,
        "in _stock": false
    }
]
const { flowRight, prop, last, first, 
        map, reduce, add, replace, toLower, 
        forEach } = require('lodash/fp')

// 组合获取最后一条数据的in_stock
const f1 = flowRight(prop('in_stock'), last)
console.log(f1(datalist))

// 组合获取第一个car的name
const f2 = flowRight(prop('name'), first)
console.log(f2(datalist))

// 组合获取平均值
const _average = function (xs) {
    return reduce(add, 0, xs) / xs.length
}
const f3 = flowRight(_average, map(item => item["dollar_value"]))
console.log(f3(datalist))

// 组合获取字符串
const _underscore = replace(/\W+/g, '_')
const sanitizeNames = flowRight(_underscore, toLower)
forEach(item => item.name = sanitizeNames(item.name))(datalist)
console.log(datalist)