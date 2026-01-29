import { StoryProcessInterface } from './../interface/storyProces.interface';

export class StoryProcess implements StoryProcessInterface {
    id: number;
    insegn_id: number;
    descrizione: string;

    constructor() {
        this.id = 0;
        this.insegn_id = 0;
        this.descrizione = '';
    }
}
