# Florar — landing + panel de edición

Este repo tiene dos partes:

- **Raíz** (`index.html`, `styles.css`, `script.js`, `data.json`, `config.js`): la landing pública. Se sube a **GitHub Pages**.
- **`admin-app/`**: una app separada (Next.js) que expone `/admin` para editar los links y `/api/links` para servirlos. Se sube a **Vercel**, como proyecto aparte del repo del taller que ya está en Vercel.

La landing, al cargar, pide los links a la API de Vercel. Si esa API todavía no existe o falla, usa automáticamente `data.json` como respaldo, así que la página nunca queda rota.

## 1. Publicar la landing en GitHub Pages

1. Creá un repo en GitHub y subí todo el contenido de esta carpeta (podés dejar `admin-app/` adentro, no molesta).
2. En GitHub: Settings → Pages → Source: rama `main`, carpeta `/ (root)`.
3. Listo, va a quedar en `https://<usuario>.github.io/<repo>/`. Podés después conectar un dominio propio (florar.com.ar, por ejemplo) desde el mismo panel de Pages.

## 2. El panel de admin en Vercel

Ya está desplegado en **https://admin-app-silk-nu.vercel.app** (proyecto `admin-app` en Vercel, conectado a este mismo repo con **Root Directory = `admin-app`** y **Production Branch = `main`**). Cualquier push a `main` que toque algo dentro de `admin-app/` dispara un deploy automático.

Config actual del proyecto:
- **Environment Variables**: `ADMIN_PASSWORD` (contraseña de `/admin`) y `REDIS_URL` (la agrega sola Vercel al conectar la base — Storage → Marketplace → Redis).
- El cliente de datos usa `ioredis` contra `REDIS_URL` (ver [`admin-app/lib/store.js`](admin-app/lib/store.js)).

Si alguna vez hay que recrear el proyecto desde cero: Add New Project → importar este repo → Root Directory `admin-app` → agregar `ADMIN_PASSWORD` → conectar Redis desde Storage → Marketplace.

### Conectar la landing con el admin

[`config.js`](config.js) en la raíz del repo ya apunta a la URL de Vercel:

```js
window.FLORAR_CONFIG = {
  ADMIN_API_URL: "https://admin-app-silk-nu.vercel.app"
};
```

Si el dominio de Vercel cambia alguna vez, hay que actualizar esa línea y subirla a GitHub.

## 3. Usar el panel de edición

1. Entrar a `https://admin-app-silk-nu.vercel.app/admin`.
2. Ingresar la contraseña (`ADMIN_PASSWORD`).
3. Ahí se puede:
   - Editar título, subtítulo y logo del perfil.
   - Editar texto y URL de cada botón (si falta `http(s)://` se agrega solo al guardar).
   - Agregar o eliminar botones y títulos de sección.
   - Reordenar arrastrando el ícono `⠿` de cada item, o con las flechas ↑ / ↓.
4. Botón "Guardar cambios" al final. Los cambios quedan en Redis y la landing los muestra al instante (recargando la página), sin tocar GitHub.

## Logo

El isotipo real está en [`assets/logo.png`](assets/logo.png) y el perfil ya apunta ahí (`logoUrl: "assets/logo.png"`). Si en algún momento se quiere cambiar, se puede editar el campo "URL del logo" desde `/admin` — puede ser esa misma ruta relativa u otra URL externa.
