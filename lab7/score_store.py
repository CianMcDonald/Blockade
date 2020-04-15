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
score = int(escape(form_data.getfirst('score', '').strip()))
game = escape(form_data.getfirst('game', '').strip())
sid = escape(form_data.getfirst('sid','').strip())
game = game + '_score'
try:
    session_store = open('sess_' + sid, writeback=False)
    username = session_store['username']
    authenticated = session_store['authenticated']
    if authenticated:
        connection = db.connect('localhost', 'cmd14', 'idaeh', 'cs6503_cs1106_cmd14')
        cursor = connection.cursor(db.cursors.DictCursor)
        cursor.execute("SELECT %s FROM users WHERE username = '%s';"%(game,username))
        current_score = cursor.fetchone()
        if game == 'pong_score':
            if current_score[game] == None or score < int(current_score[game]):
                cursor.execute("""
                                UPDATE users
                                SET %s = '%s'
                                WHERE username = '%s'
                """%(game,score,username))
                connection.commit()
                print("success")
        else:
            if current_score[game] == None or score > int(current_score[game]):
                cursor.execute("""
                                UPDATE users
                                SET %s = '%s'
                                WHERE username = '%s'
                """%(game,score,username))
                connection.commit()
                print("success")
    session_store.close()
    cursor.close()
    connection.close()
except db.Error:
    print("failure")
    session_store.close()
