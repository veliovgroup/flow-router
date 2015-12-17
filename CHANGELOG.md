# Changelog

### v2.10.1 (FR: v2.10.0)
* Execute `whileWaiting` hook before `waitOn`

### v2.10.0 (v2.10.0)
Extend original `flow-router` with:
* `waitOn` - Subscriptions
* `whileWaiting` - Hook mostly used for loader
* `data` - Hook for setting template data context
* `onNoData` - Hook for cases when no data was returned from `data` hook