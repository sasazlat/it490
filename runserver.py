"""
This script runs the application using a development server.
It contains the definition of routes and views for the application.
"""

from IT490 import app

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
