package ar.medirecord.app.alarm;

import android.Manifest;
import android.app.AlarmManager;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Puente con la web (src/native/alarms.ts): programar alarmas tipo despertador, leer las
 * respuestas dadas con la app cerrada y revisar los permisos que las hacen sonar a horario.
 */
@CapacitorPlugin(
    name = "MedAlarm",
    permissions = @Permission(alias = "notifications", strings = {Manifest.permission.POST_NOTIFICATIONS})
)
public class MedAlarmPlugin extends Plugin {
    private static MedAlarmPlugin instance;

    @Override
    public void load() {
        instance = this;
        AlarmNotifier.ensureChannels(getContext());
    }

    @Override
    protected void handleOnDestroy() {
        if (instance == this) instance = null;
    }

    /** Avisa a la web que hay respuestas nuevas (si la app está abierta). */
    static void deliverPending() {
        MedAlarmPlugin p = instance;
        if (p != null) p.notifyListeners("alarmAction", new JSObject(), true);
    }

    @PluginMethod
    public void schedule(PluginCall call) {
        JSArray alarms = call.getArray("alarms", new JSArray());
        boolean sound = Boolean.TRUE.equals(call.getBoolean("sound", true));
        boolean vibration = Boolean.TRUE.equals(call.getBoolean("vibration", true));
        JSONArray clean = new JSONArray();
        try {
            for (int i = 0; i < alarms.length(); i++) {
                JSONObject a = alarms.getJSONObject(i);
                clean.put(new JSONObject()
                    .put("id", a.getInt("id"))
                    .put("at", a.getLong("at"))
                    .put("doseId", a.getString("doseId"))
                    .put("title", a.optString("title"))
                    .put("body", a.optString("body")));
            }
        } catch (JSONException e) {
            call.reject("Alarmas inválidas: " + e.getMessage());
            return;
        }
        AlarmScheduler.replace(getContext(), clean, sound, vibration);
        call.resolve();
    }

    @PluginMethod
    public void cancelAll(PluginCall call) {
        AlarmScheduler.cancelAll(getContext());
        call.resolve();
    }

    /** Respuestas ("take" / "postpone") dadas desde la alarma; se devuelven una sola vez. */
    @PluginMethod
    public void consumeActions(PluginCall call) {
        JSONArray list = AlarmStore.takeActions(getContext());
        JSObject ret = new JSObject();
        try {
            ret.put("actions", new JSArray(list.toString()));
        } catch (JSONException e) {
            ret.put("actions", new JSArray());
        }
        call.resolve(ret);
    }

    /** Devuelve a la cola respuestas que la web no pudo registrar (se reintentan en el próximo refresh). */
    @PluginMethod
    public void requeueActions(PluginCall call) {
        JSArray list = call.getArray("actions", new JSArray());
        for (int i = 0; i < list.length(); i++) {
            JSONObject a = list.optJSONObject(i);
            if (a != null) AlarmStore.restoreAction(getContext(), a);
        }
        call.resolve();
    }

    @PluginMethod
    public void status(PluginCall call) {
        Context c = getContext();
        JSObject ret = new JSObject();
        ret.put("notifications", c.getSystemService(NotificationManager.class).areNotificationsEnabled());
        boolean exact = Build.VERSION.SDK_INT < Build.VERSION_CODES.S
            || ((AlarmManager) c.getSystemService(Context.ALARM_SERVICE)).canScheduleExactAlarms();
        ret.put("exactAlarms", exact);
        boolean fullScreen = Build.VERSION.SDK_INT < 34
            || c.getSystemService(NotificationManager.class).canUseFullScreenIntent();
        ret.put("fullScreen", fullScreen);
        PowerManager pm = (PowerManager) c.getSystemService(Context.POWER_SERVICE);
        ret.put("batteryUnrestricted", pm.isIgnoringBatteryOptimizations(c.getPackageName()));
        call.resolve(ret);
    }

    @PluginMethod
    public void requestNotifications(PluginCall call) {
        if (Build.VERSION.SDK_INT < 33 || getPermissionState("notifications") == com.getcapacitor.PermissionState.GRANTED) {
            JSObject ret = new JSObject();
            ret.put("granted", getContext().getSystemService(NotificationManager.class).areNotificationsEnabled());
            call.resolve(ret);
            return;
        }
        requestPermissionForAlias("notifications", call, "notificationsResult");
    }

    @com.getcapacitor.annotation.PermissionCallback
    private void notificationsResult(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("granted", getPermissionState("notifications") == com.getcapacitor.PermissionState.GRANTED);
        call.resolve(ret);
    }

    /** Abre la pantalla de ajustes del sistema que corresponde a cada permiso. */
    @PluginMethod
    public void openSettings(PluginCall call) {
        String which = call.getString("which", "app");
        Context c = getContext();
        Uri pkg = Uri.parse("package:" + c.getPackageName());
        Intent i;
        switch (which) {
            case "exactAlarms":
                i = Build.VERSION.SDK_INT >= Build.VERSION_CODES.S
                    ? new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM, pkg)
                    : new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, pkg);
                break;
            case "fullScreen":
                i = Build.VERSION.SDK_INT >= 34
                    ? new Intent(Settings.ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT, pkg)
                    : new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, pkg);
                break;
            case "notifications":
                i = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).putExtra(Settings.EXTRA_APP_PACKAGE, c.getPackageName());
                break;
            case "battery":
                // Lista de apps del ahorro de batería: no requiere el permiso restringido de Play.
                i = new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
                break;
            default:
                i = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, pkg);
        }
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        try {
            c.startActivity(i);
        } catch (Exception e) {
            c.startActivity(new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, pkg).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
        }
        call.resolve();
    }

    /** Hace sonar una alarma de prueba en `seconds` segundos. */
    @PluginMethod
    public void test(PluginCall call) {
        int seconds = call.getInt("seconds", 5);
        AlarmScheduler.set(getContext(), 999_999, System.currentTimeMillis() + seconds * 1000L, "",
            "Prueba de alarma", "Así va a sonar cuando sea la hora de una medicina");
        call.resolve();
    }
}
