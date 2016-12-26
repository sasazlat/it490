import json
import httplib2
import urllib2

import sys
import codecs
sys.stdout = codecs.getwriter('utf8')(sys.stdout)
sys.stderr = codecs.getwriter('utf8')(sys.stderr)


def getListaPredmeta(faks):
    url = ('http://192.168.200.229:8080/core/rest/listapredmeta/%s' % faks)
    
    h = httplib2.Http()
    response, content = h.request(url,'GET')
    if response[ 'status' ] == '200': 
        results = json.loads(content)
        return results            


def getListaPredmetaFromJSONfile():
    with open('MOCK_DATA.json', 'r') as isum:
        results = json.load(isum)
        return results


def randomPredmeti(faks):
    from random import randint
    #predmeti = getListaPredmetaFromJSONfile()
    predmeti = getListaPredmeta(faks)
    lenfile = len(predmeti)
    index_predmeta = sorted([randint(1,lenfile-1) for p in range(1,11)])
    return [predmeti[ip] for ip in index_predmeta]