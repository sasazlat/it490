import json
import httplib2
import requests


def getListaPredmeta(faks):
    url = (f'https://62f78bb473b79d01535a152e.mockapi.io/api/fakultet/{faks}')

    # h = httplib2.Http()
    response = requests.get(url)
    # response, content = h.request(url, 'GET')
    # if response['status'] == '200':
    return response.json()
        # results = json.loads(content)
        # return results


# def getListaPredmetaFromJSONfile():
#     with open('MOCK_DATA.json', 'r', encoding="utf8") as isum:
#         results = json.load(isum)
#         return results


def getListaFaksJSON(faks):
    if faks in ['fit', 'fdu', 'fmu', 'MOCK_DATA']:
        with open(f"{faks}.json", 'r', encoding="utf8") as isum:
            results = json.load(isum)
            return results
    else:
        return json.loads({'greska': 'Nema vez'})


def randomPredmeti(faks):
    from random import randint
    #predmeti = getListaPredmetaFromJSONfile()
    # predmeti = getListaPredmeta(faks)
    predmeti = getListaFaksJSON(faks)
    lenfile = len(predmeti)
    index_predmeta = sorted([randint(1, lenfile-1) for p in range(1, 11)])
    return [predmeti[ip] for ip in index_predmeta]
