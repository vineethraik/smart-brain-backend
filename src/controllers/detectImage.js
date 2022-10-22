import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc";


export const handleDetectImage = (db) => (req, res) => {

    const stub = ClarifaiStub.grpc();

    const metadata = new grpc.Metadata();
    metadata.set("authorization", `Key ${process.env.smartbrain_clarifai_api_key}`);

    const { imageUrl, userid } = req.body;

    let {sessionid} = req.cookies;

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
                stub.PostModelOutputs(
                    {
                        // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
                        model_id: "face-detection",
                        inputs: [{ data: { image: { url: imageUrl } } }]
                    },
                    metadata,
                    (err, response) => {
                        if (err) {
                            console.log(err);
                            res.json({
                                status: 'failed',
                                code: '01',
                                message: 'image detection failed'
                            });
                            return;
                        }

                        if (response.status.code !== 10000) {
                            console.log('err not 10000');
                            res.json({
                                status: 'failed',
                                code: '01',
                                message: 'image detection failed'
                            });
                            return;
                        }


                        res.json({ status:'success', data: response.outputs[0].data.regions.map((res) => res.region_info.bounding_box) });


                    }
                );

                db('requests')
                .insert({
                    userid:userid,
                    url:imageUrl,
                    isawsurl:false
                })
                .then(console.log)
                .catch(console.log);

            } else {
                res.json({
                    status: 'failed',
                    code: '00',
                    message: 'authentication failed'
                });
            }
        }).catch(err => {
            res.json({
                status: 'failed',
                code: '00',
                message: 'authentication failed'
            });
        })

};