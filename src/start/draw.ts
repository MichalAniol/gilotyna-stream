const draw = (function () {
    const { context, view } = init

    const drawLeftPart = () => {
        const gradient = context.createLinearGradient(0, view.centerHeight, view.centerWidth, view.centerHeight)
        data.left.background.color.forEach((e: [number, string]) => {
            gradient.addColorStop(e[0] / 100, e[1])
        })

        context.fillStyle = gradient
        context.fillRect(0, 0, view.centerWidth, view.height)
    }

    const drawRightPart = () => {
        const gradient = context.createLinearGradient(view.centerWidth, 0, view.width, view.height)
        data.right.background.color.forEach((e: [number, string]) => {
            gradient.addColorStop(e[0] / 100, e[1])
        })

        context.fillStyle = gradient
        context.fillRect(view.centerWidth, 0, view.width, view.height)
    }

    const draw = () => {
        drawLeftPart()
        drawRightPart()
        if (data.left.wave.enable) wave.drawLeft()
        if (data.right.wave.enable) wave.drawRight()
        if (data.left.dots.enable) dots.draw()
        if (data.box.enable) box.draw()
        text.draw()
        startText.draw()
    }
    draw()

    setInterval(draw, Math.round(1000 / data.global.speed))

    return {

    }
}())