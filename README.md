<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <h1>📲 Proyecto de Billetera Virtual</h1>
  <p>Este proyecto implementa una billetera virtual utilizando <strong>NestJS</strong>. Está organizado en dos módulos principales: un módulo <strong>REST</strong> que actúa como puente entre el cliente y el servicio SOAP, y un módulo <strong>SOAP</strong> que maneja el acceso directo a la base de datos y la lógica de negocio principal. La base de datos empleada es <strong>MongoDB</strong> y se utiliza <strong>Nodemailer</strong> para el envío de notificaciones por correo electrónico.</p>

  <h2>🚀 Tecnologías Utilizadas</h2>
  <ul>
    <li><strong>NestJS</strong>: Framework principal para construir una API modular y escalable.</li>
    <li><strong>MongoDB</strong>: Base de datos NoSQL, manejada desde el módulo SOAP.</li>
    <li><strong>NestJS SOAP</strong>: Librería de NestJS para implementar servicios SOAP.</li>
    <li><strong>Nodemailer</strong>: Herramienta para el envío de notificaciones por correo electrónico.</li>
    <li><strong>Swagger</strong>: Documentación interactiva de la API para facilitar el consumo de los servicios.</li>
  </ul>

  <h2>📂 Estructura del Proyecto</h2>
  <pre>
src
├── billetera
│   ├── rest
│   │   ├── billetera.controller.ts      # Controlador REST para manejar solicitudes de clientes
│   │   ├── billetera.dto.ts             # DTOs para validar datos de entrada en REST
│   │   ├── billetera.module.ts          # Módulo REST
│   │   └── billetera.service.ts         # Servicio REST para lógica intermedia
│   ├── soap
│   │   ├── entities
│   │   │   └── mongo                    # Carpeta para las entidades de MongoDB
│   │   │       └── mongo.service.ts     # Servicio que maneja la conexión con MongoDB
│   │   ├── wsdl
│   │   │   └── billetera.wsdl           # Archivo WSDL para el servicio SOAP
│   │   ├── billetera.soap.controller.ts # Controlador SOAP
│   │   ├── billetera.soap.module.ts     # Módulo SOAP
│   │   └── billetera.soap.service.ts    # Servicio SOAP con lógica de negocio principal
├── app.module.ts                        # Módulo raíz
└── main.ts                              # Archivo de entrada principal
  </pre>

  <h2>🧩 Funcionalidades Principales</h2>
  <ul>
    <li><strong>Registrar Cliente</strong>: Permite registrar nuevos clientes en el sistema.</li>
    <li><strong>Recargar Billetera</strong>: Realiza recargas a la billetera de los clientes.</li>
    <li><strong>Pagar Compra</strong>: Permite realizar pagos utilizando el saldo de la billetera.</li>
    <li><strong>Confirmar Pago</strong>: Confirma una transacción en curso.</li>
    <li><strong>Consultar Saldo</strong>: Permite consultar el saldo actual de la billetera del cliente.</li>
  </ul>

  <h2>📑 Documentación Swagger</h2>
  <p>La documentación Swagger está disponible en:</p>
  <p><a href="http://localhost:3000/api/docs#/">Swagger Documentation</a></p>
  <p>Esta documentación describe cada endpoint del módulo REST, los parámetros necesarios y las respuestas esperadas.</p>

  <h2>📬 Notificaciones por Correo</h2>
  <p>Se utiliza <strong>Nodemailer</strong> para enviar notificaciones de eventos importantes, como confirmaciones de pagos y recargas.</p>

  <h2>🛠️ Instalación y Configuración</h2>

  <h3>Paso 1: Clonar el repositorio</h3>
  <pre><code>git clone https://github.com/CamilolIn/Billetera-virtual-back.git
cd Billetera-virtual-back</code></pre>

  <h3>Paso 2: Instalar dependencias</h3>
  <pre><code>npm install</code></pre>

  <h3>Paso 3: Iniciar el servidor</h3>
  <p>Ejecuta el siguiente comando para iniciar el servidor en modo desarrollo:</p>
  <pre><code>npm run start:dev</code></pre>
  <p>El servidor estará disponible en <code>http://localhost:3000</code>.</p>

  <h2>🛠️ Desarrollo</h2>

  <h3>Comandos Útiles</h3>
  <ul>
    <li><strong>Iniciar el servidor en modo desarrollo</strong>:
      <pre><code>npm run start:dev</code></pre>
    </li>
    <li><strong>Compilar el proyecto</strong>:
      <pre><code>npm run build</code></pre>
    </li>
    <li><strong>Ejecutar el proyecto</strong>:
      <pre><code>npm run start</code></pre>
    </li>
  </ul>

  <h3>Estructura de Carpetas</h3>
  <p>Este proyecto utiliza la estructura recomendada por NestJS para mantener una separación clara entre los módulos <strong>REST</strong> y <strong>SOAP</strong>.</p>

  <h2>📜 Licencia</h2>
  <p>Este proyecto está bajo la Licencia MIT. Consulta el archivo <code>LICENSE</code> para más detalles.</p>
</body>
</html>
