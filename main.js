var cron = require('node-cron');
const run = require('./index');
 cron.schedule('2 23 * * *', () => {
   console.log('Running a job at 01:00 at America/Sao_Paulo timezone');
   run.main();
 }, {
   scheduled: true,
   timezone: "America/Sao_Paulo"
 });