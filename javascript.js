/* Online CounterAPI (Öffentlicher Modus ohne blockierten Header) */
async function loadViews(){
  try {
    const COOLDOWN_KEY = "albo_api_cooldown";
    const now = Date.now();
    const lastVisit = localStorage.getItem(COOLDOWN_KEY);
    const oneHour = 60 * 60 * 1000;

    const baseEndpoint = "https://api.counterapi.dev/v2/albos-team-4962/first-counter-4962";
    let endpoint = baseEndpoint;

    // Wenn die Stunde rum ist, erhöhen wir den Zähler über den öffentlichen /up-Pfad
    if (!lastVisit || (now - Number(lastVisit)) > oneHour) {
      endpoint = baseEndpoint + "/up";
      localStorage.setItem(COOLDOWN_KEY, now.toString());
    }

    // Ganz ohne Authorization-Header, daher kein CORS-Problem im Browser!
    const response = await fetch(endpoint);
    const data = await response.json();
    
    const countValue = data.count !== undefined ? data.count : (data.value !== undefined ? data.value : 0);
    document.getElementById("views").textContent = Number(countValue).toLocaleString("de-DE");
  } catch(e) {
    console.error("Counter Fehler:", e);
    document.getElementById("views").textContent = "0";
  }
}
