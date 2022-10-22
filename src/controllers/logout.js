export const handleLogout = (db) => (req, res) => {
    const { userid } = req.body;
    let { sessionid } = req.cookies;

    console.log(req.cookies);

    if (sessionid === undefined) {
        sessionid = 'nill';
    }

    console.log(userid,sessionid); 

    db('sessions')
        .select('sessionid')
        .where({
            userid: userid,
            sessionid: sessionid
        })
        .then(sessionidtab => {
            if (sessionidtab.length > 0) {
                db('sessions')
                    .where({ sessionid: sessionid })
                    .del()
                    .then(deltab => {
                        res.cookie('sessionid', '', { expires: new Date(Date.now() - 1000000), httpOnly: false });
                        res.json({
                            status: 'success',
                        })
                    })
            } else {
                res.cookie('sessionid', '', { expires: new Date(Date.now() - 1000000), httpOnly: false });
                res.json({
                    status: 'failed',
                    code:'00',
                    message:'user not found'
                })
            }
        })
        .catch(err=>{
            console.log(err);
            res.json({
                status: 'failed',
                code:'01',
                message:'unknown error'
            })
        })
}