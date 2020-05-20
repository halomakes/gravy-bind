class DemoModel {
    constructor() {
        this.binder.registerOutwardBinding('alt', (element, value) => element.alt = value);
        this.binder.registerOutwardBinding('src', (element, value) => element.src = value);
    }

    binder = new GravyBinder(this, document.getElementById('demoRoot'));
    codeSource = '';
    toggleColor = false;
    textInput = '';
    checkInput = false;
    getStupidText = text => text.split('').map((c, i) => i % 2 ? c.toUpperCase() : c.toLowerCase()).join('');
    max = 10;
    min = 5;
    range;
    select;
    disable = false;
    immediate = '';
    counter = 0;
    alt;
    width = 140;
    height = 60;
    triggerRefresh = () => {
        this.counter++;
        this.binder.updateOutwardBindings();
    }

    loadSource = () => {
        if (window.fetch) {
            fetch('https://raw.githubusercontent.com/halomademeapc/gravy-bind/master/demo/demo.js').then(r => r.text().then(t => {
                this.codeSource = t;
                this.binder.updateOutwardBindings();
                hljs.initHighlighting();
            }));
        } else {
            hljs.initHighlightingOn();
        }
    }
    getImageUrl = () => `https://via.placeholder.com/${this.width}x${this.height}`;
}

let dm = new DemoModel();
dm.loadSource();