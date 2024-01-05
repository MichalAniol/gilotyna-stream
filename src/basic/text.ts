const text = (function () {
    const textElem = document.getElementById('title')

    const draw = () => {
        if (!data.right.text.enable) {
            textElem.style.display = 'none'
        }
    }

    return {
        draw,
    }
}())