class GravyBinder {
    private root: Element | Document;

    constructor(root?: HTMLElement) {
        this.root = root || document;
        this.initialize();
    }

    private loopByQuery = (query: string, action: (element: any) => any): void => {
        const elements = this.root.querySelectorAll(query);

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < elements.length; ++i) {
            const element = elements[i];
            action(element);
        }
    };

    // tslint:disable-next-line: no-eval
    private setDynamic = (variableName: string, value: any): void => eval(variableName + ' = value');

    // tslint:disable-next-line: no-eval
    private getDynamic = (variableName: string): any => eval(variableName);

    public updateDisplayBindings = () =>
        this.loopByQuery('[data-display]', (e) => e.innerHTML = this.getDynamic(e.dataset.display));

    public updateMinBindings = (): void =>
        this.loopByQuery('[data-min]', (e) => e.min = this.getDynamic(e.dataset.min));

    public updateMaxBindings = (): void =>
        this.loopByQuery('[data-max]', (e) => e.max = this.getDynamic(e.dataset.max));

    public updateInputBindings = (): void =>
        this.loopByQuery('[data-in]', (e) => {
            if (e.type === 'checkbox')
                this.setDynamic(e.dataset.in, e.checked);
            else if (e.type === 'number')
                this.setDynamic(e.dataset.in, Number(e.value));
            else
                this.setDynamic(e.dataset.in, e.value);
        });

    public updateShadowInputBindings = (): void =>
        this.loopByQuery('[data-out]', (e) => e.value = this.getDynamic(e.dataset.out));

    public updateClassBindings = (): void =>
        this.loopByQuery('[data-class]', (e) =>
            this.applyClassConditionally(e, e.dataset.class, this.getDynamic(e.dataset.classCondition) || false)
        );

    public updateDisableBindings = (): void =>
        this.loopByQuery('[data-disable]', (e) => e.disabled = this.getDynamic(e.dataset.disable) || false);

    private applyClassConditionally = (element: any, className: string, evaluator: boolean): void => {
        if (evaluator)
            element.classList.add(className);
        else
            element.classList.remove(className);
    };

    public updateBindings = (): void => {
        this.updateInputBindings();
        this.updateOutwardBindings();
    };

    public updateOutwardBindings = (): void => {
        this.updateShadowInputBindings();
        this.updateDisplayBindings();
        this.updateClassBindings();
        this.updateDisableBindings();
        this.updateMinBindings();
        this.updateMaxBindings();
    };

    private bindInputEvents = (): void => this.loopByQuery('[data-in]', (e) => {
        e.addEventListener('change', () => this.updateBindings());
        e.addEventListener('blur', () => this.updateBindings());
        if (e.dataset.immediate === 'true')
            e.addEventListener('keyup', () => this.updateBindings());
    });

    private initializeListener = (): void => {
        this.bindInputEvents();
        this.updateBindings();
    };

    private initialize = (): void => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.initializeListener);
        } else {
            this.initializeListener();
        }
    }
};
