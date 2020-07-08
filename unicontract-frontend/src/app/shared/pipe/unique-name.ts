import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe ({
    name: 'unique_name',
    // pure: 'false'
})

export class UniqueName implements PipeTransform {
    transform(value: any): any {
        if (value !== undefined && value !== null) {
            return _.uniqBy(value, 'cod_fis');
        }
        return value;
    }
}
