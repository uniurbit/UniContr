import { ControlBase } from './control-base';

export class ArrayControl extends ControlBase<Array<any>> {
  controlType = 'array';
  type: Array<any>;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}