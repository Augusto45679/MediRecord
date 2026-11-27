package ar.medirecord.app.alarm;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Persiste las alarmas programadas (para reprogramarlas tras reiniciar el teléfono) y las
 * respuestas que la persona dio desde la alarma con la app cerrada, que la app aplica al abrirse.
 */
final class AlarmStore {
    private static final String PREFS = "medirecord_alarms";
    private static final String KEY_ALARMS = "alarms";
    private static final String KEY_SOUND = "sound";
    private static final String KEY_VIBRATION = "vibration";
    private static final String KEY_ACTIONS = "pending_actions";

    private AlarmStore() {}

    private static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    static JSONArray alarms(Context c) {
        return parse(prefs(c).getString(KEY_ALARMS, "[]"));
    }

    static boolean sound(Context c) {
        return prefs(c).getBoolean(KEY_SOUND, true);
    }

    static boolean vibration(Context c) {
        return prefs(c).getBoolean(KEY_VIBRATION, true);
    }

    static void save(Context c, JSONArray alarms, boolean sound, boolean vibration) {
        prefs(c).edit()
            .putString(KEY_ALARMS, alarms.toString())
            .putBoolean(KEY_SOUND, sound)
            .putBoolean(KEY_VIBRATION, vibration)
            .apply();
    }

    /** Datos de una alarma programada (para posponer desde la notificación). */
    static JSONObject find(Context c, int id) {
        JSONArray list = alarms(c);
        for (int i = 0; i < list.length(); i++) {
            JSONObject a = list.optJSONObject(i);
            if (a != null && a.optInt("id") == id) return a;
        }
        return null;
    }

    static synchronized void enqueueAction(Context c, String action, String doseId) {
        JSONArray list = parse(prefs(c).getString(KEY_ACTIONS, "[]"));
        try {
            list.put(new JSONObject().put("action", action).put("doseId", doseId).put("at", System.currentTimeMillis()));
        } catch (JSONException ignored) {
        }
        prefs(c).edit().putString(KEY_ACTIONS, list.toString()).commit();
    }

    /** Vuelve a encolar una respuesta tal cual (conserva la hora en que se apretó). */
    static synchronized void restoreAction(Context c, JSONObject action) {
        JSONArray list = parse(prefs(c).getString(KEY_ACTIONS, "[]"));
        list.put(action);
        prefs(c).edit().putString(KEY_ACTIONS, list.toString()).commit();
    }

    static synchronized JSONArray takeActions(Context c) {
        JSONArray list = parse(prefs(c).getString(KEY_ACTIONS, "[]"));
        prefs(c).edit().remove(KEY_ACTIONS).commit();
        return list;
    }

    private static JSONArray parse(String raw) {
        try {
            return new JSONArray(raw);
        } catch (JSONException e) {
            return new JSONArray();
        }
    }
}
