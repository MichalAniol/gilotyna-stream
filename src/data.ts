const data = {
    global: {
        speed: 30 // ilośc klatek na sekundę
    },
    left: { // lewa strona obrazu
        background: {
            colorLeft: '#cbdeba',
            colorRight: '#fba976',
        },
        wave: { // fla czerwieni w górnej części
            enable: true, // widoczność
            direction: 'left', // kerunek ruchu
            frames: 3700, // ilość klatek na cały cykl - czym więcej tym wolniejszy ruch
            color: '#e2562d',
            shape: {
                length: 3.5, // ile razy dłuższa jest fala od szerokości okna, w któreym jest wyświetlana
                points: [
                    [0, 50], // [oś x 0-100, wysokość fali od -100 do 100]
                    [20, 110], // wystaje poza zakres
                    [40, 0],
                    [60, 30],
                    [80, -50],
                ],
            }
        },
        dots: { // niebieskie kropki
            enable: true,
            frames: 1900,
            quantity: 80, // ilość kropek w poziomie
            color: '#658fa8',
            field: [100, 65, 85], // przesunięcie w bok, zakres 0-100
            fold: {
                x: { // wysunięcie ku górze
                    frames: 1700,
                    field: [100, 75, 90] // zakres 0-100
                },
                y: { // szerokość fali
                    frames: 2300,
                    field: [100, 180, 280, 120, 170, 200] // zakres 0-10000
                },
            }
        }
    },
    right: { // prawa stona ekranu
        background: {
            colorLeft: '#ff8469',
            colorCenter: '#ebb5a0',
            colorRight: '#bfa881',
        },
        text: { // napis gilotyna
            enable: true, // widoczność
        },
        wave: { // fala niebieska w dolnej części
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
    box: { // prostokąt przyciemniający
        enable: true,
        margin: {
            left: 9.83, // odstęp od lewej w procentach względem szerokości całego obrazu
            top: 8.6, // odstęp od góry w procentach względem wysokości całego obrazu
            right: 13.08, // odstęp od prawej w procentach względem szerokości całego obrazu
            bottom: 8.2, // odstęp od dołu w procentach względem wysokości całego obrazu
        },
        colors: [
            '#4974af33',
            '#fba97644',
            '#fba97666',
            '#ff846944',
            '#4974af1a',
        ],
    },
}