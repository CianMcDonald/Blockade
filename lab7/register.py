#!/usr/local/bin/python3
from cgitb import enable
enable()
from cgi import FieldStorage
from html import escape
from hashlib import sha256
from time import time
from shelve import open
from http.cookies import SimpleCookie
import pymysql as db

form_data = FieldStorage()
username = ''
result = ''
base_score = 0
if len(form_data) != 0:
    username = escape(form_data.getfirst('username', '').strip())
    password1 = escape(form_data.getfirst('password1', '').strip())
    password2 = escape(form_data.getfirst('password2', '').strip())
    if not username or not password1 or not password2:
        result = '<p>Error: user name and passwords are required</p>'
    elif password1 != password2:
        result = '<p>Error: passwords must be equal</p>'
    else:
        try:
            connection = db.connect('localhost', 'cmd14', 'idaeh', 'cs6503_cs1106_cmd14')
            cursor = connection.cursor(db.cursors.DictCursor)
            cursor.execute("""SELECT * FROM users
                              WHERE username = %s;""", (username))
            if cursor.rowcount > 0:
                result = '<p>That username is already taken!</p>'
            else:
                sha256_password = sha256(password1.encode()).hexdigest()
                cursor.execute("""INSERT INTO users (username, password)
                                  VALUES (%s, %s);""", (username, sha256_password))
                connection.commit()
                cursor.close()
                connection.close()
                cookie = SimpleCookie()
                sid = sha256(repr(time()).encode()).hexdigest()
                cookie['sid'] = sid
                session_store = open('sess_' + sid, writeback=True)
                session_store['authenticated'] = True
                session_store['username'] = username
                session_store.close()
                result = """
                   <p>Succesfully registered</p>
                   <p>Thanks for joining Blockade!</p>
                   <ul>
                       <li><a href="games.html">To The Games</a></li>
                       <li><a href="logout.py">Logout</a></li>
                   </ul>"""
                print(cookie)
        except (db.Error, IOError):
            result = '<p>Sorry! We are experiencing problems at the moment. Please call back later.</p>'

print('Content-Type: text/html')
print()
print("""
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <title>Blockade</title>
            <link rel="stylesheet" href="styles.css"/>
        </head>
        <header>
            <h1>Blockade</h1>
        </header>
        <body>
            <main>
                <form action="register.py" method="post">
                    <label for="username">Username </label>
                    <input type="text" name="username" id="username" value="%s" />
                    <label for="password1">Password: </label>
                    <input type="password" name="password1" id="password1" />
                    <label for="passwords2">Re-enter password </label>
                    <input type="password" name="password2" id="password2" />
                    <input type="submit" class = 'button' value="Register" />
                </form>
                %s
            </main>
        </body>
    </html>""" % (username, result))
