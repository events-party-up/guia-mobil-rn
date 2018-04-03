package com.animus.guideapp;

import android.support.annotation.Nullable;

import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage; 
import com.crashlytics.android.Crashlytics;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.magus.fblogin.FacebookLoginPackage;
import com.mapbox.rctmgl.RCTMGLPackage;
import com.merryjs.PhotoViewer.MerryPhotoViewPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.bridge.NavigationReactPackage;

import java.util.Arrays;
import java.util.List;

import io.fabric.sdk.android.Fabric;
import io.realm.react.RealmReactPackage;

public class MainApplication extends NavigationApplication  {


  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  @Nullable
  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }


  protected List<ReactPackage> getPackages() {
    // Add additional packages you require here
    // No need to add RnnPackage and MainReactPackage
    return Arrays.<ReactPackage>asList(
            new RNI18nPackage(),
            new NavigationReactPackage(),
            new FacebookLoginPackage(),
            new MerryPhotoViewPackage(),
            new RealmReactPackage(),
            new RNDeviceInfo(),
            new ReactNativePushNotificationPackage(),
            new RCTMGLPackage(),
            new VectorIconsPackage(),
            new MerryPhotoViewPackage(),
            new SnackbarPackage()
    );
  }

  @Override
  public String getJSMainModuleName() {
    return "index";
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Fabric.with(this, new Crashlytics());
    SoLoader.init(this, /* native exopackage */ false);
  }
}
