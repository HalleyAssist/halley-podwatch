const ResponseTime = require('response-time')

class ExpressMonitor {
    constructor(sender){
        this.totalRequests = this.itResponseTime = this.itRequests = 0
        this._sender = sender
    }
    register(app){
        app.use(ResponseTime((_req, _res, time)=>{
            this.totalRequests++
            this.itRequests++
            this.itResponseTime += time
            //todo: min response time, max response time
        }))

        setInterval(()=>{
            this._sender.addItem(`nodejs.express["requests"]`, this.totalRequests)
            const avgResponseTime = this.itRequests ? (this.itResponseTime / this.itRequests) : 0
            this._sender.addItem(`nodejs.express["response_time_avg"]`, avgResponseTime)
            this.itResponseTime = this.itRequests = 0
            this._sender.send().catch(()=>{})
        }, 15*1000).unref()
    }
}

module.exports = ExpressMonitor