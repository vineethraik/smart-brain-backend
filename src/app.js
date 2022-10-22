/** Documentation
 * Express server for backend api
 * api methods (request must be in json with specific name given ,or of the format)
 * 1. /register POST
 *          require-> name, email, password             
 *          returns-> status(success/failed)            
 *              success->   <nodata>
 *              failed ->   
 *                  reason
 *                  message
 *                  code(00/01)
 *                      00->    email already registered
 *                      01->    unknown error
 * 
 * 2. /verify GET
 *          require-> /<userid>/<verificationid>
 *          returns-> html response
 *              verified->  html response and redirected to login after 10 seconds
 *              failed ->   
 *                  invalid link->  html response of invalid link
 *                  unknown ->      html response of unknown error
 * 
 * 3. /verify/sendmail 
 *          require-> userid
 *          returns->
 *              status(success/failed)
 *              message
 *              code(00/01/02/11)
 *                  00-> user does not exist
 *                  01-> email already verified
 *                  02-> unknown problem
 *                  11-> verification mail sent successfully
 *                 
 * 4. /signin POST
 *          require-> email, password             
 *          returns-> status(success/failed)            
 *              success->
 *                  data->{name,email,entries,sessionid}
 *              failed ->   
 *                  reason
 *                  message
 *                  code(00/01)
 *                      00->    wrong credential
 *                      01->    email verification in-complete
 * 
 * 5. /session POST
 *          require-> userid, sessionid             
 *          returns-> status(success/failed)            
 *              success->
 *                  data->{userid,name,email,entries,sessionid}
 *              failed ->   
 *                  message
 *                  code(00/01/02)
 *                      00->    unknown error
 *                      01->    invalid session id
 *                      02->    session timeout
 * 
 *  6. /detectImage PUT
 *          require-> imageUrl, userid, sessionid             
 *          returns-> status(success/failed)            
 *              success->
 *                  data->[rectangle %data]
 *              failed ->
 *                  message
 *                  code(00/01)
 *                      00->    authentication failed
 *                      01->    image detection error
 * 
 *  7. /profile GET
 *          require-> /<userid>
 *          require-> sessionid
 *          returns-> status(success/failed)            
 *              success->
 *                  data-> {name,email,entries,sessionid}
 *              failed ->
 *                  message
 *                  code(00/01)
 *                      00->    authentication failed
 *                      01->    unknown error
 * 
 *  8. /leaderboard GET
 *          require-> userid, sessionid
 *          returns-> status (success/failed)
 *              success->
 *                  data-> {unique[],total[]}
 *              failed ->
 *                  message
 *                  code(00)
 *                      00->    authentication failed
 * 
 */

// export const mainUrl="http://localhost:3000";
let tempUrl;
if (process.env.smartbrain_mainUrl !== undefined) {
    tempUrl = process.env.smartbrain_mainUrl;
} else {
    tempUrl = "https://api.smartbrain.vrkcreations.in";
}
export const mainUrl = tempUrl;


import Express from "express";
import cors from 'cors'
import knex from "knex";
import bcrypt from 'bcrypt';
import cookieParser from "cookie-parser";


import { handleRegister } from "./controllers/register.js";
import { handleSignIn } from "./controllers/signIn.js";
import { handleProfileFetch } from "./controllers/profile.js";
import { handleSession } from "./controllers/session.js";
import { handleDetectImage } from "./controllers/detectImage.js";
import { handleSendMail, handleVerifyEmail } from "./controllers/verify.js";
import { handleGetLeaderBoard } from "./controllers/leaderboard.js";
// import { handleTestCookie } from "./controllers/testcookie.js";
import { handleLogout } from "./controllers/logout.js";

/* database init */
const db = knex({
    client: 'pg',
    connection: {
        host: process.env.smartbrain_db_link,
        port: process.env.smartbrain_db_port,
        user: process.env.smartbrain_db_user,
        password: process.env.smartbrain_db_password,
        database: 'smartbrain'
    }
});


const app = Express();

const corsOptions = {
    origin:['http://localhost:3001','https://smartbrain.vrkcreations.in','*'],
    credentials: true,
}
app.use(cookieParser())
app.use(cors(corsOptions));
// app.use(cors());
app.use(Express.json())


app.post('/register', handleRegister(db, bcrypt));
app.get('/verify/:uid/:vid', handleVerifyEmail(db));
app.post('/verify/sendmail', handleSendMail(db));
app.post('/signIn', handleSignIn(db, bcrypt));
app.post('/logout', handleLogout(db));
app.post('/session', handleSession(db));
app.put('/detectImage', handleDetectImage(db));
app.get('/profile/:userid', handleProfileFetch(db));
app.post('/leaderboard', handleGetLeaderBoard(db));


//app.get('/test', handleTestCookie);



app.listen(3000);

export default app;