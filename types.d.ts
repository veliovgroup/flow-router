type Trigger = (
    context: {},
    doRedirect: (url: string, params?: { key: string }, queryParams?: { [key: string]: string }) => void,
    doStop: () => void
) => void;

type TriggerFilter = {
    only?: string[];
    except?: string[];
};
type TriggerFilterParam = TriggerFilter | TriggerFilter[];

interface Router {
    getQueryParam: (param: string) => string | undefined;
    getParam: (param: string) => string | undefined;
    subscriptions?: any;
    register: (name: string, sub: any) => void;
    route: (
        path: string,
        options?: {
            name?: string;
            action?: () => void;
            subscriptions?: (params: { [key: string]: string }) => void;
            triggersEnter?: Trigger[];
            triggersExit?: Trigger[];
        },
        group?: any
    ) => any;
    group: (options: any) => any;
    path: (pathDef: string, fields?: { [key: string]: string }, queryParams?: { [key: string]: string }) => string;
    go: (pathDef: string, fields?: { [key: string]: string }, queryParams?: { [key: string]: string }) => void;
    reload: () => void;
    redirect: (path: string) => void;
    setQueryParams: (newParams: { [key: string]: string | null | undefined | number }) => boolean;
    current: () => {
        path: string;
        context: any;
        params: string[];
        queryParams: { [key: string]: string };
    };
    getRouteName: () => string;
    watchPathChange: () => void;
    subsRead: () => boolean;
    triggers: {
        enter: (triggers: Trigger[], filter?: TriggerFilterParam) => void;
        exit: (triggers: Trigger[], filter?: TriggerFilterParam) => void;
    };
}

export const FlowRouter: Router;
