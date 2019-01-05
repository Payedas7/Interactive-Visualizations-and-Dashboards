def getSampleNames():
    # assign the db's uniform resource identifier to a variable
    db_uri = 'sqlite:///DataSets/belly_button_biodiversity.sqlite'

    #connect to the db using create_engine():
    from sqlalchemy import create_engine
    # returned value engine represents the core interface to the database
    engine = create_engine(db_uri,echo=False)

    # Declare a Base using `automap_base()`
    from sqlalchemy.ext.automap import automap_base
    Base = automap_base()

    # Use the Base class to reflect the database tables
    Base.prepare(engine, reflect=True)

    # mapped classes are now created with names by default
    # matching that of the table name.
    Otu = Base.classes.otu
    Samples = Base.classes.samples
    Samples_metadata = Base.classes.samples_metadata

    # Create a session
    from sqlalchemy.orm import Session
    session = Session(engine)

    # initialize an empty list to store the values of sample ids
    sampleNames = []
    for sampleid in session.query(Samples_metadata.SAMPLEID).all():
        sampleNames.append("BB_"+str(sampleid[0]))

    # return the list of sample name
    return sampleNames


def getOTUbySamples(sample_id):
    # assign the db's uniform resource identifier to a variable
    db_uri = 'sqlite:///DataSets/belly_button_biodiversity.sqlite'

    #connect to the db using create_engine():
    from sqlalchemy import create_engine
    # returned value engine represents the core interface to the database
    engine = create_engine(db_uri,echo=False)

    # Declare a Base using `automap_base()`
    from sqlalchemy.ext.automap import automap_base
    Base = automap_base()

    # Use the Base class to reflect the database tables
    Base.prepare(engine, reflect=True)

    # mapped classes are now created with names by default
    # matching that of the table name.
    Otu = Base.classes.otu
    Samples = Base.classes.samples
    Samples_metadata = Base.classes.samples_metadata

    # Create a session
    from sqlalchemy.orm import Session
    session = Session(engine)

    # initialize an empty list to store the sample table
    otuIDbySample = []

    for row in session.query(Samples).all():
        otuIDbySample.append(row.__dict__)

    import pandas as pd
    otuIDbySample = pd.DataFrame.from_dict(otuIDbySample, orient='columns', dtype=None)

    otuIDbySample = otuIDbySample[sample_id].sort_values(ascending=False)[:10].reset_index()
    otuIDbySample.columns =["otu_ids","sample_values"]

    return otuIDbySample.to_json(orient='columns')


def getSampleMetaData(sample_id):
    # assign the db's uniform resource identifier to a variable
    db_uri = 'sqlite:///DataSets/belly_button_biodiversity.sqlite'

    #connect to the db using create_engine():
    from sqlalchemy import create_engine
    # returned value engine represents the core interface to the database
    engine = create_engine(db_uri,echo=False)

    # Declare a Base using `automap_base()`
    from sqlalchemy.ext.automap import automap_base
    Base = automap_base()

    # Use the Base class to reflect the database tables
    Base.prepare(engine, reflect=True)

    # mapped classes are now created with names by default
    # matching that of the table name.
    Otu = Base.classes.otu
    Samples = Base.classes.samples
    Samples_metadata = Base.classes.samples_metadata

    # Create a session
    from sqlalchemy.orm import Session
    session = Session(engine)

    # initialize an empty list to store the sample metadata table
    sampleMetaData = []

    for row in session.query(Samples_metadata).all():
        sampleMetaData.append(row.__dict__)

    import pandas as pd
    sampleMetaData = pd.DataFrame.from_dict(sampleMetaData, orient='columns', dtype=None)

    sample_id = pd.to_numeric(sample_id[3:])

    print(sample_id)
    meta  = sampleMetaData[sampleMetaData['SAMPLEID']==sample_id]
    meta = meta[['AGE','BBTYPE','ETHNICITY','GENDER','LOCATION','SAMPLEID']]

    meta = [{u: str(v)} for (u, v) in meta.iloc[0].iteritems()]
    return meta

def getWashingFreq(sample_id):
    # assign the db's uniform resource identifier to a variable
    db_uri = 'sqlite:///DataSets/belly_button_biodiversity.sqlite'

    #connect to the db using create_engine():
    from sqlalchemy import create_engine
    # returned value engine represents the core interface to the database
    engine = create_engine(db_uri,echo=False)

    # Declare a Base using `automap_base()`
    from sqlalchemy.ext.automap import automap_base
    Base = automap_base()

    # Use the Base class to reflect the database tables
    Base.prepare(engine, reflect=True)

    # mapped classes are now created with names by default
    # matching that of the table name.
    Otu = Base.classes.otu
    Samples = Base.classes.samples
    Samples_metadata = Base.classes.samples_metadata

    # Create a session
    from sqlalchemy.orm import Session
    session = Session(engine)

    washingFreq = []

    for row in session.query(Samples_metadata).all():
        washingFreq.append(row.__dict__)

    import pandas as pd
    washingFreqDf = pd.DataFrame.from_dict(washingFreq, orient = "columns")

    sample_id = pd.to_numeric(sample_id[3:])

    wFreq = washingFreqDf[washingFreqDf['SAMPLEID']==sample_id]['WFREQ']

    wFreq = float(wFreq.iloc[0])

    return wFreq