type Coords = { x: number, y: number }
type Point = [number, number]
type Points = Point[]
type Rect = { x: number, y: number, width: number, height: number }

type Wave = {
    points: Points,
    start: Coords,
    clip: Rect,
    width: number,
    height: number,
    length: number,
    ratio: Coords,
    centerHeight: number,
    color: string,
    gradient: CanvasGradient,
    move: number,
}

type Dots = {
    diameter: number,
    radius: number,
    quantity: Coords,
    start: Coords,
    fields: { x: number[], y: number[] },
    field: number[],
    fold: Coords,
    move: number
}

type Box = {
    x: number,
    y: number,
    width: number,
    height: number,
}

type View = {
    width: number,
    height: number,
    centerWidth: number,
    centerHeight: number,
    leftWave: Wave | null,
    rightWave: Wave | null,
    dots: Dots | null,
    box: Box | null,
}

const init = (function () {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const context: CanvasRenderingContext2D = canvas.getContext("2d")

    const view: View = {
        width: 0,
        height: 0,
        centerWidth: 0,
        centerHeight: 0,
        leftWave: null,
        rightWave: null,
        dots: null,
        box: null,
    }

    const resize = () => {
        view.width = window.innerWidth
        view.height = window.innerHeight
        view.centerWidth = view.width / 2
        view.centerHeight = view.height / 2

        canvas.width = view.width
        canvas.height = view.height

        {
            const length = view.centerWidth * data.left.wave.shape.length
            const move = length / data.left.wave.frames
            const startX = data.left.wave.direction === 'left' ? 0 : -length

            const gradient: CanvasGradient = context.createLinearGradient(view.width * .5, 0, view.width * .45, view.centerHeight)
            gradient.addColorStop(0, `${data.left.wave.color}ff`)
            gradient.addColorStop(1, `${data.left.wave.color}00`)

            view.leftWave = {
                points: data.left.wave.shape.points as Points,
                start: { x: startX, y: 0 },
                clip: { x: 0, y: 0, width: view.centerWidth, height: view.height * .7 },
                width: view.centerWidth,
                height: view.centerHeight,
                length: length,
                ratio: { x: length / 100, y: (view.centerHeight) / 200 },
                centerHeight: view.centerHeight / 2,
                color: data.left.wave.color,
                gradient: gradient,
                move: data.left.wave.direction === 'left' ? -move : move,
            }
        }

        {
            const length = view.centerWidth * data.right.wave.shape.length
            const move = length / data.right.wave.frames
            const startX = (data.right.wave.direction === 'left' ? 0 : -length) + view.centerWidth

            const gradient: CanvasGradient = context.createLinearGradient(view.width, view.height * .4, view.width * .8, view.height * .9)
            gradient.addColorStop(0, `${data.right.wave.color}ff`)
            gradient.addColorStop(1, `${data.right.wave.color}00`)

            view.rightWave = {
                points: data.right.wave.shape.points as Points,
                start: { x: startX, y: view.centerHeight },
                clip: { x: view.centerWidth, y: view.height * .4, width: view.centerWidth, height: view.height * .6 },
                width: view.centerWidth,
                height: view.centerHeight,
                length: length,
                ratio: { x: length / 100, y: (view.centerHeight) / 200 },
                centerHeight: view.centerHeight / 2,
                color: data.right.wave.color,
                gradient: gradient,
                move: data.right.wave.direction === 'left' ? -move : move,
            }
        }

        {
            const diameter = (view.centerWidth / data.left.dots.quantity)
            const radius = diameter / 2
            const quantityY = Math.ceil(view.centerHeight / diameter)
            const field = data.left.dots.field
            field.push(field[0])
            const foldX = data.left.dots.fold.x.field
            foldX.push(foldX[0])
            const foldY = data.left.dots.fold.y.field
            foldY.push(foldY[0])

            view.dots = {
                diameter,
                radius,
                quantity: { x: data.left.dots.quantity, y: quantityY },
                start: { x: radius, y: view.height - ((quantityY * diameter) - radius) },
                field,
                fields: { x: foldX, y: foldY },
                fold: { x: 1 / data.left.dots.quantity, y: 1 / quantityY },
                move: view.centerWidth / data.left.dots.frames,
            }
        }

        {
            view.box = {
                x: view.width * (data.box.margin.left / 100),
                y: view.height * (data.box.margin.top / 100),
                width: view.width * ((100 - data.box.margin.left - data.box.margin.right) / 100),
                height: view.height * ((100 - data.box.margin.top - data.box.margin.bottom) / 100),
            }
        }
    }
    window.onresize = resize
    resize()

    return {
        context,
        view,
    }
}())