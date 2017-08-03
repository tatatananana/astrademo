var uid = require('uid2');
const DEFAULT_HASH_LEN = 24;

module.exports = function(Draw) {

  function generateHash(cb) {
    uid(DEFAULT_HASH_LEN, function(err, guid) {
      if (err) {
        cb(err);
      } else {
        cb(null, guid);
      }
    });
  }

  function sumDrawTime() {

  }

  Draw.observe('before save', function (ctx, next) {
    if(ctx.isNewInstance) {
      ctx.instance.created = new Date();

      generateHash(function (err,guid) {
        if(err)
          return next(err);

        ctx.instance.hashKey = guid;
        next();
      });
    } else {
      next();
    }
  });
};
