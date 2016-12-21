from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from IT490.models import Base, Predmet

from funkcije import getListaPredmeta, getListaPredmetaFromJSONfile

import sys
import codecs
sys.stdout = codecs.getwriter('utf8')(sys.stdout)
sys.stderr = codecs.getwriter('utf8')(sys.stderr)

engine = create_engine('sqlite:///isumdb.db')
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
sess = DBSession() 


#def main():
#    populateDB()
#    print 'Baza napunjena'


def populateDB():
    listaPredmeta = getListaPredmetaFromJSONfile()
    for predmet in listaPredmeta: 
        id = predmet['id']
        sifra = predmet['sifra']
        punoIme = predmet['punoIme']
        if predmet['ekvivalent']:
            ekvivalent = predmet['ekvivalent']
        else:
            ekvivalent = 0
        predmet = Predmet(isum_id=id, sifra=sifra,punoIme=punoIme,ekvivalent=ekvivalent)
        sess.add(predmet)
        sess.commit()
        
#if __name__ == "__main__":
#    main()