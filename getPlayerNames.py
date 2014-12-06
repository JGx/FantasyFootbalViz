
#Used to create JSON 'hash' of
#Full player name : FirstInitial.Lastname
#For seasons 2009-2014
import nflgame
import json
import operator


def getAllPlayers(year):
	weeks = []
	for x in xrange(1,18):
		weeks.append(x)
	game = nflgame.games(2009,week = weeks)
	players = nflgame.combine(game)

	playerDict = {}
	for p in players:
		playerDict[str(p.player.full_name)]=str(p.player.gsis_name)
	return playerDict



def generateJSON():
	players = getAllPlayers(2009)
	for x in xrange(2010,2015):
		print "Adding season" + str(x)
		newPlayers = getAllPlayers(x)
		players = dict(players.items() + newPlayers.items())
	sortedPlayers = sorted(players.items(), key=lambda key: operator.itemgetter(0))
	data = json.dumps(sortedPlayers)
	jsonf = open('playersHash.json','w')
	jsonf.write(data)
	jsonf.close() 

generateJSON()