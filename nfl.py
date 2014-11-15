#!python
import nflgame

games = nflgame.games(2012)
players = nflgame.combine_game_stats(games)
for p in players.rushing().sort('rushing_yds').limit(5):
    msg = '%s %d carries for %d yards and %d TDs'
    print msg % (p, p.rushing_att, p.rushing_yds, p.rushing_tds)

players.passing().sort('passing_yds').limit(30).csv('2012_passing.csv')