const { GoogleSpreadsheet } = require('google-spreadsheet');

const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  addAnswer,
  addAction,
  EVENTS,
} = require('@bot-whatsapp/bot');

const fs = require('fs');
const RESPONSES_SHEET_ID = '11VkICw1I8xQj8mnma-yXl--M_kS-2pg0713UGaJzmCQ'; //Aquí pondras el ID de tu hoja de Sheets
const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID);
const CREDENTIALS = JSON.parse(fs.readFileSync('./credenciales.json'));
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
//const MySQLAdapter = require('@bot-whatsapp/database/mysql');

let STATUS = {}; // Variable para GoogleSheets
let STATE = true; // Variable de estado del bot

const flowModelo = addKeyword([
  'a',
  'e',
  'i',
  'o',
  'u',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
])
  // Funcion para apagar el bot
  .addAction(async () => {
    STATE = false;
  })

  .addAnswer(
    'Entiendo, y qué modelo es? 🤔\n\n📝 Ejemplo: *Galaxy J7*',
    { capture: true },

    async (ctx, { flowDynamic }) => {
      telefono = ctx.from;
      modelo = STATUS[telefono] = { ...STATUS[telefono], modelo: ctx.body };

      ingresarDatos();
      async function ingresarDatos() {
        console.log(STATUS[telefono].modelo);
        let rows = [
          {
            Cliente: STATUS[telefono].cliente,
            Marca: STATUS[telefono].marca,
            Modelo: STATUS[telefono].modelo,
            Problema: STATUS[telefono].problema,
            Telefono: STATUS[telefono].telefono,
          },
        ];

        await doc.useServiceAccountAuth({
          client_email: CREDENTIALS.client_email,
          private_key: CREDENTIALS.private_key,
        });
        await doc.loadInfo();
        let sheet = doc.sheetsByIndex[0];
        for (let index = 0; index < rows.length; index++) {
          const row = rows[index];
          await sheet.addRow(row);
        }
      }

      return flowDynamic(
        'Un placer haber sido de ayuda, en breve se estará conectando un agente 😊'
      );
    }
  );

const flowMarca = addKeyword(['a', 'e', 'i', 'o', 'u']).addAnswer(
  '📝 Escribe el número que corresponda a la marca de celular que tienes 📲 \n\n1️⃣ *Samsung*\n2️⃣ *Motorola*\n3️⃣ *Iphone*\n4️⃣ *Huawei*\n5️⃣ *Xiaomi*\n6️⃣ *Otro*',
  { capture: true },

  async (ctx, { flowDynamic, fallBack }) => {
    telefono = ctx.from;

    if (ctx.body == 1) {
      marca = STATUS[telefono] = { ...STATUS[telefono], marca: 'Samsung' };
    } else if (ctx.body == 2) {
      marca = STATUS[telefono] = { ...STATUS[telefono], marca: 'Motorola' };
    } else if (ctx.body == 3) {
      marca = STATUS[telefono] = { ...STATUS[telefono], marca: 'Iphone' };
    } else if (ctx.body == 4) {
      marca = STATUS[telefono] = { ...STATUS[telefono], marca: 'Huawei' };
    } else if (ctx.body == 5) {
      marca = STATUS[telefono] = { ...STATUS[telefono], marca: 'Xiaomi' };
    } else if (ctx.body == 6) {
      marca = STATUS[telefono] = { ...STATUS[telefono], marca: 'Otro' };
    } else {
      return fallBack();
    }

    flowDynamic();
  },
  [flowModelo]
);

const flowCliente = addKeyword([
  'a',
  'e',
  'i',
  'o',
  'u',
  'lg',
  'pixel',
  'sony',
  '2',
  '3',
  'ok',
  'chip',
  'sim',
  'cable',
  'pin',
  'carga',
  'coso',
  'sucio',
  'boton',
  'botones',
  'id',
  'face',
  'lector',
  'camara',
  'zoom',
  'audio',
  'microfono',
  'altavoz',
  'altavoces',
  'sonido',
])
  .addAnswer('Ya casi terminamos ✅🫡')

  .addAnswer(
    '¿Cuál es tu nombre y tu apellido? 📝👤',
    { capture: true },

    async (ctx, { flowDynamic }) => {
      telefono = ctx.from;
      cliente = STATUS[telefono] = { ...STATUS[telefono], cliente: ctx.body }; //➡️ Variable del STATUS
      telefono = STATUS[telefono] = { ...STATUS[telefono], telefono: ctx.from };

      flowDynamic();
    },
    [flowMarca]
  );

/////////////////////////////////////////////////////////////////////////////      FIN PEDIR DATOS ESTADO DE REPARACION        //////////////////////////////////////////////////////////////////////////////////////////////////////

const flowOrdenN = addKeyword([
  'a',
  'e',
  'i',
  'o',
  'u',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
])
  // Funcion para apagar el bot
  .addAction(async () => {
    STATE = false;
  })
  .addAnswer(
    'Qué número de orden figura en tu boleta? 📝👤',

    { capture: true },

    async (ctx, { flowDynamic }) => {
      telefono = ctx.from; // A mejorar, potencial basura

      return flowDynamic(
        'Un placer haber sido de ayuda, en breve se estará conectando un agente'
      );
    }
  );

const flowEquipoRevisado = addKeyword(['a', 'e', 'i', 'o', 'u']).addAnswer(
  'Por favor facilitame el nombre del equipo que nos trajiste 📝👤',
  null,
  null,
  [flowOrdenN]
);

const flowCliente3 = addKeyword('3').addAnswer(
  '¿Cuál es tu nombre y tu apellido? 📝👤',
  null,
  null,
  [flowEquipoRevisado]
);

/////////////////////////////////////////////////////////////////////////////      FIN PEDIDO DE DATOS PARA GREMIO        //////////////////////////////////////////////////////////////////////////////////////////////////////

const flowGremio = addKeyword(['a', 'e', 'i', 'o', 'u'])
  // Funcion para apagar el bot
  .addAction(async () => {
    STATE = false;
  })
  .addAnswer(
    'Contame un poco como te puedo ayudar con respecto al gremio o temas relacionados 📝👤',

    { capture: true },

    async (ctx, { flowDynamic }) => {
      telefono = ctx.from; // A mejorar, potencial basura

      return flowDynamic(
        'Un placer haber sido de ayuda, en breve se estará conectando un agente'
      );
    }
  );

const flowLocalidad2 = addKeyword(['a', 'e', 'i', 'o', 'u']).addAnswer(
  '¿De dónde sos? 📝👤',
  null,
  null,
  [flowGremio]
);

const flowCliente2 = addKeyword('2').addAnswer(
  '¿Cuál es tu nombre y tu apellido? 📝👤',
  null,
  null,
  [flowLocalidad2]
);

/////////////////////////////////////////////////////////////////////////////      FIN PROBLEMA        //////////////////////////////////////////////////////////////////////////////////////////////////////

const flowProblema = addKeyword('otros').addAnswer(
  '😊 Estoy para escucharte y ofrecerte la mejor solución posible 💪\n\n¡Adelante! 👂🏽 Contame más detalles sobre el inconveniente que estás experimentando!',

  { capture: true },
  async (ctx, { flowDynamic }) => {
    telefono = ctx.from;
    problema = STATUS[telefono] = { ...STATUS[telefono], problema: ctx.body };

    flowDynamic();
  },
  [flowCliente]
);

const flowFoto = addKeyword(['1', '2', '3'])
  .addAnswer(
    '✍️ Para poder brindarte una mejor asistencia, necesitaría que me envíes una foto del teléfono que queres reparar tomada con otro celular, con la pantalla encendida y un fondo blanco. Así podré evaluar con mayor precisión la situación y darte la mejor solución posible 💪'
  )

  // Imagen de ejemplo de como tienen que sacar la foto

  .addAnswer(
    '📷 Este es un ejemplo de como se tendría que ver',
    {
      media: 'https://raw.githubusercontent.com/aptimia/wpp-chatbot001/main/CelularConPantallaBlanca.jpeg',
    },
    null,
    [flowCliente]
  );

/////////////////////////////////////////////////////////////////////////////      FIN PANTALLA        //////////////////////////////////////////////////////////////////////////////////////////////////////

const flowPantalla = addKeyword(['Pantalla', '1']).addAnswer(
  '¡Gracias por la información! 😊\nParece que la falla está relacionada con la pantalla, contame como esta: 📱👆:\n\n1️⃣ Astillada ( Elegir si la imagen y el táctil funcionan a la perfección )\n2️⃣ No me da imagen, está blanca o verde, pero nunca se me golpeó\n3️⃣ Se me rompió completamente debido a un golpe\n\n🤖 Si la falla no corresponde con ninguna de las opciones, no te preocupes. ¡Simplemente escribe *otros*! Estoy aquí para escuchar y resolver cualquier problema que puedas tener. 😊💬',

  { capture: true },
  async (ctx, { flowDynamic, fallBack }) => {
    telefono = ctx.from;
    if (ctx.body == 1) {
      problema = STATUS[telefono] = {
        ...STATUS[telefono],
        problema: 'Pantalla astillada',
      };
    } else if (ctx.body == 2) {
      problema = STATUS[telefono] = {
        ...STATUS[telefono],
        problema: 'Problemas con la imagen',
      };
    } else if (ctx.body == 3) {
      problema = STATUS[telefono] = {
        ...STATUS[telefono],
        problema: 'Pantalla rota debido un golpe',
      };
    } else if (ctx.body.includes('otros')) {
    } else {
      return fallBack();
    }

    flowDynamic();
  },
  [flowFoto, flowProblema]
);

//////////////////////////////////////////////////////////////////////      FIN PRINCIPALES        //////////////////////////////////////////////////////////////////////////////////////////////////////

const flowCursos = addKeyword('4')
  // Funcion para apagar el bot
  .addAction(async () => {
    STATE = false;
  })

  .addAnswer(
    '📚 ¡Tenemos varios cursos y capacitaciones disponibles para empresas 💼 ! Tanto en formato online como presencial.\n\nSe acerca la fecha de los próximos congresos en México 🇲🇽 y Uruguay 🇺🇾! 🎓🌟'
  )

  .addAnswer(
    'Seguinos en nuestras redes para ver toda la info! 😉\n\n📷 Instagram: @matias.mancinelli.ok\n📱 Tiktok: @matiasmancinelli01'
  );

const flowTelefono = addKeyword(['Problemas con mi telefono', '1']).addAnswer(
  '💬 Estoy para ayudarte, tu celular tiene algún problema relacionado con alguno de estos temas?\n\n1️⃣ Problemas con mi pantalla ( Somos especialistas )\n2️⃣ Quiero cambiar la batería de mi teléfono\n3️⃣ Problemas relacionados a carga o fallas electrónicas',

  { capture: true },
  async (ctx, { flowDynamic, fallBack }) => {
    telefono = ctx.from;
    if (ctx.body == 1) {
    } else if (ctx.body == 2) {
      problema = STATUS[telefono] = {
        ...STATUS[telefono],
        problema: 'Quiere cambiar la batería',
      };
    } else if (ctx.body == 3) {
      problema = STATUS[telefono] = {
        ...STATUS[telefono],
        problema: 'Relacionado a carga o fallas electrónicas',
      };
    } else {
      return fallBack();
    }

    flowDynamic();
  },
  [flowPantalla, flowCliente]
);

//////////////////////////////////////////////////////////////////////      FIN BIENVENIDA        //////////////////////////////////////////////////////////////////////////////////////////////////////

// flowPrincipal
//-----------------------------------------------------------------------------------
//        1.flowTelefono
//                1.2.flowPantalla
//                    1.3.flowFoto
//                        1.4.flowCliente
//                            1.5.flowMarca
//                                1.6.flowModelo
//                                    1.7.flowLocalidad
//                                        1.8.flowEnvio ( FUNCIONA )
//-----------------------------------------------------------------------------------
//        2.flowCliente2
//             2.1.flowLocalidad2
//                 2.2.flowGremio
//                     Fin ( FUNCIONAL )
//-----------------------------------------------------------------------------------
//        3.flowCliente3
//                     3.1.flowEquipoRevisado
//                          3.2.flowOrdenN
//                                  Fin ( FUNCIONAL )
//-----------------------------------------------------------------------------------
//        4.flowCursos
//                     Fin ( FUNCIONAL )
//-----------------------------------------------------------------------------------

// Si se termina CUALQUIER flujo el bot se apaga

// Funcion axuliar confidencial

const flowEncender = addKeyword('excalibur')
  .addAction(async () => {
    STATE = true;
  })
  .addAnswer('Bot encendido...');

const flowPrincipal = addKeyword([EVENTS.WELCOME, 'hola'])
  // Funcion para apagar el bot

  .addAction(async (_, { endFlow }) => {
    if (!STATE) return endFlow();
  })

  .addAnswer(
    'Hola! 👋 Soy el chatbot de CelExpress 📱\nTu lugar de confianza para resolver los problemas de tu celular\n\n📍 Nos ubicamos en Blanco Encalada 2245, Local 13, Galería Las Brujas, La Horqueta, San Isidro, CP 1618\n\n🕚 Nuestro horario de atención es de 10 a 22hs, de Lunes a Sábado\n\n😊💼¿En qué tipo de consulta puedo ayudarte hoy? \n\n¡Estamos aquí para asistirte!'
  )

  .addAnswer(
    '*IMPORTANTE!* En este momento te está atendiendo un chatbot especializado, pero quedate tranquilo que serás atentido por Matías. Este solo es un pequeño paso para acelerar tu consulta y que tengas la mejor experiencia posible 😊',
    {
      delay: 500,
    }
  )
  .addAnswer(
    '✍️ Escribí el número de la opción que corresponda 🔎\n\n1️⃣ Problemas en mi teléfono\n2️⃣ Atención al gremio\n3️⃣ Quisiera saber el estado de mi reparación\n4️⃣ Info acerca de cursos',
    { capture: true, delay: 700 },
    (ctx, { fallBack }) => {
      if (ctx.body == 1 || ctx.body == 2 || ctx.body == 3 || ctx.body == 4) {
      } else {
        return fallBack();
      }
    },
    [flowTelefono, flowCliente2, flowCliente3, flowCursos]
  );

const main = async () => {
  //   // Nos conectamos a Mysql
  //   const adapterDB = new MySQLAdapter({
  //       host: '127.0.0.1',
  //       user: 'USUARIO',
  //       database: 'DB',
  //       password: 'PASSWORD',
  //       port: '3306',
  //   })

  const adapterDB = new MockAdapter();

  const adapterFlow = createFlow([flowPrincipal, flowEncender]);
  const adapterProvider = createProvider(
    BaileysProvider /*, {
    accountSid: process.env.ACC_SID,
    authToken: process.env.ACC_TOKEN,
    vendorNumber: process.env.ACC_VENDOR,
  }*/
  );

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
