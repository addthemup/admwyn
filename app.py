from flask import Flask, jsonify
from flask_cors import CORS
from nba_api.live.nba.endpoints import ScoreBoard
from nba_api.stats.endpoints.boxscoreadvancedv3 import BoxScoreAdvancedV3
from datetime import timezone
from dateutil import parser

app = Flask(__name__)
CORS(app)

@app.route('/api/today_games', methods=['GET'])
def get_today_games():
    # Query the NBA live scoreboard
    board = ScoreBoard()
    games = board.games.get_dict()

    # Extract necessary game information
    games_list = []
    for game in games:
        gameTimeLTZ = parser.parse(game["gameTimeUTC"]).replace(tzinfo=timezone.utc).astimezone(tz=None)
        games_list.append({
            "game_id": game['gameId'],
            "away_team": game['awayTeam']['teamName'],
            "home_team": game['homeTeam']['teamName'],
            "game_time": gameTimeLTZ.strftime('%Y-%m-%d %I:%M %p %Z')  # Format as local time
        })

    # Return both the simplified games list and the full raw JSON data
    return jsonify({
        "games_list": games_list,
        "full_json": games  # Include the full raw JSON data
    })

@app.route('/api/game_stats/<game_id>', methods=['GET'])
def get_game_stats(game_id):
    try:
        # Fetch advanced box score data
        boxscore = BoxScoreAdvancedV3(game_id=game_id)
        
        # Extract PlayerStats and TeamStats
        player_stats_raw = boxscore.player_stats.get_dict()
        team_stats_raw = boxscore.team_stats.get_dict()

        # Helper function to reshape data
        def reshape_data(headers, data):
            return [dict(zip(headers, row)) for row in data]

        # Reshape PlayerStats and TeamStats
        player_stats = reshape_data(player_stats_raw["headers"], player_stats_raw["data"])
        team_stats = reshape_data(team_stats_raw["headers"], team_stats_raw["data"])

        # Return organized data
        return jsonify({
            "PlayerStats": player_stats,
            "TeamStats": team_stats
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
