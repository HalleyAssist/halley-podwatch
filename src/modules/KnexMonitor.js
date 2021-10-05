class KnexMonitor {
    constructor(sender){
        this._sender = sender
    }
    register(knex){
        const pool = knex.client.pool

        setInterval(()=>{
            // returns the number of non-free resources
            this._sender.addItem('nodejs.node["knex", "pool", "used"]', pool.numUsed())

            // returns the number of free resources
            this._sender.addItem('nodejs.node["knex", "pool", "free"]', pool.numFree())

            // how many acquires are waiting for a resource to be released
            this._sender.addItem('nodejs.node["knex", "pool", "waiting"]', pool.numPendingAcquires())

            // how many asynchronous create calls are running
            this._sender.addItem('nodejs.node["knex", "pool", "creating"]', pool.numPendingCreates())

            // pool size (max)
            this._sender.addItem('nodejs.node["knex", "pool", "max"]', pool.max)

            this._sender.send().catch(()=>{})
        }, 10*1000).unref()
        
    }
}
module.exports = KnexMonitor