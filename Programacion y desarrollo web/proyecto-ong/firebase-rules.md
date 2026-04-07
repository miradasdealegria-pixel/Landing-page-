# Reglas de Seguridad de Firestore

Copia y pega este código exactamente en la sección **Rules** de tu Firestore Database en Firebase Console:
`https://console.firebase.google.com` → Tu proyecto → Firestore Database → Rules

## Reglas Recomendadas (Producción)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Colección donde se guardarán las suscripciones
    match /suscriptores/{docId} {
      
      // Solo permite CREAR documentos nuevos (no leer, actualizar ni borrar)
      allow create: if
        // Solo permite exactamente estos 3 campos
        request.resource.data.keys().hasOnly(['email', 'timestamp', 'tipo']) &&

        // El email debe ser un string con formato válido
        request.resource.data.email is string &&
        request.resource.data.email.matches('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$') &&

        // El tipo debe ser un string
        request.resource.data.tipo is string &&

        // El timestamp debe ser un timestamp del servidor
        request.resource.data.timestamp == request.time;

      // Bloquea todo lo demás
      allow read, update, delete: if false;
    }
  }
}
```

## Reglas Simples (Para Pruebas)

Si las reglas de arriba no te funcionan inmediatamente, usa estas temporalmente para probar:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /suscriptores/{docId} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

> [!CAUTION]
> Las reglas simples permiten que cualquiera cree documentos sin validación. 
> Úsalas solo para **probar** que la conexión funciona, y luego cambia a las reglas de producción.

> [!IMPORTANT]
> **Pasos para aplicar las reglas:**
> 1. Ve a [Firebase Console](https://console.firebase.google.com)
> 2. Selecciona tu proyecto "organizacion-benefica"
> 3. Ve a **Firestore Database** → pestaña **Rules**
> 4. Reemplaza todo el contenido con las reglas de arriba
> 5. Haz clic en **Publicar** (Publish)
