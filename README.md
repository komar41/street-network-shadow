# Shadow Map

CS594 - Big Data Visualization & Analytics (Fall 2021): Assignment 2
Instructor: Fabio Miranda

A web application built to visualize the  distribution of accumulated shadows for each season of the year, making use of a front-end and back-end infrastructure. The accumulated shadows were computed for three days of the year: June 21 (summer solstice), September 22 (autumnal equinox) and December 21 (winter solstice). Shadows can be greatly distorted when they are near the horizon, so all the shadows in the dataset are estimated from one and a half hours after sunrise to one and a half hours before sunset. This time, however, the shadow information was aggregated considering the street network, i.e., each street segment contains the accumulated shadow for the three days of the year.

Download the datasets [here](https://raw.githubusercontent.com/uic-big-data/fall-2021-assignment-2/main/chicago-street-shadow.geojson), and find more information [here](https://fmiranda.me/publications/shadow-accrual-maps/) and [here](https://github.com/VIDA-NYU/shadow-accrual-maps/).

```
ng new vis
cd vis
ng generate component map
ng generate component chart
ng generate service data
```

The front-end code makes use of [D3.js](https://d3js.org/) and [OpenLayers](https://openlayers.org/):

```
npm install --save-dev d3 ol @types/d3 @types/ol
```

run ```npm install``` inside the ```vis``` folder.

The back-end code makes use of [GeoPandas](https://geopandas.org/) and [Flask](https://flask.palletsprojects.com/). 

```
conda install geopandas flask
```

To create a new environment before installing GeoPandas and Flask:
```
conda create --name geopandas
conda activate geopandas
```

### Tasks

- load the street network geojson file that serves the appropriate data to the front end.

- An [OpenLayers](https://openlayers.org/) map inside the map component. The map contains one [TileLayer](https://openlayers.org/en/latest/apidoc/module-ol_layer_Tile-TileLayer.html). The view is centered in Chicago (i.e., ``center: transform([-87.6298, 41.8781], 'EPSG:4326', 'EPSG:3857')``). 

<p align="center">
  <img alt="Assignment 2 map" src="https://raw.githubusercontent.com/uic-big-data/fall-2021-assignment-2/main/map.png" style="width: 50%;" />
</p>

- A selection functionality that allows the user to draw an arbitrary polygon **and** translate it if selected.

<p align="center">
  <img alt="Assignment 2 selection" src="https://raw.githubusercontent.com/uic-big-data/fall-2021-assignment-2/main/selection.png" style="width: 50%;" />
</p>

- A chart component, given a selection that visualizes the **distribution** of shadow values for all seasons.

![Assignment 2 Chicago animation](chicago.gif)
