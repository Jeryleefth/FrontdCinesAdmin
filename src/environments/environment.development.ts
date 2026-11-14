// Usa el mismo host desde donde se abre Angular. Así el panel funciona desde
// el equipo local o desde otro dispositivo dentro de la red privada.
export const environment = {
  urlApi: `http://${window.location.hostname}:8081/api`,
};
