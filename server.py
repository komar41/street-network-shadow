import geopandas as gpd
import pandas as pd
import pyproj
from flask import Flask, send_from_directory, safe_join, request
from flask_cors import CORS, cross_origin
from shapely.geometry import LineString
from shapely.geometry.polygon import Polygon

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
geo_network = None
gdf_network = None
df_network = None
saved_data = None
wgs84 = pyproj.Proj(projparams='epsg:4326')
InputGrid = pyproj.Proj(projparams='epsg:3857')


@app.route('/')
def index():
    return serve_static('index.html')


@app.route('/<path:filename>', methods=['GET'])
def serve_static(filename):
    return send_from_directory(safe_join(app.root_path,'vis/dist/shadow-maps/'), filename)


@app.route('/network', methods=['GET'])
@cross_origin()
def serve_network():
    return geo_network


def if_intersects(linestring, polygon):
    return linestring.intersects(polygon) or polygon.contains(linestring)


def get_data(df, columns):
    data = {}
    for col in columns:
        season_dict = df[col].describe(percentiles=[0.75, 0.25]).to_dict()
        season_dict["IQR"] = season_dict['75%'] - season_dict['25%']
        data[col] = season_dict
    return data


def get_polygon_distribution(polygon):
    global df_network
    intersects = df_network['geometry'].apply(lambda x: if_intersects(x, polygon))
    df = df_network[intersects]
    data = get_data(df, ['chi-jun-21', 'chi-sep-22', 'chi-dec-21'])
    return data


def get_distribution(data):
    data = str(data)[1:]
    ppolygon = eval(eval(data))
    polygon = Polygon(ppolygon)
    print(polygon)
    distribution = get_polygon_distribution(polygon)
    return distribution


@app.route('/distribution', methods=['POST'])
def serve_distribution():
    global saved_data
    data = request.data
    print("POST request received")
    if saved_data != data:
        saved_data = data
        distributions = get_distribution(data)
        return {"message": "From backend: Coordinates Received",
                "distributions": distributions}
    else:
        return {"message": "From backend: Coordinates Repetitive",
                "distributions": None}


def flip(linestring):
    x, y = linestring.coords.xy
    line2 = LineString(list(zip(y, x)))
    return line2


def load():
    global gdf_network
    global geo_network
    global df_network
    gdf_network = gpd.read_file('./chicago-street-shadow.geojson')
    df_network = pd.DataFrame(gdf_network)
    df_network['geometry'] = df_network.geometry.apply(lambda x: flip(x))
    geo_network = gdf_network.to_json()


if __name__ == '__main__':
    load()
    app.run(debug=True, host='127.0.0.1', port=8080)
