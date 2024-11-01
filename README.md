# Aplicación de Microservicios para Transacciones, Operaciones y Usuarios

## 👀 Solución

Este sistema está diseñado como una arquitectura de microservicios para lograr escalabilidad, velocidad y robustez. La aplicación separa las funcionalidades en diferentes servicios para manejar las transacciones, operaciones y usuarios de forma distribuida. A continuación, se explican las decisiones de diseño tomadas para cumplir con los requisitos de la consigna.

### Decisiones de Diseño

1. **Separación de Servicios**:  
   La aplicación original almacenaba todas las transacciones y operaciones en una única base de datos dentro de un monolito. Este diseño limitaba la escalabilidad, velocidad de respuesta y robustez del sistema. Para abordar estos problemas, se decidió separar las funcionalidades en tres microservicios, cada uno responsable de una tarea específica y con su propia base de datos.

   - **TransactionService** es responsable de gestionar las transacciones, como intercambios, depósitos, retiros y pagos de facturas. Cada vez que se crea una transacción, este servicio publica un mensaje en **RabbitMQ**. La mensajería desacoplada permite que **OperationService** reciba y procese las transacciones de manera independiente.
   - **OperationService** escucha los eventos de transacciones en **RabbitMQ** y crea una operación correspondiente para cada transacción. Esto permite que **OperationService** almacene solo las operaciones relacionadas, lo cual ayuda a mantener una estructura de datos optimizada para las consultas.
   - **UserService** maneja la información de los usuarios y sirve como el único punto de acceso para los clientes. A través de este servicio, los clientes pueden recuperar el historial de transacciones y operaciones de cada usuario sin interactuar directamente con **TransactionService** ni **OperationService**. 

   Para lograr esta comunicación, **UserService** utiliza **RabbitMQ** para enviar solicitudes de datos a **TransactionService** y **OperationService**. Al solicitar el historial de transacciones u operaciones, **UserService** envía un mensaje a las colas de solicitud de cada servicio, respectivamente. Los servicios responden a través de una cola de respuesta utilizando un `correlationId`, permitiendo que **UserService** reciba y reenvíe los datos al cliente sin acceder directamente a las bases de datos de los otros servicios. Esto asegura una arquitectura desacoplada y facilita el escalado de cada servicio de manera independiente.

   Este enfoque de separación mejora la **escalabilidad** porque cada microservicio puede escalar de forma independiente. Además, al distribuir la carga de trabajo, el sistema se vuelve **más robusto**: si uno de los servicios falla, los otros pueden continuar funcionando. La **velocidad** también mejora, ya que cada servicio está optimizado para su tarea específica.

2. **Filtro por Compañía o ID**:  
   Uno de los requerimientos de la aplicación es que los usuarios puedan filtrar las operaciones de pago de facturas por `company` (como Edenor o Metrogas) y `account_id` (número de cuenta del servicio). Para cumplir con este requisito, diseñamos el sistema de almacenamiento y consulta de manera eficiente.

   - **Almacenamiento de Datos en OperationService**: Cada operación de tipo `BILL_PAYMENT` almacena los campos `company` y `account_id`. Esto permite que las operaciones de pago de facturas se almacenen con la información necesaria para realizar búsquedas y filtrados eficientes.
   - **Optimización de las Consultas**: En **OperationService**, se configuran índices en `user_id`, `company`, y `account_id` para acelerar las consultas y reducir el tiempo de respuesta cuando se aplica un filtro. Esto es especialmente útil cuando el sistema tiene que manejar grandes volúmenes de datos.
   - **Endpoint de Filtrado en UserService**: **UserService** actúa como intermediario para que los clientes externos puedan obtener las operaciones de un usuario específico, filtradas opcionalmente por `company` y `account_id`. Este diseño encapsula la lógica de acceso en **UserService** y permite que **OperationService** maneje las consultas de manera interna.

Este diseño escalable garantiza que la búsqueda de operaciones de pago de facturas sea rápida y eficiente, incluso con un gran volumen de datos. Además, mantiene el sistema flexible para futuras expansiones.

## 📍 Microservicios

- **TransactionService**: Gestiona las transacciones (como intercambios, depósitos y retiros).
- **OperationService**: Recibe eventos de transacciones y registra operaciones relacionadas para cada usuario.
- **UserService**: Administra los detalles de los usuarios y recupera el historial de transacciones y operaciones de cada usuario.

## 💬 Descripción de los Servicios

Cada servicio tiene un rol específico dentro de la aplicación. Aquí tienes un resumen:

1. ### TransactionService
- Crea transacciones y publica eventos de transacción en RabbitMQ para que **OperationService** los procese.
- Expone endpoints para operaciones CRUD en las transacciones.
2. ### OperationService
- Escucha en RabbitMQ los eventos de transacción y crea operaciones basadas en esas transacciones.
- Proporciona una API para recuperar, crear, actualizar y eliminar operaciones.
3. ### UserService
- Administra la información de los usuarios y proporciona endpoints para obtener el historial de transacciones y operaciones de cada usuario, consultando **TransactionService** y **OperationService**.

## ✅ Requisitos Previos

Asegúrate de tener instalados los siguientes componentes:

- **Docker** y **Docker Compose**
- **Node.js** (si quieres probar localmente)
- **MongoDB Atlas** para almacenar los datos

## 🚀 Configuración

### Variables de Entorno
Cada microservicio requiere variables de entorno específicas para ejecutarse. Crea un archivo `.env` en la raíz de cada directorio de servicio con las siguientes variables:

### TransactionService/.env
```bash
MONGODB_URI=<Tu URI de MongoDB>
RABBITMQ_URL=amqp://rabbitmq:5672
```

### OperationService/.env
```bash
MONGODB_URI=<Tu URI de MongoDB>
RABBITMQ_URL=amqp://rabbitmq:5672
```

### UserService/.env
```bash
MONGODB_URI=<Tu URI de MongoDB>
RABBITMQ_URL=amqp://rabbitmq:5672
```

## 🤖 Ejecución de la Aplicación
Para iniciar todos los servicios y RabbitMQ, utiliza Docker Compose:
```bash
docker-compose up --build
```
Este comando construirá las imágenes e iniciará los contenedores. Accede a cada servicio en los siguientes puertos:

- **TransactionService**: `http://localhost:3001`
- **OperationService**: `http://localhost:3002`
- **UserService**: `http://localhost:3003`

La consola de administración de RabbitMQ está disponible en `http://localhost:15672` (usuario: guest, contraseña: guest).

## 💡 Endpoints

### TransactionService
- **POST** `/api/transactions`: Crea una nueva transacción.
- **GET** `/api/transactions`: Obtiene todas las transacciones.
- **GET** `/api/transactions/{id}`: Obtiene una transacción por su ID.
- **PUT** `/api/transactions/{id}`: Actualiza una transacción.
- **DELETE** `/api/transactions/{id}`: Elimina una transacción.
- **GET** `/api/transactions/health`: Verifica el estado del servicio.

### OperationService
- **POST** `/api/operations`: Crea una nueva operación.
- **GET** `/api/operations`: Obtiene todas las operaciones.
- **GET** `/api/operations/{id}`: Obtiene una operación por su ID.
- **PUT** `/api/operations/{id}`: Actualiza una operación.
- **DELETE** `/api/operations/{id}`: Elimina una operación.
- **GET** `/api/operations/filter`: Obtiene las operaciones por user_id, company y account_id.
- **GET** `/api/operations/health`: Verifica el estado del servicio.

### UserService
- **POST** `/api/users`: Crea un nuevo usuario.
- **GET** `/api/users`: Obtiene todos los usuarios.
- **GET** `/api/users/{id}`: Obtiene un usuario por su ID.
- **PUT** `/api/users/{id}`: Actualiza un usuario.
- **DELETE** `/api/users/{id}`: Elimina un usuario.
- **GET** `/api/users/{userId}/operations`: Obtiene las operaciones de un usuario específico.
- **GET** `/api/users/{userId}/operations/filter`: Obtiene las operaciones de un usuario específico por company y account_id.
- **GET** `/api/users/health`: Verifica el estado del servicio.

## 🤝 Ejemplo de Solicitudes

Puedes probar los endpoints utilizando **curl** o **Postman**. Aquí tienes algunos ejemplos:


### Crear un usuario (UserService)
```bash
curl -X POST http://localhost:3003/api/users -H "Content-Type: application/json" -d '{"name": "John Doe", "email": "john@example.com"}'
```

### Crear una transacción (TransactionService)
```bash
curl -X POST http://localhost:3001/api/transactions -H "Content-Type: application/json" -d '{"type": "SWAP", "user_id": "12345", "amount": 100, "currency": "USD"}'
```

```bash
curl -X POST http://localhost:3001/api/transactions -H "Content-Type: application/json" -d '{
  "type": "BILL_PAYMENT",
  "user_id": "12345",
  "amount": 200,
  "currency": "USD",
  "company": "Edenor",
  "account_id": "67890",
  "additional_data": [
    { "name": "fee", "value": "2.5" },
    { "name": "payment_date", "value": "2024-11-01" }
  ]
}'
```

### Obtener todas las transacciones (TransactionService)
```bash
curl http://localhost:3001/api/transactions
```

### Crear una operación (OperationService)
```bash
curl -X POST http://localhost:3002/api/operations -H "Content-Type: application/json" -d '{"transaction_id": "trans123", "type": "DEPOSIT", "user_id": "12345", "amount": 200, "currency": "USD"}'
```

### Obtener las operaciones de un usuario específico con filtro por company y account_id
```bash
curl -X GET "http://localhost:3003/api/users/12345/operations/filter?company=Edenor&account_id=67890"
```

## ✨ Notas
**RabbitMQ** debe estar en funcionamiento antes de ejecutar los servicios que lo utilizan.
Asegúrate de que las variables de entorno estén correctamente configuradas para la conexión a **MongoDB** y **RabbitMQ**.

## 🔐 Próximas Implementaciones

1. **Autenticación y Autorización**:
   - Implementar un sistema de autenticación basado en **JWT** (JSON Web Tokens) para asegurar que solo usuarios autorizados puedan acceder a los endpoints.
   - Añadir niveles de autorización para controlar qué operaciones pueden realizar los diferentes tipos de usuarios (e.g., usuarios regulares vs. administradores).
   
2. **Pruebas Unitarias**:
   - Escribir pruebas unitarias para todos los servicios principales (TransactionService, OperationService, UserService) utilizando **Jest** o **Mocha**.
   - Asegurar que cada endpoint funcione como se espera y que las validaciones y manejo de errores estén cubiertos en las pruebas.
   - Incluir pruebas para verificar el funcionamiento de la mensajería con **RabbitMQ** y la correcta respuesta de los servicios externos.

Estas mejoras proporcionarán una mayor seguridad y confiabilidad a la aplicación, asegurando que solo usuarios autorizados puedan acceder a las funcionalidades y que el sistema esté cubierto ante errores y cambios futuros.