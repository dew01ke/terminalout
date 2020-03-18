const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const spawn = require('spawn-promise');

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function response(res, stdout) {
    return res.json({
        stdout,
    });
}

function parseArguments(text = '') {
    const pattern = /^task[\s]*(.*?)$/i;
    const cmd = text.trim();
    const [source, args] = cmd.match(pattern) || [];

    return {
        valid: /^task/.test(cmd),
        args: (args && typeof args === 'string') ? args.split(' ') : []
    };
}

function output(buffer) {
    return buffer.toString('utf8');
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/run', (req, res) => {
    const { cmd } = req.body;
    const { valid, args } = parseArguments(cmd);

    if (!valid) {
        return response(res, 'invalid command, command must start with `task` keyword');
    }

    if (!args.length) {
        return response(res, 'no arguments passed',);
    }

    spawn('task', args)
        .then((stdout) => response(res, output(stdout)))
        .catch((stderr) => response(res, output(stderr)));
});

app.listen(port, () => {
    console.log('Terminalout running on port', port);
});
