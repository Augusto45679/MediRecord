package ar.medirecord.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

import ar.medirecord.app.alarm.MedAlarmPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(MedAlarmPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
