package com.quietassistant

import android.Manifest
import android.app.*
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.media.AudioManager
import android.os.Build
import android.telephony.SmsManager
import android.telephony.TelephonyCallback
import android.telephony.TelephonyManager
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class TelephonyModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val context: ReactApplicationContext = reactContext
    private var telephonyManager: TelephonyManager? = null
    private var audioManager: AudioManager? = null
    private var smsManager: SmsManager = SmsManager.getDefault()
    private var telephonyCallback: TelephonyCallback? = null
    private var notificationManager: NotificationManager? = null
    private var isListening = false
    private var currentConfig: ReadableMap? = null
    
    private val FOREGROUND_SERVICE_ID = 1001
    private val NOTIFICATION_CHANNEL_ID = "quiet_assistant_channel"
    private val NOTIFICATION_CHANNEL_NAME = "Quiet Assistant Service"

    override fun getName(): String {
        return "TelephonyModule"
    }

    @ReactMethod
    fun initialize(promise: Promise) {
        try {
            telephonyManager = context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
            audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
            notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            
            createNotificationChannel()
            
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("INIT_ERROR", "Failed to initialize telephony module", e)
        }
    }

    @ReactMethod
    fun startListening(config: ReadableMap, promise: Promise) {
        if (isListening) {
            promise.resolve(true)
            return
        }

        currentConfig = config

        try {
            // Set silent mode if enabled
            if (config.hasKey("autoSilenceEnabled") && config.getBoolean("autoSilenceEnabled")) {
                setSilentModeInternal(true)
            }

            // Start foreground service
            startForegroundServiceInternal("Quiet Assistant Active", "Monitoring incoming calls")

            // Register telephony callback
            if (ActivityCompat.checkSelfPermission(
                    context,
                    Manifest.permission.READ_PHONE_STATE
                ) == PackageManager.PERMISSION_GRANTED
            ) {
                registerTelephonyCallback()
                isListening = true
                promise.resolve(true)
            } else {
                promise.reject("PERMISSION_ERROR", "READ_PHONE_STATE permission not granted")
            }
        } catch (e: Exception) {
            promise.reject("START_LISTENING_ERROR", "Failed to start listening", e)
        }
    }

    @ReactMethod
    fun stopListening(promise: Promise) {
        try {
            if (isListening) {
                unregisterTelephonyCallback()
                stopForegroundServiceInternal()
                setSilentModeInternal(false)
                isListening = false
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("STOP_LISTENING_ERROR", "Failed to stop listening", e)
        }
    }

    @ReactMethod
    fun sendSMS(phoneNumber: String, message: String, promise: Promise) {
        if (ActivityCompat.checkSelfPermission(
                context,
                Manifest.permission.SEND_SMS
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            promise.reject("PERMISSION_ERROR", "SEND_SMS permission not granted")
            return
        }

        try {
            smsManager.sendTextMessage(phoneNumber, null, message, null, null)
            
            // Emit event to JavaScript
            val params = Arguments.createMap().apply {
                putString("phoneNumber", phoneNumber)
                putString("message", message)
                putDouble("timestamp", System.currentTimeMillis().toDouble())
            }
            sendEvent("onSMSSent", params)
            
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SMS_SEND_ERROR", "Failed to send SMS", e)
        }
    }

    @ReactMethod
    fun checkPermissions(promise: Promise) {
        val result = Arguments.createMap().apply {
            putBoolean(
                "readPhoneState",
                ActivityCompat.checkSelfPermission(
                    context,
                    Manifest.permission.READ_PHONE_STATE
                ) == PackageManager.PERMISSION_GRANTED
            )
            putBoolean(
                "sendSMS",
                ActivityCompat.checkSelfPermission(
                    context,
                    Manifest.permission.SEND_SMS
                ) == PackageManager.PERMISSION_GRANTED
            )
        }
        promise.resolve(result)
    }

    @ReactMethod
    fun setSilentMode(enabled: Boolean, promise: Promise) {
        try {
            setSilentModeInternal(enabled)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SILENT_MODE_ERROR", "Failed to set silent mode", e)
        }
    }

    private fun setSilentModeInternal(enabled: Boolean) {
        audioManager?.let { manager ->
            if (enabled) {
                manager.ringerMode = AudioManager.RINGER_MODE_SILENT
            } else {
                manager.ringerMode = AudioManager.RINGER_MODE_NORMAL
            }
        }
    }

    @ReactMethod
    fun startForegroundService(title: String, message: String, promise: Promise) {
        try {
            startForegroundServiceInternal(title, message)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("FOREGROUND_ERROR", "Failed to start foreground service", e)
        }
    }

    private fun startForegroundServiceInternal(title: String, message: String) {
        // Create a simple notification without content intent for now
        val notification = NotificationCompat.Builder(context, NOTIFICATION_CHANNEL_ID)
            .setContentTitle(title)
            .setContentText(message)
            .setSmallIcon(android.R.drawable.ic_dialog_info) // Using system icon
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()

        // For now, we'll just show a notification without a full foreground service
        // This is simpler for initial testing
        notificationManager?.notify(FOREGROUND_SERVICE_ID, notification)
    }

    @ReactMethod
    fun stopForegroundService(promise: Promise) {
        try {
            stopForegroundServiceInternal()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("FOREGROUND_ERROR", "Failed to stop foreground service", e)
        }
    }

    private fun stopForegroundServiceInternal() {
        notificationManager?.cancel(FOREGROUND_SERVICE_ID)
    }

    private fun registerTelephonyCallback() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            telephonyCallback = object : TelephonyCallback(), TelephonyCallback.CallStateListener {
                override fun onCallStateChanged(state: Int) {
                    handleCallStateChange(state)
                }
            }
            
            telephonyManager?.registerTelephonyCallback(
                context.mainExecutor,
                telephonyCallback as TelephonyCallback
            )
        } else {
            // For older Android versions
            // Note: You'll need to implement PhoneStateListener for older APIs
            // This is simplified for now
        }
    }

    private fun unregisterTelephonyCallback() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            telephonyCallback?.let {
                telephonyManager?.unregisterTelephonyCallback(it)
            }
        }
    }

    private fun handleCallStateChange(state: Int) {
        when (state) {
            TelephonyManager.CALL_STATE_RINGING -> {
                // Note: Getting phone number requires additional permissions
                val phoneNumber = "UNKNOWN"
                
                // Send auto-reply if enabled
                currentConfig?.let { config ->
                    if (config.hasKey("autoReplyEnabled") && config.getBoolean("autoReplyEnabled")) {
                        val message = config.getString("defaultMessage") ?: "I'm currently unavailable."
                        
                        // We'll need to implement sending SMS when call comes in
                        // This requires proper Promise handling
                        println("[TelephonyModule] Would send auto-reply to: $phoneNumber")
                        println("[TelephonyModule] Message: $message")
                    }
                }
                
                // Emit event to JavaScript
                val params = Arguments.createMap().apply {
                    putString("phoneNumber", phoneNumber)
                    putString("callState", "RINGING")
                    putDouble("timestamp", System.currentTimeMillis().toDouble())
                }
                sendEvent("onIncomingCall", params)
            }
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                NOTIFICATION_CHANNEL_ID,
                NOTIFICATION_CHANNEL_NAME,
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Background service for Quiet Assistant"
                setShowBadge(false)
            }
            notificationManager?.createNotificationChannel(channel)
        }
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Required for RN built-in EventEmitter
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for RN built-in EventEmitter
    }
}