const { Schema, model } = require('mongoose');

const Bal = Schema({
    id: String,
    balence: {
        default: '0',
        type: Number
    }
});

module.exports = model('Bal', Bal);
