const draw = (function () {
    const { context, view } = init

    const drawLeftPart = () => {
        const gradient = context.createLinearGradient(0, view.centerHeight, view.centerWidth, view.centerHeight)
        gradient.addColorStop(0, data.left.background.colorLeft)
        gradient.addColorStop(1, data.left.background.colorRight)

        context.fillStyle = gradient
        context.fillRect(0, 0, view.centerWidth, view.height)
    }

    const drawRightPart = () => {
        const gradient = context.createLinearGradient(view.centerWidth, 0, view.width, view.height)
        gradient.addColorStop(0, data.right.background.colorLeft)
        gradient.addColorStop(.5, data.right.background.colorCenter)
        gradient.addColorStop(1, data.right.background.colorRight)

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
    }
    draw()

    setInterval(draw, Math.round(1000 / data.global.speed))

    return {

    }
}())