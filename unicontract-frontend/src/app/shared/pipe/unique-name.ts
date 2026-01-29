import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
    name: 'unique_name',
    standalone: false
})

export class UniqueName implements PipeTransform {
    transform(value: any[]): any[] {
        if (!Array.isArray(value)) return value;
        const seen = new Set();
        return value.filter(item => {
            if (!item || !item.cod_fis) return false;
            if (seen.has(item.cod_fis)) return false;
            seen.add(item.cod_fis);
            return true;
        });
    }
}
