import { UntypedFormControl } from '@angular/forms';
import { BaseEntity } from './base-entity';

export class FormState {
    form: UntypedFormControl;
    model: BaseEntity;
    constructor(form, model: BaseEntity) {
        this.form = form;
        this.model = model;
    }

    get isUpdatable(): boolean {
        // non deve avere errori e deve essere dirty
        return !this.form.valid || !this.form.dirty;
    }

    get isNew(): boolean {
        return this.model == null || this.model.id == null;
    }

    get isReloadable(): boolean {
        // non DEVE essere nuovo
        return !this.isNew && this.form.dirty;

    }
}
