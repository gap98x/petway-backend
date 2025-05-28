# Autenticación con Firebase

Esta guía te ayudará a configurar la autenticación con Google usando Firebase en tu aplicación NestJS.

## Configuración de Firebase

1. Ve a la [consola de Firebase](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a "Configuración del proyecto" > "Cuentas de servicio"
4. Haz clic en "Generar nueva clave privada" para descargar el archivo JSON de credenciales
5. Copia los valores del archivo JSON a tu archivo `.env`:

```
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_PRIVATE_KEY_ID=tu-private-key-id
FIREBASE_PRIVATE_KEY='tu-clave-privada'
FIREBASE_CLIENT_EMAIL=tu-email@tudominio.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=tu-client-id
FIREBASE_CLIENT_CERT_URL=tu-client-cert-url
```

## Configuración de la autenticación de Google

1. En la consola de Firebase, ve a "Authentication" > "Sign-in method"
2. Habilita "Google" como proveedor de autenticación
3. Proporciona un correo electrónico de soporte y guarda los cambios

## Uso

### Inicio de sesión con Google

```http
POST /auth/google
Content-Type: application/json

{
  "idToken": "token-de-google"
}
```

### Validar token

```http
POST /auth/validate-token
Content-Type: application/json

{
  "token": "token-de-firebase"
}
```

## Variables de entorno

Asegúrate de configurar las siguientes variables de entorno en tu archivo `.env`:

- `FIREBASE_PROJECT_ID`: ID de tu proyecto de Firebase
- `FIREBASE_PRIVATE_KEY_ID`: ID de tu clave privada de Firebase
- `FIREBASE_PRIVATE_KEY`: Clave privada de Firebase (asegúrate de escapar los caracteres especiales)
- `FIREBASE_CLIENT_EMAIL`: Correo electrónico de la cuenta de servicio de Firebase
- `FIREBASE_CLIENT_ID`: ID del cliente de Firebase
- `FIREBASE_CLIENT_CERT_URL`: URL del certificado del cliente de Firebase
