
from flask import Flask, request
import json

# Setup flask server
app = Flask(__name__)

# Setup url route which will calculate
# total sum of array.
@app.route('/arraysum', methods = ['POST'])

def sum_of_array():
    data = request.get_json()
    print(data)
    return json.dumps({"result":data})

if __name__ == "__main__":
    app.run(port=5000)