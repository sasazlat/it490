#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import Flask
import sys
import codecs

sys.stdout = codecs.getwriter('utf-8')(sys.stdout)
sys.stderr = codecs.getwriter('utf-8')(sys.stderr)

app = Flask(__name__)

import IT490.views 