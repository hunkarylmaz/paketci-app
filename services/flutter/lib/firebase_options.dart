import 'package:firebase_core/firebase_core.dart';

// Firebase yapılandırma dosyası
// Bu dosya Firebase Console'dan indirilen google-services.json'dan otomatik oluşturulur
// flutterfire configure komutu ile oluşturulabilir

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    // Android yapılandırması
    return const FirebaseOptions(
      apiKey: 'YOUR_API_KEY',
      appId: 'YOUR_APP_ID',
      messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
      projectId: 'paketci-app',
      databaseURL: 'https://paketci-app.firebaseio.com',
      storageBucket: 'paketci-app.appspot.com',
    );
  }
}
