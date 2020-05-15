class DemoModel {
    binder = new GravyBinder(document);
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
}

let dm = new DemoModel();
dm.loadSource();