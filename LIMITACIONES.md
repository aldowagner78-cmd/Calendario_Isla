# Estado del Sistema y Recomendaciones

## 1. Integración con Backend (Firebase) ☁️
**¡Buenas noticias!** La aplicación **SÍ** está conectada a una base de datos en la nube (Firebase Realtime Database).
*   **Sincronización:** Los cambios que hagas se guardan en la nube y se deberían reflejar en los dispositivos de los demás (si tienen internet).
*   **Persistencia:** Si borras los datos del navegador, la información de la rotación y cambios NO se pierde, porque baja de Firebase.

## 2. Modo Admin (Seguridad Simple) 🔒
Para cumplir con tu pedido de "solo yo puedo hacer cambios", he implementado un sistema de **PIN simplificado**:
*   **Solo lectura para todos:** Cualquiera puede VER el calendario.
*   **Edición protegida:** Si alguien intenta tocar un día para cambiarlo, se le pedirá un PIN.
*   **Tu PIN:** `1234` (Una vez ingresado, el dispositivo queda "autorizado" como Admin y no lo pide más, a menos que borres datos).

## 3. Notificaciones 🔔
*   **Locales:** Cuando haces un cambio, te confirma con un mensaje visual (Toast).
*   **Remotas:** Si *otra* persona (o tú desde otro dispositivo) hace un cambio, la app intentará avisarte "🔄 Calendario actualizado remotamente" cuando detecte el cambio en la base de datos (requiere tener la app abierta o que el navegador permita checkear en 2do plano).

## 4. Próximos Pasos (Opcionales)
*   **Login Real:** Si el PIN `1234` se filtra o necesitan más seguridad, podríamos implementar Login con Google (ya que usamos Firebase).
*   **Notificaciones Push Reales:** Para avisar aunque la app esté cerrada (requiere configuración más avanzada de Service Workers y Cloud Messaging).
