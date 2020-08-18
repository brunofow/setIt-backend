import { StrategyOptions, ExtractJwt, Strategy } from 'passport-jwt'; 
import passport from 'passport';
import db from './database/connection';
import authConfig from '@configs/authConfig.json';

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: authConfig.jwt_secret
}

interface Payload {
  id: number
}

export default () => {
  const strategy = new Strategy(opts, async (payload: Payload, done) => {
    const user = await db('users').select('*').where('id', '=', payload.id);
    if(user) {
      return done(null, {id: user[0].id})
    } else {
      return done(new Error('User not found'), null)
    }
  })

  passport.use(strategy);

  const initialize = () => {
    return passport.initialize();
  }

  const authenticate = () => {
    return passport.authenticate('jwt', { session: false})
  }

  return {
    initialize,
    authenticate
  }
}