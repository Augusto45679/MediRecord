package ar.medirecord.app.alarm;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Llega a la hora de la toma (AlarmManager) o al reiniciar/actualizar (reprograma todo). */
public class AlarmReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent intent) {
        String action = intent.getAction();
        if (Intent.ACTION_BOOT_COMPLETED.equals(action)
            || Intent.ACTION_MY_PACKAGE_REPLACED.equals(action)
            || "android.intent.action.LOCKED_BOOT_COMPLETED".equals(action)) {
            AlarmScheduler.scheduleStored(c);
            return;
        }
        AlarmNotifier.ring(
            c,
            intent.getIntExtra(AlarmScheduler.EXTRA_ID, 0),
            intent.getStringExtra(AlarmScheduler.EXTRA_DOSE),
            intent.getStringExtra(AlarmScheduler.EXTRA_TITLE),
            intent.getStringExtra(AlarmScheduler.EXTRA_BODY));
    }
}
