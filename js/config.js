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
    apiKey: "",                       // opcional: para cargar reseñas en vivo (ver README)
    placeId: "",                      // opcional
    reviewsUrl: "https://maps.app.goo.gl/qgtaZEFkXfmFUJ5BA",
    demo: false,

    // Reseñas destacadas copiadas de la ficha pública de Google (8 nov 2026).
    // Se muestran mientras no haya clave de API. Actualízalas de vez en cuando.
    rating: 4.7,
    count: 322,
    featured: [
      { author: "Héctor Bautista Sala", rating: 5, when: "hace un mes", text: "Fui con mi mujer a comer y pedimos la parrillada para dos personas: la carne se derretía en la boca y se notaba el género de muy buena calidad. El personal es muy amable y sirven súper rápido. Ambiente acogedor y tranquilo." },
      { author: "H Kim", rating: 5, when: "hace 7 meses", text: "Es mi lugar preferido siempre que quiero comer carne argentina. La carne es espectacular, y las empanadas, la morcilla y el provolone también están riquísimos. Además, los precios son razonables y el personal es muy amable!" },
      { author: "Fernando Sol Martínez", rating: 5, when: "hace 2 semanas", text: "Empanadas riquísimas y carne a la brasa en su punto muy tierna el personal extraordinario. Merece la pena salir de la zona turística y acercarte a este restaurante argentino." },
      { author: "Eugenia Fernández", rating: 5, when: "hace 3 semanas", text: "Nos pedimos una parrillada para 4 y unas milanesas. Estaba todo buenísimo. Los chicos divinos! A la cumpleañera le regalaron una botella de vino. Gracias, volveremos seguro!!" },
      { author: "Cristina Jiménez González", rating: 5, when: "hace 10 meses", text: "Celebramos la comida de empresa allí y comimos genial, varios entrantes a compartir y como principal varios tipos de carnes, patatas y ensalada (muy rica aliñada por cierto). Finalmente pusieron varios postres para compartir. Me gustó mucho y repetiremos seguro." },
    ],
  },
};
