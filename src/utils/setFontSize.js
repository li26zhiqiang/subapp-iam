import { getFontSize } from './util';

function setSize() {
    let fontSize = getFontSize();
    document.documentElement.style.fontSize = fontSize + 'px';
}

setSize();

window.addEventListener('resize', setSize);
