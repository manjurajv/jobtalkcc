import socket
from _thread import *

mySock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)      
print ("Socket successfully created")  
port = 7777
mySock.bind(('127.0.0.1', port))        
print ("Socket binded to",port)  

ThreadCount = 0

print('Waiting for Connection(s)...')
mySock.listen(2)   
print ("Socket is listening")            

replies = {"HI":"Hello","HELLO":"Hi", "GOOD MORNING":"Good Morning", 
           "GOOD EVENING":"Good Evening", "GOOD NIGHT":"Good Night", 
           "HOW ARE YOU":"I'm fine, how about you?",
           "I'M FINE":"Great to hear"}

def thread_client(con,ThreadCount):
    while True:
        data = (con.recv(1024)).decode()
        print('Received from Client %d : %s'%(ThreadCount,data))
        if data.upper() == "EXIT":
            con.sendall("END".encode())
            print('Connection with Client',ThreadCount,'terminated\n')
            break
            
        elif data.upper() in replies.keys():
            reply = replies[data.upper()]
                
        else:
            reply="I can't understand, try using other messages"
                
        print("Reply sent to Client %d : %s"%(ThreadCount,reply))
        con.sendall(reply.encode())
    con.close()
    
while True:
    while ThreadCount < 2:
        con, address = mySock.accept()
        print('Connection from', address)
        start_new_thread(thread_client,(con,ThreadCount+1))
        ThreadCount+=1
        print('Connection Established with Client',ThreadCount,end='\n\n')
    
mySock.close()
print("Connection closed")
