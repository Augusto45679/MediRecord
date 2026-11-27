package ar.medirecord.app.alarm;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import org.json.JSONArray;
import org.json.JSONObject;

import ar.medirecord.app.MainActivity;

/** Programa las tomas con AlarmManager.setAlarmClock: exacto y exento del ahorro de batería (Doze). */
public final class AlarmScheduler {
    static final String EXTRA_ID = "id";
    static final String EXTRA_DOSE = "doseId";
    static final String EXTRA_TITLE = "title";
    static final String EXTRA_BODY = "body";

    private AlarmScheduler() {}

    /** Reemplaza todas las alarmas programadas por `alarms`. */
    static void replace(Context c, JSONArray alarms, boolean sound, boolean vibration) {
        cancel(c, AlarmStore.alarms(c));
        AlarmStore.save(c, alarms, sound, vibration);
        scheduleStored(c);
    }

    static void cancelAll(Context c) {
        cancel(c, AlarmStore.alarms(c));
        AlarmStore.save(c, new JSONArray(), AlarmStore.sound(c), AlarmStore.vibration(c));
    }

    /** Vuelve a programar lo guardado (después de reiniciar o actualizar la app). */
    static void scheduleStored(Context c) {
        JSONArray alarms = AlarmStore.alarms(c);
        long now = System.currentTimeMillis();
        for (int i = 0; i < alarms.length(); i++) {
            JSONObject a = alarms.optJSONObject(i);
            if (a == null || a.optLong("at") <= now) continue;
            set(c, a.optInt("id"), a.optLong("at"), a.optString("doseId"), a.optString("title"), a.optString("body"));
        }
    }

    static void set(Context c, int id, long at, String doseId, String title, String body) {
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        PendingIntent fire = firePendingIntent(c, id, doseId, title, body);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !am.canScheduleExactAlarms()) {
            // Sin permiso de alarma exacta: igual suena, aunque Android puede demorarla unos minutos.
            am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, fire);
            return;
        }
        Intent open = new Intent(c, MainActivity.class).setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        PendingIntent show = PendingIntent.getActivity(c, id, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        am.setAlarmClock(new AlarmManager.AlarmClockInfo(at, show), fire);
    }

    private static void cancel(Context c, JSONArray alarms) {
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        for (int i = 0; i < alarms.length(); i++) {
            JSONObject a = alarms.optJSONObject(i);
            if (a == null) continue;
            PendingIntent pi = PendingIntent.getBroadcast(
                c, a.optInt("id"), new Intent(c, AlarmReceiver.class),
                PendingIntent.FLAG_NO_CREATE | PendingIntent.FLAG_IMMUTABLE);
            if (pi != null) {
                am.cancel(pi);
                pi.cancel();
            }
        }
    }

    private static PendingIntent firePendingIntent(Context c, int id, String doseId, String title, String body) {
        Intent i = new Intent(c, AlarmReceiver.class)
            .putExtra(EXTRA_ID, id)
            .putExtra(EXTRA_DOSE, doseId)
            .putExtra(EXTRA_TITLE, title)
            .putExtra(EXTRA_BODY, body);
        return PendingIntent.getBroadcast(c, id, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }
}
