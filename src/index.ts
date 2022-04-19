export type GravyBinderConfig = { precomputeBindings?: boolean };
type Action = (node: any, value: any) => void;
type ActionCollection = { [key: string]: Action };
type OutwardBinding = { element?: HTMLElement, action: () => void };

export class GravyBinder {
    protected root: Element | Document;
    protected scope: any;

    constructor(scope?: any, root?: HTMLElement, protected config?: GravyBinderConfig) {
        this.root = root || document;
        this.scope = scope || window;
        this.initialize();
    }

    private outwardBindingActions: ActionCollection = {};
    private appliedBindings: OutwardBinding[] = [];

    private loopByQuery = (query: string, action: (element: any) => any): void => {
        const elements = this.root.querySelectorAll(query);

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < elements.length; ++i) {
            const element = elements[i];
            action(element);
        }
    };

    protected setDynamic = <TValue>(property: string, value: TValue): void => {
        this.scope.$binderWorkingValue = value;
        return Function(`${property} = this.$binderWorkingValue`).call(this.scope);
    }

    protected getDynamic = <TValue>(property: string): TValue => this.compileGetter(property).call(this.scope);

    protected compileGetter = (property: string): Function => Function(`return ${property}`);

    public updateInputBindings = (): void =>
        this.loopByQuery('[data-in]', (e) => {
            if (e.type === 'checkbox')
                this.setDynamic(e.dataset.in, e.checked);
            else if (e.type === 'number')
                this.setDynamic(e.dataset.in, Number(e.value));
            else
                this.setDynamic(e.dataset.in, e.value);
        });

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
        if (!this.config?.precomputeBindings) {
            this.scanBindings();
        }
        this.appliedBindings.forEach(b => b.action());
    }


    private bindInputEvents = (): void => this.loopByQuery('[data-in]', (e) => {
        e.addEventListener('change', () => this.updateBindings());
        e.addEventListener('blur', () => this.updateBindings());
        if (e.dataset.immediate === 'true')
            e.addEventListener('keyup', () => this.updateBindings());
    });

    private initializeListener = (): void => {
        this.bindInputEvents();
        this.updateBindings();
        if (this.config?.precomputeBindings) {

        }
    };

    public scanBindings = (): void => {
        this.appliedBindings = [];
        for (let bindingName in Object.keys(this.outwardBindingActions)) {
            const action = this.outwardBindingActions[bindingName];
            this.loopByQuery(`[data-${bindingName}]`, (element) => {
                const getter = this.compileGetter(element.dataset[this.toCamelCase(bindingName)]);
                this.appliedBindings.push({
                    element: element,
                    action: () => action(element, getter.call(this.scope))
                });
            });
        }
    }

    private initialize = (): void => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.initializeListener);
        } else {
            this.initializeListener();
        }
        this.registerDefaultOutwardBindings();
    }

    public registerOutwardBinding = (dataAttribute: string, bindingAction: (node: any, value: any) => void): void => {
        this.outwardBindingActions[dataAttribute] = bindingAction;
    }

    private registerDefaultOutwardBindings = (): void => {
        this.registerOutwardBinding('display', (e, v) => e.innerHTML = v);
        this.registerOutwardBinding('min', (e, v) => e.min = v);
        this.registerOutwardBinding('max', (e, v) => e.max = v);
        this.registerOutwardBinding('disable', (e, v) => e.disabled = v || false);
        this.registerOutwardBinding('out', (e, v) => e.value = v);
        this.registerOutwardBinding('class-condition', (e, v) => this.applyClassConditionally(e, e.dataset.class, v || false));
        this.registerOutwardBinding('hide', (e, v) => e.hidden = v);
        this.registerOutwardBinding('show', (e, v) => e.hidden = !v);
        this.registerOutwardBinding('min-length', (e, v) => e.minLength = v);
        this.registerOutwardBinding('max-length', (e, v) => e.maxLength = v);
        this.registerOutwardBinding('required', (e, v) => e.required = v);
        this.registerOutwardBinding('placeholder', (e, v) => e.placeholder = v);
        this.registerOutwardBinding('checked', (e, v) => e.checked = v);
        this.registerOutwardBinding('step', (e, v) => e.step = v);
        this.registerOutwardBinding('title', (e, v) => e.title = v);
        this.registerOutwardBinding('href', (e, v) => e.href = v);
    }

    private toCamelCase = (kebabCase: string): string => kebabCase
        .split('-')
        .map((item, index) => index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item)
        .join("")
};
