const box = (function () {
    const { context, view } = init


    const draw = () => {
        const { x, y, width, height } = view.box

        const gradient: CanvasGradient = context.createLinearGradient(x + width, y, x, y + height)
        data.box.colors.forEach((e: [number, string]) => {
            gradient.addColorStop(e[0] / 100, e[1])
        })

        context.fillStyle = gradient
        context.fillRect(x, 0, view.centerWidth - x, height + y)
        context.fillRect(view.centerWidth, y, x + width - view.centerWidth, height)
    }

    return {
        draw,
    }
}())