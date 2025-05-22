const { authorize } = require('./authorize');

authorize().then(()=>console.log("Google API Access Granted")).catch(console.error);
