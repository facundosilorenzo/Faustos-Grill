/* ==========================================================================
   Datos del restaurante. Edita SOLO este archivo para cambiar teléfono,
   horarios, redes o activar las reseñas de Google.
   Los valores marcados con  // PENDIENTE  aún no son los reales.
   ========================================================================== */
window.FAUSTOS = {
  name: "Fausto's Grill",
  timezone: "Europe/Madrid",

  phone: "+34 952 00 62 61",
  whatsapp: "",                       // PENDIENTE: móvil con WhatsApp, p. ej. "+34 600 000 000"
  email: "",                          // PENDIENTE: p. ej. "reservas@faustosgrill.es"
  instagram: "",                      // PENDIENTE: usuario sin @, p. ej. "faustosgrill"

  address: {
    street: "Calle Victoria 86",
    city: "29012 Málaga",               // PENDIENTE: confirmar código postal
    mapsQuery: "Calle Victoria 86, Málaga, España",
  },

  // 0 = domingo, 1 = lunes … 6 = sábado. null = cerrado.
  // Para un cierre después de medianoche usa p. ej. close: "01:00".
  hours: {
    0: { open: "09:00", close: "23:30" },
    1: null,
    2: { open: "09:00", close: "23:30" },
    3: { open: "09:00", close: "23:30" },
    4: { open: "09:00", close: "23:30" },
    5: { open: "09:00", close: "23:30" },
    6: { open: "09:00", close: "23:30" },
  },
  hoursNote: "Cocina non-stop",

  /* Reseñas de Google ------------------------------------------------------
     Para mostrar las reseñas reales:
       1. Crea una clave en Google Cloud con "Maps JavaScript API" y
          "Places API (New)" activadas, restringida al dominio de la web.
       2. Busca el Place ID del local en
          https://developers.google.com/maps/documentation/places/web-service/place-id
       3. Pega ambos valores aquí y pon demo en false.
     Sin clave se muestran reseñas de EJEMPLO, marcadas como tal. */
  google: {
    apiKey: "",                       // PENDIENTE
    placeId: "",                      // PENDIENTE
    reviewsUrl: "https://www.google.com/maps/search/?api=1&query=Fausto%27s+Grill+Calle+Victoria+86+M%C3%A1laga",
    demo: true,
  },
};
