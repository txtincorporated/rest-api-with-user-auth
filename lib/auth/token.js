const jwt = require('jsonwebtoken');
//Digital anti-tamper 'seal' to ensure integrity of tokens once issued
const kryptofier = process.env.APP_SECRET || 'inthevault';

module.exports = {
  sign(user) {

    return new Promise((resolve, reject) => {

    //jwt optional data to store in token;
    //"transparent", i.e., visible, but tamper-proof
    //since altering it will corrupt or 'break' its kryptofier 'seal'
      const payload = {
        id: user._id,
        roles: user.roles
      };

    //tokenize payload using kryptofier
      jwt.sign(payload, kryptofier, null, (err, token) => {
        //in case of oops...
        if (err) return reject(err);
        //otherwise...
        resolve(token);
      });

    });
  },
  verify(token) {
    return new Promise((resolve, reject) => {      
      jwt.verify(token, kryptofier, (err, payload) => {
        console.log('verifying jwt... ');
        //reject token if corrupted, expired or otherwise invalidated
        if(err) return reject(err);
        //pass back payload if token valid
        resolve(payload);
      });
    });
  }
};