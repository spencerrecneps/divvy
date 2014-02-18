from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from database import Base

class Station(Base):
    __tablename__ = 'station'
    
    id = Column(Integer, primary_key=True)
    station_num = Column(Integer, unique=True, nullable=False)
    name = Column(String(128), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    dpcapacity = Column(Integer, nullable=True)
    
    def __init__(self, station_num, name, latitude, longitude, dpcapacity=None):
        station_num = self.station_num
        name=self.name
        latitude=self.latitude
        longitude=self.longitude
        dpcapacity=self.dpcapacity
        
    def __repr__(self):
        return '<Station %r>' % (self.name)
        

class Trip(Base):
    __tablename__ = 'trip'
    
    id = Column(Integer, primary_key=True)
    trip_num = Column(Integer, nullable=False)
    starttime = Column(DateTime, nullable=False)
    stoptime = Column(DateTime, nullable=False)
    bikeid = Column(Integer, nullable=False)
    tripduration = Column(Integer, nullable=False)                          #duration in seconds
    from_station_num = Column(Integer, ForeignKey('station.station_num'), nullable=False)
    from_station_name = Column(String(128))
    to_station_num = Column(Integer, ForeignKey('station.station_num'), nullable=False)
    to_station_name = Column(String(128))
    usertype = Column(String(50))
    gender = Column(String(40))
    birthyear = Column(Integer)
    
    def __init__(self, trip_num, starttime, stoptime, bikeid, tripduration, 
                 to_station_num, from_station_num, from_station_name=None, 
                 to_station_name=None, usertype=None, gender=None, birthyear=None):
        trip_num=self.trip_num
        starttime = self.starttime
        stoptime = self.stoptime
        bikeid = self.bikeid
        tripduration = self.tripduration
        from_station_name = self.from_station_name
        to_station_name = self.to_station_name
        from_station_num = self.from_station_num
        to_station_num = self.to_station_num
        usertype =self.usertype
        gender = self.gender
        birthyear = self.birthyear
        
    def __repr__(self):
        return '<Trip %r: %r' % (self.id, self.trip_num)
