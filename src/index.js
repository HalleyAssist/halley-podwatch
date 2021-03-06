module.exports = {
    /* monitoring modules */
    ExpressMonitor: require('./modules/ExpressMonitor'),
    NodeJsMonitor: require('./modules/NodeJsMonitor'),
    KnexMonitor: require('./modules/KnexMonitor'),
    SyncFunctionMonitor: require('./modules/SyncFunctionMonitor'),

    /* helpers */
    TrackedZabbixSender: require('./helpers/TrackedZabbixSender')
}