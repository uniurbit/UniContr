import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe ({
    name: 'unique_year',
    // pure: 'false'
})

export class UniqueYear implements PipeTransform {
    transform(value: any): any {
        if (value !== undefined && value !== null) {
            return _.uniqBy(value, 'aa_off_id');
        }
        return value;
    }
}
