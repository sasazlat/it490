#!/usr/bin/env python
# -*- coding: utf-8 -*-
from IT490 import app
from flask import render_template, jsonify, request, json, url_for
from funkcije import randomPredmeti

import sys
import codecs
sys.stdout = codecs.getwriter('utf-8')(sys.stdout)
sys.stderr = codecs.getwriter('utf-8')(sys.stderr)



@app.route('/')
@app.route('/index', methods = ["GET","POST"])
def index():
    """Renderuje index stranu - pocetnu."""
    #predmeti = randomPredmeti() #list of predmeti
    #predmeti_json = jsonify(predmeti)
    if request.method == "GET":
        return render_template('index.html')
    else:
        id = request.form['ime']
        sifra = request.form['email']
        punoIme = request.form['p_vsu']
        ekvivalent = request.form['br_espb']
        espb = request.form['program'] 
        semestar = request.form['diploma']


@app.route('/_process_prijava', methods = ['POST'])
def process_table():
    """Prima podatke sa klijent strane index.html
       i vraca json podatke fakulteta. Zavisi od izabranog polja - 
       FIT, FDU ili FM 
    """

    #za bazu podataka studenta
    ime = request.form['ime']
    email = request.form['email']
    telefon = request.form['telefon']
    vsu = request.form['vsu']
    psp = request.form['psp']
    steceniESPB = request.form['steceniESPB']
    diploma = request.form['diploma']
    upisPrograma = request.form['upisPrograma']

    #ovde ce umesto randomPredmeti() biti 
    #json dobijen rest-om
    predmeti = randomPredmeti(upisPrograma) #list of predmeti
    a = []
    if predmeti:
        for p in predmeti:
            d = {}
            d["id"]    = p['id']
            d['sifra'] = p['sifra']
            d['punoIme'] = p['punoIme']
            d['espb'] = p['ects']
            d['semestar'] = p['ekvivalent']
            d['priznatESPB'] = ''
            d['dodatiESPB'] = ''
            d['priznat'] = ''
            a.append(d)      
        return jsonify(a)



@app.route("/_process_cetiri", methods = ["POST"])
def process_cetiri():
    upisPrograma = request.form['upisPrograma']
    print upisPrograma
    predmeti = randomPredmeti(upisPrograma) #list of predmeti
    a = []
    for p in predmeti:
        d = {}
        d["id"]    = p['id']
        d['sifra'] = p['sifra']
        d['punoIme'] = p['punoIme']
        d['espb'] = p['ects']
        d['semestar'] = p['ekvivalent']
        d['dodatESPB'] = ''
        d['dodat'] = ''
        a.append(d)

    return jsonify(a)
  