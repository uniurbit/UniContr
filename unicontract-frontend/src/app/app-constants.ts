import { environment } from '../environments/environment';
export class AppConstants {
    public static get baseURL(): string { return environment.API_URL; }
    public static get apiVer(): string { return "api/v1"; }

    public static get baseApiURL(): string { return this.baseURL + this.apiVer; }
    public static get documentationURL(): string { return environment.documentation; }
}

