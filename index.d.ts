import type { Meteor } from "meteor/meteor";
import type { Mongo } from "meteor/mongo";
import type { Tracker } from "meteor/tracker";

type Trigger = (context: ReturnType<Router["current"]>, redirect: Router["go"], stop: () => void, data: any) => void;

type TriggerFilterParam = { only: string[] } | { except: string[] };

type DynamicImport = Promise<string>;

type QueryValue = string | number | boolean | null | undefined | QueryParams | QueryValue[];
type QueryParams = {
    [key: string]: QueryValue;
};

type Hook = (params: Param, queryParams: QueryParams) => void | Promise<void>;

type waitOn = (
    params: Param,
    queryParams: QueryParams,
    ready: (func: () => ReturnType<waitOn>) => void
) =>
    | Promise<any>
    | Array<Promise<any>>
    | Meteor.SubscriptionHandle
    | Tracker.Computation
    | Array<Tracker.Computation>
    | DynamicImport
    | Array<DynamicImport | Meteor.SubscriptionHandle>;

type waitOnResources = (
    params: Param,
    queryParams: QueryParams
) => {
    images: string[];
    other: string[];
};

type data = (params: Param, queryParams: QueryParams) => Mongo.CursorStatic | Object | Object[] | false | null | void | Promise<Mongo.CursorStatic | Object | Object[] | false | null | void>;

type action = (params: Param, queryParams: QueryParams, data: any) => void;

type Param = {
    [key: string]: string;
};

type NewParams = {
    [key: string]: string | null
};

export interface Router {
    /** Max time (ms) for each `waitOn` promise phase and subscription poll phase; default `120000`. Overridable per route via `maxWaitFor`. When exceeded, `waitOn` stops waiting but `action` still runs; navigating away aborts `waitOn` and skips `action` for the left route. */
    maxWaitFor: number;
    go: (path: string, params?: NewParams, queryParams?: QueryParams) => boolean;
    route: (
        path: string,
        options?: {
            name?: string;
            whileWaiting?: Hook;
            waitOn?: waitOn;
            waitOnResources?: waitOnResources;
            endWaiting?: () => void;
            data?: data;
            onNoData?: Hook;
            triggersEnter?: Array<Trigger>;
            action?: action;
            triggersExit?: Array<Trigger>;
            conf?: { [key: string]: any; forceReRender?: boolean };
            /** Max time (ms) for this route’s `waitOn` promise and subscription waits; defaults to `FlowRouter.maxWaitFor`. On timeout, `action` still runs. */
            maxWaitFor?: number;
            [key: string]: any;
        }
    ) => Route;
    group: (options: { name: string; prefix?: string; [key: string]: any }) => any;
    render: (layout: string, template: string, data?: { [key: string]: any }, callback?: () => void) => void;

    refresh: (layout: string, template: string) => void;
    reload: () => void;
    redirect: (path: string) => void;
    pathRegExp: RegExp;
    decodeQueryParamsOnce: boolean;

    getParam: (param: string) => string;
    getQueryParam: (param: string) => string;
    setParams: (params: NewParams) => boolean;
    setQueryParams: (params: QueryParams) => boolean;

    url: (path: string, params?: NewParams, queryParams?: QueryParams) => string;
    path: (path: string, params?: NewParams, queryParams?: QueryParams) => string;
    current: () => {
        context: Context;
        oldRoute: Route;
        params: Param;
        path: string;
        queryParams: QueryParams;
        route: Route;
    };
    getRouteName: () => string;

    watchPathChange: () => void;
    withReplaceState: (callback: () => void) => void;

    onRouteRegister: (callback: (route: Route) => void) => void;

    wait: () => void;
    initialize: (options: {
        hashbang?: boolean;
        page?: { click: boolean };
        click?: boolean;
        popstate?: boolean;
        /** Sets `FlowRouter.maxWaitFor` (ms) for routes that do not set `maxWaitFor`. Default `120000`. */
        maxWaitFor?: number;
    }) => void;

    triggers: {
        enter: (triggers: Trigger[], filter?: TriggerFilterParam) => void;
        exit: (triggers: Trigger[], filter?: TriggerFilterParam) => void;
    };
}

interface Route {
    conf: { [key: string]: string | boolean };
    globals: Array<any>;
    group: string;
    name: string;
    options: { name: string };
    path: string;
    pathDef: string;
    render: () => void;
}

/** `new Router()` instance API (same object shape as `FlowRouter` before `.Router` / `.Route` are attached). */
export interface RouterConstructor {
    new (): Router;
}

/** Route class instance (see `FlowRouter.route()` return type). */
export interface RouteConstructor {
    new (...args: any[]): Route;
}

/** Route group constructor (see `FlowRouter.group()`). */
export interface GroupConstructor {
    new (...args: any[]): any;
}

/**
 * Client singleton: full router + `FlowRouter.Router` / `FlowRouter.Route` constructors
 * (used by companion packages such as `ostrio:flow-router-meta`).
 */
export type FlowRouterSingleton = Router & {
    Router: RouterConstructor;
    Route: RouteConstructor;
};

type Context = {
    canonicalPath: string;
    hash: string;
    params: Param;
    path: string;
    pathname: string;
    querystring: string;
    state: { [key: string]: string };
    title: string;
};

interface Helpers {
    name: (routeName: string | RegExp) => boolean;
    path: (pathName: string | RegExp) => boolean;
    pathFor: (pathName: string, params: Param) => string;
    configure: (options: { activeClass: string; caseSensitive: boolean; disabledClass: string; regex: string }) => void;
}

/** Router class (instantiate only inside the package; apps use `FlowRouter`). */
export const Router: RouterConstructor;
/** Route class (for advanced / package authors). */
export const Route: RouteConstructor;
/** Group class. */
export const Group: GroupConstructor;
/** Trigger helpers (`applyFilters`, etc.). Server build exposes an empty object. */
export const Triggers: Record<string, (...args: any[]) => any>;
/**
 * Blaze renderer when `templating` + `blaze` are present; otherwise a no-op stub.
 * Server build exports an empty object — use only from client router code.
 */
export const BlazeRenderer: new (opts?: Record<string, unknown>) => unknown;

/** Default `FlowRouter.maxWaitFor` and route `maxWaitFor` fallback (ms). */
export declare const MAX_WAIT_FOR_MS: number;

export const FlowRouter: FlowRouterSingleton;
/** Client-only: not exported from server `mainModule`. Import from isomorphic modules only if guarded with `Meteor.isClient`. */
export const RouterHelpers: Helpers;
