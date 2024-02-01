const cron = require('node-cron');
const GradeManager = require('./gradeManager').GradeManager;

cron.schedule('*/10 * * * *', async () => {
    console.log('running a task every 10 minutes')
    const grandManager = new GradeManager
    grandManager.update()
  },{runOnInit : true});