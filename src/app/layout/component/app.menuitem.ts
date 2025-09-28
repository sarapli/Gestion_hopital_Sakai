export interface AppMenuItem {
    label?: string;
    icon?: string;
    items?: AppMenuItem[];
    routerLink?: string[];
    url?: string;
    target?: string;
    separator?: boolean;
}