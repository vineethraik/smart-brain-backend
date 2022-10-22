import { mainUrl } from "../app.js";
import { getHash } from "../tools/hash.js";
import { htmlResponseVerificationFailedInvalid, htmlResponseVerificationFailedUnknown, htmlResponseVerificationSuccess } from "../tools/htmlResponseGenerator.js";
import { sendEmailVerificationMail } from "../tools/mail.js";


export const handleVerifyEmail = (db) => (req, res) => {
    const { uid, vid } = req.params;

    db.transaction(trx => {
        db('emailverification')
            .transacting(trx)
            .select('*')
            .returning('userid')
            .where({
                userid: uid,
                verificationid: vid
            })
            .then(out => {
                if (out.length > 0) {
                    return db('users')
                        .transacting(trx)
                        .returning('userid')
                        .update({ emailverified: true })
                        .where({ userid: out[0].userid })
                        .then(out => {
                            return db('emailverification')
                                .transacting(trx)
                                .del()
                                .where({ userid: out[0].userid })
                        })  
                } else {
                    const err = new Error('link invalid');
                    err.code = '000000';
                    throw err;
                }
            })
            .then(trx.commit)
            .catch(trx.rollback)

    })
        .then(out => {
            res.send(htmlResponseVerificationSuccess());
        })
        .catch(err => {
            console.log(err);
            if (err.code === '000000') {
                res.send(htmlResponseVerificationFailedInvalid());
            } else {
                res.send(htmlResponseVerificationFailedUnknown());
            }

        })


};


export const handleSendMail = (db) => (req, res) => {
    const { userid } = req.body;
    db('users')
        .select('*')
        .where({ userid: userid })
        .then(out => {
            if (out.length > 0) {
                if (out[0].emailverified === false) {
                    db('emailverification')
                        .select('*')
                        .where({ userid: userid })
                        .then(out1 => {
                            if (out1.length > 0) {
                                sendEmailVerificationMail(out[0].email, `${mainUrl}/verify/${out1[0].userid}/${out1[0].verificationid}`)(out[0].name)

                                res.json({
                                    status: 'success',
                                    code: '11',
                                    message: 'Verification mail sent successfully'
                                });
                            } else {
                                const verification_id = getHash(`${out[0].name} and ${out[0].email}`, out[0].hash);
                                db('emailverification')
                                    .returning('*')
                                    .insert({
                                        userid: out[0].userid,
                                        verificationid: verification_id
                                    })
                                    .then(out2 => {
                                        sendEmailVerificationMail(out[0].email,
                                            `${mainUrl}/verify/${out2[0].userid}/${out2[0].verificationid}`
                                        )(out[0].name)
                                        res.json({
                                            status: 'success',
                                            code: '11',
                                            message: 'Verification mail sent successfully'
                                        });
                                    })
                                    .catch(err=>{
                                        console.log(err);
                                        res.json({
                                            status: 'failed',
                                            code: '02',
                                            message: 'unknown problem'
                                        });
                                    });
                            }
                        })
                } else {
                    res.json({
                        status: 'failed',
                        code: '01',
                        message: 'Verification already completed'
                    });
                }

            } else {
                res.json({
                    status: 'failed',
                    code: '00',
                    message: 'user not found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
                status: 'failed',
                code: '02',
                message: 'unknown problem'
            });
        })
}