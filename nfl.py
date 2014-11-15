#!python
import nflgame
import json
import csv

fieldnames=["name","id","home","team","pos","defense_ast","defense_ffum","defense_int","defense_sk","defense_tkl","fumbles_lost","fumbles_rcv","fumbles_tot","fumbles_trcv","fumbles_yds","passing_att","passing_cmp","passing_ints","passing_tds","passing_twopta","passing_twoptm","passing_yds","punting_avg","punting_i20","punting_lng","punting_pts","punting_yds","receiving_lng","receiving_lngtd","receiving_rec","receiving_tds","receiving_twopta","receiving_twoptm","receiving_yds","rushing_att","rushing_lng","rushing_lngtd","rushing_tds","rushing_twopta","rushing_twoptm","rushing_yds"]

def convert(src):
 csv_filename = src
 print "Opening CSV file: ",csv_filename 
 f=open(csv_filename, 'r')
 csv_reader = csv.DictReader(f,fieldnames)
 json_filename = csv_filename.split(".")[0]+".json"
 print "Saving JSON to file: ",json_filename
 jsonf = open(json_filename,'w') 
 data = json.dumps([r for r in csv_reader])
 jsonf.write(data) 
 f.close()
 jsonf.close()

#getPlayerStats will be used to compare multiple players, so the result
#of each function call must be appended to a list of previous function calls
#HAVE TO CALL WITH Abbreviated name, eg "M.Lynch","rushing_lngtd"
def getPlayerStats(plyr,stat): 
	game = nflgame.games(2012,week=[2,3,4,6])
	players = nflgame.combine(game)
	player = players.name(plyr)
	playerStats = player.stats
	if stat in playerStats:
		print 'stat: ',stat,' value = ',playerStats[stat]

games = nflgame.games(2012)
players = nflgame.combine_game_stats(games)
for p in players.rushing().sort('rushing_yds').limit(5):
    msg = '%s %d carries for %d yards and %d TDs'
    print msg % (p, p.rushing_att, p.rushing_yds, p.rushing_tds)

players.passing().sort('passing_yds').limit(30).csv('2012_passing.csv')

getPlayerStats('M.Lynch','rushing_lngtd')

convert('2012_passing.csv')



 
