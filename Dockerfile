# Use a imagem base oficial (ex: Node.js, Python ou OpenJDK dependendo do seu stack)
# Exemplo usando Node.js 20 (Altere se for Python/Java)
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código fonte
COPY . .

# Expõe a porta que a aplicação roda (ex: 3000, 8080, etc.)
EXPOSE 5173

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"]