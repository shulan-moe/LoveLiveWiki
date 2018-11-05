# -*- coding: utf-8 -*-
import string
import datetime
import argparse
import urllib2
import re
import json


def getData():
	eventtype = ['classic', 'score match', 'medley festival']
	character = ['honoka', 'kotori', 'umi', 'nozomi', 'eli', 'nico', 'rin', 'hanayo', 'maki']
	last = [0,1,2,3,4,5,6,7,8,
			[[68534,69499,70409,72298],[49616,50181,50795,52138]],10,
			[[69436,70723,72131,74520],[46497,47007,47551,48836]],
			[[20119,20330,20610,21267],[14761,14980,15255,15881]],
			[[53685,54145,54805,56416],[42198,42727,43256,44523]],
			[[27612,28131,28720,30009],[18810,19179,19618,20468]],
			[[60478,61188,62022,63467],[46927,47495,48204,49605]],
			[[29432,30005,30570,31531],[21187,21621,22258,23134]],
			[[60569,61587,62805,64436],[46971,47804,48937,50549]],
			[[24209,24480,24770,25431],[17505,17833,18258,19200]],
			[[62256,63230,64289,66206],[49429,50278,51100,53045]],
			[[30636,31033,31582,32946],[21119,21558,22154,23317]],
			[[79479,80833,82045,84599],[55852,56769,57872,60120]],
			[[22235,22422,22648,23314],[15790,16022,16263,16848]],
			[[61411,61972,62727,64352],[45345,45795,46382,47802]],
			[[21111,21407,21741,22484],[15757,16097,16418,17271]]]


	content = urllib2.urlopen('http://www.lovelivewiki.com/w/EventCutOff').read()
	#content = open('111.htm', 'r').read()

	eventdatare = re.compile('<table id="eventData" border="1">[\s\S]*?</table>')
	eventdata = eventdatare.findall(content)[0].decode('utf-8')

	trre = re.compile('<tr>([\s\S]*?)</tr>')
	trredata = trre.findall(eventdata)

	result = {}

	for i in range(6, len(trredata)/4):
		if i == 7:
			continue
		tdre = re.compile('<td>(.*?)</td>')
		info = tdre.findall(trredata[4*i+1])
		firstrank = tdre.findall(trredata[4*i+2])
		secondrank = tdre.findall(trredata[4*i+3])
		del firstrank[0]
		del secondrank[0]
		event = {}
		event['id'] = i+3
		event['character'] = character[string.atoi(info[2])]
		event['days'] = string.atoi(info[1])
		event['type'] = eventtype[string.atoi(info[6])]
		fscore = [string.atoi(s) for s in firstrank]
		sscore = [string.atoi(s) for s in secondrank]
		event['score'] = [fscore,sscore]
		if len(last)-3 > i:
			if type(last[event['id']]) != int:
				for j in last[event['id']][0]:
					event['score'][0].insert(-1, j)
				for j in last[event['id']][1]:
					event['score'][1].insert(-1, j)
		result[event['id']] = event
		
	
	return json.dumps(result)

eventData = json.loads(getData())


file = open("/var/www/html/predict/result", 'w')
file.write("Output At : " + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") + "\r\n")
def output(*args):
	
	
	for arg in args:
		file.write(str(arg) + ", ")
	file.write("\r\n")


def daychange(scorearray, olddays, days, type):
    result = scorearray
    deltaarray = [scorearray[i]-scorearray[i-2] for i in range(2,len(scorearray)-5)]
    delta2array = [deltaarray[i]-deltaarray[i-1] for i in range(1,len(deltaarray))]
    mindelta2 = 100000
    minpos = 0
    typebase = 4
    if type == 'classic':
    	typebase = 10
    for i in range(4, len(delta2array)-typebase):
        delta2 = int(1.5*abs(delta2array[i]))+abs(delta2array[i+1])+int(0.5*abs(delta2array[i+2]))
        if delta2 < mindelta2:
            minpos = i
            mindelta2 = delta2
    #print olddays, days,len(scorearray),len(deltaarray),len(delta2array)
    offset = deltaarray[minpos+1]
    if days == olddays+1:
        result.insert(minpos+4, scorearray[minpos+2]+offset)
        result.insert(minpos+5, scorearray[minpos+3]+offset)
        for i in range(minpos+6, len(result)):
            result[i] += offset
    elif days == olddays-1:
    	del result[minpos+3]
    	del result[minpos+3]
    	for i in range(minpos+3, len(result)):
    		result[i] -= offset
    return result

def calcusimilarity(eventid1, eventid2, pos):
    #print eventid1,eventid2,pos
    distance = [1,1]
    #eventid1n = string.atoi(eventid1)
    #eventid2n = string.atoi(eventid2)
    for i in range(0,pos+1):
        #print i,eventData[str(eventid1)]['score'][0][i],eventData[str(eventid2)]['score'][0][i]
        distance[0] = 0.8*distance[0]+1.2**abs(eventid1-eventid2)*abs(eventData[str(eventid1)]['score'][0][i]-eventData[str(eventid2)]['score'][0][i])**2
        distance[1] = 0.8*distance[1]+1.2**abs(eventid1-eventid2)*abs(eventData[str(eventid1)]['score'][1][i]-eventData[str(eventid2)]['score'][1][i])**2
    return [1.0/(distance[0]/10000000.0),1.0/(distance[1]/10000000.0)]

def predict(eventid, pos, change):
    predictevent = eventData[str(eventid)]
    totalweight = [0,0]
    totalpredict = [0,0]
    #print predictevent
    current = [predictevent['score'][0][pos],predictevent['score'][1][pos]]
    if pos > 1:
        currentdelta = [current[0]-predictevent['score'][0][pos-2],current[1]-predictevent['score'][1][pos-2]]
    else:
        currentdelta = [1,1]
    for index in eventData:
    	event = eventData[index]
        if event['id'] < eventid and abs(event['days']-predictevent['days']) <= 1 \
        and event['type'] == predictevent['type']:
            if abs(event['days']-predictevent['days']) == 1 and change:
                event['score'][0] = daychange(event['score'][0],event['days'],predictevent['days'],predictevent['type'])
                event['score'][1] = daychange(event['score'][1],event['days'],predictevent['days'],predictevent['type'])
            event['predict'] = [0]*2
            if args.old:
                event['weight'] = [1.0, 1.0]
            else:
                event['weight'] = calcusimilarity(eventid,string.atoi(index),pos)#[1.0,1.0]
            
            if pos >1 and args.delta:
                delta0 = event['score'][0][pos]-event['score'][0][pos-2]
                delta1 = event['score'][1][pos]-event['score'][1][pos-2]
                event['predict'][0] = current[0]+int(1.0*(event['score'][0][-1]-event['score'][0][pos])*currentdelta[0]/delta0)
                event['predict'][1] = current[1]+int(1.0*(event['score'][1][-1]-event['score'][1][pos])*currentdelta[1]/delta1)
            else:
                event['predict'][0] = int(1.0*event['score'][0][-1]*(1.0*current[0]/event['score'][0][pos]))
                #print event['score'][0], predictevent['score'][0]
                event['predict'][1] = int(1.0*event['score'][1][-1]*(1.0*current[1]/event['score'][1][pos]))
            totalpredict[0] += event['weight'][0]*event['predict'][0]
            totalpredict[1] += event['weight'][1]*event['predict'][1]
            totalweight[0] += event['weight'][0]
            totalweight[1] += event['weight'][1]
            if not args.all or pos == len(eventData[args.eventid]['score'][0])-1:
            	output( event['id'], event['predict'], event['weight'] )
    output( int(totalpredict[0]/totalweight[0]), int(totalpredict[1]/totalweight[1]) )
    notchange = False
    return [int(totalpredict[0]/totalweight[0]), int(totalpredict[1]/totalweight[1])]

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('eventid')
    parser.add_argument('-a', '--all', action='store_true')
    parser.add_argument('-o', '--old', action='store_true')
    parser.add_argument('-d', '--delta', action='store_true')
    parser.add_argument('pos')
    args = parser.parse_args()
    eventData['25']['score'][0].append(46466)
    eventData['25']['score'][0].append(49880)
    eventData['25']['score'][0].append(51746)
    eventData['25']['score'][0].append(55282)
    eventData['25']['score'][0].append(55708)
    eventData['25']['score'][0].append(56471)
    eventData['25']['score'][1].append(33975)
    eventData['25']['score'][1].append(36913)
    eventData['25']['score'][1].append(38630)
    eventData['25']['score'][1].append(41924)
    eventData['25']['score'][1].append(42463)
    eventData['25']['score'][1].append(43152)
    change = True
    if args.all:
        for i in range(0, len(eventData[args.eventid]['score'][0])):
            predict(string.atoi(args.eventid), i, change)
            change = False
    else:
        predict(string.atoi(args.eventid), string.atoi(args.pos), True)
