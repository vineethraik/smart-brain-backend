import { getHash } from "../tools/hash.js";

export const createSessionId = async (db, id) => {
    const hash = getHash(`${id} and ${Date.now()}`, 'hey there , how is life');

    return await db('sessions')
        .insert({
            sessionid: hash,
            userid: id,
            credtimeout: (new Date(Date.now() + (1000 * 60 * 60 * 24 * 2))),
            sessiontimeout: (new Date(Date.now() + (1000 * 60 * 60 * 24 * 14)))
        })
        .returning('sessionid')
        .then(out => out[0].sessionid)
        .catch(err => 'nill');
}


export const handleSession = (db) => (req, res) => {
    const { userid } = req.body;

    let {sessionid} = req.cookies;

    if(sessionid===undefined){
        sessionid='nill'
    }
    db('sessions')
        .select('*')
        .where({
            userid: userid,
            sessionid: sessionid
        })
        .then(out => {
            if (out.length > 0) {
                const credtimeout = new Date(out[0].credtimeout);
                const sessiontimeout = new Date(out[0].sessiontimeout);
                if (Date.now() > sessiontimeout.getTime()) {
                    res.json({
                        status: 'failed',
                        code: '02',
                        message: 'session timeout'
                    });
                    db('sessions')
                        .del()
                        .where({
                            userid: userid,
                            sessionid: sessionid
                        })
                        .catch(console.log)
                } else {
                    if (Date.now() > credtimeout.getTime()) {
                        const hash = getHash(`${out.userid} and ${Date.now()}`, 'hey there , how is life');
                        db('sessions')
                            .update({
                                sessionid: hash,
                                credtimeout: new Date(Date.now() + (1000 * 60 * 60 * 24 * 2)),
                            })
                            .where({ sessionid: out[0].sessionid })
                            .returning('*')
                            .then(out => {
                                db('users').select('*')
                                    .where({ userid: out[0].userid })
                                    .then(out1 => {
                                        db('requests')
                                            .select('requestedon as time', 'isawsurl as upload', 'url')
                                            .where({ userid: out[0].userid })
                                            .then(out2 => {
                                                res.json({
                                                    status: 'success',
                                                    data: {
                                                        userid: out1[0].userid,
                                                        name: out1[0].name,
                                                        email: out1[0].email,
                                                        entries: out2,
                                                        sessionid: out[0].sessionid
                                                    }
                                                });
                                            })
                                    })
                            })
                            .catch(err => {
                                console.log(err);
                                res.json({
                                    status: 'failed',
                                    code: '02',
                                    message: 'session timeout'
                                });
                            });
                    } else {
                        db('users').select('*')
                            .where({ userid: out[0].userid })
                            .then(out1 => {
                                db('requests')
                                    .select('requestedon as time', 'isawsurl as upload', 'url')
                                    .where({ userid: out[0].userid })
                                    .then(out2 => {
                                        res.json({
                                            status: 'success',
                                            data: {
                                                userid: out1[0].userid,
                                                name: out1[0].name,
                                                email: out1[0].email,
                                                entries: out2,
                                                sessionid: out[0].sessionid
                                            }
                                        });
                                    })
                            })
                    }
                }
            } else {
                res.json({
                    status: 'failed',
                    code: '01',
                    message: 'invalid session'
                });
            }
        })
        .catch(err => {

            console.log(err);
            res.json({
                status: 'failed',
                code: '00',
                message: 'unknown error'
            });
        })
};