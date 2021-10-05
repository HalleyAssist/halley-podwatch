const NodeZabbixSender = require('node-zabbix-sender'),
      Q = require('q-lite'),
      debug = require('debug')('halley-monitoring')

class TrackedZabbixSender extends NodeZabbixSender {
    constructor(zabbixSenderOptions){
        super(zabbixSenderOptions)
        this._errors = 0
        this._lastErrors = 0
    }

    start(){
        this._interval = setInterval(() => {
            if(this._lastErrors === this._errors === 0){
                return
            }

            this.addItem('nodejs.zabbix.sender["errors"]', this._errors)

            this._lastErrors = this._errors
            this._errors = 0
        }, 60*1000).unref()
    }

    _send(fn){
        return super.send(fn)
    }

    async send(){
        try {
            const ret = await Q.ninvoke(this, '_send')
            debug(ret)
        } catch(ex){
            debug(ex)
            this._errors++;
        }
    }
}

module.exports = TrackedZabbixSender;