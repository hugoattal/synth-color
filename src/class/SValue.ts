export class SValue<T> {
    private internal: {
        value: T,
        valid: boolean
    } = {
        value: undefined,
        valid: true
    };

    constructor(value?: T) {
        if (value) {
            this.internal.value = value;
            this.internal.valid = true;
        }
        else {
            this.internal.valid = false;
        }
    }

    get ready() {
        return this.internal.valid;
    }

    get value() {
        return this.internal.value
    }

    set value(value: T) {
        this.internal.value = value;
        this.internal.valid = true;
    }

    invalidate() {
        this.internal.valid = false;
    }
}
