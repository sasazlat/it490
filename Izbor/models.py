from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine

Base = declarative_base()

class Predmet(Base):
    __tablename__ = 'predmeti'

    id = Column(Integer, primary_key=True)
    isum_id = Column(Integer, nullable=False, index=True)
    sifra = Column(String(20), nullable=False, index=True)
    punoIme = Column(String(96))
    ekvivalent = Column(Integer, nullable=False)

    @staticmethod
    def popupateDB(self, listDB):
        pass

    @property
    def serialize(self):
        return {
            'id':self.id,
            'isum_id':self.isum_id,
            'sifra':self.sifra,
            'punoIme':self.punoIme,
            'ekvivalent':self.ekvivalent
            }

engine = create_engine('sqlite:///isumdb.db')

Base.metadata.create_all(engine)