# Fausto's Grill · web

Web del restaurante **Fausto's Grill** (Calle Victoria 86, Málaga): carta, fotos, reseñas de Google, ubicación con mapa, horario con estado "abierto ahora" y formulario de reserva.

Es una web estática (HTML + CSS + JavaScript, sin dependencias ni paso de compilación). Se puede publicar tal cual en GitHub Pages, Netlify, Vercel o cualquier hosting.

## Verla en local

Abre `index.html` en el navegador, o sirve la carpeta:

```bash
npx serve .
```

## Qué editar

| Quiero cambiar… | Archivo |
|---|---|
| Teléfono, WhatsApp, email, Instagram, dirección, horario | `js/config.js` |
| Platos y precios de la carta | `index.html`, sección `Carta` |
| Fotos | `assets/fotos/` (ver `assets/fotos/LEEME.md`) |
| Colores, tipografía, espaciado | `css/styles.css` (tokens al principio) |

### Reseñas de Google

Sin configurar, la sección muestra reseñas de **ejemplo**, marcadas como tal. Para cargar las reales:

1. En [Google Cloud](https://console.cloud.google.com/) crea una clave de API con **Maps JavaScript API** y **Places API (New)** activadas. Restríngela a tu dominio (*HTTP referrers*).
2. Busca el **Place ID** del local con el [buscador de Place ID](https://developers.google.com/maps/documentation/places/web-service/place-id).
3. En `js/config.js` rellena `google.apiKey` y `google.placeId`, y pon `demo: false`.

Google devuelve hasta 5 reseñas destacadas más la nota media y el total de reseñas. Los botones "Ver todas en Google" y "Escribir una reseña" enlazan a la ficha.

### Reservas

El formulario prepara la reserva y la envía por:
- **WhatsApp**, si hay un número en `whatsapp`;
- si no, por **correo**, si hay un `email`;
- si no hay ninguno, invita a llamar por teléfono.

Valida que el día no sea lunes (cerrado) ni una fecha pasada, y que la hora esté dentro del horario.

## Pendiente (contenido real)

- [ ] Precio en pitufo de la tostada Catalana (en la carta impresa está corregido a mano)
- [ ] Fotos de los platos y del local
- [ ] Clave de Google y Place ID para las reseñas
- [ ] WhatsApp, email e Instagram (opcionales)
- [ ] Confirmar código postal

## Guías de diseño y animación

El proyecto incluye dos paquetes de *skills* para agentes de IA (Claude Code y compatibles) en `.claude/skills/`:

- **[Impeccable](https://impeccable.style/docs/)** (`.claude/skills/impeccable`): criterio de diseño, auditorías (`/impeccable audit`), pulido (`/impeccable polish`), tipografía, color, layout y movimiento.
- **[Emil Kowalski](https://emilkowal.ski/skill)** (`.claude/skills/emil-design-eng`, `animate`, `review-animations`, `improve-animations`…): reglas de animación e interacción. Se instaló con `npx skills add emilkowalski/skill` (ver `skills-lock.json`).

Para actualizarlos: `npx skills update` y `npx impeccable update`.

`PRODUCT.md` y `DESIGN.md` describen el público, el tono y el sistema visual. `CLAUDE.md` indica a los agentes cómo usar estas guías al modificar la web.
