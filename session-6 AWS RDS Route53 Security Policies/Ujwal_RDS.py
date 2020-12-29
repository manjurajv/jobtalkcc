import sys
import pymysql

#Provide the 'endpoint','username' and 'password' of the Database.
db = pymysql.connect('my-testdb-01.czgoxgr4rmxc.ap-south-1.rds.amazonaws.com', 'rootadmin', 'Rootadmin1')
cursor = db.cursor()

def tbshoot():
    cursor.execute("select version()")
    data = cursor.fetchone()
    print (data)

def CreateDatabase():
    sql = '''create database alpha'''
    cursor.execute(sql)
    cursor.connection.commit()

def DisplayDatabases():
    sql = '''show databases'''
    cursor.execute(sql)
    show = cursor.fetchall()
    print(show)

def CreateTable():
    use = '''use alpha'''
    cursor.execute(use)
    sql = '''
    create table users (
    id int,
    name text,
    number int
    )
    '''
    cursor.execute(sql)

def DisplayTables():
    use = '''use alpha'''
    cursor.execute(use)
    sql = ''' show tables'''
    cursor.execute(sql)
    show = cursor.fetchall()
    print(show)

def Insertinto():
    use = '''use alpha'''
    cursor.execute(use)
    sql = '''
    insert into users(id, name, number) values('1', 'UJ', '12345')
    '''
    cursor.execute(sql)
    db.commit()

def ReadTable():
    use = '''use alpha'''
    cursor.execute(use)
    sql = '''select * from users'''
    #sql = '''desc users'''
    cursor.execute(sql)
    show = cursor.fetchall()
    print(show)

##Note: Uncomment the functions to use them.

##To Display Databases.
#DisplayDatabases()

##To Create a Database.
#CreateDatabase()

##To Create a Table.
#CreateTable()

##To Display Tables.
#DisplayTables()

##To insert content into a Table.
#Insertinto()

##To read the entire Table.
#ReadTable()

##For troubleshooting, checks the version of MySQL.
tbshoot()