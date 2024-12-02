from elasticsearch import Elasticsearch
from flask import current_app

def get_elasticsearch():
    """Initialize Elasticsearch client."""
    return Elasticsearch(current_app.config['ELASTICSEARCH_URL'])
