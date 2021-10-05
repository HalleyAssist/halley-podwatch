const SyncFunction = require('syncfunction')
class SyncFunctionMonitor {
    constructor(sender){
        this._sender = sender
    }
    register(){
        let backlogEvents = 0
        let timeoutEvents = 0

        const origLog = SyncFunction.debugLog
        SyncFunction.debugLog = function(msg, reason){
            if(reason === 'backlog'){
                backlogEvents++
            } else if (reason == 'timeout'){
                timeoutEvents++
            }
            return origLog(msg, reason)
        }

        setInterval(()=>{
            // returns the number of non-free resources
            this._sender.addItem('nodejs.node["syncfunction", "events", "backlog"]', backlogEvents)
            this._sender.addItem('nodejs.node["syncfunction", "events", "timeout"]', timeoutEvents)

            this._sender.send().catch(()=>{})
        }, 30*1000).unref()
        
    }
}
module.exports = SyncFunctionMonitor