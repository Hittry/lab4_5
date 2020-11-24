FROM node:14

RUN npm install nodemon -g
RUN npm install express
RUN npm install sequelize
RUN npm install pg
RUN npm install pug
RUN npm install cookie-parser
RUN npm install passport
RUN npm install express-session
RUN npm install passport-local
RUN npm install bcrypt

WORKDIR ./

COPY /package.json ./
COPY /package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "node", "app.js" ]