// Archivo script.js — catálogo de especies actualizado exactamente según el listado fuente.
// El <select> de especies se llena dinámicamente para evitar inconsistencias.

require([
  "esri/config", "esri/WebMap", "esri/views/MapView", "esri/layers/GraphicsLayer",
  "esri/widgets/Sketch", "esri/layers/FeatureLayer", "esri/widgets/Search",
  "esri/widgets/Home", "esri/widgets/BasemapGallery", "esri/widgets/Expand"
], function (
  esriConfig, WebMap, MapView, GraphicsLayer, Sketch, FeatureLayer,
  Search, Home, BasemapGallery, Expand
) {
  // --- CONFIGURACIÓN (ajusta si cambia tu mapa/capa) ---
  esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurFVwsLxwboNn05dD-g-wXCq6hIoNzOz3ux9yzgOZG9INLDTddo6qBTYDZm_n5DjAOyi-7dwrRWABXsY3JxNU_J4jht6poTGK7pr0kZDCebJwr_HQQXpBhuiVGqHx61qgMm2r_LcgTF9Kx5LW8O_Nh-3Q2uVRUNysgIMcBWm8NhMNO0w6TstBCLyeMVJg9gNwDW-Ve1zPsXkpTSmnBquPTlvBt5B2Hw8A5m8cgP-CH1BB4l06T8wE4yYvvwfurR82Ig..AT1_RAbPD7p5";
  const idDeTuMapaWeb = "ed45f96423704bd5ad66736ddddd68b4";
  const urlDeTuCapa = "https://services7.arcgis.com/lsxbLWF2l19Rmhqj/arcgis/rest/services/service_9374627a2668441ca317d496364bf485_form/FeatureServer/0";

  // --- MAPA / CAPAS ---
  const graphicsLayer = new GraphicsLayer();
  const featureLayer = new FeatureLayer({ url: urlDeTuCapa });
  const map = new WebMap({ portalItem: { id: idDeTuMapaWeb } });
  map.add(graphicsLayer);
  const view = new MapView({ container: "viewDiv", map });

  // Widgets básicos
  const searchWidget = new Search({ view });
  view.ui.add(searchWidget, { position: "top-right", index: 0 });
  const homeWidget = new Home({ view });
  view.ui.add(homeWidget, "top-left");
  const basemapGallery = new BasemapGallery({ view });
  const bgExpand = new Expand({ view, content: basemapGallery });
  view.ui.add(bgExpand, "top-right");

  // Sketch (creación de punto activada por botón)
  const sketch = new Sketch({
    view,
    layer: graphicsLayer,
    visibleElements: { createTools: { point: true, polyline: false, polygon: false, rectangle: false, circle: false } }
  });

  // --- FORMULARIO ---
  const drawPointButton = document.getElementById("draw-point-btn");
  const submitButton = document.getElementById("submit-btn");
  const form = document.getElementById("registro-form");

  const nombreComunDropdown = document.getElementById("nombre_comun");
  const nombreCientificoInput = document.getElementById("nombre_cientifico");
  const otraEspecieGroup = document.getElementById("otra_especie_group");

  let puntoCreado;

  // Utilidad: escapar texto para HTML (por si acaso)
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s]));
  }

  // === Catálogo de especies (común -> científico) EXACTO según tu lista ===
  const speciesMap = {
    "Abarco": "Cariniana sp.",
    "Acacia amarilla": "Cassia siamea (Lam.)",
    "Acacia de Girardot": "Delonix regia",
    "Aceituno": "Vitex cymosa",
    "Achiote": "Bixa orellana",
    "Acuápar": "Hura crepitans",
    "Ageratina": "Ageratina sp.",
    "Agraz": "Vaccinium floribundum",
    "Aguacatillo": "Persea sp.",
    "Ají de páramo": "Drimys sp.",
    "Alcaparro enano": "Senna multiglandulosa",
    "Alcaparro grande": "Senna viarum",
    "Algarrobo": "Hymenaea courbaril",
    "Algarrobo doncello": "Prosopis juliflora (Sw.) DC.",
    "Aliso": "Alnus sp.",
    "Almendro": "Terminalia sp.",
    "Amarguero": "Critoniopsis sp.",
    "Amargoso": "Ageratina sp.",
    "Amarrabollos": "Meriania sp.",
    "Angelito": "Monochaetum myrtoideum",
    "Arizá": "Brownea sp.",
    "Arbol de caparrapí": "Ocotea  cymbarum Kunth.",
    "Arbol del pan": "Artocarpus sp.",
    "Arboloco": "Montanoa quadrangularis",
    "Arrayán blanco": "Myrcianthes leucoxyla",
    "Arrayán negro": "Myrcyanthes rophaloides",
    "Azuceno blanco": "Plumeria sp.",
    "Balú": "Erythrina edulis",
    "Baluy": "Erythrina edulis",
    "Bao": "Platymiscium sp.",
    "Balso": "Ochroma pyramidale (Cav. Ex-Lam) Urb",
    "Balso blanco": "Heliocarpus sp.",
    "Bayo": "Vochysia sp.",
    "Bilibil": "Guarea sp.",
    "Blanquillo": "Eupatorium sp.",
    "Botumbo": "Prunus integrifolia",
    "Brevo": "Ficus carica",
    "Buchegallino": "Coccoloba obovata",
    "Cachimbo": "Erythrina fusca Louveiro",
    "Cachipay": "Bactris gasipaes Kunth.",
    "Cafeto de monte": "Posoqueria latifolia",
    "Camargo": "Verbesina arbórea",
    "Cámbulo": "Erythrina poeppigiana (Walp.) Q.F.Cook",
    "Campano": "Vallea stipularis",
    "Cañafistol amarillo": "Cassia moschata",
    "Caoba": "Swietenia sp.",
    "Capote": "Machaerium capote",
    "Caracolí": "Anacardium excelsum Skeel",
    "Caraqueño": "Erythrina indica",
    "Carbonero rojo": "Calliandra sp.",
    "Cariseco": "Billia sp.",
    "Carrán colorado": "Pouteria sp.",
    "Carrapo": "Bulnesia carrapo Killip & Dugand",
    "Carreto": "Aspidosperma polyneuron Müll . Arg",
    "Casco de vaca": "Bauhinia sp.",
    "Caucho sabanero": "Ficus soatensis",
    "Caucho tequendama": "Ficus tequendamae",
    "Cedrillo": "Phyllantus salvifolius Kunth",
    "Cedro amarillo": "Albizia guachapele",
    "Cedro caoba": "Swietenia sp.",
    "Cedro cebollo": "Cedrela montana Moritz ex Turcz.",
    "Cedro de altura": "Cedrela montana Moritz ex Turcz.",
    "Cedro nogal": "Juglans neotrópica Diels",
    "Cedro rosado": "Cedrela odorata",
    "Ceiba": "Ceiba pentandra (L.) Gaertn.",
    "Ceiba amarilla": "Trema micrantha (L.) Blume",
    "Ceiba bonga": "Ceiba pentandra (L.) Gaertn.",
    "Ceiba de leche": "Trema micrantha (L.) Blume",
    "Ceiba verde": "Pseudobombax septenatum (Jacq.) Dugand",
    "Cerezo común": "Prunus serotina",
    "Cerezo montañero": "Prunus buxifolia",
    "Ciro": "Baccharis bogotensis",
    "Ciruelillo": "Ximenia americana",
    "Clavellino": "Caesalpinia pulchérrima (L.) Sw.",
    "Chachafruto": "Erythrina edulis",
    "Chagualo": "Clusia multiflora Kunth",
    "Chambimbe": "Sapindus saponaria",
    "Chánamo": "Dodonaea sp.",
    "Chicalá amarillo": "Tecoma stans (L.) Juss. ex Kunth",
    "Chicalá rosado": "Delostoma integrifolium",
    "Chilco": "Baccharis latifolia",
    "Chiminango": "Pithecellobium dulce",
    "Chingalé": "Jacaranda copaia (Aubl.) D. Don",
    "Chirlobirlo": "Tecoma stans",
    "Chitató": "Muntingia calabura",
    "Chocho de arbol": "Erythrina rubrinervia Kunth",
    "Chuque": "Viburnum triphyllum Bentham",
    "Cocacá": "Achatocarpus nigricans Triana",
    "Coralito": "Ixora sp.",
    "Corono": "Xilosma sp",
    "Cruceto": "Randia aculeata L.",
    "Cucharo": "Myrsine guianensis",
    "Cucharo blanco": "Myrsine coriaceae",
    "Cucubo": "Solanum oblongifolium",
    "Cují": "Prosopis juliflora (Sw.) DC.",
    "Cumulá": "Aspidosperma polyneuron Müll . Arg",
    "Dinde": "Maclura tinctoria (L.) D. Don ex Steud",
    "Diomate": "Astronium graveolens Jacq.",
    "Dividivi de tierra fría": "Tara espinosa (Molina) Br. & Rose",
    "Drago": "Croton sp.",
    "Duraznillo": "Abatia parviflora Ruiz & Pav.",
    "Encenillo": "Weinmannia sp.",
    "Endrino": "Myrcia sp.",
    "Espadero": "Myrsine coriaceae",
    "Espino garbanzo": "Duranta sp.",
    "Falso pimiento": "Schinus molle L.",
    "Floramarillo": "Tecoma stans",
    "Gaque": "Clusia multiflora Kunth",
    "Garrocho": "Viburnum triphyllum Bentham",
    "Gomo": "Cordia alba L",
    "Granadillo": "Platymiscium hebestachyum Benth",
    "Granizo": "Hedyosmum sp.",
    "Guácimo": "Guazuma ulmifolia Lam.",
    "Guácimo colorado": "Luehea seemannii Triana & Planch",
    "Guacharaco": "Cupania sp.",
    "Guadua": "Guadua spp.",
    "Gualanday": "Jacaranda caucana Pittier",
    "Guamo": "Inga sp.",
    "Guamuche": "Albizia carbonaria (Britton) E.J.M.Koenen",
    "Guaney": "Erythrina poeppigiana (Walp.) O.F. Cook",
    "Guayacán amarillo": "Handroanthus chrysanthus",
    "Guayacán de Manizales": "Lafoencia speciosa",
    "Guayacán carrapo": "Bulnesia sp.",
    "Guayacán chaparro": "Albizia pistaciifolia  (Willd.) Barneby & J.W.Grimes.",
    "Guayacán hobo": "Centrolobium sp.",
    "Guayacán negro": "Guaiacum officinale",
    "Guayacán trébol": "Platymiscium sp.",
    "Gurrubo": "Lycianthes sp.",
    "Gusanero": "Astronium graveolens Jacq.",
    "Hayuelo": "Dodonaea sp.",
    "Higuerón": "Ficus insipida",
    "Hobo": "Spondias mombin L.",
    "Iguá": "Albizia guachapele",
    "Indiodesnudo": "Bursera sp.",
    "Jaboncillo": "Sapindus saponaria",
    "Jagua": "Genipa americana L.",
    "Jazmin": "Guettarda rusbyi Standl.",
    "Jazmin del Cabo": "Pittosporum undulatum Vent.",
    "Jobo": "Spondias mombin L.",
    "Juco": "Viburnum triphyllum Bentham",
    "Laurel": "Ocotea sp.",
    "Laurel de cera hojiancho": "Morella pubescens",
    "Laurel de cera hojipequeño": "Morella parvifolia",
    "Laurel huesito": "Pittosporum undulatum Vent.",
    "Lechero plomo": "Pseudolmedia sp.",
    "Limonacho": "Achatocarpus nigricans Triana",
    "Lombricero": "Alchornea sp",
    "Lulo de perro": "Solanum oblongifolium",
    "Macle": "Escallonia sp.",
    "Mamoncillo": "Meliccocus bijugatus  Jacq.",
    "Mangle de tierra fría": "Escallonia sp.",
    "Mano de oso": "Oreopanax sp.",
    "Matarratón": "Gliricidia sepium",
    "Mayo": "Tibouchina lepidota (Bompl.) Baill.",
    "Mestizo": "Cupania sp.",
    "Michú": "Sapindus saponaria",
    "Móncoro": "Cordia gerascanthus",
    "Mortiño": "Hesperomeles sp.",
    "Mortiño verdadero": "Hesperomeles sp.",
    "Muche": "Albizia carbonaria (Britton) E.J.M.Koenen",
    "Nacedero": "Trichanthera sp.",
    "Naranjillo": "Quadrellla odoratissima",
    "Naranjuelo": "Capparis sp.",
    "Nogal cafetero": "Cordia alliodora (Ruiz & Pav. ) Oken",
    "Nogal negro": "Juglans neotrópica Diels",
    "Ocobo blanco": "Tabebuia roseoalba",
    "Ocobo rosado": "Tabebuia rosea (Bertol.) Bertero ex A. DC",
    "Ocobo flor morado": "Tabebuia rosea (Bertol.) Bertero ex A. DC",
    "Ondequera": "Casearia corymbosa Kunth",
    "Orejero": "Enterolobium cyclocarpum (Jacq.) Griseb",
    "Pagoda": "Escallonia myrtilloides",
    "Palma amarga": "Sabal mauritiiformis ",
    "Palma cola de pescado": "Caryota mitis",
    "Palma de cera": "Ceroxylon vogelianum (Engel) H. Wendl.",
    "Palma de cera de Sasaima": "Ceroxylon sasaimae Galeano",
    "Palma de cuesco": "Attalea butyracea (Mutis ex L.f.) Wess.Boer",
    "Palma de vino": "Attalea butyracea (Mutis ex L.f.) Wess.Boer",
    "Palma mararay": "Aiphanes sp.",
    "Palma mil pesos": "Oenocarpus bataua ",
    "Palma Real": "Ceroxylon alpinum Bonpl. Ex DC.",
    "Palma Sabal": "Sabal mauritiiformis ",
    "Palo de cruz": "Brownea sp.",
    "Palo mulato": "Ilex kunthiana",
    "Paloblanco": "Ilex kunthiana",
    "Pategallina": "Schefflera sp.",
    "Pavito": "Jacaranda copaia (Aubl.) D. Don",
    "Payandé bobo": "Pithecellobium dulce",
    "Pino colombiano": "Podocarpus sp.",
    "Pino romerón": "Decusocarpus sp.",
    "Piñon de oreja": "Enterolobium cyclocarpum (Jacq.) Griseb",
    "Raque": "Vallea stipularis",
    "Rayo": "Parkia sp.",
    "Roble": "Quercus sp.",
    "Roble negro": "Colombobalanus sp.",
    "Rodamonte": "Escallonia myrtilloides",
    "Romerón": "Decusocarpus sp.",
    "Ruque": "Viburnum triphyllum",
    "Samán": "Albizia samán",
    "Sangregao": "Croton sp.",
    "Sangretoro": "Virola sp.",
    "San juanito": "Vallea estipularis",
    "Sauce llorón": "Salix sp.",
    "Sauco": "Sambucus sp.",
    "Sauz": "Salix sp.",
    "Sietecueros": "Tibouchina lepidota (Bompl.) Baill.",
    "Suribio": "Zigya sp.",
    "Tabaquillo": "Solanum mauritianum",
    "Tachuelo": "Zanthoxylum sp.",
    "Tagua": "Giadendron punctatum",
    "Tamarindo": "Tamarindus indica",
    "Tambor": "Schizolobium sp.",
    "Tibar": "Escallonia paniculata sp",
    "Tinto": "Cestrum sp.",
    "Totumo": "Crescentia cujete L.",
    "Tomatillo": "Lycianthes sp.",
    "Totumo de paramo": "Citharexylum sp.",
    "Trompeto": "Bocconia sp.",
    "Tronador": "Hura crepitans",
    "Trupillo": "Prosopis juliflora (Sw.) DC.",
    "Tuno": "Miconia sp.",
    "Uche": "Prunus buxifolia",
    "Uva camarona": "Cavendishia sp.",
    "Uva de anís": "Macleania sp.",
    "Uvito": "Cordia alba L",
    "Vainillo": "Senna spectabilis",
    "Velero": "Senna spectabilis",
    "Velitas": "Abatia parviflora Ruiz & Pav.",
    "Yarumo": "Cecropia sp.",
    "Yopo": "Anadenanthera sp.",
    "Zurrumbo": "Trema micrantha (L.) Blume"
  };

  // --- Poblar el <select> desde speciesMap ---
  (function cargarOpciones() {
    let html = '<option value="">--Seleccione una especie--</option>';
    Object.keys(speciesMap).forEach(nombreComun => {
      html += `<option value="${escapeHtml(nombreComun)}">${escapeHtml(nombreComun)}</option>`;
    });
    html += `<option value="otra_especie">Otra</option>`;
    nombreComunDropdown.innerHTML = html;
  })();

  // Sincroniza nombre científico y muestra campo "Otra"
  nombreComunDropdown.addEventListener("change", (e) => {
    const val = e.target.value;
    const cient = speciesMap[val] || "";
    nombreCientificoInput.value = cient;

    if (val === "otra_especie") {
      otraEspecieGroup.style.display = "block";
      nombreCientificoInput.readOnly = false;
      nombreCientificoInput.placeholder = "Escribe el nombre científico (opcional)";
    } else {
      otraEspecieGroup.style.display = "none";
      nombreCientificoInput.readOnly = true;
      nombreCientificoInput.placeholder = "";
    }
  });

  // Botón para dibujar punto
  drawPointButton.addEventListener("click", () => sketch.create("point"));

  // Habilitar envío cuando hay punto
  sketch.on("create", (event) => {
    if (event.state === "complete") {
      if (puntoCreado) graphicsLayer.remove(puntoCreado);
      puntoCreado = event.graphic;
      submitButton.disabled = false;
    }
  });

  // Envío del formulario
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!puntoCreado) {
      alert("Por favor, crea un punto en el mapa primero.");
      return;
    }

    const attrs = {
      num_arboles: form.elements["num_arboles"].value,
      FechaPlantacion: form.elements["FechaPlantacion"].value,
      nombre_cientifico: form.elements["nombre_cientifico"].value,
      nombre_comun: form.elements["nombre_comun"].value,
      otra_especie: form.elements["otra_especie"] ? form.elements["otra_especie"].value : "",
      ubicacion: form.elements["ubicacion"].value,
      proposito: form.elements["proposito"].value,
      tipo_plantacion: form.elements["tipo_plantacion"].value,
      persona_mantto: form.elements["persona_mantto"].value,
      nombre_plantador: form.elements["nombre_plantador"].value,
      celular_plantador: form.elements["celular_plantador"].value,
      email_plantador: form.elements["email_plantador"].value,
      clasificacion_plantador: form.elements["clasificacion_plantador"].value
    };

    const nuevoRegistro = {
      geometry: puntoCreado.geometry,
      attributes: attrs
    };

    submitButton.disabled = true;
    submitButton.textContent = "Guardando datos...";

    featureLayer.applyEdits({ addFeatures: [nuevoRegistro] })
      .then((res) => {
        const r = res.addFeatureResults?.[0];
        if (!r || r.error) {
          throw new Error(r?.error?.message || "No se pudo guardar el registro.");
        }
        const objectId = r.objectId;
        const archivo = form.elements["foto_evidencia"]?.files?.[0];
        if (!archivo) return null;

        submitButton.textContent = "Subiendo adjunto...";
        const formData = new FormData();
        formData.append("attachment", archivo);
        formData.append("f", "json");
        // Si tu capa permite edición anónima, no necesitas token aquí.
        const urlAdjunto = `${urlDeTuCapa}/${objectId}/addAttachment`;
        return fetch(urlAdjunto, { method: "POST", body: formData });
      })
      .then((resp) => (resp && resp.ok ? resp.json() : null))
      .then((jsonFinal) => {
        if (jsonFinal && jsonFinal.error) {
          alert(`Registro guardado, pero hubo un error con el adjunto: ${jsonFinal.error.message}`);
        } else if (jsonFinal && jsonFinal.addAttachmentResult && jsonFinal.addAttachmentResult.success) {
          alert("¡Registro y adjunto guardados con éxito!");
        } else {
          alert("¡Registro guardado con éxito! (sin adjunto)");
        }

        form.reset();
        graphicsLayer.remove(puntoCreado);
        puntoCreado = null;
        submitButton.disabled = true;
        submitButton.textContent = "Registrar Plantación";
      })
      .catch((error) => {
        alert("Hubo un error en el proceso. Revisa la consola para más detalles.");
        console.error("Error en el proceso de guardado:", error);
        submitButton.disabled = false;
        submitButton.textContent = "Registrar Plantación";
      });
  });
});
