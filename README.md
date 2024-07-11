# Street Network Shadow Visualization

This project aims to visualize the distribution of accumulated shadows for each season of the year across Chicago's street network. By presenting data through interactive map and chart visualizations, we seek to offer a comprehensive understanding of shadow patterns at the street segment level. The project incorporates multiple visualization techniques to showcase different aspects of the data, including geographic distribution and seasonal variations. Our goal is to create an accessible and informative tool for urban planners, researchers, and the general public to explore the impact of shadows on the urban environment.

- **GitHub repo:** https://github.com/komar41/street-network-shadow
- **Tools used:** Angular, TypeScript, Python, GeoPandas, Flask, D3.js, OpenLayers, HTML, CSS
  
<p align="center">
  <img src="chicago.gif" alt="drawing" style="width: 70%;" /> 
</p>

## Components

### 1. [OpenLayers Map](https://openlayers.org/)

- Displays the street network of Chicago
- [TileLayer](https://openlayers.org/en/latest/apidoc/module-ol_layer_Tile-TileLayer.html) for base map visualization
- Centered on Chicago coordinates
- Interactive selection functionality allowing users to draw and translate arbitrary polygons

<p align="center">
  <img alt="Assignment 2 map" src="https://raw.githubusercontent.com/uic-big-data/fall-2021-assignment-2/main/map.png" style="width: 50%;" />
</p>

### 2. Distribution Chart
- Visualizes the distribution of shadow values for all seasons
- Updates based on the user's polygon selection on the map
- Provides comparative view of shadow patterns across different seasons

## Interaction Features

- Draw arbitrary polygons on the map to select areas of interest
- Translate selected polygons to adjust the area of focus
- Dynamic updates of the distribution chart based on map selection

<p align="center">
  <img alt="Assignment 2 selection" src="https://raw.githubusercontent.com/uic-big-data/fall-2021-assignment-2/main/selection.png" style="width: 50%;" />
</p>


## Data Sources
Download the datasets [here](https://raw.githubusercontent.com/uic-big-data/fall-2021-assignment-2/main/chicago-street-shadow.geojson), and find more information [here](https://fmiranda.me/publications/shadow-accrual-maps/) and [here](https://github.com/VIDA-NYU/shadow-accrual-maps/).

- Accumulated shadow data for three key dates:
  - June 21 (summer solstice)
  - September 22 (autumnal equinox)
  - December 21 (winter solstice)
- Shadow data aggregated at the street segment level
- Time range: 1.5 hours after sunrise to 1.5 hours before sunset

## Technical Implementation

### Front-end
- [Angular framework](https://angular.dev/) for component-based architecture
- [D3.js](https://d3js.org/) for creating interactive data visualizations
- [OpenLayers](https://openlayers.org/) for map rendering and interactions

### Back-end
- [Flask](https://flask.palletsprojects.com/) server to handle API requests
- [GeoPandas](https://geopandas.org/) for processing and serving geospatial data

## Setup Instructions

**1. Front-end setup:**
```
ng new vis
cd vis
ng generate component map
ng generate component chart
ng generate service data
npm install --save-dev d3 ol @types/d3 @types/ol
npm install
```

**2. Back-end setup:**
```
conda create --name geopandas
conda activate geopandas
conda install geopandas flask
```
