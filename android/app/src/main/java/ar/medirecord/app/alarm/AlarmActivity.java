package ar.medirecord.app.alarm;

import android.app.Activity;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.lang.ref.WeakReference;
import java.text.DateFormat;
import java.util.Date;

/**
 * Pantalla de alarma a pantalla completa, sobre el bloqueo, con dos botones grandes.
 * El sonido lo da la notificación insistente; esta pantalla solo la apaga al responder.
 */
public class AlarmActivity extends Activity {
    private static WeakReference<AlarmActivity> showing = new WeakReference<>(null);

    private int alarmId;
    private String doseId;
    private String title;
    private String body;
    private final Handler handler = new Handler(Looper.getMainLooper());

    static void closeIfShowing(int id) {
        AlarmActivity a = showing.get();
        if (a != null && a.alarmId == id) a.runOnUiThread(a::finish);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
        }
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        show(getIntent());
    }

    /** Llega otra alarma con esta pantalla abierta (dos medicinas seguidas): muestra la nueva. */
    @Override
    protected void onNewIntent(android.content.Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        show(intent);
    }

    private void show(android.content.Intent intent) {
        alarmId = intent.getIntExtra(AlarmScheduler.EXTRA_ID, 0);
        doseId = intent.getStringExtra(AlarmScheduler.EXTRA_DOSE);
        title = intent.getStringExtra(AlarmScheduler.EXTRA_TITLE);
        body = intent.getStringExtra(AlarmScheduler.EXTRA_BODY);
        showing = new WeakReference<>(this);

        setContentView(buildLayout());
        handler.removeCallbacksAndMessages(null);
        handler.postDelayed(this::finish, AlarmNotifier.RING_MS);
    }

    @Override
    protected void onDestroy() {
        handler.removeCallbacksAndMessages(null);
        if (showing.get() == this) showing = new WeakReference<>(null);
        super.onDestroy();
    }

    @Override
    public void onBackPressed() {
        // Volver atrás no apaga la alarma: hay que elegir una opción.
    }

    private void respond(String action) {
        AlarmActionReceiver.handle(this, action, alarmId, doseId, title, body);
        // Si hay otra alarma sonando (dos medicinas a la misma hora), se muestra su pantalla.
        for (android.service.notification.StatusBarNotification sbn
                : getSystemService(android.app.NotificationManager.class).getActiveNotifications()) {
            android.app.Notification n = sbn.getNotification();
            if (sbn.getId() != alarmId && android.app.Notification.CATEGORY_ALARM.equals(n.category) && n.contentIntent != null) {
                try {
                    n.contentIntent.send();
                    return;
                } catch (android.app.PendingIntent.CanceledException ignored) {
                }
            }
        }
        finish();
    }

    private int dp(float v) {
        return (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, v, getResources().getDisplayMetrics());
    }

    private LinearLayout buildLayout() {
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER);
        root.setBackgroundColor(Color.parseColor("#0F3D38"));
        root.setPadding(dp(28), dp(48), dp(28), dp(48));

        root.addView(text(DateFormat.getTimeInstance(DateFormat.SHORT).format(new Date()), 64, true, "#FFFFFF"));
        root.addView(space(16));
        root.addView(text(title != null ? title : "Hora de tu medicina", 30, true, "#FFFFFF"));
        root.addView(space(8));
        if (body != null && !body.isEmpty()) root.addView(text(body, 22, false, "#CDE7E1"));
        root.addView(space(56));
        root.addView(button("Ya la tomé", "#FFFFFF", "#0F3D38", () -> respond(AlarmActionReceiver.TAKE)));
        root.addView(space(16));
        root.addView(button("Posponer 10 minutos", "#1F5F57", "#FFFFFF", () -> respond(AlarmActionReceiver.POSTPONE)));
        return root;
    }

    private TextView text(String s, int sp, boolean bold, String color) {
        TextView t = new TextView(this);
        t.setText(s);
        t.setTextSize(TypedValue.COMPLEX_UNIT_SP, sp);
        t.setTextColor(Color.parseColor(color));
        t.setGravity(Gravity.CENTER);
        if (bold) t.setTypeface(Typeface.DEFAULT_BOLD);
        return t;
    }

    private Button button(String label, String bg, String fg, Runnable onClick) {
        Button b = new Button(this);
        b.setText(label);
        b.setAllCaps(false);
        b.setTextSize(TypedValue.COMPLEX_UNIT_SP, 24);
        b.setTypeface(Typeface.DEFAULT_BOLD);
        b.setTextColor(Color.parseColor(fg));
        GradientDrawable shape = new GradientDrawable();
        shape.setColor(Color.parseColor(bg));
        shape.setCornerRadius(dp(20));
        b.setBackground(shape);
        b.setMinHeight(dp(80));
        b.setOnClickListener(v -> onClick.run());
        b.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
        return b;
    }

    private android.view.View space(int heightDp) {
        android.view.View v = new android.view.View(this);
        v.setLayoutParams(new LinearLayout.LayoutParams(1, dp(heightDp)));
        return v;
    }
}
