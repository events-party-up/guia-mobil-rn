package com.guiaanimus;

import android.app.Application;

import com.crashlytics.android.Crashlytics;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.react.ReactApplication;
import com.reactnativenavigation.NavigationReactPackage;
import com.magus.fblogin.FacebookLoginPackage;
import com.merryjs.PhotoViewer.MerryPhotoViewPackage;
import com.mapbox.rctmgl.RCTMGLPackage;
import io.fabric.sdk.android.Fabric;
import io.realm.react.RealmReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.mapbox.rctmgl.RCTMGLPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new NavigationReactPackage(),
            new FacebookLoginPackage(),
            new MerryPhotoViewPackage(),
            new RCTMGLPackage(),
            new RealmReactPackage(),
            new RNDeviceInfo(),
            new ReactNativePushNotificationPackage(),
            new RCTMGLPackage(),
            new VectorIconsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Fabric.with(this, new Crashlytics());
    SoLoader.init(this, /* native exopackage */ false);
  }
}
