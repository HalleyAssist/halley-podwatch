class NodeJsMonitor {
    constructor(sender){
        this._sender = sender
    }

    basicMontioring(){
        // basic monitoring
        this._sender.addItem('nodejs.node["node", "version"]', process.version)
        this._sender.addItem('nodejs.node["node", "node_env"]', process.env.NODE_ENV)
        if(process.env.K8S_APPLICATION_COMMIT) this._sender.addItem('nodejs.node["app", "commit"]', process.env.K8S_APPLICATION_COMMIT)
        if(process.env.K8S_APPLICATION_VERSION) this._sender.addItem('nodejs.node["app", "version"]', process.env.K8S_APPLICATION_VERSION)
        
        // in the background is fine
        this._sender.send().catch(()=>{})
    }
    register(){
        let rejectionCount = 0
        process.on('unhandledRejection', (reason, promise) => {
            rejectionCount++
            console.log('Unhandled Rejection at:', promise, 'reason:', reason);
            
            this._sender.addItem('nodejs.node["unhandled_rejection", "message"]', reason.toString())
        })

        this.basicMontioring()
        
        setInterval(()=>{
            this._sender.addItem('nodejs.node["unhandled_rejection", "count"]', rejectionCount)
            this._sender.send().catch(()=>{})
        }, 15*1000).unref()
        
        setInterval(()=>{
            this.basicMontioring()
        }, 60*1000*5).unref()
    }
}

module.exports = NodeJsMonitor