import express from 'express';
import next from 'next';
import session from 'express-session';
import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import redisClient from './utils/redis.js';
import RedisStore from './utils/redisStore.js';
import http from 'http';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
  new SteamStrategy(
    {
      returnURL: 'https://psychic-space-carnival-r7v9xrq667vcppx6-3000.app.github.dev/api/auth/steam/return',
      realm: 'https://psychic-space-carnival-r7v9xrq667vcppx6-3000.app.github.dev',
      apiKey: process.env.STEAM_API_KEY || 'E7F792B59516C902746564DAE69F6BCA',
    },
    (identifier, profile, done) => {
      profile.identifier = identifier;
      return done(null, profile);
    }
  )
);

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  server.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET || 'keyboard cat',
      resave: false,
      saveUninitialized: false,
    })
  );

  server.use(passport.initialize());
  server.use(passport.session());

  server.get('/api/auth/steam', passport.authenticate('steam', { failureRedirect: '/' }));

  server.get(
    '/api/auth/steam/return',
    passport.authenticate('steam', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/');
    }
  );

  io.on('connection', (socket) => {
    socket.on('join', (room) => {
      socket.join(room);
      io.to(room).emit('presence', { count: io.sockets.adapter.rooms.get(room)?.size || 0 });
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
