export const htmlResponseVerificationSuccess=()=>{
    return (`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="shortcut icon" href="https://vineethraik.github.io/initial-web-dev/res/image/smartbrain/favicon.png" type="image/x-icon">
        <title>SmartBrain</title>
        <style>
            body{
                height: 99vh;
                background: linear-gradient(#417ece,#1a4175);
                overflow-y: hidden;
            }
            #main{
                width: 80vw;
                margin: 10px auto;
                padding: 1rem;
                text-align: center;
                box-shadow: 0px 0px 1rem black;
                border-radius: 1rem;
                font-size: 3rem;
                font-weight: 1000;
                color: rgb(14, 36, 69);
            }
        img{
            width: 20%;
        }
        </style>
    </head>
    
    <body>
        <div id="main">
            <img src="https://vineethraik.github.io/initial-web-dev/res/image/smartbrain/logo.png" alt="logo">
            <p>Hello ,Your email has been succussfully verified , You will be redirected to login shortly.</p>
            <script> setTimeout(() => { window.location.replace("https://smartbrain.vrkcreations.in/") }, 10000); </script>
        </div>
    
    </body>
    
    </html>`);
}

export const htmlResponseVerificationFailedInvalid=()=>{

    return (`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="shortcut icon" href="https://vineethraik.github.io/initial-web-dev/res/image/smartbrain/favicon.png" type="image/x-icon">
        <title>SmartBrain</title>
        <style>
            body{
                height: 99vh;
                background: linear-gradient(#417ece,#1a4175);
                overflow-y: hidden;
            }
            #main{
                width: 80vw;
                margin: 10px auto;
                padding: 1rem;
                text-align: center;
                box-shadow: 0px 0px 1rem black;
                border-radius: 1rem;
                font-size: 3rem;
                font-weight: 1000;
                color: rgb(135, 76, 17);
            }
        img{
            width: 20%;
        }
        </style>
    </head>
    
    <body>
        <div id="main">
            <img src="https://vineethraik.github.io/initial-web-dev/res/image/smartbrain/logo.png" alt="logo">
            <p>This link is invalid, please check the link again or Register.</p>
            </div>
    
    </body>
    
    </html>`);
}

export const htmlResponseVerificationFailedUnknown=()=>{

    return (`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="shortcut icon" href="https://vineethraik.github.io/initial-web-dev/res/image/smartbrain/favicon.png" type="image/x-icon">
        <title>SmartBrain</title>
        <style>
            body{
                height: 99vh;
                background: linear-gradient(#417ece,#1a4175);
                overflow-y: hidden;
            }
            #main{
                width: 80vw;
                margin: 10px auto;
                padding: 1rem;
                text-align: center;
                box-shadow: 0px 0px 1rem black;
                border-radius: 1rem;
                font-size: 3rem;
                font-weight: 1000;
                color: rgb(135, 76, 17);
            }
        img{
            width: 20%;
        }
        </style>
    </head>
    
    <body>
        <div id="main">
            <img src="https://vineethraik.github.io/initial-web-dev/res/image/smartbrain/logo.png" alt="logo">
            <p>Something went Wrong, please check the link again or contact <a href="mailto:vrkproject2022ec@gmail.com">vrkproject2022ec@gmail.com</a>.</p>
            </div>
    
    </body>
    
    </html>`);
}

export const htmlResponseVerificationEmail=(name,url)=>{
    return (`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    
    <body>
        <style>
            img {
                width: 20%;
                max-width: 100px;
            }
    
            h1 {
                color: #b4b2b2;
            }
    
            .inittext {
                color: #b4b2b2;
                font-weight: 1000;
            }
    
            a.button {
                -webkit-appearance: button;
                -moz-appearance: button;
                appearance: button;
                text-decoration: none;
                background: linear-gradient(#127ea5, #0d5b78);
                color: #949494;
                padding: 5px;
            }
    
            .span1 {
                color: #0915f2
            }
    
            #main {
                width: 80%;
                min-width: 300px;
                background: linear-gradient(#0056d7, #0072b9);
                margin: 10px auto;
                text-align: center;
                padding: 10px;
            }
        </style>
        <div id="main"> <img src="https://vineethraik.github.io/initial-web-dev/res/image/smartbrain/favicon.png" alt="logo">
            <h1>SmartBrain</h1>
            <p class="inittext">Hello ${name}. Thank you for testing out my SmartBrain project.</p>
            <p class="inittext"><a href="${url}" target="_blank" class="button">Click here</a> to verify.</p>
            <p class="inittext">If the above button does not work then copy paste this link into the browser. <span
                    class="span1"><br> ${url}</span> </p>
        </div>
        </body>
    
    </html>`);
}