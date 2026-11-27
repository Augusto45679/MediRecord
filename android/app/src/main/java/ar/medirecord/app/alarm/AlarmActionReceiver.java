package ar.medirecord.app.alarm;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/**
 * Respuesta a la alarma ("Ya la tomé" / "Posponer"), desde la notificación o la pantalla completa.
 * Funciona con la app cerrada: apaga la alarma, guarda la respuesta para que la app la registre
 * al abrirse y, si se pospuso, programa la alarma de nuevo en 10 minutos.
 */
public class AlarmActionReceiver extends BroadcastReceiver {
    static final String TAKE = "take";
    static final String POSTPONE = "postpone";
    static final long POSTPONE_MS = 10 * 60 * 1000L;
    private static final String EXTRA_ACTION = "action";

    static PendingIntent pendingIntent(Context c, int id, String doseId, String action) {
        Intent i = new Intent(c, AlarmActionReceiver.class)
            .setAction("ar.medirecord.app.ALARM_" + action) // distinto por botón para no pisar el PendingIntent
            .putExtra(EXTRA_ACTION, action)
            .putExtra(AlarmScheduler.EXTRA_ID, id)
            .putExtra(AlarmScheduler.EXTRA_DOSE, doseId);
        return PendingIntent.getBroadcast(c, id, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    @Override
    public void onReceive(Context c, Intent intent) {
        handle(c,
            intent.getStringExtra(EXTRA_ACTION),
            intent.getIntExtra(AlarmScheduler.EXTRA_ID, 0),
            intent.getStringExtra(AlarmScheduler.EXTRA_DOSE),
            null, null);
    }

    static void handle(Context c, String action, int id, String doseId, String title, String body) {
        AlarmNotifier.stop(c, id);
        AlarmActivity.closeIfShowing(id);
        if (doseId == null || doseId.isEmpty() || action == null) return; // alarma de prueba: solo se apaga
        if (POSTPONE.equals(action)) {
            org.json.JSONObject stored = AlarmStore.find(c, id);
            if (title == null) title = stored != null ? stored.optString("title") : "Hora de tu medicina";
            if (body == null) body = stored != null ? stored.optString("body") : "";
            AlarmScheduler.set(c, id, System.currentTimeMillis() + POSTPONE_MS, doseId, title, body);
        }
        AlarmStore.enqueueAction(c, action, doseId);
        MedAlarmPlugin.deliverPending();
    }
}
