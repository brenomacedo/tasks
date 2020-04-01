const moment = require('moment')
module.exports = app => {
    const getTasks = (req, res) => {
        const date = req.query.date ? req.query.date : moment().endOf('day').toDate()

        app.db('tasks').where({ userId: req.user.id })
        .where('estimateAt', '<=', date).orderBy('estimateAt')
        .then(tasks => res.json(tasks))
        .catch(err => res.status(400).json(err))
    }

    const save = (req, res) => {
        if(!req.body.desc || !req.body.desc.trim()) {
            return res.status(400).send('desc faltando')
        }

        req.body.userId = req.user.id

        app.db('tasks').insert(req.body)
            .then(_ => res.status(240).send('CADASTRADO COM SUCESSO'))
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .del()
            .then(rowsDeleted => {if(rowsDeleted > 0){
                return res.status(204).send('sucesso ao deletar')
            }else{
                return res.status(404).send('erro ao deletar')
            }}).catch(err => {
                return res.json(err)
            })
    }

    const updateTaskDoneAt = (req, res, doneAt) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .update({ doneAt })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const toggleTask = (req, res) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .first()
            .then(task => {
                if (!task) {
                    const msg = `Task com id ${req.params.id} não encontrada.`
                    return res.status(400).send(msg)
                }

                const doneAt = task.doneAt ? null : new Date()
                console.log(doneAt)
                updateTaskDoneAt(req, res, doneAt)
            })
            .catch(err => {
                res.status(404).json(err)
            })
    }

    return { getTasks, save, remove, toggleTask }
}