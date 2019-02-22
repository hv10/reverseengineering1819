# WarData Extraction Helper

## Setup
Install requirements:
```
$ npm install 
$ pip install -r requirements.txt
```

## Basic-Usage
```
$ npm run build && npm run dev
```
Open your favourite browser and navigate to `localhost:8080`.

## Abstract
Popular old games are worth to be preserved.
This program is an effort to extract the game-assets of different Versions of Warcraft 1. Special focus was the MacOS Version, as users believe the assets to be of a higher quality.

To partly automate the extraction process a system of metrics was introduced to decide if a given section of the Game-Binary is of part of a specific type of file.

Because of time-constraints the only tested and fully developed metric is based upon information entropy in a given data-section. Based on the entropy we can identify audio data, as well as text data, with a high accuracy.

This tool can be considered a proof-of-concept tool and should not be used in *any* project of importance

THIS SOFTWARE IS DISTRIBUTED "AS IS", WITH NO WARRANTY EXPRESSED OR IMPLIED, AND NO GUARANTEE FOR ACCURACY OR APPLICABILITY TO ANY PURPOSE. 
