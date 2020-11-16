// 使用产量定义promis状态
const PENDDING = 'pedding'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

// promise类
class MyPromise {

    constructor (exector) {
        try {
            exector(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
        }
    }

    // promise的状态, 初始化为pendding
    status = PENDDING

    // 成功回调的返回
    value = undefined

    // 失败的原因
    reason = undefined

    // 用于存储then的多次回调, 以及异步调用
    successCallback = []

    // 用于存储失败的回调
    failCallback = []

    resolve = value => {
        // 首先判断状态是否为pendding, 
        // 如果不是pendding, 直接退出
        // 如果是pendding, 将状态修改为fulfilled
        if (this.status !== PENDDING) return
        this.status = FULFILLED
        this.value = value

        // 调用多次then传进来的successCallback
        while (this.successCallback.length) this.successCallback.shift()()
    }

    reject = reason => {
        // 首先判断状态是否为pendding, 
        // 如果不是pendding, 直接退出
        // 如果是pendding, 将状态修改为rejected
        if (this.status !== PENDDING) return
        this.status = REJECTED
        this.reason = reason

        while (this.failCallback.length) this.failCallback.shift()()
    }

    then = (successCallback, failCallback) => {
        // 但调用then不传递参数是依然可以链式调用
        successCallback = successCallback || (value => value)
        failCallback = failCallback || (reason => { throw reason })

        // then函数返回的promise, 用于链式调用
        const promise2 = new MyPromise((resolve, reject) => {
            if (this.status === FULFILLED) {
                // 成功的回调
                setTimeout(() => { // 这里用setTimeout是为了拿到promise2的实例
                    try { // 用于捕获successCallback执行过程中的异常
                        const x = successCallback(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            } else if (this.status === REJECTED) {
                // 失败的回调
                setTimeout(() => { // 这里用setTimeout是为了拿到promise2的实例
                    try { // 用于捕获failCallback执行过程中的异常
                        const x = failCallback(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            } else {
                // 异步的情况
                this.successCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = successCallback(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })

                this.failCallback.push(() => {
                    setTimeout(() => { 
                        try { 
                            const x = failCallback(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
            }
        })

        return promise2
    }

    catch = (failCallback) => {
        return this.then(undefined, failCallback)
    }

    finally (callback) {
        return this.then(value => {
            return MyPromise.resolve(callback()).then(() => value)
        }, reason => {
            return MyPromise.resolve(callback()).then(() => { throw reason })
        })
    }

    static all(array) {
        const result = []
        let index = 0

        return new MyPromise((resolve, reject) => {
            function addRes(key, value) {
                result[key] = value
                index++
                // 但最后一个元素加入之后返回结果
                if (index == array.length) {
                    resolve(result)
                }
            }

            for (let i = 0;i < array.length;i++) {
                if (array[i] instanceof MyPromise) {
                    // 第i项是promise的实例
                    array[i].then(value => {
                        addRes(i, value)
                    }, reason => {
                        reject(reason)
                    })
                } else {
                    // 不是promise的实例
                    addRes(i, array[i])
                }
            }
        })
    }

    static race(array) {
        return new MyPromise((resolve, reject) => {
            function addRes(value) {
                resolve(value)
            }
            for (let i = 0;i < array.length;i++) {
                if (array[i] instanceof MyPromise) {
                    array[i].then(value => {
                        addRes(value)
                    }, reason => {
                        reject(reason)
                    })
                } else {
                    addRes(array[i])
                }
            }
        })
    }

    static resolve(value) {
        // 判断传进来的值, 如果是MyPromise的实例, 就直接返回
        // 如果不是, 就返回一个新的promise, 
        // 并将传进来的value, 作为成功回调的参数
        if (value instanceof MyPromise) return value
        return new MyPromise(resolve => resolve(value))
    }

}

function resolvePromise(promise2, x, resolve, reject) {
    // 首先判断promise2于x是否相等, 如果相等直接退出
    // 否则判断x的类型, 
    if (promise2 === x) return reject(new TypeError('不被允许的循环调用'))
    if (x instanceof MyPromise) return x.then(resolve, reject)
    resolve(x)
}

module.exports = MyPromise