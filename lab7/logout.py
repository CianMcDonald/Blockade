#!/usr/local/bin/python3

from cgitb import enable
enable()

from os import environ
from shelve import open
from http.cookies import SimpleCookie
result = '''<p>You are already logged out</p>
            <p><a href="login.py">Login again</a></p>'''

try:
    cookie = SimpleCookie()
    http_cookie_header = environ.get('HTTP_COOKIE')
    if http_cookie_header:
        cookie.load(http_cookie_header)
        if 'sid' in cookie:
            sid = cookie['sid'].value
            session_store = open('sess_' + sid, writeback=True)
            if session_store['authenticated'] == True:
                session_store['authenticated'] = False
                result = """
                    <p>You are now logged out. Thanks for playing Blockade</p>
                    <p><a href="login.py">Login again</a></p>"""
            session_store.close()

except IOError:
    result = '<p>Sorry! We are experiencing problems at the moment. Please call back later.</p>'
print('Content-Type: text/html')
print()


print("""
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <title>Blockade</title>
            <link rel="stylesheet" href="styles.css">
        </head>
        <body>
            <header>
                <h1>Blockade</h1>
            </header>
            <main>
                %s
            </main>
        </body>
    </html>""" % (result))
