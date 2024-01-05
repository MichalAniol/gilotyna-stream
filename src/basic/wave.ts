const wave = (function () {
    const { context, view } = init

    const drawWave = (wave: Wave, index: number) => {
        const { points, start, clip, width, height, length, ratio, centerHeight, gradient, move } = wave

        const getPoint = (point: Point) => ({
            x: (point[0] * ratio.x) + start.x + (move * index),
            y: -(point[1] * ratio.y) + start.y + centerHeight
        })

        context.save()
        const clipRect = new Path2D()
        clipRect.rect(clip.x, clip.y, clip.width, clip.height)
        context.clip(clipRect)

        const region = new Path2D()
        const startPoint = getPoint(points[0] as Point)

        region.moveTo(startPoint.x, startPoint.y)

        const drawBezier = (movePhase: number) => {
            points.forEach((e: Point, i: number, arr: Points) => {
                const firstPoint = getPoint(e)
                const nextElem: Point = i < arr.length - 1 ? arr[i + 1] : [100, arr[0][1]]
                const secondPoint = getPoint(nextElem)
                const middleXPoint = ((firstPoint.x + secondPoint.x) / 2) + movePhase

                region.bezierCurveTo(
                    middleXPoint, firstPoint.y,
                    middleXPoint, secondPoint.y,
                    secondPoint.x + movePhase, secondPoint.y
                )
            })
        }

        drawBezier(0)
        drawBezier(length)

        region.lineTo(clip.x + width, clip.y + clip.height)
        region.lineTo(clip.x, clip.y + clip.height)
        region.closePath()

        context.fillStyle = gradient
        context.fill(region)

        context.restore()
    }

    let leftWaveIndex = 0
    const drawLeft = () => {
        drawWave(view.leftWave, leftWaveIndex)
        leftWaveIndex += 1
        if (leftWaveIndex > data.left.wave.frames) leftWaveIndex = 0
    }

    let rightWaveIndex = 0
    const drawRight = () => {
        drawWave(view.rightWave, rightWaveIndex)
        rightWaveIndex += 1
        if (rightWaveIndex > data.right.wave.frames) rightWaveIndex = 0
    }

    return {
        drawLeft,
        drawRight,
    }
}())