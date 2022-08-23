//converting everything onto ES6:
import * as http from 'http';
import {default as express} from 'express';
import * as path from 'path';
import {default as cookieParser} from 'cookie-parser';
import {default as logger} from 'morgan';
//used to login every http request in node environment.
import {default as hbs} from 'hbs';
//import * as favicon from 'serve-favicon'
import {default as bodyParser} from 'body-parser';
import {approotdir} from './approotdir.mjs';
import { requireIt } from 'require-it';
import {default as rfs} from 'rotating-file-stream';
const __dirname=approotdir;
import{
  normalizePort, onError,onListening,handle404,basicErrorHandler


} from './appsupport.mjs';
import { default as DBG } from 'debug';
const debug = DBG('notes:debug');
const dbgerror = DBG('notes:error');
import {router as indexRouter} from './routes/index.mjs';
import {router as notesRouter} from './routes/notes.mjs';
// import { router as indexRouter } from './routes/index.mjs';
// import { router as notesRouter } from './routes/notes.mjs';
import { router as usersRouter, initPassport } from './routes/users.mjs';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
const FileStore = sessionFileStore(session);
export const sessionCookieName = 'notescookie.sid';
// import { InMemoryNotesStore } from './models/notes-memory.mjs';
// export const NotesStore = new InMemoryNotesStore();
import { useModel as useNotesModel } from './models/notes-store.mjs';
useNotesModel(process.env.NOTES_MODEL ? process.env.NOTES_MODEL :
'memory')
.then(store => { })
.catch(error => { onError({ code: 'ENOTESSTORE', error }); });

export const app=express()
//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','hbs')
hbs.registerPartials(path.join(__dirname, 'partials'))
//uncomment it after placing your favicon in public.
//app.use(favicon(path.join(__dirname,'public','favicon.ico')))
// app.use(logger('dev'))
//dev is concise status output for developers.Lets change its format
app.use(logger(process.env.REQUEST_LOG_FORMAT || 'dev', {
  stream: process.env.REQUEST_LOG_FILE ?
  rfs.createStream(process.env.REQUEST_LOG_FILE, {
    //1st argument is logged file.
  size: '10M',
  // rotate every 10 MegaBytes written
  interval: '1d', // rotate daily
  compress: 'gzip' // compress rotated files
})
: process.stdout
}));



//using an environment variable to override the default.
//if we dont supply configuration value, 'dev' willbe used.
app.use(bodyParser.json())
//we want to use json only. parse incoming request body and append data to `req.body`
app.use(bodyParser.urlencoded({extended:false}))
//extended false means we want simple algorithm for shallow parsing.we dont want nested objects to 
//to get parsed.
app.use(cookieParser())
//An application level middleware used for all API endpoionts in application.
app.use(express.static(path.join(__dirname,'public')))


app.use('/assets/vendor/feather-icons', express.static(
  path.join(requireIt.directory("feather-icons"), 'dist')));
  // the directory method returns the pathname of the root of the module.
  /*feather-icons dont have node's code.So how to access such files inside node-modules hierarchy.
  one method is to Use Content-delivery-network(CDN).but this might break application if one of the
  javascript file breaks and users dont care why.
  another good method is to install them directly into your application as node.js Modules and access them from 
  inside directly by using the following code.*/
app.use('/assets/vendor/bootstrap', express.static(
  path.join(requireIt.directory("bootstrap"), 'dist')));
  app.use('/assets/vendor/jquery', express.static(
  path.join(requireIt.directory("jquery"), 'dist')));
  app.use('/assets/vendor/popper.js', express.static(
  path.join(requireIt.directory("popper.js"), 'dist', 'umd')));

//now by using reqiureIt application is little less fragile than before.

//Router function list
app.use('/',indexRouter)
app.use('/notes',notesRouter)
app.use('/users', usersRouter);
// app.use(passport.initialize())

//eror handlers
//catch 404 and forward to error handler
app.use(handle404)
app.use(basicErrorHandler)
export const port=normalizePort(process.env.PORT||'3011')
app.set('port',port)
export const server=http.createServer(app)
server.listen(port)
server.on('error',onError)
server.on('listening',onListening)
server.on('request', (req, res) => {
  debug(`${new Date().toISOString()} request ${req.method}
  ${req.url}`);
  });

  app.use(session({
    store: new FileStore({ path: "sessions" }),
    secret: 'keyboard mouse',
    resave: true,
    saveUninitialized: true,
    name: sessionCookieName
}));
initPassport(app);

