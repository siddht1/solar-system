/*
 * solar-system
 * @Description Solar System defines methods to init the scene.
 * @link https://github.com/kdaimiel/solar-system#readme
 * @author Enrique Daimiel Ruiz <k.daimiel@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
define('solar-system', [
  'scene-builder',
  'scene-factory',
  'solar-service',
  'solar-properties'
], function(SceneBuilder, SceneFactory, SolarService, SolarProperties) {

  'use strict';

  var bodies = {};

  var solarSystem = {
    addMoon: addMoon,
    addPlanet: addPlanet,
    addStar: addStar,
    init: init,
    loadObjectFronJSONFiles: loadObjectFronJSONFiles
  };

  return solarSystem;

  function init() {
    SceneBuilder.init();
  }

  function addSolarBody(solarBody){
    bodies[solarBody.name] = solarBody;
    if(solarBody.orbitProperties) {
      bodies[solarBody.orbitProperties.round].addSatellite(solarBody, solarBody.orbitProperties);
    } else {
      SceneBuilder.addObject(solarBody);
    }
  }

  function addPlanet(planetProperties){
    var planet = new THREE.PlanetMesh(planetProperties);
    addSolarBody(planet);
  }

  function addStar(starProperties){
    var star = new THREE.StarMesh(starProperties);
    addSolarBody(star);
  }

  function addMoon(moonProperties) {
    var moon = new THREE.MoonMesh(moonProperties);
    addSolarBody(moon);
  }

  function loadObjectFronJSONFiles(){
    SolarService.getCamera(SolarProperties.cameraJSONProperties, loadCamera);
    SolarService.getBodies(SolarProperties.bodiesJSONProperties, loadBodies);
    SolarService.getLights(SolarProperties.lightsJSONProperties, loadLights);
  }

  function loadCamera(cameraProperties) {
    var camera = SceneFactory.createCamera(cameraProperties);
    SceneBuilder.setCamera(camera);

    var controls = SceneFactory.createControls(camera, cameraProperties.controls);
    SceneBuilder.setControls(controls);
    SceneBuilder.animate();
  }

  function loadBodies(bodiesProperties) {
    bodiesProperties.forEach(function(bodyProperties) {
      switch(bodyProperties.type) {
      case 'Star':
        addStar(bodyProperties);
        break;
      case 'Planet':
        addPlanet(bodyProperties);
        break;
      case 'Dwarf Planet':
        addPlanet(bodyProperties);
        break;
      case 'Moon':
        addMoon(bodyProperties);
        break;
      default:
        console.error(bodyProperties.type + ' is not considered a kind of solar body');
        return;
      }
    });
  }

  function loadLights(lightsProperties) {
    lightsProperties.forEach(function(lightProperties) {
      var light = SceneFactory.createLight(lightProperties);
      SceneBuilder.addObject(light);
    });
  }

});
