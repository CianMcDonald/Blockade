#!/usr/local/bin/python3

from cgitb import enable
enable()
from cgi import FieldStorage
from html import escape
import pymysql as db
print('Content-Type: text/html')
print()

result = ''
score = "Points"
form_data = FieldStorage()
game = escape(form_data.getfirst('game', '').strip())
game = game + '_score'
try:
    connection = db.connect('localhost', 'cmd14', 'idaeh', 'cs6503_cs1106_cmd14')
    cursor = connection.cursor(db.cursors.DictCursor)
    #get the table for the game
    if game == 'pong_score':
        cursor.execute("SELECT username, %s FROM users WHERE %s IS NOT NULL ORDER BY %s LIMIT 10;"%(game,game,game))
        score = "Seconds"
    else:
        cursor.execute("SELECT username, %s FROM users WHERE %s IS NOT NULL ORDER BY %s DESC LIMIT 10;"%(game,game,game))

    if cursor.rowcount == 0:
        result = '<p>Currently no top scores</p>'
    else:
        result = '''<table>
                    <tr><th>Username</th><th>%s</th></tr>
                    '''%(score)
        for row in cursor.fetchall():
            result += '<tr><td>%s</td><td>%s</td></tr>' % (row['username'], row[game])
        result += '</table>'
    cursor.close()
    connection.close()
except db.Error:
    result = '<p>No leaderboard available at this time</p>'


print(result)
