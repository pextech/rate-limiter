export async function scheduleCronJob(schedule: any, cron_syntax: string, task: any) {
    try {
      schedule.scheduleJob(cron_syntax, task);
    } catch (error) {
      console.log(`Error performing the cron task ${error}`);
    }
  }