const anticrashHandler = (bot) => {
 
    process.on('uncaughtExceptionMonitor', (err, origin) => {
      console.log(err, origin)
 });
 
 process.on('rejectionHandled', (err) => {
   console.log(err)
 });
 
 process.on('warning', (warning) => {
   console.log(warning)
 });
 
 process.on('uncaughtException', (error) => {
  if(error.code == 40060) return
  if(error.code == 10062) return
  if(error.code == 10008) return
 
   console.log('Une erreur non-capturée est survenue:', error);
 });
 
 process.on('unhandledRejection', (reason, promise) => {
  console.log(reason)
 });
 
 bot.on('error', (error) => {
   console.log('Une erreur non-capturée est survenue:', error);
 });
 
 process.on('processTicksAndRejections', (request, reason) => {
   console.log('Une erreur réseau non-capturée est survenue:', reason);
 });
 
 process.on('exit', (code) => {
   console.log(`Processus terminé avec le code ${code}`);
 });
  };
 
 module.exports = anticrashHandler;