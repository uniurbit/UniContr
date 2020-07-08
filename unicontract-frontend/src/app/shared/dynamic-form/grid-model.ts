export class GridModel<T> {
    PageSize: number;
    TotalElements: number;
    TotalPages: number;
    CurrentPageNumber: number;
    SortBy: string;
    SortDir: string;
    Data: Array<T>;

    constructor(defaultSortBy: string = 'Id', defaultSortDir: string = 'asc') {
        this.PageSize = 10;
        this.TotalElements = 0;
        this.TotalPages = 0;
        this.CurrentPageNumber = 0;
        this.Data = new Array<T>();

        this.SortBy = defaultSortBy;
        this.SortDir = defaultSortDir;
    }
}
