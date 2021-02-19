const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const app = express();
const bodyParser = require('body-parser')
const Todo_schema = require('./models/Todo_schema');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(express.json())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



const PORT = config.get('port') || 5000

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,

        })
        app.listen(PORT, () => console.log(`server is live!!! on ${PORT}`));

        app.get('/', (req, res) => { 
            res.set('Access-Control-Allow-Origin', '*');
            const id = req.params.todo_schemasId;
            Todo_schema.find()
            .exec()
            .then(docs => {
              console.log(docs);
              res.status(200).json(docs);
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error: err
              });
            });           
        })
        
        app.post('/', async (req, res) => {

            try {

                const task = req.body

                const todo = new Todo_schema(task)

                await todo.save()

                res.status(200).json({ message: 'Задача создана :)' }).body
                console.log(req.body)

            } catch (err) {
                console.log(err)
                res.status(500).json({ message: 'Опааа... Какаято лажа :-(' })
            }

        })
        app.delete("/", (req, res) => {
            res.set('Access-Control-Allow-Methods', '*');
            console.log(req.body);
            const id = req.body.Todo_schemaId;
            Todo_schema.deleteOne({ __id: id })
              .exec()
              .then(result => {
                res.status(200).json(result);
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }); 
    } catch (err) {
        console.log('server ERROR o0...', err.message)
        process.exit(1)
    }
}


start()

module.exports = app;
