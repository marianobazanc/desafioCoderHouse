import express from 'express'
import session from 'express-session'
import handlebars from 'express-handlebars'
import { Server} from 'socket.io'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import cookieParser from 'cookie-parser'

import routerApp from '../src/routes/index.js'
import { __dirname } from './utils.js'
import  messageSocket  from './utils/messageSocket.js'
import { connectDB, objetConfig } from './config/index.js'
import { initializePassport } from './config/passport.config.js'

const {port}= objetConfig
const app = express()

const httpServer = app.listen(port, error => {
    if(error) console.log(error)
    console.log('Server en purto: ', port)
})
const io = new Server(httpServer)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/public'))
app.use(cookieParser())

app.engine('handlebars', handlebars.engine())

app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://evangelinavarela:evangelina1234@cluster0.l5uohuv.mongodb.net/ecommerce',
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 60 * 60 * 1000 * 24
    }),
    secret: 's3cr3etC@d3r',
    resave: true,
    saveUninitialized: true
}))
initializePassport() 
app.use(passport.initialize())
app.use(passport.session())
app.use(routerApp)

connectDB()
app.use(messageSocket(io))
