# D.부록: 기본값 맵핑

Altibase의 테이블 컬럼의 기본값은 원본 데이터베이스의 기본값과 대부분 호환된다.

하지만 이기종 데이터베이스들 간의 기본값 정책이 일부 상이하여, Migration
Center가 이러한 몇 가지 예외 상황에 대해 원본 데이터베이스의 값을 Altibase정책에
맞춰 변환한다.

이 부록은 Migration Center가 Altibase에 맞춰 원본 데이터베이스의 기본값을
변환하는 기본값 맵핑 테이블을 제공한다.

### 기본값 맵핑 테이블

Migration Center는 데이터를 이전하기 전에 마이그레이션 대상 데이터베이스 에 원본
데이터베이스의 테이블과 동일한 테이블을 생성한다. 이를 위해 원본 데이터베이스의
테이블 속성과 일치하는 테이블 생성 구문을 먼저 만든다. 이 때 Migration Center는
원본 테이블의 컬럼 기본값과 동일하게 대상 테이블의 컬럼에 기본값을 설정하려
한다. 이 절의 맵핑 테이블에 나열된 기본값은 Migration Center가 CREATE TABLE 문
생성시에 표에 따라 변환하여 지정한다. 그 외의 기본값은 변경 없이 그대로 CREATE
TABLE 문에 지정된다.

> 주의: 변경 없이 그대로 사용되는 기본값 중에는 원본과 대상 데이터베이스간에
> 호환이 되지 않는 것이 있을 수 있다. 필요하다면 나중에 사용자가 Reconcile 단계의
> DDL Editing 창에서 직접 CREATE TABLE 문의 기본값을 수정해야 한다.

#### 기본값 맵핑 정책

- 대다수의 원본 데이터베이스 기본값은 변경 없이 대상 데이터베이스와 호환된다.
  하지만 아래의 경우에는 Migration Center가 원본 데이터베이스의 기본값을 대상
  데이터베이스 정책에 맞춰 변환한다

- 문자형 데이터 타입의 기본값이 길이가 0인 문자열('')인 경우 : Altibase는
  길이가 0인 문자열을 NULL로 인식하므로, 기본값을 지정하지 않는다.

- 날짜형 데이터 타입의 기본값이 문자열 표현인 경우 : 원본 데이터베이스 별로
  날짜형을 위한 기본 포맷이 다르므로, Migration Center는 테이블 생성 구문에
  기본값 대신에 DEFAULT 키워드가 포함된 주석을 지정한다. 필요하다면 나중에
  사용자가 주석을 참고하여 직접 기본값을 설정해야 한다.  
  단 원본 데이터베이스가 MySQL, TimesTen, 또는 CUBRID일 때, 아래의 표처럼
  Migration Center가 기본값을 자동으로 변환한다.

- 기본값에 함수가 사용된 경우 : 아래 표에 열거된 함수가 원본 데이터베이스의
  기본값으로 단독 사용된 경우에 한해서 표와 같이 변환된다. 그 외의 함수 또는
  복잡한 형태의 표현식일 경우에는 변경 없이 그대로 변환된다. 필요하다면 나중에
  사용자가 직접 변경해야 한다.

#### Oracle 데이터베이스 to Altibase

<table>
    <tr>        
        <th>Expression Type</th> <th>원본(오라클)</th><th>대상(Altibase)</th><th>특이사항</th>
    </tr>
    <tr>
        <td>문자형을 위한 문자열</td><td>"</td><td></td><td></td>
    </tr>
    <tr>
        <td>날짜형을 위한 문자열</td><td>'97/04/21'</td><td>/* DEFAULT '97/04/21' */</td><td></td>
    </tr>
    <tr>
        <td rowspan="4">함수</td><td>DBTIMEZONE</td><td>DB_TIMEZONE()</td><td>Altibase 6.3.1.0.0 이상에서 지원됨</td>
    </tr>
    <tr>
        <td >SYS_GUID()</td><td>SYS_GUID_STR()</td><td>Altibase 6.3.1.0.0 이상에서 지원됨</td>
    </tr>
     <tr>
        <td >UID</td><td>USER_ID()</td><td></td>
    </tr>
    <tr>
         <td >USER</td><td>USER_NAME()</td><td></td>
    </tr>
</table>


아래는 변환 예제이다.

| 오라클의 테이블 생성 SQL문                                   | Altibase의 테이블 생성 SQL문                                 |
| :----------------------------------------------------------- | ------------------------------------------------------------ |
| CREATE TABLE testtbl_4_defval<br /> ( c1 INT DEFAULT 123, <br />c2 VARCHAR(50) DEFAULT 'test', <br />c3 INT DEFAULT NULL,<br /> c4 CHAR(10) DEFAULT '', <br />c5 INT DEFAULT SQRT(144) + 72, <br />c6 DATE DEFAULT '97/04/21', <br />c7 DATE DEFAULT TO_DATE('1999-12-01', 'YYYY-MM-DD'), <br />c8 VARCHAR(100) DEFAULT DBTIMEZONE, <br />c9 VARCHAR(100) DEFAULT SYS_GUID(), <br />c10 VARCHAR(100) DEFAULT UID, <br />c11 VARCHAR(100) DEFAULT USER ); | CREATE TABLE TESTTBL_4_DEFVAL<br /> ( C1 NUMBER (38, 0) DEFAULT 123, <br />C2 VARCHAR (50) DEFAULT 'test', <br />C3 NUMBER (38, 0), <br />C4 CHAR (10), <br />C5 NUMBER (38, 0) DEFAULT SQRT(144) + 72, <br />C6 DATE /\* DEFAULT '97/04/21' \*/, <br />C7 DATE DEFAULT TO_DATE('1999-12-01', 'YYYY-MM-DD'), <br />C8 VARCHAR (100) DEFAULT DB_TIMEZONE(), <br />C9 VARCHAR (100) DEFAULT SYS_GUID_STR(), <br />C10 VARCHAR (100) DEFAULT USER_ID(), <br />C11 VARCHAR (100) DEFAULT USER_NAME() ); |

#### MS SQL Server to Altibase

<table>
    <tr>        
        <th>Expression Type</th> <th>원본(MS SQL Server)</th><th>대상(Altibase)</th><th>특이사항</th>
    </tr>
    <tr>
        <td>문자형을 위한 문자열</td><td>"</td><td></td><td></td>
    </tr>
    <tr>
        <td>날짜형을 위한 문자열</td><td>'December 5, 1985'</td><td>/* DEFAULT 'December 5, 1985' */</td><td></td>
    </tr>
    <tr>
        <td rowspan="3">함수</td><td>GETDATE90</td><td>SYSDATE</td><td></td>
    </tr>
    <tr>
        <td >CURRENT_TIMESTAMP</td><td></td><td></td>
    </tr>
     <tr>
        <td >LEN( str_expression )</td><td>LENGTH( str_expression )</td><td></td>
    </tr>
</table>


아래는 변환 예제이다.

| MS SQL Server의 테이블 생성 SQL문                            | Altibase의 테이블 생성 SQL문                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| CREATE TABLE testtbl_4_defval <br />( c1 BIT DEFAULT 0, <br />c2 INT DEFAULT 2 + 3, <br />c3 VARCHAR(50) DEFAULT 'test', <br />c4 INT DEFAULT NULL, <br />c5 NCHAR(10) DEFAULT '', <br />c6 FLOAT DEFAULT sqrt(12 \* 12), <br />c7 DATE DEFAULT 'December 5, 1985', <br />c8 DATE DEFAULT getdate(), <br />c9 DATETIME DEFAULT CURRENT_TIMESTAMP,<br /> c10 INT DEFAULT len('test'), ); | CREATE TABLE TESTTBL_4_DEFVAL<br /> ( C1 CHAR (1) DEFAULT (0), <br />C2 INTEGER DEFAULT (2)+(3), <br />C3 VARCHAR (50) DEFAULT 'test', <br />C4 INTEGER, <br />C5 NCHAR (10), <br />C6 VARCHAR (310) DEFAULT sqrt((12)\*(12)), <br />C7 DATE /\* DEFAULT 'December 5, 1985' \*/, <br />C8 DATE DEFAULT SYSDATE, <br />C9 DATE DEFAULT SYSDATE, <br />C10 INTEGER DEFAULT LENGTH('test') ); |

#### MySQL to Altibase

<table>
    <tr>        
        <th>Expression Type</th> <th>원본(MySQL)</th><th>대상(Altibase)</th><th>특이사항</th>
    </tr>
    <tr>
        <td>문자형을 위한 문자열</td><td>"</td><td></td><td></td>
    </tr>
    <tr>
        <td rowspan="3">날짜형을 위한 문자열</td><td>'1989-04-28'</td><td>TO_DATE('1989-04-28', 'YYYY-MM-DD')</td><td></td>
    </tr>
     <tr>
        <td> '1989-04-28 12:31:29'</td><td>TO_DATE('1989-04-28 12:31:29', 'YYYY-MM-DD HH:MI:SS')</td><td></td>
    </tr>
    <tr>
        <td>'0000-00-00 00:00:00'</td><td>/* DEFAULT '0000-00-00 00:00:00' */</td><td>MySQL은 날짜형 타입의 기본값이 지정되지 않으면 자동으로 '0000-00-00 00:00:00'으로 지정된다. 하지만 이 값은 Altibase의 DATE 타입에는 입력이 불가능한 값이므로 주석 처리가 된다.</td>
    </tr>
    <tr>
    <td rowspan="7">함수</td><td>CURRENT_TIMESTAMP</td><td rowspan="7">SYSDATE</td><td></td>
    </tr>
    <tr>
        <td >CURRENT_TIMESTAMP()</td><td></td>
    </tr>
     <tr>
        <td >NOW()</td><td></td>
    </tr>
    <tr>
        <td >LOCALTIME</td><td></td>
    </tr>
    <tr>
        <td >LOCALTIME()</td><td></td>
    </tr>
    <tr>
        <td >LOCALTIMESETAMP</td><td></td>
    </tr>
    <tr>
        <td >LOCALTIMESETAMP()</td><td></td>
    </tr>
</table>


> 참고: MySQL은 테이블의 첫 컬럼의 데이터 타입이 TIMESTAMP인 경우, 사용자가
> 기본값을 지정하지 않아도 기본값으로 CURRENT_TIMESTAMP이 자동으로 지정된다.
> 따라서, 이 경우 기본값이 SYSDATE으로 변환된다. 아래의 예제를 참고하라.

아래는 변환 예제이다.

| MySQL의 테이블 생성 SQL문                                    | Altibase의 테이블 생성 SQL문                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| CREATE TABLE testtbl_4_defval <br />( c1 TIMESTAMP NOT NULL, <br />c2 INT DEFAULT 123, <br />c3 VARCHAR(50) DEFAULT 'test', <br />c4 INT DEFAULT NULL, <br />c5 CHAR(10) DEFAULT '', <br />c6 DATE DEFAULT '1989-04-28', <br />c7 DATETIME DEFAULT '1989-04-28 12:31:29', <br />c8 TIMESTAMP DEFAULT '1989-04-28 12:31:29' NOT NULL, <br />c9 TIMESTAMP NOT NULL ); | CREATE TABLE TESTTBL_4_DEFVAL <br />( C1 DATE DEFAULT SYSDATE NOT NULL, <br />C2 INTEGER DEFAULT 123, <br />C3 CLOB DEFAULT 'test', C4 INTEGER, <br />C5 CHAR (10), <br />C6 DATE DEFAULT TO_DATE('1989-04-28', 'YYYY-MM-DD'), <br />C7 DATE DEFAULT TO_DATE('1989-04-28 12:31:29', 'YYYY-MM-DD HH:MI:SS'), <br />C8 DATE DEFAULT TO_DATE('1989-04-28 12:31:29', 'YYYY-MM-DD HH:MI:SS') NOT NULL, <br />C9 DATE /\* DEFAULT '0000-00-00 00:00:00' \*/ NOT NULL ); |

#### Informix 11.5 to Altibase

<table>
    <tr>        
        <th>Expression Type</th> <th>원본(Informix)</th><th>대상(Altibase)</th><th>특이사항</th>
    </tr>
    <tr>
        <td>문자형을 위한 문자열</td><td>"</td><td></td><td></td>
    </tr>
    <tr>
        <td>날짜형을 위한 문자열</td><td>'2007-03-06'</td><td>/* DEFAULT '2007-03-06' */</td><td></td>
    </tr>
    <tr>
        <td rowspan="2">함수</td><td>CURRENT</td><td>SYSDATE</td><td></td>
    </tr>
    <tr>
        <td >TODAY</td><td>SYSDATE</td><td></td>
    </tr>     
</table>


아래는 변환 예제이다.

| Informix의 테이블 생성 SQL문                                 | Altibase의 테이블 생성 SQL문                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| CREATE TABLE testtbl_4_defval ( <br />c1 INTEGER DEFAULT 123, <br />c2 BOOLEAN DEFAULT 't',<br />c3 CHAR(100) DEFAULT 'test', <br />c4 INTEGER DEFAULT null, <br />c5 CHAR(10) DEFAULT '', <br />c6 DATETIME YEAR TO DAY DEFAULT DATETIME(07-3-6) YEAR TO DAY, <br />c7 DATETIME DAY TO HOUR DEFAULT CURRENT DAY TO HOUR, <br />c8 DATE DEFAULT TODAY ); | CREATE TABLE TESTTBL_4_DEFVAL ( <br />C1 INTEGER DEFAULT 123, <br />C2 CHAR (1) DEFAULT 't', <br />C3 CHAR (100) DEFAULT 'test', <br />C4 INTEGER, <br />C5 CHAR (10), <br />C6 DATE /\* DEFAULT '2007-03-06' \*/, <br />C7 DATE DEFAULT SYSDATE, <br />C8 DATE DEFAULT SYSDATE ); |

#### TimesTen to Altibase

<table>
    <tr>        
        <th>Expression Type</th> <th>원본(TimesTen)</th><th>대상(Altibase)</th><th>특이사항</th>
    </tr>
    <tr>
        <td rowspan="3">날짜형을 위한 문자열</td><td>'1989-04-28'</td><td>TO_DATE('1989-04-28', 'YYYY-MM-DD')</td><td></td>
    </tr>
    <tr>
        <td>'1989-04-28 12:31:29'</td><td>TO_DATE('1989-04-28 12:31:29', 'YYYY-MM-DD HH:MI:SS')</td><td></td>        
    </tr>
    <tr>
        <td>'12:31:29'</td>    <td>TO_DATE('12:31:29', 'HH:MI:SS')</td>    <td></td>    
    </tr>
    <tr>
        <td rowspan="2">함수</td><td>UID</td><td>USER_ID</td><td></td>
    </tr>
    <tr>
        <td >USER</td><td>USER_NAME</td><td></td>
    </tr>     
</table>


아래는 변환 예제이다.

| TimesTen의 테이블 생성 SQL문                                 | Altibase의 테이블 생성 SQL문                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| CREATE TABLE testtbl_4_defval ( <br />c1 INT DEFAULT 123, <br />c2 VARCHAR2(50) DEFAULT 'test', <br />c3 INT DEFAULT NULL, <br />c4 DATE DEFAULT '1999-12-01', <br />c5 TIMESTAMP DEFAULT '1999-12-01 11:30:21', <br />c6 TIME DEFAULT '11:30:21', <br />c7 VARCHAR(100) DEFAULT UID, <br />c8 VARCHAR(100) DEFAULT USER ); | CREATE TABLE TESTTBL_4_DEFVAL ( <br />c1 INT DEFAULT 123, <br />c2 VARCHAR2(50) DEFAULT 'test', <br />c3 INT DEFAULT NULL, <br />c4 DATE DEFAULT TO_DATE('1999-12-01', 'YYYY-MM-DD'), <br />c5 TIMESTAMP DEFAULT TO_DATE('1999-12-01 11:30:21', 'YYYY-MM-DD HH:MI:SS), <br />c6 TIME DEFAULT TO_DATE('11:30:21', 'HH:MI:SS'), c7 VARCHAR(100) DEFAULT UID, <br />c8 VARCHAR(100) DEFAULT USER ); |

#### CUBRID to Altibase

<table>
    <tr>        
        <th>Expression Type</th> <th>원본(CUBRID)</th><th>대상(Altibase)</th><th>특이사항</th>
    </tr>   
    <tr>
        <td rowspan="2">함수</td><td>USER</td><td>USER_ID()</td><td></td>
    </tr>
    <tr>
        <td >CURRENT_USER</td><td>USER_NAME()</td><td></td>
    </tr>     
</table>


아래는 변환 예제이다.

| CUBRID의 테이블 생성 SQL문                                   | Altibase의 테이블 생성 SQL문                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| CREATE TABLE testtbl_4_defval ( <br />c1 INTEGER DEFAULT 123, <br />c2 CHARACTER VARYING (50) DEFAULT 'test', <br />c3 INTEGER, <br />c4 CHARACTER VARYING (100) DEFAULT 'USER', <br />c5 CHARACTER VARYING (100) DEFAULT 'CURRENT_USER', <br />c6 CHARACTER VARYING(100) DEFAULT ' ', <br />c7 DATE DEFAULT DATE'2008-10-31', <br />c8 TIME DEFAULT TIME'1:15', <br />c9 TIMESTAMP DEFAULT TIMESTAMP'10/31', <br />c10 DATETIME DEFAULT DATETIME'01:15:45 PM 2008-10-31' ); | CREATE TABLE TESTTBL_4_DEFVAL ( <br />C1 INTEGER DEFAULT 123, <br />C2 VARCHAR (50) DEFAULT 'test', <br />C3 INTEGER, <br />C4 VARCHAR (100) DEFAULT USER_ID(), <br />C5 VARCHAR (100) DEFAULT USER_ID(), <br />C6 VARCHAR (100) DEFAULT ' ', <br />C7 DATE /\* DEFAULT '10/31/2008' \*/, <br />C8 DATE /\* DEFAULT '01:15:00 AM' \*/, <br />C9 DATE /\* DEFAULT '12:00:00 AM 10/31/2016' \*/, <br />C10 DATE /\* DEFAULT '01:15:45.000 PM 10/31/2008' \*/ ); |

#### Altibase to Oracle

<table>
    <tr>        
        <th>Expression Type</th> <th>원본(Altibase)</th><th>대상(Oracle)</th><th>특이사항</th>
    </tr>
    <tr>
        <td>문자형을 위한 문자열</td><td>"</td><td></td><td></td>
    </tr>
    <tr>
    <td rowspan="4">함수</td><td>DB_TIMEZONE()</td><td>DBTIMEZONE</td><td>Altibase 6.3.1.0.0 이상에서 지원됨</td>
    </tr>
    <tr>
        <td >SYS_GUID_STR()</td><td>SYS_GUID()</td><td>Altibase 6.3.1.0.0 이상에서 지원됨</td>
    </tr> 
    <tr>
        <td>USER_ID()</td><td>UID</td><td></td>
    </tr>
    <tr>
        <td>USER_NAME()</td><td>USER</td><td></td>
    </tr>
</table>


아래는 변환 예제이다.

| Altibase의 테이블 생성 SQL문                                 | Oracle의 테이블 생성 SQL문                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| CREATE TABLE testtbl_4_defval <br />( c1 INT DEFAULT 123, <br />c2 VARCHAR(50) DEFAULT 'test', <br />c3 INT DEFAULT NULL, <br />c4 CHAR(10) DEFAULT '', <br />c5 INT DEFAULT SQRT(144) + 72, <br />c6 DATE DEFAULT TO_DATE('1999-12-01 PM', 'YYYY-MM-DD AM'), <br />c7 VARCHAR(100) DEFAULT DB_TIMEZONE(), <br />c8 VARCHAR(100) DEFAULT SYS_GUID_STR(), <br />c9 VARCHAR(100) DEFAULT USER_ID(), <br />c10 VARCHAR(100) DEFAULT USER_NAME() ); | CREATE TABLE TESTTBL_4_DEFVAL <br />( C1 NUMBER (10) DEFAULT 123 ,<br />C2 VARCHAR2 (50) DEFAULT 'test' ,<br />C3 NUMBER (10) ,<br />C4 CHAR (10) ,<br />C5 NUMBER (10) DEFAULT SQRT(144) + 72 ,<br />C6 TIMESTAMP  DEFAULT TO_DATE('1999-12-01 PM', 'YYYY-MM-DD AM') ,<br />C7 VARCHAR2 (100) DEFAULT DBTIMEZONE ,<br />C8 VARCHAR2 (100) DEFAULT SYS_GUID() ,<br />C9 VARCHAR2 (100) DEFAULT UID ,<br />C10 VARCHAR2 (100) DEFAULT USER ); |

#### Tibero to Altibase

<table>
    <tr>        
        <th>Expression Type</th> <th>원본(Tibero)</th><th>대상(Altibase)</th><th>특이사항</th>
    </tr>
    <tr>
        <td>문자형을 위한 문자열</td><td>"</td><td></td><td></td>
    </tr>
     <tr>
        <td>날짜형을 위한 문자열</td><td>'97/04/21'</td><td>/* DEFAULT '97/04/21' */    </td><td></td>
    </tr>
    <tr>
    <td rowspan="4">함수</td><td>DBTIMEZONE</td><td>DB_TIMEZONE()</td><td>Altibase 6.3.1.0.0 이상에서 지원됨</td>
    </tr>
    <tr>
        <td >SYS_GUID_GUID()</td><td>SYS_GUID_STR()</td><td>Altibase 6.3.1.0.0 이상에서 지원됨</td>
    </tr> 
    <tr>
        <td>UID</td><td>USER_ID()</td><td></td>
    </tr>
    <tr>
        <td>USER</td><td>USER_NAME()</td><td></td>
    </tr>
</table>


아래는 변환 예제이다.

| Tibero의 테이블 생성 SQL문                                   | Altibase의 테이블 생성 SQL문                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| CREATE TABLE testtbl_4_defval( <br />c1 INT DEFAULT 123, <br />c2 VARCHAR(50) DEFAULT 'test', <br />c3 INT DEFAULT NULL, <br />c4 CHAR(10) DEFAULT '', <br />c5 INT DEFAULT QRT(144) + 72, <br />c6 DATE DEFAULT '97/04/21', <br />c7 DATE DEFAULT TO_DATE('1999-12-01', 'YYYY-MM-DD'), <br />c8 VARCHAR(100) DEFAULT DBTIMEZONE, <br />c9 VARCHAR(100) DEFAULT SYS_GUID(), <br />c10 VARCHAR(100) DEFAULT UID, <br />c11 VARCHAR(100) DEFAULT USER ); | CREATE TABLE TESTTBL_4_DEFVAL(  <br />C1  NUMBER (38, 0)  DEFAULT 123,    <br />C2  VARCHAR (50)    DEFAULT 'test',    <br />C3  NUMBER (38, 0),    <br />C4  CHAR (10),    <br />C5  NUMBER (38, 0)  DEFAULT SQRT(144) + 72,   <br />C6  DATE /\* DEFAULT '97/04/21' \*/,    <br />C7  DATE DEFAULT TO_DATE('1999-12-01', 'YYYY-MM-DD'),    <br />C8  VARCHAR (100)   DEFAULT DB_TIMEZONE(),    <br />C9  VARCHAR (100)   DEFAULT SYS_GUID_STR(),<br />C10 VARCHAR (100)   DEFAULT USER_ID(), <br />C11 VARCHAR (100)   DEFAULT USER_NAME() ); |

#### PostgreSQL to Altibase

| Expression Type | 원본(PostgreSQL)          | 대상(Altibase)          | 특이사항 |
| :-------------- | :------------------------ | :---------------------- | :------- |
| 함수            | current_role              | USER_NAME()             |          |
|                 | current_schema            | USER_NAME()             |          |
|                 | current_user              | USER_NAME()             |          |
|                 | session_user              | USER_NAME()             |          |
|                 | user                      | USER_NAME()             |          |
|                 | ceiling(expression)       | CEIL(number)            |          |
|                 | random()                  | RANDOM(0)/2147483647    |          |
|                 | bit_length(string)        | 8*OCTET_LENGTH(expr)    |          |
|                 | reverse(str)              | REVERSE_STR(expr)       |          |
|                 | strpos(string, substring) | INSTR (expr, substring) |          |
|                 | clock_timestamp()         | SYSDATE                 |          |
|                 | current_date              | SYSDATE                 |          |
|                 | current_time              | SYSDATE                 |          |
|                 | current_timestamp         | SYSDATE                 |          |
|                 | localtime                 | SYSDATE                 |          |
|                 | localtimestamp            | SYSDATE                 |          |
|                 | now()                     | SYSDATE                 |          |
|                 | statement_timestamp()     | SYSDATE                 |          |
|                 | transaction_timestamp()   | SYSDATE                 |          |


아래는 변환 예제이다.

| PostgreSQL의 테이블 생성 SQL문                               | Altibase의 테이블 생성 SQL문                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| CREATE TABLE testtbl_4_defval <br />( c1 VARCHAR(50) DEFAULT current_role,<br/>c2 VARCHAR(50) DEFAULT current_schema,<br/>c3 VARCHAR(50) DEFAULT current_user,<br/>c4 VARCHAR(50) DEFAULT session_user,<br/>c5 VARCHAR(50) DEFAULT user,<br/>c6 INTEGER DEFAULT ceiling(-95.3),<br/>c7 DOUBLE PRECISION DEFAULT random(),<br/>c8 INTEGER DEFAULT bit_length('abc'),<br/>c9 VARCHAR(50) DEFAULT reverse('reverse'),<br/>c10 INTEGER DEFAULT strpos('high', 'ig'),<br/>c11 timestamp with time zone DEFAULT clock_timestamp(),<br/>c12 date DEFAULT current_date,<br/>c13 time with time zone DEFAULT current_time,<br/>c14 timestamp with time zone DEFAULT current_timestamp,<br/>c15 time DEFAULT localtime,<br/>c16 timestamp DEFAULT localtimestamp,<br/>c17 timestamp with time zone DEFAULT now(),<br/>c18 timestamp with time zone DEFAULT transaction_timestamp() ); | CREATE TABLE TESTTBL_4_DEFVAL <br />( C1 VARCHAR (50) DEFAULT USER_NAME()<br/>,C2 VARCHAR (50) DEFAULT USER_NAME()<br/>,C3 VARCHAR (50) DEFAULT USER_NAME()<br/>,C4 VARCHAR (50) DEFAULT USER_NAME()<br/>,C5 VARCHAR (50) DEFAULT USER_NAME()<br/>,C6 INTEGER  DEFAULT CEIL('-95.3')<br/>,C7 DOUBLE  DEFAULT (RANDOM(0)/2147483647)<br/>,C8 INTEGER  DEFAULT 8*OCTET_LENGTH('abc')<br/>,C9 VARCHAR (50) DEFAULT REVERSE_STR('reverse')<br/>,C10 INTEGER  DEFAULT INSTR('high', 'ig')<br/>,C11 DATE  DEFAULT SYSDATE<br/>,C12 DATE  DEFAULT SYSDATE<br/>,C13 DATE  DEFAULT SYSDATE<br/>,C14 DATE  DEFAULT SYSDATE<br/>,C15 DATE  DEFAULT SYSDATE<br/>,C16 DATE  DEFAULT SYSDATE<br/>,C17 DATE  DEFAULT SYSDATE<br/>,C18 DATE  DEFAULT SYSDATE ); |

<br/>

