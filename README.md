# Aplicación de Microservicios para Transacciones, Operaciones y Usuarios

## Resumen

Esta aplicación es un sistema basado en microservicios que gestiona transacciones de usuarios, operaciones y detalles de los mismos en una arquitectura distribuida. Cada microservicio está contenedorizado utilizando Docker y se comunica a través de RabbitMQ para gestionar la mensajería entre servicios.

## Microservicios

- **TransactionService**: Gestiona las transacciones (como intercambios, depósitos y retiros).
- **OperationService**: Recibe eventos de transacciones y registra operaciones relacionadas para cada usuario.
- **UserService**: Administra los detalles de los usuarios y recupera el historial de transacciones y operaciones de cada usuario.

## Descripción de los Servicios

Cada servicio tiene un rol específico dentro de la aplicación. Aquí tienes un resumen:

1. ### TransactionService
- Crea transacciones y publica eventos de transacción en RabbitMQ para que **OperationService** los procese.
- Expone endpoints para operaciones CRUD en las transacciones.
2. ### OperationService
- Escucha en RabbitMQ los eventos de transacción y crea operaciones basadas en esas transacciones.
- Proporciona una API para recuperar, crear, actualizar y eliminar operaciones.
3. ### UserService
- Administra la información de los usuarios y proporciona endpoints para obtener el historial de transacciones y operaciones de cada usuario, consultando **TransactionService** y **OperationService**.

## Requisitos Previos

Asegúrate de tener instalados los siguientes componentes:

- **Docker** y **Docker Compose**
- **Node.js** (si quieres probar localmente)
- **MongoDB Atlas** para almacenar los datos

## Configuración

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
TRANSACTION_SERVICE_URL=http://transaction-service:3000
OPERATION_SERVICE_URL=http://operation-service:3000
```

## Ejecución de la Aplicación
Para iniciar todos los servicios y RabbitMQ, utiliza Docker Compose:
```bash
docker-compose up --build
```
Este comando construirá las imágenes e iniciará los contenedores. Accede a cada servicio en los siguientes puertos:

- **TransactionService**: `http://localhost:3001`
- **OperationService**: `http://localhost:3002`
- **UserService**: `http://localhost:3003`
La consola de administración de RabbitMQ está disponible en `http://localhost:15672` (usuario: guest, contraseña: guest).

## Endpoints

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
- **GET** `/api/operations/health`: Verifica el estado del servicio.

### UserService
- **POST** `/api/users`: Crea un nuevo usuario.
- **GET** `/api/users`: Obtiene todos los usuarios.
- **GET** `/api/users/{id}`: Obtiene un usuario por su ID.
- **PUT** `/api/users/{id}`: Actualiza un usuario.
- **DELETE** `/api/users/{id}`: Elimina un usuario.
- **GET** `/api/users/{userId}/transactions`: Obtiene las transacciones de un usuario específico.
- **GET** `/api/users/{userId}/operations`: Obtiene las operaciones de un usuario específico.
- **GET** `/api/users/health`: Verifica el estado del servicio.

## Ejemplo de Solicitudes

Puedes probar los endpoints utilizando **curl** o **Postman**. Aquí tienes algunos ejemplos:

### Crear una transacción (TransactionService)
```bash
curl -X POST http://localhost:3001/api/transactions -H "Content-Type: application/json" -d '{"type": "SWAP", "user_id": "12345", "amount": 100, "currency": "USD"}'
```

### Obtener todas las transacciones (TransactionService)
```bash
curl http://localhost:3001/api/transactions
```

### Crear una operación (OperationService)
```bash
curl -X POST http://localhost:3002/api/operations -H "Content-Type: application/json" -d '{"transaction_id": "trans123", "type": "DEPOSIT", "user_id": "12345", "amount": 200, "currency": "USD"}'
```

### Crear un usuario (UserService)
```bash
curl -X POST http://localhost:3003/api/users -H "Content-Type: application/json" -d '{"user_id": "12345", "name": "John Doe", "email": "john@example.com"}'
```

## Notas
**RabbitMQ** debe estar en funcionamiento antes de ejecutar los servicios que lo utilizan.
Asegúrate de que las variables de entorno estén correctamente configuradas para la conexión a **MongoDB** y **RabbitMQ**.