import session from 'express-session';

export default class RedisStore extends session.Store {
  constructor({ client, prefix = 'sess:' } = {}) {
    super();
    this.client = client;
    this.prefix = prefix;
  }

  async get(sid, cb) {
    try {
      const data = await this.client.json.get(this.prefix + sid);
      cb(null, data);
    } catch (err) {
      cb(err);
    }
  }

  async set(sid, sess, cb) {
    try {
      await this.client.json.set(this.prefix + sid, '$', sess);
      if (sess?.cookie?.maxAge) {
        await this.client.expire(
          this.prefix + sid,
          Math.floor(sess.cookie.maxAge / 1000)
        );
      }
      cb(null);
    } catch (err) {
      cb(err);
    }
  }

  async destroy(sid, cb) {
    try {
      await this.client.del(this.prefix + sid);
      cb(null);
    } catch (err) {
      cb(err);
    }
  }
}
