// La lista de módulos está completa
require([
  "esri/config", "esri/WebMap", "esri/views/MapView", "esri/layers/GraphicsLayer",
  "esri/widgets/Sketch", "esri/layers/FeatureLayer", "esri/widgets/Search",
  "esri/widgets/Home", "esri/widgets/BasemapGallery", "esri/widgets/Expand"
], function(
    esriConfig, WebMap, MapView, GraphicsLayer, Sketch, FeatureLayer,
    Search, Home, BasemapGallery, Expand
  ) {

  // --- CONFIGURACIÓN ---
  esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurFVwsLxwboNn05dD-g-wXCq6hIoNzOz3ux9yzgOZG9INLDTddo6qBTYDZm_n5DjAO6O-1G_S05HccLOEHCU6pY9YNeW8HQh3pRS9hj2QnKQTi4yVNAK8CwQyccB2cx0cxm2sJxWs-NweHOZptAsO6hcjQ1a1NFUdoHTcxK6JSw0V8HJPCiHtbxHMZrjECeLi-s7KfoOt0r4HU5xbxd9YqtR8A6mc7g9NKRiRQkC0NidsKnEIo5QTxcMjsCY8ibjc-A..AT1_RAbPD7p5"; 
  const idDeTuMapaWeb = "ed45f96423704bd5ad66736ddddd68b4"; 
  
  // --- CORRECCIÓN 1: Se añade /0 al final de la URL ---
  const urlDeTuCapa = "https://services7.arcgis.com/lsxbLWF2l19Rmhqj/arcgis/rest/services/service_9374627a2668441ca317d496364bf485_form/FeatureServer/0";

  // El resto de la configuración no cambia...
  const graphicsLayer = new GraphicsLayer();
  const featureLayer = new FeatureLayer({ url: urlDeTuCapa });
  const map = new WebMap({ portalItem: { id: idDeTuMapaWeb } });
  map.add(graphicsLayer);
  const view = new MapView({ container: "viewDiv", map: map });
  const searchWidget = new Search({ view: view });
  view.ui.add(searchWidget, { position: "top-right", index: 0 });
  const homeWidget = new Home({ view: view });
  view.ui.add(homeWidget, "top-left");
  const basemapGallery = new BasemapGallery({ view: view });
  const bgExpand = new Expand({ view: view, content: basemapGallery });
  view.ui.add(bgExpand, "top-right");
  const sketch = new Sketch({ view: view, layer: graphicsLayer, visibleElements: { createTools: { point: true } } });
  
  // LÓGICA DE BOTONES Y FORMULARIO (sin cambios en la primera parte)
  const drawPointButton = document.getElementById("draw-point-btn");
  const submitButton = document.getElementById("submit-btn");
  const form = document.getElementById("registro-form");
  let puntoCreado;
  const speciesMap = {
    "Guayacán rosado": "Handroanthus impetiginosus", "Guayacán amarillo": "Handroanthus chrysotrichus",
    "Roble andino": "Quercus humboldtii", "Nogal": "Juglans neotropica", "Samán": "Albizia saman",
    "Guamo": "Inga edulis", "Cerezo": "Prunus capuli", "Cedro": "Cedrela odorata", "Ceiba": "Ceiba pentandra",
    "Yarumo": "Cecropia sp", "Aliso": "Alnus acuminata", "Pino patula": "Pinus patula",
    "Eucalipto": "Eucalyptus globulus", "Teca": "Tectona grandis", "otra_especie": ""
  };
  const nombreComunDropdown = document.getElementById("nombre_comun");
  const nombreCientificoInput = document.getElementById("nombre_cientifico");
  const otraEspecieGroup = document.getElementById("otra_especie_group");
  nombreComunDropdown.addEventListener('change', function(event) {
    const selectedValue = event.target.value;
    nombreCientificoInput.value = speciesMap[selectedValue] || "";
    if (selectedValue === 'otra_especie') {
      otraEspecieGroup.style.display = 'block';
    } else {
      otraEspecieGroup.style.display = 'none';
    }
  });
  drawPointButton.addEventListener("click", function() { sketch.create("point"); });
  sketch.on("create", function(event) {
    if (event.state === "complete") {
      if (puntoCreado) { graphicsLayer.remove(puntoCreado); }
      puntoCreado = event.graphic;
      submitButton.disabled = false;
    }
  });

  // LÓGICA DE ENVÍO DEL FORMULARIO
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    if (!puntoCreado) {
      alert("Por favor, crea un punto en el mapa primero.");
      return;
    }

    // --- CORRECCIÓN 2: Mapeo exacto de campos según tu imagen ---
    const atributos = {
      // Los nombres de la izquierda coinciden con los 'name' de tu imagen
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
        throw new Error(resultadoEdicion.addFeatureResults[0].error.message || "No se pudo guardar el registro.");
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