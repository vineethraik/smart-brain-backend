import { createSessionId } from "./session.js";

export const handleProfileFetch = (db) => (req, res) => {
    const { userid } = req.params;
    let {sessionid} = req.cookies;

    console.log(userid,sessionid);

    if(sessionid===undefined){
        sessionid='nill'
    }

    db('sessions').select('*')
        .where(
            {
                userid: userid,
                sessionid: sessionid
            }
        )
        .then(sessiontab => {
            if (sessiontab.length > 0) {
                res.cookie('sessionid',sessionid,{ expires: new Date(Date.now() + (1000*60*60*24*2)), httpOnly: true })
                db('users')
                    .select('*')
                    .where({ userid: userid })
                    .then(out => {
                        db('requests')
                            .select('isawsurl as upload', 'requestedon as time', 'url')
                            .where({ userid: out[0].userid })
                            .then(out1 => {
                                res.json({
                                    status: 'success',
                                    data: {
                                        name: out[0].name,
                                        email: out[0].email,
                                        entries: out1,
                                        userid:out[0].userid,
                                    }
                                });
                            })
                            .catch(console.log);
                    })
                    .catch(console.log);
            } else {
                res.json({
                    status: 'failed',
                    code: '00',
                    message: 'authentication failed'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
                status: 'failed',
                code: '01',
                message: 'unknown error'
            });
        })


};