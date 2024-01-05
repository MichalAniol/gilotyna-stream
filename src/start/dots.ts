const dots = (function () {
    const { context, view } = init

    const endAngle = 2 * Math.PI

    const anglePlus90 = Math.PI / 2

    const getVirtualValue = (arr: number[], size: number, index: number) => {
        const lengthA = arr.length
        const lengthB = size + 1

        if (lengthA === 0 || index < 0) {
            return null
        }

        const stepA = (lengthA - 1) / lengthB
        const indexA = Math.floor(index * stepA)
        const stepB = lengthB / (lengthA - 1)

        if (indexA < lengthA) {
            const firsNum = arr[indexA]
            const secondNum = arr[indexA + 1]
            const indexPart = index % stepB
            const deference = firsNum - secondNum
            const sin = (((indexPart / stepB) * 2) - 1) * anglePlus90
            const ratio = ((Math.sin(sin)) + 1) / 2

            return (firsNum - (deference * ratio))
        }

        return arr[lengthA - 1]
    }

    // for (let i = 0; i < 40; i++) {
    // const res = getVirtualValue([100, 50, 70, 100], 1200, 1200)
    // console.log('%c res:', 'background: #ffcc00; color: #003300', 1200, res)
    // }

    const getHex = (num: number) => {
        if (num < 0) {
            return "00"
        } else if (num > 255) {
            return "ff"
        } else {
            const hexString = num.toString(16).padStart(2, '0');
            return hexString;
        }
    }

    let dotsIndex = 0
    let foldXIndex = 0
    let foldYIndex = 0

    const ratioFoo = (index: number) => getVirtualValue(
        view.dots.field,
        data.left.dots.frames,
        index
    )

    const ratioXFoo = (index: number) => getVirtualValue(
        view.dots.fields.x,
        data.left.dots.fold.x.frames,
        index
    )

    const ratioYFoo = (index: number) => getVirtualValue(
        view.dots.fields.y,
        data.left.dots.fold.y.frames,
        index
    )

    const draw = () => {
        const { diameter, radius, quantity, start, fold } = view.dots

        const move = ratioFoo(dotsIndex)
        const ratioX = ratioXFoo(foldXIndex) / 100
        const ratioY = ratioYFoo(foldYIndex)

        for (let x = 0; x < quantity.x; ++x) {
            const startOpacity = (Math.sin((endAngle / ratioY) * (x + move)) + 1) / 2
            for (let y = 0; y < quantity.y; ++y) {
                const opacity = Math.floor((startOpacity - (2 - ratioX - ((fold.y) * y))) * 256)
                const hex = getHex(opacity)
                const color = data.left.dots.color + hex
                context.fillStyle = color

                context.beginPath()
                context.arc(start.x + (x * diameter), start.y + (y * diameter), radius, 0, endAngle)
                context.fill()
            }
        }

        dotsIndex += 1
        if (dotsIndex > data.left.dots.frames) dotsIndex = 0

        foldXIndex += 1
        if (foldXIndex > data.left.dots.fold.x.frames) foldXIndex = 0

        foldYIndex += 1
        if (foldYIndex > data.left.dots.fold.y.frames) foldYIndex = 0
    }

    return {
        draw,
        getHex,
        anglePlus90,
    }
}())