# Usa una imagen base de Node.js
FROM node:18

# Crea un directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el código de la aplicación
COPY . .

# Define una variable de entorno para el nombre del servicio
ENV SERVICE_NAME transaction-service

# Expone el puerto
EXPOSE 3000

# Comando para iniciar el servicio
CMD ["npm", "start"]