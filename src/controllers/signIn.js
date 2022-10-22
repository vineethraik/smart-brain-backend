import { createSessionId } from "./session.js";

export const handleSignIn = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;

    db('users')
        .select('*')
        .where({ email: email })
        .then(out => {
            if (out.length > 0) {
                if (bcrypt.compareSync(password, out[0].hash)) {
                    if (out[0].emailverified === true) {
                        db('requests')
                            .select('isawsurl as upload', 'requestedon as time', 'url')
                            .where({ userid: out[0].userid })
                            .then(out1 => {
                                createSessionId(db, out[0].userid)
                                    .then(out3 => {
                                        res.cookie('sessionid',out3,{ expires: new Date(Date.now() + (1000*60*60*24*2)), httpOnly: false })
                                        res.json({
                                            status: 'success',
                                            data: {
                                                userid:out[0].userid,
                                                name: out[0].name,
                                                email: out[0].email,
                                                entries: out1,
                                            }
                                        });
                                    })
                                    .catch(err => {
                                        res.cookie('sessionid',out3,{ expires: new Date(Date.now() + (1000*60*60*24*2)), httpOnly: false })
                                        res.json({
                                            status: 'success',
                                            data: {
                                                userid:out[0].userid,
                                                name: out[0].name,
                                                email: out[0].email,
                                                entries: out1,
                                            }
                                        });
                                    })
                            })
                            .catch(err => {
                                createSessionId(db, out[0].userid)
                                    .then(out3 => {
                                        res.cookie('sessionid',out3,{ expires: new Date(Date.now() + (1000*60*60*24*2)), httpOnly: false })
                                        res.json({
                                            status: 'success',
                                            data: {
                                                userid:out[0].userid,
                                                name: out[0].name,
                                                email: out[0].email,
                                                entries: [],
                                            }
                                        });
                                    })
                                    .catch(err => {
                                        res.cookie('sessionid',out3,{ expires: new Date(Date.now() + (1000*60*60*24*2)), httpOnly: false })
                                        res.json({
                                            status: 'success',
                                            data: {
                                                userid:out[0].userid,
                                                name: out[0].name,
                                                email: out[0].email,
                                                entries: [],
                                            }
                                        });
                                    })
                            });


                    } else {
                        res.json({
                            status: 'failed',
                            code: '01',
                            userid:out[0].userid,
                            reason: 'email verification in complete',
                            message: 'Please check the credentials and try again, or Register'
                        });
                    }
                } else {
                    res.json({
                        status: 'failed',
                        code: '00',
                        reason: 'wrong credentials',
                        message: 'Please check the credentials and try again, or Register'
                    });
                }


            } else {
                res.json({
                    status: 'failed',
                    code: '00',
                    reason: 'wrong credentials',
                    message: 'Please check the credentials and try again, or Register'
                });
            }
        });

};
