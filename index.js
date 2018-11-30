const 
    express = require('express'),
    http = require('http'),
    server = http.createServer(function(request, response){}),
    socketIO = require('socket.io'),
    io = socketIO(server),
    app = express(),
    loki = require('lokijs'),
    cors = require('cors'),
    config = require('./config.js'),
    db = new loki('./data/test.json',{
        // autosave: true,
        // autoload: true,
    });

app.use(express.static('dist'));
app.use(cors());

db.loadDatabase({},()=> {
    let users = db.getCollection('users')
    io.on('connection', (client) => {
        client.on('getNotes',() => {
            let data = users.data
            let obj = {}
            data.forEach(el => {
                if (el.tags) {
                    for (var i = 0; i < el.tags.length; i++) {
                      var str = el.tags[i];
                      obj[str] = true; // запомнить строку в виде свойства объекта
                    }
                }
            });
            io.sockets.emit('getTags',Object.keys(obj))
            io.sockets.emit('getNotes',data)
        })
        client.on('addNote',data => {
            users.insert(data)
            db.saveDatabase();
        })    
        client.on('updateNotes',data => {
            var obj = users.findOne({ id:data.id });
            obj.title = data.title
            obj.content = data.content
            obj.tags = data.tags
            db.saveDatabase();
        })
        client.on('delete_note',id => {
            var obj = users.findOne({ id:id });
            users.remove(obj)
            db.saveDatabase();
        })
    })
})

server.listen(config.port_socket,config.host, () => console.log('Socket ready on '+config.host+':'+config.port_socket));
app.listen(config.port_http,config.host, () => console.log('http ready on '+config.host+':'+config.port_http));

io.on('connection', function (socket) {
    console.log('A client is connected!');   
});