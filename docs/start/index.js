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
    startText: {
        distance: 5,
        numItems: 3,
        frames: 100,
    }
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
        svgText: null,
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
        {
            view.svgText = {
                scaleX: view.width / 205,
                scaleY: view.height / (205 * (1080 / 1920)),
                numItems: data.startText.numItems - 1,
                step: data.startText.distance / data.startText.frames,
                wholeDistance: data.startText.distance * data.startText.numItems
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
        getHex,
        anglePlus90,
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
const startText = (function () {
    const { context, view } = init;
    const p = new Path2D("M122.38.35a17.31 17.31 0 0 1 3.56.05h.53c.24 0 .54.04.76.07.28.04.39.08.67.34.25.23.6.68.85.95 1.06 1.14 2 2.25 3 3.41.49.58 1.08 1.32 1.56 1.9.32.38.6.75.91 1.14l1.25 1.59c.8 1.07 1.8 2.28 2.68 3.26.26.28.42.47.66.76.35.42.62.73.93 1.14.28.35.3.52.33.68.01.04.06.14 0 .29-.07.22-.42.28-.56.3-.48.06-.8-.02-1.36.06-.4.05-.57.03-1.06.03h-.84c-.5 0-1.04.02-1.51 0a1.34 1.34 0 0 1-.69-.17c-.2-.12-.41-.33-.57-.51-.44-.5-.9-1.15-1.29-1.67-.13-.18-.24-.36-.42-.51-.26-.23-.49-.3-.9-.32a13.8 13.8 0 0 0-2.2.04c-.32.04-.49.03-.83.03h-5.46c-1.3 0-2.59.07-3.87.08-.62 0-1.45-.11-2.05.03-.39.1-.52.23-.78.5l-.61.68c-.57.66-1.14 1.8-1.94 1.89-.3.03-.73 0-1.06 0h-2.73c-.24 0-.38 0-.61-.04-.24-.03-.54-.01-.76-.04-.26-.03-.35-.05-.44-.24-.07-.14.12-.61.26-.81.47-.66 1.36-1.57 1.91-2.2 2.18-2.48 4.43-5.16 6.57-7.73.97-1.18 2.07-2.41 3.04-3.57.28-.32.46-.57.76-.9.38-.43.45-.44.87-.46.54-.03 1 .01 1.44-.05m-68.01.1C54.77.3 55.64.4 56.1.4h4.47c.46 0 .6.02.91.3.35.32.93 1.02 1.23 1.37.17.2.29.38.47.6.21.26.4.42.64.68 1.64 1.82 3.2 3.77 4.73 5.7l1.77 2.19c.87 1.06 2.21 2.51 3.03 3.56.28.36.5 1.03.3 1.28-.14.2-.28.24-.72.24h-3.87c-.44 0-.85.1-1.2-.12-.93-.58-1.5-1.9-2.28-2.6-.23-.2-.4-.31-.76-.4-.45-.12-.67.01-1.06.01-.56 0-1.33-.06-1.9-.07-2.98-.08-5.97.13-8.95.15h-1.74c-.3 0-.48-.03-.83.01-.48.06-.58.11-.82.32-.19.16-.4.46-.55.65-.37.5-1.23 1.5-1.67 1.87a.88.88 0 0 1-.6.25h-4.02c-.45 0-.9-.02-1.21-.08-.1-.02-.26-.04-.31-.23-.06-.22.11-.52.28-.75.43-.56 1.06-1.26 1.56-1.82.2-.22.35-.36.56-.6.88-1.02 1.97-2.35 2.91-3.41.6-.68 1.19-1.37 1.76-2.05.34-.4.63-.8.96-1.22.86-1.07 1.76-2.02 2.64-3.03.52-.59 1.13-1.35 1.66-1.97.32-.38.47-.63.87-.78m25.62.2C81.4.48 82.9.63 84.31.63c2.81 0 5.62.01 8.42.08 1.8.04 3.68 0 5.46 0 .39 0 .59-.03.99.02A5.56 5.56 0 0 1 102.44 2c.3.25.5.4.74.67.35.4.64.92.9 1.44a3.18 3.18 0 0 1 .2 2.28c-.09.36-.15.75-.32 1.13-.14.34-.3.62-.51.91a6.56 6.56 0 0 1-1.92 1.66c-.45.28-.67.32-.79.7-.06.2.03.47.11.68.22.6.88 1.33 1.26 1.9.38.57.88 1.44 1.23 1.96.1.16.3.6.26.75-.08.24-.2.25-.4.3-.83.2-2.36.1-3.42.1-.44 0-.93-.01-1.36-.06-.37-.05-.53.02-.83-.18-.24-.16-.37-.43-.54-.68A80.7 80.7 0 0 0 95 12.68c-.3-.4-.78-1.05-1.13-1.35-.44-.38-.95-.24-1.6-.24h-1.13c-1.78 0-3.6.07-5.38.07-.53 0-1.35.04-1.82.07-.22.02-.66-.04-.9.14-.24.18-.23.3-.24.63V15.03c0 .35.08.81-.14 1.12-.16.21-.34.23-.54.24-.24.02-.58 0-.84 0H78.7c-.36 0-1.17 0-1.41-.2-.2-.16-.25-1-.25-1.39 0-1.3-.01-2.73-.03-4.02 0-.36.03-.54.03-.9V6.84c0-1.09-.1-2.36.02-3.42.04-.33.05-.5.05-.83l.01-1.3c.02-.17.03-.38.24-.52.18-.12.46-.08.66-.08.64 0 1.33.04 1.97-.04m43.83 3.73c.31-.07.62.22.85.48.7.77 1.7 1.85 2.32 2.65.27.34.34.57.4.76.02.07.1.19.06.37-.04.22-.35.3-.45.32-1 .26-2.52.15-4.02.15h-1.74c-.48 0-.74.08-.84-.32-.04-.14.04-.36.08-.44.1-.25.36-.57.58-.84.61-.75 1.28-1.52 1.92-2.27.35-.4.39-.76.84-.86m-66.2.1c.41-.01.75.35 1.05.68.62.68 1.42 1.64 2.03 2.35.25.3.5.58.6.84.02.07.08.23.05.37-.08.34-.33.3-.62.31a24 24 0 0 0-1.44.06c-1.02.1-2.08.02-3.1.02h-1.37c-.42 0-.55.03-.67-.24-.06-.15 0-.3.01-.37.07-.25.2-.48.48-.83.62-.78 1.4-1.58 2-2.36.28-.35.6-.8.99-.82m26.3-.05c2.95-.4 6.15.04 9.1.04h.91c.63 0 1.41.05 2.05.08.58.02 1.41.06 1.89.39.28.19.44.49.42.82-.01.44-.3.79-.64 1-.67.4-1.23.38-1.9.47-.45.07-1.1.05-1.59.05-2.6 0-5.2.15-7.8.15-.98 0-2.34.25-3.27-.12-.48-.2-.38-.66-.38-1.1 0-.56-.14-.93.1-1.36.19-.35.73-.37 1.12-.42m-61.2 8c.21.02.74 0 1 0 .88 0 1.76.07 2.65.08 2.6.03 5.2 0 7.8 0h1.75c.25 0 .44.01.68.04.2.03.34.03.53.03.44 0 .93-.14 1.09.38.08.29.03.5 0 .76-.05.38-.02.85-.02 1.21 0 .5-.03.7-.19.99-.2.35-.94.38-1.33.38-.4 0-.88-.03-1.29.02-.27.03-.42.05-.68.05h-5.16c-.36 0-.53-.04-.9-.06-1.55-.11-3.16-.01-4.7-.01-2.66 0-5.33-.08-7.97-.08-1.26 0-2.71.02-3.94-.07-.33-.02-.78.04-.93-.31-.21-.5-.06-1.04-.06-1.66 0-.34-.01-.73.03-1.07.03-.17.03-.34.06-.53a.65.65 0 0 1 .3-.45c.21-.15.57-.27.82-.38.85-.36 1.67-.8 2.5-1.17 1.91-.83 3.82-1.8 5.7-2.72.28-.14.53-.22.83-.35.28-.12.49-.26.76-.38.78-.36 2.2-.94 2.95-1.31.86-.43 1.9-1 2.12-1.3-.42-.02-1.25 0-1.43-.03a12 12 0 0 0-1.14-.1c-.98 0-2.12-.07-3.11-.07-2.23 0-4.44-.08-6.67-.08h-2.12c-.2 0-.35-.03-.54-.05-.26-.03-.52.02-.75-.05-.38-.1-.3-.48-.3-.88 0-.82-.14-1.74.1-2.5.14-.5.97-.3 1.4-.3h23.74c.27 0 .9-.02 1.14 0 .14 0 .28 0 .42.12.19.16.23.35.25.56.04.42.04 1.92 0 2.35-.02.25-.1.52-.27.75-.3.43-.48.45-1.08.69-2.23.87-4.43 2.07-6.6 3.04-1.36.6-2.8 1.44-4.17 2-.6.24-1.15.46-1.75.74-.4.18-.75.28-1.13.5-.46.26-1.54.9-2.01 1.15.11.1 1.2.03 1.63.07zm-8.79 22.07c-.91 0-2.08-.11-2.95-.15l-.69-.01c-.84-.06-1.55-.14-2.35-.27-1.46-.23-2.75-.44-4.17-.64-.65-.09-1.2-.25-1.82-.43-.2-.06-.43-.1-.6-.2-.34-.17-.65-.38-.49-.96.2-.69.48-.95.97-1.67.2-.29.42-.77.8-.93.23-.08.33-.06.61-.04.31.02.68.12.99.18 1.1.25 2.21.5 3.33.69.5.08 1.13.14 1.6.2l.98.12c.33.03.65 0 .99.03.32.04.48.06.83.06h1.21c.7 0 1.58.03 2.28-.06 1.02-.12 2.1-.08 3.1-.28a7.12 7.12 0 0 0 1.68-.52c.49-.22 1.05-.49 1.02-1.04-.02-.25-.18-.37-.35-.47a2.54 2.54 0 0 0-.9-.28c-1.23-.12-2.69-.2-3.87-.23h-1.29c-.38 0-.52-.07-.98-.08h-.76c-.34 0-.6-.04-.99-.07-1.73-.12-3.5-.11-5.23-.23-.53-.04-.84-.1-1.36-.18a11 11 0 0 1-2.13-.48 4.73 4.73 0 0 1-2.69-2c-.25-.44-.36-1-.41-1.44-.1-.75.12-1.52.7-2.2a9.28 9.28 0 0 1 4.3-2.49c1.39-.34 2.93-.54 4.4-.73l1.29-.17.9-.09c.3-.02.44 0 .76 0 .67 0 .88 0 1.44-.06.27-.03.57.04.84.05.2.01.32.01.53.04 1.01.13 2.08.18 3.1.35 2.09.34 4.16.55 6.22 1.01.7.16 1.36.42 1.3.88-.05.38-.65 1.39-.95 1.9-.21.37-.38.86-.8 1.01-.38.14-.9-.18-1.29-.3-.96-.31-1.95-.5-2.96-.64-.55-.07-1.3-.12-1.82-.2-.26-.03-.4-.03-.68-.07-.44-.06-.92-.1-1.36-.1h-1.9c-.54 0-1.55-.04-2.05.02-.27.03-.45.04-.75.1-.47.08-.96.24-1.44.32-.94.16-2.03.26-2.89.52-.33.1-.69.24-.78.55-.11.43.18.62.63.71.21.04.34.04.53.07.2.03.33.05.53.05h.69c1 0 2.1.08 3.1.15.54.04 1.11-.03 1.6.02.5.05.95.06 1.51.06.33 0 .5-.02.84.02.36.05.53.06.9.06.4 0 .57-.02.92.03.3.04.44.04.76.04.27 0 .42 0 .68.04.2.02.31.04.53.04l.53.01c.72.07 1.52.14 2.27.24.72.1 1.46.22 2.13.46a3.46 3.46 0 0 1 2.45 2.62 4.25 4.25 0 0 1-.2 2.66 3.3 3.3 0 0 1-.82 1.02c-.48.43-.81.73-1.43 1.09-.64.36-1.42.73-2.13 1-.27.1-.48.14-.75.24-.29.1-.55.22-.84.31-.59.2-1.2.35-1.82.42l-.83.1c-.31.06-.68.05-.99.08-.32.03-.66-.02-1.06.08-.45.04-.54.04-.72.04-.5.03-.97.02-1.48.02zm60.43-16.63l.76.02c.8 0 2.42-.06 3.18.01.37.04.59 0 .91.2.23.14.43.37.59.55.42.48.79.93 1.21 1.44l1.47 1.74c.67.78 1.34 1.56 1.98 2.35.87 1.09 1.69 2.17 2.54 3.26.74.97 1.55 1.9 2.36 2.81.53.6 1.12 1.28 1.61 1.9.26.32.39.61.45.83.03.07.08.21.06.38-.06.32-.39.36-.59.37-.28.02-1 0-1.36 0H86.2c-.24 0-.4.04-.6-.05-.24-.1-.49-.42-.67-.62-.41-.49-.84-1.09-1.22-1.6-.17-.22-.37-.54-.63-.68-.27-.14-.46-.07-.82-.08-.31 0-.46-.01-.76-.05-.63-.07-1.47-.02-2.12-.02-2.74 0-5.46.07-8.2.07-.96 0-2.66-.3-3.55.06-.42.17-.79.82-1.09 1.16-.47.53-1.1 1.51-1.8 1.77-.57.22-1.1.12-1.74.12h-3.03c-.58 0-.82 0-.97-.32-.05-.1.16-.73.39-1.04.9-1.23 2.02-2.26 3.01-3.41.75-.87 1.51-1.78 2.25-2.66.33-.4.64-.73.98-1.13.5-.59.96-1.16 1.43-1.75.8-.96 1.7-1.93 2.51-2.88.57-.65 1.1-1.28 1.58-1.97.15-.22.27-.4.5-.54.23-.15.42-.17.6-.2.22-.03.72-.02.98-.02l1.14-.02m-40.33.13c1.71-.23 3.57-.03 5.3-.03h10.47c1.56 0 3.47-.05 5 .13.37.04.53-.06.81.12.3.19.25 1.02.25 1.26 0 .4-.01.51-.05.84-.03.2-.02.78-.18 1.05-.15.25-.41.23-.68.24-.7 0-1.42.07-2.12.07-.63 0-1.44-.05-2.05.02-.36.05-.51.06-.9.06-.55 0-.84-.04-1.37.01-.32.03-.46.06-.76.06h-.6c-.43 0-.74-.07-1.05.2-.17.16-.17.4-.17.64v6.67c0 .35 0 .51-.03.83-.08.58-.04 1.33-.05 1.9 0 .41 0 1.1-.2 1.34-.15.2-.33.22-.48.24a20.94 20.94 0 0 1-1.97.12 4.7 4.7 0 0 1-1.37 0c-.27-.04-.57-.03-.83-.03-.18 0-.44.03-.56-.24-.15-.34-.02-.59-.06-.98-.23-2.42-.14-5-.14-7.43v-.75c0-.28 0-.45-.03-.69-.04-.3-.04-.66-.04-.98 0-.22 0-.4-.14-.58-.16-.2-.4-.17-.62-.2-.37-.03-.77-.06-1.14-.06h-1.44c-.33 0-.47 0-.76-.04-.42-.05-1.14-.03-1.59-.03H31.23c-.17 0-.34.01-.5-.1-.16-.1-.16-.28-.17-.43v-.91c0-.24 0-.38-.04-.6a4.6 4.6 0 0 1-.03-.92c.01-.2.02-.35.14-.5.17-.21.5-.17.76-.2.86-.08 1.8.01 2.65-.1m116.74 2.09c-.07.5.03 1.14-.23 1.42-.38.39-1.03.11-1.79.19-1.03.1-2.24.06-3.26.06h-2.12c-.55 0-1.13.07-1.67.07-.19 0-.42 0-.57.13-.19.17-.17.36-.18.56-.03.52-.08 1.94-.08 2.57 0 .89.02 1.81 0 2.66-.04 1.24-.08 2.58-.08 3.86v1.07c0 .24.02.82-.38.96-.23.08-.38.08-.6.1-.41.01-.94-.03-1.37.03-.45.06-.61.04-1.14.04-.34 0-1.06-.05-1.36-.08-.16 0-.33-.01-.47-.18-.17-.2-.14-.46-.14-.72v-2.13c0-1.71-.07-3.43-.07-5.15 0-.53.01-.81-.05-1.29-.04-.34-.03-.46-.03-.76 0-.28.08-1.13-.27-1.47-.34-.33-.9-.16-1.4-.2-.86-.1-1.8-.07-2.65-.07h-.84c-.83 0-1.81.04-2.65-.06-.5-.06-1.41.2-1.78-.14-.18-.16-.18-.41-.2-.64-.03-.48 0-1.5.01-1.9 0-.17 0-.5.19-.7.3-.3.63-.2 1.1-.2.26 0 .64-.07.98-.08h5.85c.32 0 .46-.03.83-.06 1.6-.15 3.32-.02 4.92-.01.37 0 .56.06.91.03 1.98-.18 4.22-.03 6.22-.03 1.15 0 2.34-.02 3.49 0 .24 0 .83.05.94.06.1.61 0 1.52-.06 2.06zm-52.82-2.02c.55-.07 1.26-.03 1.82-.03h3.72c3.37 0 6.8-.16 10.16.07.9.06 1.9-.08 2.8.03.43.05.74.08 1.22.15.53.08.97.17 1.44.44.5.28 1.03.71 1.43 1.13.5.52 1 1.18 1.28 1.82.18.42.25.85.24 1.3a4.91 4.91 0 0 1-2.35 4.21c-.2.14-.46.27-.68.39-.28.14-.55.26-.62.55-.06.24.03.41.11.68.14.43.52.97.79 1.36l.45.69.38.6c.28.42.63.88.88 1.3.1.14.28.56.23.75-.08.28-.23.28-.48.3-.22.02-.77.08-1.06.08h-3.18c-.32 0-.82.04-1.14-.14-.31-.17-.42-.38-.63-.7l-.46-.68c-.56-.82-1.13-1.63-1.7-2.42-.34-.5-.44-.82-.87-1.18-.4-.35-1.25-.26-1.95-.26-1.42 0-2.9.07-4.32.07h-1.29c-.7 0-1.99.06-2.58.08-.18 0-.85.06-.98.26-.24.34-.11.55-.15 1.1-.06.84 0 1.83 0 2.66 0 .26.04.52-.08.75a.73.73 0 0 1-.53.43c-.19.05-.52.03-.76.03h-.68c-.4-.03-.71-.08-1.14-.08h-.83c-.58 0-1.24 0-1.56-.28-.14-.12-.19-.9-.19-1.23v-4.17c0-1.5.08-2.99.08-4.48v-2.73c0-.66.06-1.22.07-1.82 0-.25-.05-.62.15-.86.2-.23.5-.12.84-.12h1.44c.27 0 .41-.01.68-.05M75.3 21.86c.25-.1.4 0 .53.1.2.15.39.4.6.65.33.4.6.76.93 1.14.5.58.98 1.03 1.4 1.67.17.25.3.42.28.68-.02.28-.24.33-.33.35-.3.08-1.05.1-1.59.1-1.46 0-3.3.02-4.7 0-.34 0-.6.03-.68-.3-.04-.23.15-.54.32-.76.52-.66 1.17-1.34 1.71-1.97.31-.36.6-.81.93-1.14.15-.16.37-.42.6-.52m25.86.1c.54-.08 1.37-.03 1.9-.03h.9c2.24 0 4.68-.2 6.9.01.37.04.56.07.91.07h1.44c.57 0 1.28.05 1.82.18.38.1.7.3.9.65.27.46.07.93-.37 1.24-.7.5-1.66.5-2.42.6-.31.03-.55.05-.91.05-.3 0-.47 0-.76.04-.32.04-.5.04-.84.04-.78 0-1.2-.02-1.9 0-.48.01-.62.08-1.05.08H101.45c-.3-.01-.52 0-.74-.15-.3-.21-.3-.66-.31-.92-.04-.52-.05-.8.04-1.2.1-.48.2-.58.7-.66");
    const getOapcity = (num) => {
        const prop = (1 - (num / view.svgText.wholeDistance)) * dots.anglePlus90;
        const sin = Math.sin(prop) * 32;
        return Math.floor(sin);
    };
    let index = 0;
    const draw = () => {
        const { scaleX, scaleY, numItems, step } = view.svgText;
        const { distance, frames } = data.startText;
        {
            context.lineWidth = .6;
            context.save();
            context.scale(scaleX, scaleY);
            context.translate(25, 25);
            context.strokeStyle = '#fff';
            context.stroke(p);
        }
        {
            const move = index * step;
            context.translate(0, move);
            context.strokeStyle = `#ffffff${dots.getHex(getOapcity(move))}`;
            context.stroke(p);
            for (let i = 0; i < numItems; ++i) {
                context.translate(0, distance);
                context.strokeStyle = `#ffffff${dots.getHex(getOapcity(move + (distance * (1 + i))))}`;
                context.stroke(p);
            }
            context.restore();
            context.save();
            context.scale(scaleX, scaleY);
            context.translate(25, 25);
            context.translate(0, -move);
            context.strokeStyle = `#ffffff${dots.getHex(getOapcity(move))}`;
            context.stroke(p);
            for (let i = 0; i < numItems; ++i) {
                context.translate(0, -distance);
                context.strokeStyle = `#ffffff${dots.getHex(getOapcity(move + (distance * (1 + i))))}`;
                context.stroke(p);
            }
        }
        index++;
        if (index === frames)
            index = 0;
        context.restore();
    };
    return {
        draw
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
        startText.draw();
    };
    draw();
    setInterval(draw, Math.round(1000 / data.global.speed));
    return {};
}());
(function () {
}());
