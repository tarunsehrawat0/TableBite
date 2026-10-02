const { app } = require('./app');

app.listen(process.env.PORT || 3000, () => console.log(JSON.stringify({ event: 'api_started', port: process.env.PORT || 3000 })));