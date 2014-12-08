#!python
import nflgame
import json
import csv

class PlayerStats:

	def __init__(self):
		self.stats = {}


	def addSeasons(self, plyr, stat, first_season, last_season):
		if first_season < last_season:
			for x in range(first_season, last_season + 1):
				self.addStats(plyr, stat, x)

	def addStats(self, plyr, stat, season):
		if self.stats == {} or plyr not in self.stats:
			self.stats[plyr]={}
		self.stats[plyr][season] = self.getSeasonStats(plyr, stat, season)

	def write(self, filename):
		jsonf = open(filename,'w') 
		jsonf.write(json.dumps(self.stats))
		jsonf.close()

	def getSeasonStats(self, plyr, stat, season):   
		data = []
		# if season == 2014:
		# 	print "HERE"
		for x in range(1, 18):
			game = nflgame.games(season,week=x)
			if game == []:
				break
			players = nflgame.combine_game_stats(game)
			player = players.name(plyr)
			if player is None:
				data.append({'week':str(x),'active':'false'})
			else:
				playerStats = player.stats
				week_obj = {'week':str(x)}
				if(stat == 'all'):
					for x in playerStats:
						week_obj[x] = playerStats[x]
					week_obj['active'] = 'true'
					data.append(week_obj)
					# if season == 2014:
					# 	print week_obj
				else:
					data.append({'week':str(x),stat:str(playerStats[stat]), 'active':'true'})
		return data

def getAllPlayerData(full_name, abbrev_name):
	names = full_name.split(' ')
	# nflgameid = '.'.join((names[0][0],names[1]))
	plyrstats = PlayerStats()
	plyrstats.addSeasons(abbrev_name,'all', 2009, 2014)
	plyrstats.write('player_data/' + str('_'.join(names)) + ".json")

# text_file = open("player_list.txt", "r")
json_data=open('playersHash.json')
data = json.load(json_data)
print data
isLastPlayer = False
for player in data:
	if isLastPlayer == True:
		print "Importing: " + player[0]
	  	getAllPlayerData(player[0], player[1])
	   	print "Finished Importing: " + player[0]
	else:
		print player[0] + " exists"
	if player[0].split(' ')[0] == "Arnaz":
		print "*******Starting Point*********"
		isLastPlayer = True
#getAllPlayerData("Peyton Manning")



