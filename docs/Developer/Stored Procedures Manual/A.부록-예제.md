# A.부록: 예제

### 저장 프로시저 예제

#### 예제 1

리플리케이션 객체를 생성하는 스크립트를 출력하는 dumpReplScrip 저장 프로시저를
생성한다.

지역서버의 IP 주소가 192.168.1.12 이고 이중화 포트번호가 35524, 원격서버의 IP
주소가 192.168.1.60 이고 이중화 포트번호가 25524 인 두 서버간에 EMPLOYEES
테이블과 DEPARTMENTS 테이블을 이중화 한다고 가정한다.

원격 서버에서:

```
iSQL> CREATE REPLICATION rep1 WITH '192.168.1.12',35524 FROM SYS.EMPLOYEES TO SYS.EMPLOYEES, FROM SYS.DEPARTMENTS TO SYS.DEPARTMENTS;
Create success.

iSQL> ALTER REPLICATION rep1 START;
Alter success.
```

지역 서버에서:

```
iSQL> CREATE REPLICATION rep1 WITH '192.168.1.60',25524 FROM SYS.EMPLOYEES TO SYS.EMPLOYEES, FROM SYS.DEPARTMENTS TO SYS.DEPARTMENTS;
Create success.
iSQL> ALTER REPLICATION rep1 START;
Alter success.

iSQL> create or replace procedure dumpReplScript
(p1 varchar(40))
as
cursor c1 is
select  system_.sys_replications_.replication_name,
system_.sys_replications_.host_ip,
system_.sys_replications_.port_no,
system_.SYS_REPLICATIONS_.ITEM_COUNT
from system_.sys_replications_
where system_.sys_replications_.replication_name = UPPER(P1);
r_name varchar(40);
r_ip varchar(40);
r_port varchar(20);
r_item_cnt integer;
r_local_user_name varchar(40);
r_local_table_name varchar(40);
r_remote_user_name varchar(40);
r_remote_table_name varchar(40);
cursor c2 is
select system_.SYS_REPL_ITEMS_.LOCAL_USER_NAME,
system_.SYS_REPL_ITEMS_.LOCAL_TABLE_NAME,
system_.SYS_REPL_ITEMS_.REMOTE_USER_NAME,
system_.SYS_REPL_ITEMS_.REMOTE_TABLE_NAME
from system_.sys_repl_items_
where system_.SYS_REPL_ITEMS_.replication_name = r_name;
begin
open c1;
SYSTEM_.PRINTLN('---------------------------------------');
SYSTEM_.PRINTLN('');
loop
fetch C1 into r_name, r_ip, r_port, r_item_cnt;
exit when C1%NOTFOUND;
SYSTEM_.PRINT(' CREATE REPLICATION ');
SYSTEM_.PRINT(r_name);
SYSTEM_.PRINT(' WITH ''');
SYSTEM_.PRINT(r_ip);
SYSTEM_.PRINT(''',');
SYSTEM_.PRINT(r_port);
SYSTEM_.PRINTLN(' ');
open c2;
        for i in 1 .. r_item_cnt loop
fetch c2 into r_local_user_name,
r_local_table_name,
r_remote_user_name,
r_remote_table_name;
SYSTEM_.PRINT(' FROM ');
SYSTEM_.PRINT(r_local_user_name);
SYSTEM_.PRINT('.');
SYSTEM_.PRINT(r_local_table_name);
SYSTEM_.PRINT(' TO ');
SYSTEM_.PRINT(r_remote_user_name);
SYSTEM_.PRINT('.');
SYSTEM_.PRINT(r_remote_table_name);
if i <> r_item_cnt then
SYSTEM_.PRINTLN(',');
else
SYSTEM_.PRINTLN(';');
end if;
        end loop;
close c2;
end loop;
close c1;
SYSTEM_.PRINTLN('');
SYSTEM_.PRINTLN('---------------------------------------');
end;
/
```

dumpReplScript 저장 프로시저를 실행한 출력 결과이다.

```
iSQL> exec dumpReplScript('rep1');
----------------------------------------------------------
 CREATE REPLICATION REP1 WITH '192.168.1.60',25524
 FROM SYS.DEPARTMENTS TO SYS.DEPARTMENTS,
 FROM SYS.EMPLOYEES TO SYS.EMPLOYEES;
----------------------------------------------------------
Execute success.
```



#### 예제 2

리플리케이션의 이름과 정보를 출력하기 위한 저장 프로시저 showReplications를
생성한다.

```
create or replace procedure showReplications
as
cursor c1 is select system_.sys_replications_.replication_name, system_.sys_replications_.host_ip, system_.sys_replications_.port_no, decode(system_.sys_replications_.is_started,1,'Running',0,'Not Running')
from system_.sys_replications_;
r_name varchar(40);
r_ip varchar(40);
r_port varchar(20);
r_status varchar(20);
r_local_user_name varchar(40);
r_local_table_name varchar(40);
r_remote_user_name varchar(40);
r_remote_table_name varchar(40);
cursor c2 is select system_.SYS_REPL_ITEMS_.LOCAL_USER_NAME, system_.SYS_REPL_ITEMS_.LOCAL_TABLE_NAME, system_.SYS_REPL_ITEMS_.REMOTE_USER_NAME
system_.SYS_REPL_ITEMS_.REMOTE_TABLE_NAME
from system_.sys_repl_items_
where system_.SYS_REPL_ITEMS_.replication_name
= r_name;
begin
open c1;
SYSTEM_.PRINTLN('-----------------------------------------');
SYSTEM_.PRINTLN('     Replications   Infos');
SYSTEM_.PRINTLN('-----------------------------------------');
SYSTEM_.PRINTLN(' Name          Ip            Port       Status');
SYSTEM_.PRINTLN('-----------------------------------------');
SYSTEM_.PRINTLN('');
loop
fetch C1 into r_name, r_ip, r_port, r_status;
exit when C1%NOTFOUND;
SYSTEM_.PRINT(' ');
SYSTEM_.PRINT(r_name);
SYSTEM_.PRINT('              ');
SYSTEM_.PRINT(r_ip);
SYSTEM_.PRINT('        ');
SYSTEM_.PRINT(r_port);
SYSTEM_.PRINT('      ');
SYSTEM_.PRINTLN(r_status);
SYSTEM_.PRINTLN('+++++++++++++++++++++++++++++++++++++');
SYSTEM_.PRINTLN(' Local Table Name   Remote Table Name');
SYSTEM_.PRINTLN('+++++++++++++++++++++++++++++++++++++');
open c2;
loop
fetch c2 into r_local_user_name, r_local_table_name, r_remote_user_name, r_remote_table_name;
exit when C2%NOTFOUND;
SYSTEM_.PRINT('         ');
SYSTEM_.PRINT(r_local_user_name);
SYSTEM_.PRINT('.');
SYSTEM_.PRINT(r_local_table_name);
SYSTEM_.PRINT('                          ');
SYSTEM_.PRINT(r_remote_user_name);
SYSTEM_.PRINT('.');
SYSTEM_.PRINTLN(r_remote_table_name);
end loop;
close c2;
end loop;
close c1;
SYSTEM_.PRINTLN('');
SYSTEM_.PRINTLN('-----------------------------------------');
end;
/
```

다음은 showReplications 저장 프로시저를 이용한 출력 결과이다.

```
iSQL> exec showReplications;
----------------------------------------------------------
 Replication Info
----------------------------------------------------------
 Name      IP              Port        Status
----------------------------------------------------------
 REP1      192.168.1.60    25524       Running
 ++++++++++++++++++++++++++++++++++++++++++++++++++++
 Local Table Name      Remote Table Name
 ++++++++++++++++++++++++++++++++++++++++++++++++++++
 SYS.DEPARTMENTS        SYS.DEPARTMENTS
 SYS.EMPLOYEES          SYS.EMPLOYEES
----------------------------------------------------------
EXECUTE success.
```



#### 예제 3

어떤 사용자의 테이블을 출력하기 위한 SHOWTABLES 저장 프로시저를 생성한다.

```
create or replace procedure SHOWTABLES(p1 in varchar(40))
as
cursor c1 is select SYSTEM_.SYS_TABLES_.TABLE_NAME
from SYSTEM_.SYS_TABLES_
where SYSTEM_.SYS_TABLES_.USER_ID =
(select SYSTEM_.SYS_USERS_.USER_ID
from SYSTEM_.SYS_USERS_
where SYSTEM_.SYS_USERS_.USER_NAME =
upper(p1)
AND system_.SYS_TABLES_.TABLE_TYPE = 'T');
v1 CHAR(40);     
begin
open c1;
SYSTEM_.PRINTLN('-------------------');
SYSTEM_.PRINT(p1);
SYSTEM_.PRINTLN(' Table');
SYSTEM_.PRINTLN('-------------------');
loop
fetch C1 into v1;
exit when C1%NOTFOUND;
SYSTEM_.PRINT(' ');
SYSTEM_.PRINTLN(v1);
end loop;
SYSTEM_.PRINTLN('-------------------');
close c1;
end;
/
```

다음은 showTables 저장 프로시저를 이용한 출력 결과이다.

```
iSQL> exec showTables('SYS');
-------------------
SYS Table
-------------------
 CUSTOMERS                                
 GOODS                                   
 DUMMY                                   
 ORDERS                                  
 EMPLOYEES                                
 DEPARTMENTS                              
-------------------
Execute success.
```



#### 예제 4

특정 프로시저의 내용을 출력하는 showProcBody 저장 프로시저를 생성한다.

```
create or replace procedure showProcBody(p1 in varchar(40))
as
cursor c1 is
    select system_.sys_proc_parse_.parse
    from system_.sys_proc_parse_
    where system_.sys_proc_parse_.proc_oid = (
    select SYSTEM_.sys_procedures_.proc_oid
    from system_.sys_procedures_
    where SYSTEM_.sys_procedures_.proc_name = upper(p1))
order by system_.sys_proc_parse_.seq_no;
v1 varchar(4000);
begin
open c1;
    SYSTEM_.PRINTLN('---------------------------------');
    system_.print(p1);
    SYSTEM_.PRINTLN(' Procedure');
    SYSTEM_.PRINTLN('---------------------------------');
    SYSTEM_.PRINTLN('');
    loop
      fetch C1 into v1;
    exit when C1%NOTFOUND;
    SYSTEM_.PRINTLN(v1);
    end loop;
  close c1;
  SYSTEM_.PRINTLN('');
  SYSTEM_.PRINTLN('---------------------------------');
end;
/
```

다음은 저장 프로시저 텍스트 정보가 존재하는 메타 테이블 조회 결과이다.

```
select system_.sys_proc_parse_.proc_oid, system_.sys_proc_parse_.parse
from system_.sys_proc_parse_
where system_.sys_proc_parse_.proc_oid = (
select SYSTEM_.sys_procedures_.proc_oid
from system_.sys_procedures_
where SYSTEM_.sys_procedures_.proc_name = upper('proc1'));
PROC_OID             
-----------------------
PARSE                                                                                                 
-----------------------------------------------------------
7695216              

create or replace procedure PROC1
(P1 in NUMBER, P2 in VARCHAR(10), P3 in DATE)
as
begin
    if P1 >  
7695216              
 0 then
        insert into T1 values (P1, P2, P3);
    end if;
end                                   
2 rows selected.
```

다음은 showProcBody 저장 프로시저를 실행한 출력 결과이다.

```
iSQL> exec showProcBody('proc1');
---------------------------------
proc1 Procedure
---------------------------------

create or replace procedure PROC1
(P1 in NUMBER, P2 in VARCHAR(10), P3 in DATE)
as
begin
    if P1 >
0 then
        insert into T1 values (P1, P2, P3);
    end if;
end

---------------------------------
Execute success.
```



#### 예제 5

커서 변수를 사용하는 저장 프로시저를 생성한다. Altibase CLI(ODBC) 응용프로그램
내에서 이 프로시저를 실행하면 프로시저 내에서 커서변수를 열어서 응용프로그램으로
결과 집합을 전달한다.

```
CREATE OR REPLACE TYPESET MY_TYPE
AS
  TYPE MY_CUR IS REF CURSOR;
END;
/

CREATE OR REPLACE PROCEDURE OPENCURSOR2
( P1 OUT MY_TYPE.MY_CUR, P2 IN INTEGER )
AS
BEGIN
  OPEN P1 FOR 'SELECT C1 FROM T1 WHERE C1 <= ?' USING P2;
END;
/

iSQL> EXEC OPENCURSOR2(4);
C1
--------------
1
2
3
4
4 rows selected.

/* ODBC 프로그램 */
    ...
    SQLINTEGER c1;
    SQLINTEGER param1;

    /* allocate Statement handle */
    if (SQL_ERROR == SQLAllocStmt(dbc, &stmt))
    {
        printf("SQLAllocStmt error!!\n");
        return SQL_ERROR;
    }

    sprintf(query,"EXEC OPENCURSOR2(?)");

    if (SQLPrepare(stmt, (SQLCHAR *) query, SQL_NTS)== SQL_ERROR)
    {
       printf("ERROR: prepare stmt\n");
       execute_err(dbc, stmt, query);
       return SQL_ERROR;
    }

    if (SQLBindParameter(stmt, 1, SQL_PARAM_INPUT, SQL_C_SLONG,
                 SQL_INTEGER, 0, 0, &param1, 0, NULL) == SQL_ERROR)
    {
       printf("ERROR: Bind Parameter 1\n");
       execute_err(dbc, stmt, query);
       return SQL_ERROR;
    }

    param1 = 4;
    if (SQLExecute( stmt ) != SQL_SUCCESS)
    {
        execute_err(dbc, stmt, query);
        SQLFreeStmt(stmt, SQL_DROP);
        return SQL_ERROR;
    }

   if (SQL_ERROR ==
SQLBindCol(stmt, 1, SQL_C_SLONG, &c1, 0, NULL))
   {
     printf("ERROR: Bind 1 Column\n");
   }

   while ( (rc = SQLFetch(stmt)) != SQL_NO_DATA)
    {
        if ( rc != SQL_SUCCESS )
        {
            execute_err(dbc, stmt, query);
            break;
        }
        printf(" Result Set : [ %d ] \n", c1 );
    }

    SQLFreeStmt(stmt, SQL_DROP);

    ....

$ refcursor
===========================================================
 Result Set : [ 1 ]
 Result Set : [ 2 ]
 Result Set : [ 3 ]
 Result Set : [ 4 ]
```



### 파일 제어 예제

#### 예제 1

다음은 파일에 테이블의 내용을 기록하고 그 파일로부터 데이터를 읽어오는 예제이다.

사용자 생성 및 사용자에게 적절한 권한을 부여한다.

```
CONNECT SYS/MANAGER;
CREATE USER JEJEONG IDENTIFIED BY JEJEONG;
GRANT CREATE ANY DIRECTORY TO JEJEONG;
GRANT DROP ANY DIRECTORY TO JEJEONG;
```

테이블과 디렉토리 객체를 생성한다.

```
CONNECT JEJEONG/JEJEONG;
CREATE TABLE T1( ID INTEGER, NAME VARCHAR(40) );
INSERT INTO T1 VALUES( 1, 'JEJEONG');
INSERT INTO T1 VALUES( 2, 'EJPARK' );
INSERT INTO T1 VALUES( 3, 'WSKIM'  );
INSERT INTO T1 VALUES( 4, 'KKSHIM' );
INSERT INTO T1 VALUES( 5, 'CSKIM'  );
INSERT INTO T1 VALUES( 6, 'KDHONG' );
CREATE DIRECTORY MYDIR AS '/home/JEJEONG';
```

테이블 T1에 있는 모든 레코드를 읽어서 t1.txt 파일에 기록하는 저장 프로시저를
생성한다.

```
CREATE OR REPLACE PROCEDURE WRITE_T1
AS
  V1 FILE_TYPE;
  ID INTEGER;
  NAME VARCHAR(40);
BEGIN
  DECLARE
    CURSOR T1_CUR IS
      SELECT * FROM T1;
  BEGIN
    OPEN T1_CUR;
    V1 := FOPEN( 'MYDIR', 't1.txt', 'w' );
    LOOP
      FETCH T1_CUR INTO ID, NAME;
      EXIT WHEN T1_CUR%NOTFOUND;
      PUT_LINE( V1, 'ID : '||ID||' NAME : '||NAME);
    END LOOP;
    CLOSE T1_CUR;
    FCLOSE(V1);
  END;
END;
/
```

파일 t1.txt에 있는 내용을 읽어 화면에 출력하는 저장 프로시저를 생성한다.

```
CREATE OR REPLACE PROCEDURE READ_T1
AS
  BUFFER VARCHAR(200);
  V1 FILE_TYPE;
BEGIN
  V1 := FOPEN('MYDIR', 't1.txt', 'r' );
  LOOP
    GET_LINE( V1, BUFFER, 200 );
    PRINT( BUFFER );
  END LOOP;
  FCLOSE( V1 );
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    FCLOSE( V1 );
END;
/
```



위의 저장 프로시저를 생성한 후 실행하면 다음과 같은 결과가 나온다.

```
iSQL> exec write_t1;
Execute success.
iSQL> exec read_t1;
ID : 1    NAME : JEJEONG
ID : 2    NAME : EJPARK
ID : 3    NAME : WSKIM
ID : 4    NAME : KKSHIM
ID : 5    NAME : CSKIM
ID : 6    NAME : KDHONG
Execute success.
```

파일 시스템 상의 실제 디렉토리에서 파일을 확인하면 결과는 다음과 같다.

```
$ cd /home/JEJEONG
$ cat t1.txt
ID : 1    NAME : JEJEONG
ID : 2    NAME : EJPARK
ID : 3    NAME : WSKIM
ID : 4    NAME : KKSHIM
ID : 5    NAME : CSKIM
ID : 6    NAME : KDHONG
```



### UTL_SMTP 예제

##### 상황

터미널과 알티베이스 서버의 캐릭터 셋이 EUC-KR이며,
첨부 파일과 캐릭터셋 UFT-8으로 변환해서 한글 텍스트를 메일로 전성하려 한다.
첨부 파일은 utl_smtp.sql 의 압축이며, 이진값 텍스트으로 보내고 있다.

##### 예제

```
CREATE OR REPLACE PROCEDURE TEST2()
AS
    c CONNECT_TYPE;
    r VARCHAR(512);
BEGIN
    c := UTL_SMTP.OPEN_CONNECTION( '127.0.0.1', '25', NULL );
    r := UTL_SMTP.HELO( c, '127.0.0.1' );
    r := UTL_SMTP.MAIL( c, 'test@test.com' );
    r := UTL_SMTP.RCPT( c, '[test@test.com](mailto:test@test.com)');
    r := UTL_SMTP.OPEN_DATA( c );
    UTL_SMTP.WRITE_DATA( c, 'MIME-Version: 1.0' || CHR(13) || CHR(10) );
    UTL_SMTP.WRITE_DATA( c, 'Content-Type: multipart/mixed; boundary="0A1B2C3D4E5F"' || CHR(13) || CHR(10) );
    UTL_SMTP.WRITE_DATA( c, '--0A1B2C3D4E5F' || CHR(13) || CHR(10) );
    UTL_SMTP.WRITE_DATA( c, 'Content-Type: text/plain; charset=utf-8' || CHR(13) || CHR(10) );
    UTL_SMTP.WRITE_DATA( c, 'Content-Transfer-Encoding: 7bit' || CHR(13) || CHR(10) );
    UTL_SMTP.WRITE_DATA( c, 'Content-Disposition: inline' || CHR(13) || CHR(10) );
    UTL_SMTP.WRITE_RAW_DATA( c, to_raw(convert('Subject: 가나다','utf8')) );
    UTL_SMTP.WRITE_DATA( c, CHR(13) || CHR(10) );
    UTL_SMTP.WRITE_RAW_DATA( c, to_raw(convert('가나다','utf8')) );
    UTL_SMTP.WRITE_DATA( c, CHR(13) || CHR(10) );
    UTL_SMTP.WRITE_DATA( c, '--0A1B2C3D4E5F' || CHR(13) || CHR(10) );
    UTL_SMTP.WRITE_DATA( c, 'Content-Type: application/octet-stream; name="test.zip"' || CHR(13) || CHR(10) );
    UTL_SMTP.WRITE_DATA( c, 'Content-Transfer-Encoding: base64' || CHR(13) || CHR(10) );
    UTL_SMTP.WRITE_DATA( c, 'Content-Disposition: attachment; filename="test.zip"' || CHR(13) || CHR(10) );
    UTL_SMTP.WRITE_DATA( c, CHR(13) || CHR(10) );
    UTL_SMTP.WRITE_DATA( c, base64_encode_str( '504B03041403000008004E7AA24AD7949D9F9E010000500500000C00000075746C5F736D74702E73716CBD545D4FF23014BEEFAF3897607CF5054543B8AAA5207176A4762A57A46E8D3419EB6C8B1FFFDE4D5DC6F08390184F76757A9EAFD36D877BBF5308F68098FCC5EAFB85874EBFDFFFD7FDDF39DD079C7A7D279D2A4E6D6EACF4DA64602C68EFC0ADEE9C4EB4B45AB9839201A729BC3138B0CA29FBA892B2FF2B758810E1140B0A21074EA7012614A6985CE03185954FE76EE973C057088D2246C42464607295CD6393652A2E6DB760619C87F79A30B8C69C9C63DE3A396EEF23F8B68AD435A878041D53FE13C03FCFBD5E2AB3F26B0018D2118E02012C0A0268234E45C4199090314AC45CCCA674B0667DA152D382B8D26D0E7E124FCC52EA6C3354A552377B9D6E7B5DA540A5B5CA761DA7B244D98DF5757B279FF7974B2B975E59574F3657B0DD9C8D73BF8B39AB629D6B95F9BF30F7F66A25D2CBC2E1A6B36FD1531E123A8C388527ABBDAAF05BC3D555221AB7DCEB1D1517FD15B9954F3B0B344538BEA9041AD9E3D438B56BF81AFEB0D27E072065C301FAFAE38FCE820981AB190BD9ECB2FE078C8A19F7E20EAAC6008D396602E82D255149C11AC720C20FAAC2E52B504B01023F031403000008004E7AA24AD7949D9F9E010000500500000C0000000000000000002080B4810000000075746C5F736D74702E73716C504B050600000000010001003A000000C80100000000' ) );
    UTL_SMTP.WRITE_DATA( c, CHR(13) || CHR(10) );
    UTL_SMTP.WRITE_DATA( c, '--0A1B2C3D4E5F--' || CHR(13) || CHR(10) );
    r := UTL_SMTP.CLOSE_DATA( c );
    r := UTL_SMTP.QUIT( c );
END;
 /
```



### SENDMAIL DAEMON 확인 예제

#### 상황

UTL_SMTP 패키지를 사용하기 전에,
E-MAIL를 전송하는 E-MAIL Server의 Sendmail Daemon을 확인하고자 한다.

#### 예제

터미널에서 아래의 명령어를 수행한다.

1. telnet ip_address 25
2. helo ip_address
3. quit

아래의 예제는 현재 E-Mail Server에 접속된 터미널에서 수행한 것이다.

```
$ telnet 127.0.0.1 25
...
2xx ...
helo 127.0.0.1
2xx ...
quit
2xx ...
```
