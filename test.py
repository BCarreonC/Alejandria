from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import requests

app = Flask(__name__, static_folder='./build', static_url_path='/')
CORS(app)

@app.route('/api/summoner_info', methods=['GET'])
def summoner_info():
    api_key = "RGAPI-6b08a298-1e6d-4d81-b84e-01665a006af4"
    summoner_name = request.args.get('summoner_name')
    region = "na1"

    summoner_url = f"https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summoner_name}"
    response = requests.get(summoner_url, headers={"X-Riot-Token": api_key})

    if response.status_code == 200:
        summoner_data = response.json()
        puuid = summoner_data["puuid"]

        games_account = f"https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=20&api_key={api_key}"

        try:
            response = requests.get(games_account)

            if response.status_code == 200:
                summoner_games = response.json()
            else:
                return jsonify({"error": "Error al hacer la solicitud de juegos"}), 500
        except Exception as e:
            return jsonify({"error": f"Error al hacer la solicitud: {e}"}), 500

        champion_stats = {}
        for game_id in summoner_games:
            game_url = f"https://americas.api.riotgames.com/lol/match/v5/matches/{game_id}?api_key={api_key}"
            try:
                response = requests.get(game_url)

                if response.status_code == 200:
                    game_data = response.json()

                    participant_id = None
                    for participant in game_data["info"]["participants"]:
                        if participant["summonerName"].lower() == summoner_name.lower():
                            participant_id = participant["participantId"]

                    if participant_id is not None:
                        champion_name = game_data["info"]["participants"][participant_id - 1]["championName"]

                        if champion_name not in champion_stats:
                            champion_stats[champion_name] = {"played": 0, "won": 0, "kda": [], "creep_score": []}

                        champion_stats[champion_name]["played"] += 1
                        champion_stats[champion_name]["won"] += int(game_data["info"]["participants"][participant_id - 1]["win"])

                        # Calcular KDA (Kill/Death/Assist)
                        kills = game_data["info"]["participants"][participant_id - 1]["kills"]
                        deaths = game_data["info"]["participants"][participant_id - 1]["deaths"]
                        assists = game_data["info"]["participants"][participant_id - 1]["assists"]
                        kda = (kills + assists) / max(1, deaths)  # Evitar división por cero
                        champion_stats[champion_name]["kda"].append(kda)

                        # Creep Score (CS)
                        cs = game_data["info"]["participants"][participant_id - 1]["totalMinionsKilled"]
                        champion_stats[champion_name]["creep_score"].append(cs)

                else:
                    return jsonify({"error": f"Error al hacer la solicitud del juego con ID {game_id}"}), 500
            except Exception as e:
                return jsonify({"error": f"Error al hacer la solicitud del juego con ID {game_id}: {e}"}), 500

        # Calcular promedio de KDA y Creep Score por campeón
        for champion_name, stats in champion_stats.items():
            if stats["played"] > 0:
                avg_kda = sum(stats["kda"]) / len(stats["kda"])
                avg_creep_score = sum(stats["creep_score"]) / len(stats["creep_score"])
                champion_stats[champion_name]["avg_kda"] = avg_kda
                champion_stats[champion_name]["avg_creep_score"] = avg_creep_score

        summoner_info = {
            'id': summoner_data["id"],
            'accountId': summoner_data["accountId"],
            'puuid': puuid,
            'name': summoner_data["name"],
            'summoner_games': summoner_games,
            'champion_stats': champion_stats
        }
        return jsonify(summoner_info)

    else:
        return jsonify({"error": "Error al hacer la solicitud"}), 500

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
