import socket

mySock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

address = ('localhost', 7777)
print('Connecting to %s port %s' % address)
mySock.connect(address)
print("Connected to Server")
try:
    while True:
        message = input('You : ')
        mySock.send(message.encode())
        data = (mySock.recv(1024)).decode()
        if data=="END":
            break
        print('Server :',data)

finally:
    print('Closing socket')
    mySock.close()
