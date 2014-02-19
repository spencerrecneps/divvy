from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base#, DeferredReflection
import os

uri = os.environ.get('DATABASE_URL', u'postgresql://gis:GIS01gis@localhost/divvy')
engine = create_engine(uri, convert_unicode=True)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
#Base = declarative_base(cls=DeferredReflection)
Base = declarative_base()
Base.query = db_session.query_property()

def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    from models import Station, Trip, TripLines, TripsByHour
    Base.metadata.create_all(bind=engine)