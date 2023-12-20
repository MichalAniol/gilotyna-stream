const box = (function () {
    const { context, view } = init


    const draw = () => {
        const { x, y, width, height } = view.box

        const gradient: CanvasGradient = context.createLinearGradient(x + width, y, x, y + height)
        gradient.addColorStop(0, data.box.colors[0])
        gradient.addColorStop(.2, data.box.colors[1])
        gradient.addColorStop(.55, data.box.colors[2])
        gradient.addColorStop(.8, data.box.colors[3])
        gradient.addColorStop(1, data.box.colors[4])

        context.fillStyle = gradient
        context.fillRect(x, 0, view.centerWidth - x, height + y)
        context.fillRect(view.centerWidth, y, x + width - view.centerWidth, height)
    }

    return {
        draw,
    }
}())