

export const handleGetLeaderBoard = (db) => (req, res) => {
    const { userid } = req.body;
    let {sessionid} = req.cookies;

    if(sessionid===undefined){
        sessionid='nill'
    }

    db('sessions').select('*')
        .where({
            userid: userid,
            sessionid: sessionid
        })
        .then(sessionTab => {
            if (sessionTab.length > 0) {
                res.cookie('sessionid',sessionid,{ expires: new Date(Date.now() + (1000*60*60*24*2)), httpOnly: true })
                db('requests')
                    .pluck('userid')
                    .groupBy('userid')
                    .then(userids => {
                        const out = {
                            unique: [],
                            total: []
                        };
                        (async () => {

                            for (let id of userids) {
                                await db('requests')
                                    .innerJoin('users', 'users.userid', 'requests.userid')
                                    .where({ 'users.userid': id })
                                    .select('requests.userid', 'name')
                                    .distinct('url')
                                    .then(tabs => {
                                        out.unique.push({ name: tabs[0].name, count: tabs.length });
                                    })
                            }
                            for (let id of userids) {
                                await db('requests')
                                    .innerJoin('users', 'users.userid', 'requests.userid')
                                    .where({ 'users.userid': id })
                                    .select('users.userid', 'url', 'name')
                                    .then(tabs => {
                                        out.total.push({ name: tabs[0].name, count: tabs.length });
                                    })
                            }
                            let rank = 0;
                            let last = 0
                            out.unique.sort((a, b) => b.count - a.count);
                            out.unique = out.unique.map((val) => {
                                if (last === val.count) {
                                } else {
                                    rank++;
                                }
                                last = val.count;
                                val.rank = rank;
                                return val
                            })
                            rank = 0;
                            last = 0
                            out.total.sort((a, b) => b.count - a.count);
                            out.total = out.total.map((val) => {
                                if (last === val.count) {
                                } else {
                                    rank++;
                                }
                                last = val.count;
                                val.rank = rank;
                                return val
                            })
                            res.json({
                                status:'success',
                                data:out
                            })
                        })()
                    })
                    .catch(console.log)
            } else {
                res.json({
                    status: 'failed',
                    code: '00',
                    message: 'authentication failed'
                });
            }
        })
        .catch(err=>{
            console.log('leaderboard',err);
            res.json({
                status: 'failed',
                code: '01',
                message: 'unknown error'
            });
        })
}