// Archivo script.js - actualizado con listado de especies desde ListadoEspecies.xlsx (230 registros)
// NOTA: Si necesita actualizar el listado, reemplace el mapeo speciesMap más abajo.

require([
  "esri/config", "esri/WebMap", "esri/views/MapView", "esri/layers/GraphicsLayer",
  "esri/widgets/Sketch", "esri/layers/FeatureLayer", "esri/widgets/Search",
  "esri/widgets/Home", "esri/widgets/BasemapGallery", "esri/widgets/Expand"
], function(
    esriConfig, WebMap, MapView, GraphicsLayer, Sketch, FeatureLayer,
    Search, Home, BasemapGallery, Expand
  ) {
  // --- CONFIGURACIÓN ---
  esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurFVwsLxwboNn05dD-g-wXCq6hIoNzOz3ux9yzgOZG9INLDTddo6qBTYDZm_n5DjAOyi-7dwrRWABXsY3JxNU_J4jht6poTGK7pr0kZDCebJwr_HQQXpBhuiVGqHx61qgMm2r_LcgTF9Kx5LW8O_Nh-3Q2uVRUNysgIMcBWm8NhMNO0w6TstBCLyeMVJg9gNwDW-Ve1zPsXkpTSmnBquPTlvBt5B2Hw8A5m8cgP-CH1BB4l06T8wE4yYvvwfurR82Ig..AT1_RAbPD7p5"; 
  const idDeTuMapaWeb = "ed45f96423704bd5ad66736ddddd68b4"; 
  const urlDeTuCapa = "https://services7.arcgis.com/lsxbLWF2l19Rmhqj/arcgis/rest/services/service_9374627a2668441ca317d496364bf485_form/FeatureServer/0";

  const graphicsLayer = new GraphicsLayer();
  const featureLayer = new FeatureLayer({ url: urlDeTuCapa });
  const map = new WebMap({ portalItem: { id: idDeTuMapaWeb } });
  map.add(graphicsLayer);
  const view = new MapView({ container: "viewDiv", map: map });

  // Widgets
  const searchWidget = new Search({ view: view });
  view.ui.add(searchWidget, { position: "top-right", index: 0 });
  const homeWidget = new Home({ view: view });
  view.ui.add(homeWidget, "top-left");
  const basemapGallery = new BasemapGallery({ view: view });
  const bgExpand = new Expand({ view: view, content: basemapGallery });
  view.ui.add(bgExpand, "top-right");
  const sketch = new Sketch({ view: view, layer: graphicsLayer, visibleElements: { createTools: { point: true } } });

  // --- FORMULARIO ---
  const drawPointButton = document.getElementById("draw-point-btn");
  const submitButton = document.getElementById("submit-btn");
  const form = document.getElementById("registro-form");
  let puntoCreado;

  // Mapeo: nombre común -> nombre científico (desde Excel)
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
    "Alcaparro": "Senna multijuga",
    "Alcaparro amarillo": "Senna spectabilis",
    "Alcaparro común": "Senna spectabilis (DC.) H.S.Irwin & Barneby",
    "Alcaparro morado": "Cassia grandis",
    "Alcaparro negro": "Senna viarum",
    "Alcaparrón": "Senna alata",
    "Alcaparroón": "Senna reticulata",
    "Aliso": "Alnus acuminata",
    "Almendro": "Terminalia catappa",
    "Almendro de río": "Andira inermis",
    "Alnus": "Alnus sp.",
    "Arrayán": "Myrcianthes leucoxyla",
    "Arrayán de páramo": "Myrcianthes sp.",
    "Arrayán negro": "Myrcianthes rhopaloides",
    "Arrayán rojo": "Myrcianthes sp.",
    "Arrayán sabanero": "Blepharocalyx salicifolius",
    "Arrayancillo": "Myrcia sp.",
    "Balso": "Ochroma pyramidale",
    "Bálsamo": "Myroxylon balsamum",
    "Bauhinia": "Bauhinia sp.",
    "Búcaro": "Erythrina poeppigiana",
    "Cabo de hacha": "Trichilia sp.",
    "Café": "Coffea arabica",
    "Cajeto": "Protium sp.",
    "Canelo": "Ocotea sp.",
    "Canelo de páramo": "Drimys granadensis",
    "Carbonero": "Calliandra pittieri",
    "Cariseco": "Cordia cylindrostachya",
    "Carreto": "Aspidosperma polyneuron",
    "Canelo encarnado": "Miconia sp.",
    "Caucho": "Ficus elastica",
    "Caucho sabanero": "Ficus soatensis",
    "Cayeno": "Hibiscus rosa-sinensis",
    "Cerezo": "Prunus capuli",
    "Chachafruto": "Erythrina edulis",
    "Chambimbe": "Tradescantia sp.",
    "Chaparro": "Curatella americana",
    "Chicalá": "Tecoma stans",
    "Chicalá amarillo": "Tecoma stans var. stans",
    "Chicalá de río": "Cordia alliodora",
    "Chicalá rojo": "Spathodea campanulata",
    "Chiminango": "Pithecellobium dulce",
    "Chirlobirlo": "Cestrum peruvianum",
    "Chocho": "Lupinus bogotensis",
    "Chusque": "Chusquea sp.",
    "Ciprés romerón": "Prumnopitys montana",
    "Ciruelillo": "Hirtella triandra",
    "Ciruelo": "Prunus domestica",
    "Clusia": "Clusia sp.",
    "Coca": "Erythroxylum coca",
    "Cocuyo": "Clibadium sp.",
    "Copaiba": "Copaifera officinalis",
    "Copoazú": "Theobroma grandiflorum",
    "Cordoncillo": "Piper aduncum",
    "Corona de Cristo": "Euphorbia milii",
    "Creciente": "Baccharis macrantha",
    "Croto": "Codiaeum variegatum",
    "Cucharo": "Myrsine guianensis",
    "Cucharo negro": "Rapanea guianensis",
    "Cucharo sabanero": "Myrsine coriacea",
    "Cucharo verde": "Myrsine andina",
    "Cucharo rojo": "Myrsine dependens",
    "Cucho": "Casearia sp.",
    "Culantrillo": "Pellaea sp.",
    "Curapiche": "Zanthoxylum fagara",
    "Curari": "Strychnos sp.",
    "Curuba": "Passiflora tripartita var. mollissima",
    "Dulcamara": "Solanum dulcamara",
    "Encenillo": "Weinmannia pubescens",
    "Encenillo negro": "Weinmannia tomentosa",
    "Encenillo sabanero": "Weinmannia sp.",
    "Encenillo rojo": "Weinmannia rollotii",
    "Enciso": "Myrsine sp.",
    "Eucalipto": "Eucalyptus globulus",
    "Falso pimiento": "Schinus molle",
    "Feijoa": "Acca sellowiana",
    "Fique": "Furcraea andina",
    "Flor amarillo": "Senna spectabilis var. excelsa",
    "Flor de mayo": "Brownea ariza",
    "Fucsia": "Fuchsia magellanica",
    "Garrayo": "Zanthoxylum sp.",
    "Gaque": "Clusia multiflora",
    "Gualanday": "Jacaranda mimosifolia",
    "Guamo": "Inga edulis",
    "Guamo macheto": "Inga sp.",
    "Guamo santafereño": "Inga densiflora",
    "Guamo negro": "Inga spuria",
    "Guamo rabo de mico": "Inga sp.",
    "Guamumo": "Virola sebifera",
    "Guarumo": "Cecropia sp.",
    "Guayacán amarillo": "Handroanthus chrysotrichus",
    "Guayacán blanco": "Tabebuia roseo-alba",
    "Guayacán rosado": "Handroanthus impetiginosus",
    "Guayacán santafereño": "Handroanthus chrysanthus",
    "Guayabo": "Psidium guajava",
    "Guayabo cas": "Psidium friedrichsthalianum",
    "Guayabo sabanero": "Psidium acutangulum",
    "Guayaba": "Psidium guajava",
    "Guayabilla": "Eugenia sp.",
    "Guayacán de Manizales": "Handroanthus sp.",
    "Guayacán trebolito": "Handroanthus sp.",
    "Gurapo": "Palicourea sp.",
    "Haya": "Juglans neotropica",
    "Higuerón": "Ficus sp.",
    "Higuerilla": "Ricinus communis",
    "Hinojo": "Foeniculum vulgare",
    "Hojarasquero": "Hyeronima alchorneoides",
    "Huanoco": "Gunnera magellanica",
    "Hued-hued": "Tristerix corymbosus",
    "Iguá": "Sloanea sp.",
    "Incienso": "Bursera graveolens",
    "Isigo": "Miconia theaezans",
    "Jaboncillo": "Sapindus saponaria",
    "Jaboncillo negro": "Sapindus sp.",
    "Jaque": "Cordia alliodora",
    "Jigua": "Guarea guidonia",
    "Jigua negro": "Guarea sp.",
    "Jigua real": "Guarea trichilioides",
    "Juan Primero": "Sambucus nigra",
    "Lechero": "Sapium stylare",
    "Lechero sabanero": "Sapium rigidifolium",
    "Leucaena": "Leucaena leucocephala",
    "Liquidámbar": "Liquidambar styraciflua",
    "Loro": "Cordia sp.",
    "Macana": "Guadua angustifolia",
    "Macanillo": "Guadua sp.",
    "Macanillo de sabana": "Guadua angustifolia var. bicolor",
    "Maguey": "Agave americana",
    "Maíz tostao": "Zea mays",
    "Mamoncillo": "Melicoccus bijugatus",
    "Manzano": "Malus domestica",
    "Manteco": "Clusia sp.",
    "Mantequillo": "Myrsine sp.",
    "Mantequillo de sabana": "Myrsine coriacea",
    "Marañón": "Anacardium occidentale",
    "Matarratón": "Gliricidia sepium",
    "Matarratón rojo": "Erythrina fusca",
    "Melancólico": "Brugmansia arborea",
    "Miju": "Casearia sp.",
    "Moho": "Miconia sp.",
    "Mogollón": "Visnea mocanera",
    "Molinillo": "Guatteria sp.",
    "Moncora": "Mauria heterophylla",
    "Mora": "Rubus glaucus",
    "Mortiño": "Vaccinium floribundum",
    "Mortiño de páramo": "Vaccinium meridionale",
    "Mostaza de árbol": "Schinus polygamus",
    "Muco": "Oreopanax floribundus",
    "Nacedero": "Trichanthera gigantea",
    "Naranja": "Citrus sinensis",
    "Naranjuelo": "Citrus aurantium",
    "Nogal": "Juglans neotropica",
    "Nogal cafetero": "Cordia alliodora",
    "Nogal negro": "Juglans nigra",
    "Nogal ross": "Guarea sp.",
    "Nogal sabanero": "Juglans neotropica",
    "Nopal": "Opuntia ficus-indica",
    "Ocobo": "Tabebuia rosea",
    "Ocobo blanco": "Tabebuia rosea var. alba",
    "Orquídea arbórea": "Spathodea campanulata (forma epífita)",
    "Pacheco": "Tecoma stans",
    "Palo blanco": "Cedrela montana",
    "Palo bobo": "Tessaria integrifolia",
    "Palo cruz": "Brownea ariza",
    "Palo de agua": "Dracaena fragrans",
    "Palo manzano": "Quercus humboldtii",
    "Palo negro": "Trichilia sp.",
    "Pasto kikuyo": "Pennisetum clandestinum",
    "Paujil": "Clusia multiflora",
    "Payandé": "Tecoma stans",
    "Penca sábila": "Aloe vera",
    "Peonía": "Paeonia officinalis",
    "Peumo": "Cryptocarya alba",
    "Pimentero": "Piper nigrum",
    "Pino patula": "Pinus patula",
    "Pino romerón": "Retrophyllum rospigliosii",
    "Pino sabanero": "Pinus radiata",
    "Piñón de oreja": "Enterolobium cyclocarpum",
    "Piramo": "Myrsine sp.",
    "Plátano": "Musa paradisiaca",
    "Pomarroso": "Syzygium jambos",
    "Porotá": "Erythrina sp.",
    "Pringamoza": "Urera baccifera",
    "Puchón": "Eugenia sp.",
    "Quiche": "Myrcianthes sp.",
    "Quinua": "Chenopodium quinoa",
    "Quinual": "Polylepis quadrijuga",
    "Quinual de páramo": "Polylepis sericea",
    "Quinual sabanero": "Polylepis sp.",
    "Rabo de mico": "Tradescantia sp.",
    "Rasquiña": "Vallea stipularis",
    "Retamo": "Ulex europaeus",
    "Retamo espinoso": "Ulex europaeus var. europaeus",
    "Retamo liso": "Teline monspessulana",
    "Retamo sietecueros": "Tibouchina lepidota",
    "Retamo sp.": "Teline sp.",
    "Revolcón": "Croton bogotensis",
    "Roble": "Quercus humboldtii",
    "Roble andino": "Quercus humboldtii",
    "Romerón": "Retrophyllum rospigliosii",
    "Romerón sabanero": "Retrophyllum rospigliosii",
    "Rubio": "Vallea stipularis",
    "Ruibarbo": "Rheum rhabarbarum",
    "Sauco": "Sambucus nigra",
    "Sauco negro": "Sambucus nigra",
    "Sietecueros": "Tibouchina mutabilis",
    "Sietecueros de monte": "Tibouchina lepidota",
    "Sietecueros sabanero": "Tibouchina sp.",
    "Sietecueros rojo": "Tibouchina urvilleana",
    "Silvadora": "Dendropanax arboreus",
    "Sinamaya": "Zanthoxylum rigidum",
    "Sirvo": "Trema micrantha",
    "Soga": "Mikania sp.",
    "Sorzal": "Myrsine latifolia",
    "Tabebuia": "Tabebuia sp.",
    "Tabaquillo": "Nicotiana glauca",
    "Tachuelo": "Tecoma stans",
    "Tarumo": "Cecropia peltata",
    "Teca": "Tectona grandis",
    "Tilo": "Tilia platyphyllos",
    "Toche": "Ochroma pyramidale",
    "Tomate de árbol": "Solanum betaceum",
    "Totumo": "Crescentia cujete",
    "Trébol": "Trifolium repens",
    "Uche": "Guazuma ulmifolia",
    "Uchuva": "Physalis peruviana",
    "Uva camarona": "Macleania rupestris",
    "Uva de monte": "Cavendishia bracteata",
    "Uvo": "Citharexylum montanum",
    "Valeriana": "Valeriana officinalis",
    "Verbena": "Verbena litoralis",
    "Vuelta vaca": "Ludwigia peruviana",
    "Yarumo": "Cecropia sp.",
    "Yarumo azaroso": "Cecropia peltata",
    "Yopo": "Anadenanthera peregrina",
    "Zurrumbo": "Hyeronima macrocarpa"
  };

  const nombreComunDropdown = document.getElementById("nombre_comun");
  const nombreCientificoInput = document.getElementById("nombre_cientifico");
  const otraEspecieGroup = document.getElementById("otra_especie_group");

  // Actualiza el nombre científico cuando cambia la especie
  nombreComunDropdown.addEventListener('change', function(event) {
    const selectedValue = event.target.value;
    const cientifico = speciesMap[selectedValue] || "";
    nombreCientificoInput.value = cientifico;

    // Si es 'Otra', habilitar campo para capturar 'otra_especie' y permitir escribir el nombre científico
    if (selectedValue === 'otra_especie') {
      otraEspecieGroup.style.display = 'block';
      nombreCientificoInput.readOnly = false;
      nombreCientificoInput.placeholder = "Escribe el nombre científico (opcional)";
    } else {
      otraEspecieGroup.style.display = 'none';
      nombreCientificoInput.readOnly = true;
      nombreCientificoInput.placeholder = "";
    }
  });

  // Botón para dibujar punto
  drawPointButton.addEventListener("click", function() { sketch.create("point"); });

  // Habilita enviar solo cuando hay un punto
  sketch.on("create", function(event) {
    if (event.state === "complete") {
      if (puntoCreado) { graphicsLayer.remove(puntoCreado); }
      puntoCreado = event.graphic;
      submitButton.disabled = false;
    }
  });

  // Envío del formulario
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    if (!puntoCreado) {
      alert("Por favor, crea un punto en el mapa primero.");
      return;
    }

    const atributos = {
      num_arboles: form.elements["num_arboles"].value,
      FechaPlantacion: form.elements["FechaPlantacion"].value,
      nombre_cientifico: form.elements["nombre_cientifico"].value,
      nombre_comun: form.elements["nombre_comun"].value,
      otra_especie: form.elements["otra_especie"].value,
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
      attributes: atributos
    };

    submitButton.disabled = true;
    submitButton.textContent = "Guardando datos...";

    featureLayer.applyEdits({
      addFeatures: [nuevoRegistro]
    }).then(function(resultadoEdicion) {
      if (resultadoEdicion.addFeatureResults.length > 0 && !resultadoEdicion.addFeatureResults[0].error) {
        const objectId = resultadoEdicion.addFeatureResults[0].objectId;
        const archivo = form.elements["foto_evidencia"].files[0];
        if (archivo) {
          submitButton.textContent = "Subiendo adjunto...";
          const formData = new FormData();
          formData.append("attachment", archivo);
          formData.append("f", "json");
          formData.append("token", esriConfig.apiKey);
          const urlAdjunto = `${urlDeTuCapa}/${objectId}/addAttachment`;
          return fetch(urlAdjunto, { method: 'POST', body: formData });
        } else {
          return null;
        }
      } else {
        throw new Error(resultadoEdicion.addFeatureResults[0].error?.message || "No se pudo guardar el registro.");
      }
    }).then(function(resultadoAdjunto) {
      if (resultadoAdjunto && resultadoAdjunto.ok) { return resultadoAdjunto.json(); }
      return null;
    }).then(function(jsonFinal) {
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
    }).catch(function(error) {
      alert("Hubo un error en el proceso. Revisa la consola para más detalles.");
      console.error("Error en el proceso de guardado:", error);
      submitButton.disabled = false;
      submitButton.textContent = "Registrar Plantación";
    });
  });
});
