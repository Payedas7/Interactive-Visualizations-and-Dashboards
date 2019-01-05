
# import relevant libraries
from flask import Flask, render_template, url_for,jsonify
import json

# python modules created for apis
from ormQueries import getSampleNames,getOTUbySamples,getSampleMetaData,getWashingFreq
from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import pandas as pd





app = Flask(__name__)


# dashboard homepage
@app.route('/')
def hello():
    """Return the dashboard homepage."""
    return render_template('index.html')

    
@app.route("/names")
def sampleNames():
    """List of sample names.
    Returns a list of sample names in the format
    [
        "BB_940",
        "BB_941",
        "BB_943",
        "BB_944",
        "BB_945",
        "BB_946",
        "BB_947",
        ...
    ]
    """
    sampleNames = getSampleNames()

    return json.dumps(sampleNames)

@app.route("/otu")
def otu():
    """List of OTU descriptions.

    Returns a list of OTU descriptions in the following format
    [
        "Archaea;Euryarchaeota;Halobacteria;Halobacteriales;Halobacteriaceae;Halococcus",
        "Archaea;Euryarchaeota;Halobacteria;Halobacteriales;Halobacteriaceae;Halococcus",
        "Bacteria",
        "Bacteria",
        "Bacteria",
        ...
    ]
    """

@app.route("/metadata/<sample_id>")
def metaDataSample(sample_id):
    """MetaData for a given sample.
    Args: Sample in the format: `BB_940`
    Returns a json dictionary of sample metadata in the format
    {
        AGE: 24,
        BBTYPE: "I",
        ETHNICITY: "Caucasian",
        GENDER: "F",
        LOCATION: "Beaufort/NC",
        SAMPLEID: 940
    }
    """

    meta = getSampleMetaData(sample_id)
    return jsonify(meta)


@app.route("/wfreq/<sample_id>")
def washingFreq(sample_id):

    """Weekly Washing Frequency as a number.
    Args: Sample in the format: `BB_940`
    Returns an integer value for the weekly washing frequency `WFREQ`
    """
    wfreq = getWashingFreq(sample_id)
    return jsonify(wfreq)

@app.route("/samples/<sample_id>")
def check(sample_id):
    """OTU IDs and Sample Values for a given sample.

    Sort your Pandas DataFrame (OTU ID and Sample Value)
    in Descending Order by Sample Value

    Return a list of dictionaries containing sorted lists  for `otu_ids`
    and `sample_values`

    [
        {
            otu_ids: [
                1166,
                2858,
                481,
                ...
            ],
            sample_values: [
                163,
                126,
                113,
                ...
            ]
        }
    ]
    """
    return getOTUbySamples(sample_id)


if __name__ == "__main__":
    app.run()

