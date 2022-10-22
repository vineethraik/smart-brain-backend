
import greenlockExpress from 'greenlock-express';
import app from './src/app.js'

import * as url from 'url';
    const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

greenlockExpress
    .init({
        packageRoot: __dirname,
        maintainerEmail: "vineethraik@gmail.com",
        configDir: './greenlock.d',
        cluster: false
    })
    .serve(app);
