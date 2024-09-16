import random
import json

# This function retrieves the details of a specific club (e.g., name, nation, pot) from a list of clubs.
def get_club_info(club_name, clubs):
    for club in clubs:
        if club["name"] == club_name:
            return club
    return None

# This function randomly selects an opponent club for a given club based on several conditions.
def random_opponent(club, clubs, matches, pot_index, match_key, opposite_match_key):
    conditions = [
        lambda c: c['nation'] != get_club_info(club, clubs)["nation"],  # Clubs must be from different nations.
        lambda c: c["name"] != matches[club][match_key],  # The opponent hasn't already been matched against the same club.
        lambda c: matches[c["name"]][opposite_match_key] == "",  # The opponent hasn't been assigned an opponent in the current position.
        lambda c: c['pot'] == pot_index  # The opponent must come from the specified pot index.
    ]

    available_opponents = [c for c in clubs if all(condition(c) for condition in conditions)]

    if not available_opponents:
        return None

    return random.choice(available_opponents)

# This function generates a list of opponents for the given club, ensuring that all conditions are met.
def get_opponents(club, clubs, matches):
    for i in range(1, 5):
        home_match_key = f'pot{i}H'
        away_match_key = f'pot{i}A'

        if matches[club][home_match_key] == "":
            # It tries to find an opponent for the club, using the random_opponent function.
            home_opponent = random_opponent(club, clubs, matches, i, away_match_key, home_match_key)
            if home_opponent:
                matches[club][home_match_key] = home_opponent["name"]
                matches[home_opponent["name"]][away_match_key] = club

        if matches[club][away_match_key] == "":
            # It tries to find an opponent for the club, using the random_opponent function.
            away_opponent = random_opponent(club, clubs, matches, i, home_match_key, away_match_key)
            if away_opponent:
                matches[club][away_match_key] = away_opponent["name"]
                matches[away_opponent["name"]][home_match_key] = club

# This function selects a club randomly from the available clubs based on the pot and checks if the club has already been picked.
def get_club(clubs, picked_clubs, pot_index):
    conditions = [
        lambda c: c["pot"] == pot_index,
        lambda c: c["name"] not in picked_clubs
    ]

    available_clubs = [c for c in clubs if all(condition(c) for condition in conditions)]
    
    if not available_clubs:
        return None

    return random.choice(available_clubs)["name"]

# This function processes all clubs in the given pot to generate matchups for each.
def get_all_pot(clubs, pot_index, matches):
    picked_clubs = []
    pot_results = []

    for i in range(1, 10):
        # It goes through all clubs and generates opponents for each using the get_opponents function.
        club = get_club(clubs, picked_clubs, pot_index)
        if not club:
            return None
        picked_clubs.append(club)

        match_info = {key: "" for key in [f'pot{i}{side}' for i in range(1, 5) for side in ['H', 'A']]}
        match_info["club"] = club
        
        get_opponents(club, clubs, matches)
        
        for key in match_info:
            if key.startswith('pot'):
                match_info[key] = matches[club][key]

        pot_results.append(match_info)
    
    return json.dumps(pot_results)

if __name__ == '__main__':
    import sys
    # Example usage: python script.py getClub '{"clubs_data"}' '["picked_club_1"]' 1
    action = sys.argv[1]
    
    if action == "getClub":
        # Arguments: clubs (as JSON), pickedClubs (as JSON), and potIndex.
        clubs = json.loads(sys.argv[2])
        picked_clubs = json.loads(sys.argv[3])
        pot_index = int(sys.argv[4])
        print(get_club(clubs, picked_clubs, pot_index))  # Output: A single club name.
    
    elif action == "getOpponents":
        # Arguments: club, clubs (as JSON), and matches (as JSON).
        club = sys.argv[2]
        clubs = json.loads(sys.argv[3])
        matches = json.loads(sys.argv[4])
        get_opponents(club, clubs, matches)
        print(json.dumps(matches))  # Output: The opponents for the club in JSON format.
    
    elif action == "getAllPot":
        # Arguments: clubs (as JSON), potIndex, and matches (as JSON).
        clubs = json.loads(sys.argv[2])
        pot_index = int(sys.argv[3])
        matches = json.loads(sys.argv[4])
        print(get_all_pot(clubs, pot_index, matches))  # Output: The matchups for all clubs in the pot.
