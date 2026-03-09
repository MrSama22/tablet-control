# MacroDroid Remote Control Web App

Esta es una aplicación web estática, responsiva y con "Dark Mode", diseñada para servir como control remoto de tu dispositivo a través de los **Webhooks de MacroDroid**.

## 🚀 Cómo desplegar en Netlify (Drag & Drop)

1. Ve a [Netlify Drop](https://app.netlify.com/drop).
2. Arrastra y suelta la carpeta entera `tablet-control-web` (que contiene `index.html`, `style.css`, y `app.js`) en la zona indicada de la página de Netlify.
3. ¡Listo! Netlify te dará un enlace público (ej. `https://tu-sitio-aleatorio.netlify.app`) que puedes abrir desde cualquier navegador y dispositivo.

## 📱 Cómo configurar en MacroDroid

Para que esta web pueda interactuar con tu dispositivo, debes crear Macros en la app MacroDroid con un disparador ("Trigger") de tipo Webhook.

1. Abre **MacroDroid** en tu dispositivo.
2. Ve a la pestaña **Macros** y añade una nueva macro (`+`).
3. En la sección de **Disparadores (Triggers)**, busca y selecciona **"Webhook (URL)"**.
   * Te mostrará un **Device ID** que es único para tu dispositivo. Este es el ID que debes introducir en el recuadro "Device ID" de la página web (se guardará automáticamente para tus próximas visitas).
   * Se te pedirá un **Identificador (Identifier)**. Este será el "Nombre del Evento".
   
4. Crea una Macro individual para cada uno de los siguientes eventos que configuramos en la botonera de la web:
   * **`vol_up`** -> Configura la acción para *Subir volumen*.
   * **`vol_down`** -> Configura la acción para *Bajar volumen*.
   * **`vol_mute`** -> Configura la acción para *Silenciar/Mutear*.
   * **`swipe_up`** -> Configura acción de Interfaz de Usuario: Gesto de *deslizar hacia arriba*.
   * **`swipe_down`** -> Configura acción de Interfaz de Usuario: Gesto de *deslizar hacia abajo*.
   * **`center_click`** -> Configura acción de Interfaz de Usuario: *Clic* en las coordenadas centrales de tu pantalla.

5. ¡Guarda las Macros y prueba desde la web! Al presionar cada botón se enviará la petición web a Macrodroid activando las acciones.
