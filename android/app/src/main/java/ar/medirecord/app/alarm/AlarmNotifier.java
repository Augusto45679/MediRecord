package ar.medirecord.app.alarm;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.net.Uri;

import androidx.core.app.NotificationCompat;

import ar.medirecord.app.R;

/**
 * Muestra la alarma de una toma: suena en loop por el canal de ALARMA (no el de notificaciones),
 * vibra y abre la pantalla completa sobre el bloqueo hasta que la persona responda.
 */
final class AlarmNotifier {
    static final long RING_MS = 10 * 60 * 1000L; // deja de sonar sola a los 10 minutos
    private static final long[] VIBRATION = {0, 900, 500, 900, 500, 900};

    private AlarmNotifier() {}

    /** Un canal por combinación: en Android el sonido y la vibración de un canal no se pueden cambiar. */
    static String channelId(boolean sound, boolean vibration) {
        return "alarma_" + (sound ? "sonido" : "mudo") + "_" + (vibration ? "vibra" : "quieto");
    }

    static void ensureChannels(Context c) {
        NotificationManager nm = c.getSystemService(NotificationManager.class);
        AudioAttributes alarm = new AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_ALARM)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build();
        Uri tone = Uri.parse("android.resource://" + c.getPackageName() + "/" + R.raw.alarma);
        for (boolean sound : new boolean[] {true, false}) {
            for (boolean vib : new boolean[] {true, false}) {
                NotificationChannel ch = new NotificationChannel(
                    channelId(sound, vib),
                    "Alarma de tomas" + (sound ? "" : " (sin sonido)") + (vib ? "" : " (sin vibración)"),
                    NotificationManager.IMPORTANCE_HIGH);
                ch.setDescription("Suena como un despertador a la hora de cada medicina");
                ch.setSound(sound ? tone : null, sound ? alarm : null);
                ch.enableVibration(vib);
                ch.setVibrationPattern(vib ? VIBRATION : null);
                ch.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
                ch.setBypassDnd(true);
                nm.createNotificationChannel(ch);
            }
        }
        // Canales de versiones anteriores (notificación común).
        for (String old : new String[] {"tomas", "tomas_sonido_vibra", "tomas_sonido_quieto", "tomas_mudo_vibra", "tomas_mudo_quieto"}) {
            nm.deleteNotificationChannel(old);
        }
    }

    static void ring(Context c, int id, String doseId, String title, String body) {
        ensureChannels(c);
        boolean sound = AlarmStore.sound(c);
        boolean vibration = AlarmStore.vibration(c);

        Intent screen = new Intent(c, AlarmActivity.class)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_NO_USER_ACTION)
            .putExtra(AlarmScheduler.EXTRA_ID, id)
            .putExtra(AlarmScheduler.EXTRA_DOSE, doseId)
            .putExtra(AlarmScheduler.EXTRA_TITLE, title)
            .putExtra(AlarmScheduler.EXTRA_BODY, body);
        PendingIntent fullScreen = PendingIntent.getActivity(c, id, screen, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        Notification n = new NotificationCompat.Builder(c, channelId(sound, vibration))
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle(title)
            .setContentText(body)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setFullScreenIntent(fullScreen, true)
            .setContentIntent(fullScreen)
            .setOngoing(true)
            .setAutoCancel(false)
            .setTimeoutAfter(RING_MS)
            .addAction(0, "Ya la tomé", AlarmActionReceiver.pendingIntent(c, id, doseId, AlarmActionReceiver.TAKE))
            .addAction(0, "Posponer 10 min", AlarmActionReceiver.pendingIntent(c, id, doseId, AlarmActionReceiver.POSTPONE))
            .build();
        n.flags |= Notification.FLAG_INSISTENT; // repite sonido y vibración hasta que se responda

        c.getSystemService(NotificationManager.class).notify(id, n);
    }

    static void stop(Context c, int id) {
        c.getSystemService(NotificationManager.class).cancel(id);
    }
}
