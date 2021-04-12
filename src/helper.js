export const getRandomArr = (arr, count) => {
    if (count > arr.length) {
        return arr
    }
    let shuffled = arr.slice(0)
    let i = arr.length
    let min = i - count
    while (i-- > min) {
        let index = Math.floor((i + 1) * Math.random())
        let temp = shuffled[index];
        shuffled[index] = shuffled[i]
        shuffled[i] = temp
    }
    return shuffled.slice(min)
}