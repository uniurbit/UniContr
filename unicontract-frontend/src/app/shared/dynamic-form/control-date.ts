import { ControlBase } from './control-base';

export class DateControl extends ControlBase<Date> {
  controlType = 'datepicker';
  type: Date;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}