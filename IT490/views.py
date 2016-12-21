#!/usr/bin/env python
# -*- coding: utf-8 -*-
from IT490 import app
from flask import render_template, jsonify, request, json
from funkcije import randomPredmeti
import sys
import codecs
sys.stdout = codecs.getwriter('utf-8')(sys.stdout)
sys.stderr = codecs.getwriter('utf-8')(sys.stderr)



@app.route('/')
@app.route('/index', methods = ["GET","POST"])
def index():
    """Renderuje index stranu - pocetnu."""
    predmeti = randomPredmeti() #list of predmeti
    predmeti_json = jsonify(predmeti)
    if request.method == "GET":
        return render_template('index.html', predmeti = predmeti)
    else:
        id = request.form['ime']
        sifra = request.form['email']
        punoIme = request.form['p_vsu']
        ekvivalent = request.form['br_espb']
        espb = request.form['program'] 
        semestar = request.form['diploma']


@app.route('/proba', methods = ['GET', 'POST'])
def proba():
    predmeti = randomPredmeti() #list of predmeti
    predmeti_json = jsonify(predmeti)
    if request.method == 'GET':
        return predmeti_json
    else:
        ime = request.json['ime']
        email = request.json['email']
        telefon = request.json['telefon']
        vsu = request.json['vsu']
        psp = request.json['psp']
        steceniESPB = request.json['steceniESPB']
        diploma = request.json['diploma']
        upisPrograma = request.json['upisPrograma']
        return jsonify({'Upis Programa': upisPrograma})

@app.route('/_process_prijava', methods = ['POST'])
def process_table():
    """Prima podatke sa klijent strane index.html
       i vraca json podatke fakulteta. Zavisi od izabranog polja - 
       FIT, FDU ili FM 
    """
    predmeti = randomPredmeti() #list of predmeti
    a = []
    for p in predmeti:
        d = {}
        d["id"]    = p['id']
        d['sifra'] = p['sifra']
        d['punoIme'] = p['punoIme']
        d['espb'] = p['espb']
        d['semestar'] = p['semestar']
        d['priznatESPB'] = ''
        d['dodatiESPB'] = ''
        d['priznat'] = ''
        a.append(d)


    predmeti_json = jsonify(d)
    ime = request.form['ime']
    email = request.form['email']
    telefon = request.form['telefon']
    vsu = request.form['vsu']
    psp = request.form['psp']
    steceniESPB = request.form['steceniESPB']
    diploma = request.form['diploma']
    upisPrograma = request.form['upisPrograma']
    print upisPrograma



    if upisPrograma == 'fit':
        return jsonify(a)
    elif upisPrograma == 'fdu':
        return jsonify(a)
    elif upisPrograma == 'fm':
        return jsonify(a)
    return jsonify({'message':'error'})