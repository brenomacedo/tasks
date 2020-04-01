const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const obtainHash = (password, callback) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, null, (err, hash) => callback(hash))
        })
    }

    const save = (req, res) => {
        obtainHash(req.body.password, hash => {
            const password = hash

            app.db('users').insert({ name: req.body.name, email: req.body.email, password })
                .then(() => res.json({ok: 'true'}))
                .catch(err => res.status(400).json(err))
        })
    }

    return { save }
}