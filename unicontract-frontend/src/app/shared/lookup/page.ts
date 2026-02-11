/**
 * An object used to get page information from the server
 */
export class Page {

    constructor(size = 0){
        this.size = size; 
    }
    //The number of elements in the page
    size: number = 0;
    //The total number of elements
    totalElements: number = 0;
    //The total number of pages
    totalPages: number = 0;
    //The current page number
    pageNumber: number = 0;
}

/**
 * An array of data with an associated page object used for paging
 */
export class PagedData<T> {
    data = new Array<T>();
    page = new Page();
}