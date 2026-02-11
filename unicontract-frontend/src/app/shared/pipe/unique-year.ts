import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
    name: 'unique_year',
    standalone: false
})

export class UniqueYear implements PipeTransform {
    transform(value: any[]): any[] {
        if (!Array.isArray(value)) return value;
    
        const seen = new Set();
        return value.filter(item => {
            if (!item || !item.aa_off_id) return false;
            if (seen.has(item.aa_off_id)) return false;
            seen.add(item.aa_off_id);
            return true;
        });
    }
}
