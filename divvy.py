import os
import flask
from flask.ext import restless
from flask.ext.restless import APIManager
from database import db_session, init_db
from models import Station, Trip, TripLines, TripsByHour
#from cherrypy import wsgiserver


# Key vars
#WEB_DIR = 'web'

# Define static pages
#class Root(object):
#    def index(self):
#        return open(os.path.join(WEB_DIR, 'index.html'))
#    index.exposed = True

#root = Root()


# restless docs
# https://flask-restless.readthedocs.org/en/latest/quickstart.html
# https://flask-restless.readthedocs.org/en/latest/searchformat.html

# Connect flask with SQLAlchemy
app = flask.Flask(__name__)
init_db()
manager = APIManager(app, session=db_session)

# Hook up with CherryPy
#d = wsgiserver.WSGIPathInfoDispatcher({'/': app})
#restServer = wsgiserver.CherryPyWSGIServer(('0.0.0.0', 9876), d)

# Create the API endpoints
station_blueprint = manager.create_api(Station, 
                                       methods=['GET'],
                                       max_results_per_page=-1)
trip_blueprint = manager.create_api(Trip,
                                    methods=['GET'],
                                    max_results_per_page=100)
trip_lines_blueprint = manager.create_api(TripLines,
                                          methods=['GET'],
                                          max_results_per_page=-1)
trips_by_hour_blueprint = manager.create_api(TripsByHour,
                                             methods=['GET'],
                                             max_results_per_page=-1)

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

#if __name__ == '__main__':
#    try:
#        restServer.start()
#    except KeyboardInterrupt:
#        restServer.stop()
    #app.run()

if __name__ == '__main__':
        port = int(os.environ.get("PORT", 5000))
        app.run(host='0.0.0.0', port=port)

# test it at e.g.
# http://0.0.0.0:5000/api/station
# http://0.0.0.0:5000/static/index.html