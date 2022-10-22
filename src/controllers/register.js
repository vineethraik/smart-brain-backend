import { mainUrl } from "../app.js";
import { getHash } from "../tools/hash.js";
import { sendEmailVerificationMail } from "../tools/mail.js";

const bcryptSaltRounds = 10;

export const handleRegister = (db, bcrypt) => (req, res) => {
    const { name, email, password } = req.body;
    console.log(name,email,password);
    const salt = bcrypt.genSaltSync(bcryptSaltRounds);
    const pass = bcrypt.hashSync(password, salt);
    const verification_id = getHash(`${name} and ${email}`, pass);

    db.transaction(trx => {
        db('users')
            .transacting(trx)
            .insert({
                name: name,
                email: email,
                hash: pass
            })
            .returning('userid')
            .then(out => {
                console.log('added user',out);
                return db('emailverification')
                    .transacting(trx)
                    .returning('userid')
                    .insert({
                        userid: out[0].userid,
                        verificationid: verification_id
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback);
    })
        .then(out => {
            console.log(out);
            sendEmailVerificationMail(email, `${mainUrl}/verify/${out[0].userid}/${verification_id}`)(name);
            res.json({
                status: 'success',
            });
        })
        .catch(err => {
            console.log(err);
            if (err.code === '23505') {
                res.json({
                    status: 'failed',
                    code: '00',
                    reason: 'email exist',
                    message: 'the email id provided is already registered , Please login or use different email id'
                });
            } else {
                res.json({
                    status: 'failed',
                    code: '01',
                    reason: 'unknown',
                    message: 'there was some problem ,please try again later'
                });
            }
        });
};
