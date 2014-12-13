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


stat = 'all'
game = nflgame.games(2014,week=14)
players = nflgame.combine_game_stats(game)
player = players.name('T.Brady')


playerStats = player.stats
week_obj = {'week':str(14)}
if(stat == 'all'):
	for y in playerStats:
		week_obj[y] = playerStats[y]
	week_obj['active'] = 'true'
	print week_obj
else:
	print week_obj

modified = open('modified.json','w') 
jsonf = open('player_data/Tom_Brady.json','r+w') 
currjson = json.load(jsonf)
for i in xrange(len(currjson['T.Brady']['2014'])):
	if currjson['T.Brady']['2014'][i]['week'] == "14":
		currjson['T.Brady']['2014'].pop(i)

currjson['T.Brady']['2014'].append(week_obj)
modified.write(json.dumps(currjson))
modified.close()




jsonf.close()









