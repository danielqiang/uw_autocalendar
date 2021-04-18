import hashlib
import base64
import sys

def hash(s):
    hash = hashlib.sha256(s.encode()).digest()
    encoded = base64.b64encode(hash)
    return encoded

contents1 = "this.onload=function(){};handleClientLoad()"
contents2 = "if (this.readyState === 'complete') this.onload()"


print(hash(contents1).decode())
print(hash(contents2).decode())