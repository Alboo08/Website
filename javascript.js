/* Online CounterAPI mit 1-Stunden-Cooldown */
async function loadViews(){
  try {
    const COOLDOWN_KEY = "albo_api_cooldown";
    const now = Date.now();
    const lastVisit = localStorage.getItem(COOLDOWN_KEY);
    const oneHour = 60 * 60 * 1000;

    const baseEndpoint = "https://api.counterapi.dev/v2/albos-team-4962/first-counter-4962";
    let endpoint = baseEndpoint;

    // Wenn der letzte Besuch länger als 1 Stunde her ist, erhöhen wir den Zähler mit /up
    if (!lastVisit || (now - Number(lastVisit)) > oneHour) {
      endpoint = baseEndpoint + "/up";
      localStorage.setItem(COOLDOWN_KEY, now.toString());
    }

    // Dein API-Key direkt eingefügt
    const apiKey = "ut_XND3YtwPQ9g8f2hs80UQ0sVHBbqbIS51aI8mNVl5";

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });

    const data = await response.json();
    
    // Den aktuellen Zählerstand auslesen und anzeigen
    const countValue = data.count !== undefined ? data.count : (data.value !== undefined ? data.value : 0);
    document.getElementById("views").textContent = Number(countValue).toLocaleString("de-DE");
  } catch(e) {
    console.error("Counter Fehler:", e);
    document.getElementById("views").textContent = "0";
  }
}
