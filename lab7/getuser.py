#!/usr/local/bin/python3

from cgitb import enable
enable()
from cgi import FieldStorage
from shelve import open
from html import escape
import pymysql as db

print('Content-Type: text/plain')
print()

form_data = FieldStorage()
sid = escape(form_data.getfirst('sid', '').strip())
try:
    session_store = open('sess_' + sid, writeback=False)
    username = session_store['username']
    authenticated = session_store['authenticated']
    if authenticated:
        print("success "+username)
    else:
        print("failure")
    session_store.close()
except:
    print("failure")
    session_store.close()
