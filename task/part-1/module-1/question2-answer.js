/* 
    改进为promise代码
*/

const p1 = function () {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('hello ')
        }, 1000)
    })
}

const p2 = function (value) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value + 'lagou ')
        }, 1000)
    })
}

const p3 = function (value) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value + 'i love you')
        }, 1000)
    })
}

p1().then(value => {
    return p2(value)
}).then(value => {
    return p3(value)
}).then(value => {
    console.log(value)
})