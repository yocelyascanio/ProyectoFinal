const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const { Router } = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const MysqlStore = require('express-mysql-session');
const router = Router();
// const bodyParser = require('body-parser')
const mysql = require('mysql');
const myConnection = require('express-myconnection');

const { database } = require('./keys');

const app = express();

// importando rutas
// const registroRoutes = require('./routes/index');
const { extname } = require('path');

// settings
app.set('port', process.env.PORT || 3000);
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

// middlewares
app.use(session({
    secret: 'Martin Martinez',
    resave: false,
    saveUninitialized: false,
    store: new MysqlStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    next();
});

// routes
app.use(require('./routes/index'));
app.use('/links', require('./routes/index'));
// app.use(require('./routes/authentication'));
// app.use(require('./routes/links'));

// static files public
app.use(express.static(path.join(__dirname, 'public')));

// starting the server
app.listen(app.get('port'), () => {
    console.log(`Ejecutando en el puerto ${app.get('port')}`);
}
);

// CORREO ELECTRONICO
app.use(require('./routes/index'));
// View engine setup
// Static folder
app.use(express.static(path.join(__dirname)));

// Body Parser Middleware

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send-email', async (req, res)=>{
  const {name , email, phone, message}=req.body;  
  contentHTML =`
  <p>Ha recibido una nueva solicitud de contacto desde La Pagina WEB</p>
  <h3>Datos del Cliente:</h3>
  <ul>  
    <li>Nombre: ${name}</li>
    <li>Email: ${email}</li>
    <li>Telefono: ${phone}</li>
  </ul>
  <h3>Mensaje</h3>
  <p>${message}</p>
`;
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
 
    host: 'smtp.zoho.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'noreply@miencargopty.com', // generated ethereal user
      pass: 'zVp62wdH6!$GCyF'   // generated ethereal password
    },
    tls:{
        rejectUnauthorized: false
    }
     
  });
  const info = await transporter.sendMail({
 
    from: '"Contactenos" <noreply@miencargopty.com>', // sender address
      to: 'info@miencargopty.com', // list of receivers
      subject: 'SOLICITUD DE CONTACTO', // Subject line
      html: contentHTML
      
  });

  console.log('Mensaje Enviado', info.messageId);

  console.log(contentHTML);
  req.flash('success', 'Usuario Registrado satisfactoriamente');
  res.redirect('/registro');
 

  });

//comienza la implementacion
// enviar correo
router.post('/sent-email', async (req, res) => {
    const { id, nombre, apellido, cedula, fecha_de_nacimiento, email, celular, direccion, pais } = req.body;

    contentHTML = `
    <p>Te Saluda tus amigo MI ENCARGO PTY, tu numero de casillero es:</h3>
    <ul>  
      <li>Nombre: ${nombre}, ${apellido} / MIENCARGO</li>
      <p>Direccion: 1345 NW 98TH CT, ST2 Miami, Florida </p>
      <p>Codigo Postal: 33172-2779 </p>
      <p>Teléfono: 786 360-2816</p>
    </ul>

    <p>${id}</p>
  `;
    const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'noreply@miencargopty.com', // generated ethereal user
            pass: 'zVp62wdH6!$GCyF'   // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const info = await transporter.sendMail({
        from: '"Contactenos" <noreply@miencargopty.com>', // sender address
        to: 'info@miencargopty.com', // list of receivers
        subject: 'CASILLERO MI ENCARGO PTY', // Subject line
        html: contentHTML
    })
    // console.log('Message sent', info.messageId);
    req.flash('success', 'Usuario Registrado satisfactoriamente, Por favor revisa tu correo eletronico.');
    res.redirect('/registro');
});

router.post('/send-contact', async (req, res) => {
    const { name, email, phone, message } = req.body;
    contentHTML = `
    <p>Ha recibido una nueva solicitud de contacto desde La Pagina WEB</p>
    <h3>Datos del Cliente:</h3>
    <ul>  
      <li>Nombre: ${name}</li>
      <li>Email: ${email}</li>
      <li>Telefono: ${phone}</li>
    </ul>
    <h3>Mensaje</h3>
    <p>${message}</p>
  `;
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({

        host: 'smtp.zoho.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'noreply@miencargopty.com', // generated ethereal user
            pass: 'zVp62wdH6!$GCyF'   // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }

    });
    const info = await transporter.sendMail({

        from: '"Contactenos" <noreply@miencargopty.com>', // sender address
        to: 'info@miencargopty.com', // list of receivers
        subject: 'SOLICITUD DE CONTACTO', // Subject line
        html: contentHTML

    });

    // console.log('Message sent', info.messageId);
    req.flash('success', 'Mensaje Enviado');
    res.redirect('/contactos');

});

module.exports = router;
