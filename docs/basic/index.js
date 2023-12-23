const data = {
    global: {
        speed: 30
    },
    left: {
        background: {
            color: [
                [0, '#cbdeba'],
                [100, '#fba976'],
            ]
        },
        wave: {
            enable: true,
            direction: 'left',
            frames: 3700,
            color: '#e2562d',
            shape: {
                length: 3.5,
                points: [
                    [0, 50],
                    [20, 110],
                    [40, 0],
                    [60, 30],
                    [80, -50],
                ],
            }
        },
        dots: {
            enable: true,
            frames: 1900,
            quantity: 80,
            color: '#658fa8',
            field: [100, 65, 85],
            fold: {
                x: {
                    frames: 1700,
                    field: [100, 75, 90]
                },
                y: {
                    frames: 2300,
                    field: [100, 180, 280, 120, 170, 200]
                },
            }
        }
    },
    right: {
        background: {
            color: [
                [0, '#ff8469'],
                [50, '#ebb5a0'],
                [100, '#bfa881'],
            ]
        },
        text: {
            enable: true,
        },
        wave: {
            enable: true,
            direction: 'right',
            frames: 4300,
            color: '#4974af',
            shape: {
                length: 5.0,
                points: [
                    [0, 40],
                    [20, 110],
                    [37, 0],
                    [50, 30],
                    [64, -20],
                    [85, 80],
                ],
            }
        }
    },
    box: {
        enable: true,
        margin: {
            left: 9.83,
            top: 8.6,
            right: 13.08,
            bottom: 8.2,
        },
        colors: [
            [0, '#4974af33'],
            [20, '#fba97644'],
            [55, '#fba97666'],
            [80, '#ff846944'],
            [100, '#4974af1a'],
        ],
    },
};
const init = (function () {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext("2d");
    const view = {
        width: 0,
        height: 0,
        centerWidth: 0,
        centerHeight: 0,
        leftWave: null,
        rightWave: null,
        dots: null,
        box: null,
    };
    const resize = () => {
        view.width = window.innerWidth;
        view.height = window.innerHeight;
        view.centerWidth = view.width / 2;
        view.centerHeight = view.height / 2;
        canvas.width = view.width;
        canvas.height = view.height;
        {
            const length = view.centerWidth * data.left.wave.shape.length;
            const move = length / data.left.wave.frames;
            const startX = data.left.wave.direction === 'left' ? 0 : -length;
            const gradient = context.createLinearGradient(view.width * .5, 0, view.width * .45, view.centerHeight);
            gradient.addColorStop(0, `${data.left.wave.color}ff`);
            gradient.addColorStop(1, `${data.left.wave.color}00`);
            view.leftWave = {
                points: data.left.wave.shape.points,
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
            };
        }
        {
            const length = view.centerWidth * data.right.wave.shape.length;
            const move = length / data.right.wave.frames;
            const startX = (data.right.wave.direction === 'left' ? 0 : -length) + view.centerWidth;
            const gradient = context.createLinearGradient(view.width, view.height * .4, view.width * .8, view.height * .9);
            gradient.addColorStop(0, `${data.right.wave.color}ff`);
            gradient.addColorStop(1, `${data.right.wave.color}00`);
            view.rightWave = {
                points: data.right.wave.shape.points,
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
            };
        }
        {
            const diameter = (view.centerWidth / data.left.dots.quantity);
            const radius = diameter / 2;
            const quantityY = Math.ceil(view.centerHeight / diameter);
            const field = data.left.dots.field;
            field.push(field[0]);
            const foldX = data.left.dots.fold.x.field;
            foldX.push(foldX[0]);
            const foldY = data.left.dots.fold.y.field;
            foldY.push(foldY[0]);
            view.dots = {
                diameter,
                radius,
                quantity: { x: data.left.dots.quantity, y: quantityY },
                start: { x: radius, y: view.height - ((quantityY * diameter) - radius) },
                field,
                fields: { x: foldX, y: foldY },
                fold: { x: 1 / data.left.dots.quantity, y: 1 / quantityY },
                move: view.centerWidth / data.left.dots.frames,
            };
        }
        {
            view.box = {
                x: view.width * (data.box.margin.left / 100),
                y: view.height * (data.box.margin.top / 100),
                width: view.width * ((100 - data.box.margin.left - data.box.margin.right) / 100),
                height: view.height * ((100 - data.box.margin.top - data.box.margin.bottom) / 100),
            };
        }
    };
    window.onresize = resize;
    resize();
    return {
        context,
        view,
    };
}());
const wave = (function () {
    const { context, view } = init;
    const drawWave = (wave, index) => {
        const { points, start, clip, width, height, length, ratio, centerHeight, gradient, move } = wave;
        const getPoint = (point) => ({
            x: (point[0] * ratio.x) + start.x + (move * index),
            y: -(point[1] * ratio.y) + start.y + centerHeight
        });
        context.save();
        const clipRect = new Path2D();
        clipRect.rect(clip.x, clip.y, clip.width, clip.height);
        context.clip(clipRect);
        const region = new Path2D();
        const startPoint = getPoint(points[0]);
        region.moveTo(startPoint.x, startPoint.y);
        const drawBezier = (movePhase) => {
            points.forEach((e, i, arr) => {
                const firstPoint = getPoint(e);
                const nextElem = i < arr.length - 1 ? arr[i + 1] : [100, arr[0][1]];
                const secondPoint = getPoint(nextElem);
                const middleXPoint = ((firstPoint.x + secondPoint.x) / 2) + movePhase;
                region.bezierCurveTo(middleXPoint, firstPoint.y, middleXPoint, secondPoint.y, secondPoint.x + movePhase, secondPoint.y);
            });
        };
        drawBezier(0);
        drawBezier(length);
        region.lineTo(clip.x + width, clip.y + clip.height);
        region.lineTo(clip.x, clip.y + clip.height);
        region.closePath();
        context.fillStyle = gradient;
        context.fill(region);
        context.restore();
    };
    let leftWaveIndex = 0;
    const drawLeft = () => {
        drawWave(view.leftWave, leftWaveIndex);
        leftWaveIndex += 1;
        if (leftWaveIndex > data.left.wave.frames)
            leftWaveIndex = 0;
    };
    let rightWaveIndex = 0;
    const drawRight = () => {
        drawWave(view.rightWave, rightWaveIndex);
        rightWaveIndex += 1;
        if (rightWaveIndex > data.right.wave.frames)
            rightWaveIndex = 0;
    };
    return {
        drawLeft,
        drawRight,
    };
}());
const dots = (function () {
    const { context, view } = init;
    const endAngle = 2 * Math.PI;
    const anglePlus90 = Math.PI / 2;
    const angleMinus90 = -anglePlus90;
    const getVirtualValue = (arr, size, index) => {
        const lengthA = arr.length;
        const lengthB = size + 1;
        if (lengthA === 0 || index < 0) {
            return null;
        }
        const stepA = (lengthA - 1) / lengthB;
        const indexA = Math.floor(index * stepA);
        const stepB = lengthB / (lengthA - 1);
        if (indexA < lengthA) {
            const firsNum = arr[indexA];
            const secondNum = arr[indexA + 1];
            const indexPart = index % stepB;
            const deference = firsNum - secondNum;
            const sin = (((indexPart / stepB) * 2) - 1) * anglePlus90;
            const ratio = ((Math.sin(sin)) + 1) / 2;
            return (firsNum - (deference * ratio));
        }
        return arr[lengthA - 1];
    };
    const getHex = (num) => {
        if (num < 0) {
            return "00";
        }
        else if (num > 255) {
            return "ff";
        }
        else {
            const hexString = num.toString(16).padStart(2, '0');
            return hexString;
        }
    };
    let dotsIndex = 0;
    let foldXIndex = 0;
    let foldYIndex = 0;
    const ratioFoo = (index) => getVirtualValue(view.dots.field, data.left.dots.frames, index);
    const ratioXFoo = (index) => getVirtualValue(view.dots.fields.x, data.left.dots.fold.x.frames, index);
    const ratioYFoo = (index) => getVirtualValue(view.dots.fields.y, data.left.dots.fold.y.frames, index);
    const draw = () => {
        const { diameter, radius, quantity, start, fold } = view.dots;
        const move = ratioFoo(dotsIndex);
        const ratioX = ratioXFoo(foldXIndex) / 100;
        const ratioY = ratioYFoo(foldYIndex);
        for (let x = 0; x < quantity.x; ++x) {
            const startOpacity = (Math.sin((endAngle / ratioY) * (x + move)) + 1) / 2;
            for (let y = 0; y < quantity.y; ++y) {
                const opacity = Math.floor((startOpacity - (2 - ratioX - ((fold.y) * y))) * 256);
                const hex = getHex(opacity);
                const color = data.left.dots.color + hex;
                context.fillStyle = color;
                context.beginPath();
                context.arc(start.x + (x * diameter), start.y + (y * diameter), radius, 0, endAngle);
                context.fill();
            }
        }
        dotsIndex += 1;
        if (dotsIndex > data.left.dots.frames)
            dotsIndex = 0;
        foldXIndex += 1;
        if (foldXIndex > data.left.dots.fold.x.frames)
            foldXIndex = 0;
        foldYIndex += 1;
        if (foldYIndex > data.left.dots.fold.y.frames)
            foldYIndex = 0;
    };
    return {
        draw,
    };
}());
const box = (function () {
    const { context, view } = init;
    const draw = () => {
        const { x, y, width, height } = view.box;
        const gradient = context.createLinearGradient(x + width, y, x, y + height);
        data.box.colors.forEach((e) => {
            gradient.addColorStop(e[0] / 100, e[1]);
        });
        context.fillStyle = gradient;
        context.fillRect(x, 0, view.centerWidth - x, height + y);
        context.fillRect(view.centerWidth, y, x + width - view.centerWidth, height);
    };
    return {
        draw,
    };
}());
const text = (function () {
    const textElem = document.getElementById('title');
    const draw = () => {
        if (!data.right.text.enable) {
            textElem.style.display = 'none';
        }
    };
    return {
        draw,
    };
}());
const draw = (function () {
    const { context, view } = init;
    const drawLeftPart = () => {
        const gradient = context.createLinearGradient(0, view.centerHeight, view.centerWidth, view.centerHeight);
        data.left.background.color.forEach((e) => {
            gradient.addColorStop(e[0] / 100, e[1]);
        });
        context.fillStyle = gradient;
        context.fillRect(0, 0, view.centerWidth, view.height);
    };
    const drawRightPart = () => {
        const gradient = context.createLinearGradient(view.centerWidth, 0, view.width, view.height);
        data.right.background.color.forEach((e) => {
            gradient.addColorStop(e[0] / 100, e[1]);
        });
        context.fillStyle = gradient;
        context.fillRect(view.centerWidth, 0, view.width, view.height);
    };
    const draw = () => {
        drawLeftPart();
        drawRightPart();
        if (data.left.wave.enable)
            wave.drawLeft();
        if (data.right.wave.enable)
            wave.drawRight();
        if (data.left.dots.enable)
            dots.draw();
        if (data.box.enable)
            box.draw();
        text.draw();
    };
    draw();
    setInterval(draw, Math.round(1000 / data.global.speed));
    return {};
}());
(function () {
}());
