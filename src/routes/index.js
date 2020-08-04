const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// const registroController = require('../controllers/registroController');

// router.get('/', registroController.list);
// router.post('/registro', registroController.save);

// cambios adicionales abajo

router.post('/send-email', async (req, res)=>{
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

 const transporter = nodemailer.createTransport({

    host: 'smtp.zoho.com',
    port: 587,
    secure: false,  
    auth: {
        user: 'noreply@miencargopty.com', // generated ethereal user
        pass: 'zVp62wdH6!$GCyF'  // generated ethereal password
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
  req.flash('success', 'Mensaje Enviado Satisfactoriamente Pronto nos pondremos en contacto contigo.');
  res.redirect('/links');
});


//cambios

router.post('/sent-email', async (req, res) => {
    const { id, nombre, apellido, cedula, fecha_de_nacimiento, email, celular, direccion, pais } = req.body;

    contentHTML = `
    <p>Te Saluda tu amigo MI ENCARGO PTY, tu numero de casillero es:</h3>
    <ul>  
      <h2>Nombre: ${nombre}, ${apellido} / MIENCARGO</h2>
      <h2>Direccion: 1345 NW 98TH CT, ST2 Miami, Florida </h2>
      <h2>Codigo Postal: 33172-2779 </h2>
      <h2>Teléfono: 786 360-2816</h2>
    </ul>

    <p>Por favor copia y pega estos datos en tu pagina de compra y disfruta de tu casillero.</p>
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
        from: '"No Reply" <noreply@miencargopty.com>', // sender address
        to: 'info@miencargopty.com', // list of receivers
        subject: 'CASILLERO MI ENCARGO PTY', // Subject line
        html: contentHTML
    })
    // console.log('Message sent', info.messageId);
    req.flash('success', 'Usuario Registrado satisfactoriamente, Por favor revisa tu correo eletrónico.');
    res.redirect('/links');
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


// BASE DE DATOS

const pool = require('../databse');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/registro', (req, res) => {
    res.render('links/registro');
});

router.get('/tarifas', (req, res) => {
    res.render('links/tarifas');
});

router.get('/casillero', (req, res) => {
    res.render('links/casillero');
});

router.get('/rastreo', (req, res) => {
    res.render('links/rastreo');
});

router.get('/calculadora', (req, res) => {
    res.render('links/calculadora');
});

router.get('/pagos', (req, res) => {
    res.render('links/pagos');
});

router.get('/terminos', (req, res) => {
    res.render('links/terminos');
});

router.get('/nosotros', (req, res) => {
    res.render('links/nosotros');
});

router.get('/contactos', (req, res) => {
    res.render('links/contactos');
});

router.post('/registro', async (req, res) => {
        const { id, nombre, apellido, cedula, fecha_de_nacimiento, email, celular, direccion, pais } = req.body;
        const newLink = {
            id,
            nombre,
            apellido,
            cedula,
            fecha_de_nacimiento,
            email,
            celular,
            direccion,
            pais
        }
        await pool.query('INSERT INTO users set ?', [newLink]);
        req.flash('success', 'Usuario Registrado, revise su correo para ver su casillero');
        res.redirect('/links');
    });

router.get('/', async (req, res) => {
    const links = await pool.query('SELECT * FROM users');
    console.log(links);
    res.render('links/list', { links });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE ID = ?', [id]);
    req.flash('success', 'Usuario Eliminado Removido satisfactoriamente');
    res.redirect('/links');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    res.render('links/edit', { link: links[0] });
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, cedula, fecha_de_nacimiento, email, celular, direccion, pais } = req.body;
    const newLink = {
        nombre,
        apellido,
        cedula,
        fecha_de_nacimiento,
        email,
        celular,
        direccion,
        pais
    }
    await pool.query('UPDATE users set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Usuario actualizado satisfactoriamente');
    res.redirect('/links');
});


module.exports = router;