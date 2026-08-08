const CLIENT_ID = 75aaf1c0b77e4d0e94c854eca0afb2f4;
const CLIENT_SECRET = 428ad719d20942c68d99eaa8dcefc718;

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";

// CORS-Header, damit deine Frontend-Website zugreifen darf
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// 1. Erzeugt ein frisches Access-Token aus deinem Refresh-Token
async function getAccessToken() {
  const basicAuth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
  });

  return response.json();
}

// 2. Fragt ab, was gerade bei Spotify läuft
async function getNowPlaying() {
  const { access_token } = await getAccessToken();

  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
}

// Haupt-Handler für den Worker
export default {
  async fetch(request) {
    // OPTIONS Preflight-Anfrage vom Browser direkt beantworten
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const response = await getNowPlaying();

      // Wenn kein Song läuft oder der Player pausiert ist (Spotify sendet 204 No Content)
      if (response.status === 204 || response.status > 400) {
        return new Response(JSON.stringify({ isPlaying: false }), {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }

      const songData = await response.json();

      // Falls die Daten ungültig sind oder kein Item enthalten
      if (!songData.is_playing || !songData.item) {
        return new Response(JSON.stringify({ isPlaying: false }), {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }

      // Daten für deine Website aufbereiten
      const result = {
        isPlaying: songData.is_playing,
        title: songData.item.name,
        artist: songData.item.artists.map((artist) => artist.name).join(", "),
        albumCover: songData.item.album.images[0]?.url || "",
        songUrl: songData.item.external_urls.spotify,
      };

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ isPlaying: false, error: error.message }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
  },
};
