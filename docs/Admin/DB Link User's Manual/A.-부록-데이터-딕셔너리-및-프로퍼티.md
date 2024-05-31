# A. 부록: 데이터 딕셔너리 및 프로퍼티

이 부록은 데이터베이스 링크와 관련하여 사용되는 각종 프로퍼티 및 데이터 딕셔너리를 기술한다.

### DB Link 관련 데이터 딕셔너리

데이터베이스 링크의 현재 상태를 보여주는 메타 테이블과 성능 뷰는 다음과 같다. 자세한 설명은 *General Reference*를 참고한다.

#### 메타 테이블

-   SYS_DATABASE_LINKS\_

#### 성능 뷰(Performance View)

-   V\$DBLINK_ALTILINKER_STATUS

-   V\$DBLINK_DATABASE_LINK_INFO

-   V\$DBLINK_GLOBAL_TRANSACTION_INFO

-   V\$DBLINK_LINKER_CONTROL_SESSION_INFO

-   V\$DBLINK_LINKER_DATA_SESSION_INFO

-   V\$DBLINK_LINKER_SESSION_INFO

-   V\$DBLINK_NOTIFIER_TRANSACTION_INFO

-   V\$DBLINK_REMOTE_STATEMENT_INFO

-   V\$DBLINK_REMOTE_TRANSACTION_INFO

### 프로퍼티 파일

Altibase 데이터베이스 링크를 사용하기 위해서는 Altibase 서버의 프로퍼티 파일인 altibase.properties와 AltiLinker의 프로퍼티 파일인 dblink.conf를 사용 목적에 맞게 수정해야 한다.

#### altibase.properties

데이터베이스 링크와 관련된 프로퍼티는 다음과 같으며, 프로퍼티에 대한 자세한 설명은 *General Reference* 를 참고한다.

-   AUTO_REMOTE_EXEC

-   DBLINK_ENABLE

-   DBLINK_GLOBAL_TRANSACTION_LEVEL

-   DBLINK_RECOVERY_MAX_LOGFILE

-   DBLINK_REMOTE_STATEMENT_AUTOCOMMIT

-   DBLINK_REMOTE_TABLE_BUFFER_SIZE

-   DBLINK_DATA_BUFFER_BLOCK_SIZE

-   DBLINK_DATA_BUFFER_BLOCK_COUNT

-   DBLINK_DATA_BUFFER_ALLOC_RATIO

-   DBLINK_ALTILINKER_CONNECT_TIMEOUT

#### dblink.conf

dblink.conf 파일은 AltiLinker를 위한 프로퍼티 파일이다. 이 파일에 설정 가능한 프로퍼티는 아래와 같다.

-   ALTILINKER_ENABLE

-   ALTILINKER_PORT_NO

-   ALTILINKER_RECEIVE_TIMEOUT

-   ALTILINKER_REMOTE_NODE_RECEIVE_TIMEOUT

-   ALTILINKER_QUERY_TIMEOUT

-   ALTILINKER_NON_QUERY_TIMEOUT

-   ALTILINKER_THREAD_COUNT

-   ALTILINKER_THREAD_SLEEP_TIME

-   ALTILINKER_REMOTE_NODE_SESSION_COUNT

-   ALTILINKER_TRACE_LOG_DIR

-   ALTILINKER_TRACE_LOG_FILE_SIZE

-   ALTILINKER_TRACE_LOGGING_LEVEL

-   ALTILINKER_JVM_BIT_DATA_MODEL_VALUE

-   ALTILINKER_JVM_MEMORY_POOL_INIT_SIZE

-   ALTILINKER_JVM_MEMORY_POOL_MAX_SIZE

-   TARGETS/NAME

-   TARGETS/JDBC_DRIVER

-   TARGETS/CONNECTION_URL

-   TARGETS/USER

-   TARGETS/PASSWORD

-   TARGETS/XADATASOURCE_CLASS_NAME

-   TARGETS/XADATASOURCE_URL_SETTER_NAME

-   TARGETS/NLS_BYTE_PER_CHAR

다음은 dblink.conf 파일의 예제이다.

```
ALTILINKER_ENABLE = 1
ALTILINKER_PORT_NO = 23238
  
ALTILINKER_RECEIVE_TIMEOUT = 100
ALTILINKER_REMOTE_NODE_RECEIVE_TIMEOUT = 100
  
ALTILINKER_QUERY_TIMEOUT = 10
ALTILINKER_NON_QUERY_TIMEOUT = 20
  
ALTILINKER_THREAD_COUNT = 10
ALTILINKER_THREAD_SLEEP_TIME  = 200
ALTILINKER_REMOTE_NODE_SESSION_COUNT = 100
  
ALTILINKER_TRACE_LOG_DIR = "?/trc"
ALTILINKER_TRACE_LOG_FILE_SIZE = 30
ALTILINKER_TRACE_LOG_FILE_COUNT = 9
ALTILINKER_TRACE_LOGGING_LEVEL =  3
  
ALTILINKER_JVM_MEMORY_POOL_INIT_SIZE = 128
ALTILINKER_JVM_MEMORY_POOL_MAX_SIZE = 512
ALTILINKER_JVM_BIT_DATA_MODEL_VALUE = 1

  
TARGETS = (
(
    NAME = "ora1"
    JDBC_DRIVER = "/home1/applys/work/natc/TC/Server/dk/RemoteServer/JdbcDrivers/ojdbc1
    CONNECTION_URL = "jdbc:oracle:thin:@dbdm.altibase.in:1521:ORCL"
    USER = "new_dblink"
    PASSWORD = "new_dblink"
    NLS_BYTE_PER_CHAR = 1
),
(
    NAME = "alti2"
    JDBC_DRIVER =  "/home/user/altibase_home/lib/Altibase.jar"
    CONNECTION_URL = "jdbc:Altibase://127.0.0.1:20600/mydb" XADATASOURCE_CLASS_NAME= "oracle.jdbc.xa.OracleXADataSource XADATASOURCE_URL_SETTER_NAME = "setURL"
)
)
```

각 프로퍼티에 대한 상세한 설명은 다음 절에서 기술한다.

### AltiLinker 프로퍼티

이 절은 dblink.conf에 설정하는 AltiLinker 프로퍼티에 대해 기술한다.

#### ALTILINKER_ENABLE

##### 기본값

0

##### 값의 범위

[0, 1]

##### 설명

AltiLinker 프로세스의 활성화 여부를 결정한다. 데이터베이스 링크를 사용하고자 할 때는 이 값을 1로 설정한다. 값이 0이면 AltiLinker 프로세스가 시작되지 않는다.

#### ALTILINKER_JVM_BIT_DATA_MODEL_VALUE

##### 기본값

1

##### 값의 범위

[0, 1]

##### 설명

JVM(Java Virtual Machine) 상에서 AltiLinker를 위해 JVM bit를 지정한다.

-   0: 32 bit

-   1: 64 bit

#### ALTILINKER_JVM_MEMORY_POOL_INIT_SIZE (단위: 바이트) 

##### 기본값

128 MBytes

##### 값의 범위

[128MB, 4096MB]

##### 설명

JVM(Java Virtual Machine) 상에서 AltiLinker를 위해 할당하는 메모리 풀의 초기 크기를 지정한다.

#### ALTILINKER_JVM_MEMORY_POOL_MAX_SIZE (단위: 바이트) 

##### 기본값

4096 MBytes

##### 값의 범위

[512MB, 32768MB]

##### 설명

JVM 상에서 AltiLinker를 위해 할당하는 메모리 풀의 최대 크기를 지정한다.

#### ALTILINKER_NON_QUERY_TIMEOUT (단위 : 초)

##### 기본값

60

##### 값의 범위

[0, 2<sup>32</sup>-1]

##### 설명

원격 서버에서 SELECT를 제외한 DML문이나 DDL문 수행에 걸리는 시간이 이 프로퍼티에 설정한 시간(초)를 초과하면 그 구문의 실행은 취소된다.

#### ALTILINKER_PORT_NO 

##### 기본값

0

##### 값의 범위

[1024, 65535]

##### 설명

AltiLinker의 TCP 대기(listen) 포트 번호를 지정한다.

#### ALTILINKER_QUERY_TIMEOUT (단위: 초)

##### 기본값

60

##### 값의 범위

[0, 2<sup>32</sup>-1]

##### 설명

원격 서버에서 질의 수행 소요 시간이 이 프로퍼티에 설정한 시간(초)을 초과하면 그 구문의 실행은 취소된다.

#### ALTILINKER_RECEIVE_TIMEOUT (단위: 초)

##### 기본값

5

##### 값의 범위

[0, 2<sup>32</sup>-1]

##### 설명

Altibase 서버가 AltiLinker에 작업 요청 후 최대 응답 대기 시간을 지정한다.

#### ALTILINKER_REMOTE_NODE_RECEIVE_TIMEOUT(단위: 초)

##### 기본값

30

##### 값의 범위

[0, 2<sup>32</sup>-1]

##### 설명

원격 서버에서 SELECT문과 DML, DDL문 수행 외의 prepare 수행, auto commit mode 설정, DCL문 수행에 대한 최대 대기 시간을 지정한다.

#### ALTILINKER_REMOTE_NODE_SESSION_COUNT 

##### 기본값

64

##### 값의 범위

[1, 128]

##### 설명

AltiLinker 프로세스가 원격 서버에 접속할 때 생성하는 세션의 최대 개수를 지정한다. 링커 데이터 세션의 최대 개수는 이 프로퍼티 값-1(링커 제어 세션의 개수)이다.

#### ALTILINKER_THREAD_COUNT 

##### 기본값

16

##### 값의 범위

[2, 2<sup>31</sup>-1]

##### 설명

AltiLinker에서 원격 서버에 SQL 구문을 수행할 쓰레드의 개수를 지정한다.

#### ALTILINKER_THREAD_SLEEP_TIME (단위: 마이크로초) 

##### 기본값

200

##### 값의 범위

[1, 2<sup>32</sup>-1]

##### 설명

AltiLinker 프로세스 내의 쓰레드가 처리할 작업이 없을 때 대기하는 시간을 지정한다.

#### ALTILINKER_TRACE_LOG_DIR

##### 기본값

$ALTIBASE_HOME/trc

##### 값의 범위

없음

##### 설명

AltiLinker 프로세스가 트레이스 로그를 기록할 로그 파일의 위치를 지정한다.

#### ALTILINKER_TRACE_LOG_FILE_COUNT

##### 기본값

10

##### 값의 범위

[1, 100]

##### 설명

AltiLinker 프로세스가 트레이스 로그를 기록할 로그 파일의 최대 개수를 지정한다.

#### ALTILINKER_TRACE_LOG_FILE_SIZE (단위: 바이트) 

##### 기본값

10 MBytes

##### 값의 범위

[1MB, 2<sup>32</sup>-1]

##### 설명

AltiLinker 프로세스가 트레이스 로그를 기록할 로그 파일의 크기를 지정한다.

#### ALTILINKER_TRACE_LOGGING_LEVEL 

##### 기본값

4

##### 값의 범위

[0, 6]

##### 설명

AltiLinker 프로세스가 트레이스 로그를 기록하는 수준을 지정한다. 아래의 값을 지정할 수 있다.

-   0: 로그를 기록하지 않음

-   1: FATAL

-   2: ERROR

-   3: WARNING

-   4: INFO

-   5: DEBUG

-   6: TRACE

#### TARGETS/CONNECTION_URL

##### 기본값

없음

##### 값의 범위

없음

##### 설명

원격 데이터베이스 서버의 연결 URL을 지정한다.

#### TARGETS/JDBC_DRIVER

##### 기본값

없음

##### 값의 범위

없음

##### 설명

원격 데이터베이스 서버를 위한 JDBC 드라이버 경로를 지정한다.

#### TARGETS/JDBC_DRIVER_CLASS_NAME

##### 기본값

없음

##### 값의 범위

없음

##### 설명

원격 데이터베이스 서버를 위한 JDBC 드라이버의 CLASS NAME을 지정한다. 값이 지정되어 있지 않으면 java.sql.Driver 인터페이스를 구현한 클래스를 로딩한다.

#### TARGETS/NAME

##### 기본값

없음

##### 값의 범위

없음

##### 설명

원격 서버에 부여할 이름을 지정한다.

#### TARGETS/PASSWORD

##### 기본값

없음

##### 값의 범위

없음

##### 설명

원격 데이터베이스 서버에 접속할 사용자의 암호를 지정한다.

#### TARGETS/USER

##### 기본값

없음

##### 값의 범위

없음

##### 설명

원격 데이터베이스 서버에 접속할 사용자 이름을 지정한다.

#### TARGETS/ XADATASOURCE_CLASS_NAME

##### 기본값

없음

##### 값의 범위

없음

##### 설명

XADataSource클래스 이름을 설정한다,

#### TARGETS/XADATASOURCE_URL_SETTER_NAME

##### 기본값

없음

##### 값의 범위

없음

##### 설명

XADataSource의 URL을 설정하는 함수이다.

#### TARGETS/NLS_BYTE_PER_CHAR

##### 기본값

0

##### 값의 범위

[0, 3]

##### 설명

원격 서버 의 문자형 데이터 타입 중 CHAR와 VARCHAR의 단위와 크기를 고려하여 설정한다.

Altibase의 CHAR와 VARCHAR 데이터 타입의 길이는 고정형 바이트 단위이지만, 타 DBMS에서 바이트(BYTE) 또는 캐릭터(CHAR) 단위로 선택 가능한 경우가 있다. (예. Oracle의 NLS_LENGTH_SEMANTICS )

이 값을 설정하지 않으면 AltiLinker는 데이터 손실을 막기 위해 원격 서버의 CHAR와 VARCHAR 데이터 타입의 단위를 보수적으로 캐릭터(CHAR) 단위로 가정하고 지역 서버의 캐릭터셋에 맞춰 길이를 변환한다. 예를 들어 지역 서버의 캐릭터셋이 MS949이고 원격 서버의 CHAR, VARCHAR 데이터 타입의 길이(size)가 10으로 선언되어 있다면, MS949에서 한 글자를 2바이트로 표현하므로 10*2=20바이트로 길이를 변환한다.

원격 서버가 Altibase 이거나, CHAR와 VARCHAR 데이터 타입의 단위가 바이트(BYTE) 인 경우 이 값을 1로 설정한다.
자세한 설명은 아래를 참고한다.

 **0으로 설정 하는 경우 (기본값)**

아래 두 조건을 만족하는 경우 0으로 설정한다. 

- 원격 서버의 문자형 데이터 타입 중 CHAR와 VARCHAR의 길이 단위가 캐릭터(CHAR) 인 경우

  - Oracle 경우, VARCHAR2(10 CHAR)

- 지역 서버 캐릭터셋과 원격 서버 캐릭터셋이 같거나, CHAR와 VARCHAR의 한 글자 크기가 같은 경우

  | 지역 서버 캐릭터셋 | 1 글자 크기 | 원격 서버 캐릭터셋 | 1 글자 크기 |
  | :----------------: | :---------: | :----------------: | :---------: |
  |       ASCII        |      1      |       ASCII        |      1      |
  |       MS949        |      2      |       MS949        |      2      |
  |       MS949        |      2      |      KSC5601       |      2      |
  |       UTF-8        |      3      |       UTF-8        |      3      |

예제) 지역 서버와 원격 서버의 캐릭터셋이 MS949이고 원격 서버에서 캐릭터(CHAR) 단위의 칼럼 생성


```sql
-- 원격 서버에 캐릭터(CHAR) 단위로 CHAR 데이터 타입 칼럼 생성
iSQL> EXEC REMOTE_EXECUTE_IMMEDIATE('link1', 'CREATE TABLE t1(C1 CHAR(20 CHAR), c2 INTEGER)');
Execute success.
iSQL> EXEC REMOTE_EXECUTE_IMMEDIATE('link1', 'INSERT INTO t1 VALUES(''일이삼사오육칠팔구십'', 3)');
Execute success.
iSQL> SELECT * FROM T1@link1;
C1 C2
---------------------------------------------------------
일이삼사오육칠팔구십 3
1 row selected.

-- 지역 서버(Altibase)에 테이블 생성 시 원격 서버 테이블의 스키마를 바이트단위로 계산해서 생성 (원격 칼럼 크기(20) * 한 글자 크기(2) = 40으로 선언)
iSQL> CREATE TABLE t1 ( c1 CHAR( 40 ), c2 INTEGER );
Create success.
iSQL> CREATE OR REPLACE PROCEDURE PROC1
 AS
 CURSOR CUR1 IS
 SELECT * FROM REMOTE_TABLE(link1,'SELECT * FROM T1 ORDER BY C2');
 BEGIN
 FOR M IN CUR1
 LOOP
 INSERT INTO T1 VALUES(M.C1, M.C2);
 END LOOP;
 END;
 /
Create success.
 
iSQL> EXEC PROC1;
Execute success.
iSQL> SELECT C1 FROM T1 ORDER BY C2;
C1
--------------------------------------------
일이삼사오육칠팔구십
1 row selected.
```


 **1로 설정 하는 경우**

- 원격 서버의 데이터베이스가 Altibase인 경우
- 원격 서버의 CHAR, VARCHAR 데이터 타입의 단위를 BYTE로 생성한 경우
- 원격 서버의 캐릭터셋이 한 글자 당 1바이트인 경우 (예, ASCII)

원격 서버의 CHAR, VARCHAR 데이터 타입의 단위를 BYTE로 생성한 경우 가능한 캐릭터셋 예제
| 지역 서버 캐릭터셋 | 1 글자 크기 | 원격 서버 캐릭터셋 | 1 글자 크기 |
|-------------|----------------|-------------|-----------------|
| ASCII       | 1              | ASCII       | 1               |
| MS949       | 2              | MS949       | 2               |
| MS949       | 2              | KSC5601     | 2               |
| MS949       | 2              | UTF-8       | 3               |
| UTF-8       | 3              | UTF-8       | 3               |

예제
```sql
-- 원격 서버에 캐릭터(BYTE) 단위로 CHAR 데이터 타입 칼럼 생성
iSQL> EXEC REMOTE_EXECUTE_IMMEDIATE('link1', 'CREATE TABLE t1(c1 CHAR(40), c2 integer)');
Execute success.
iSQL> EXEC REMOTE_EXECUTE_IMMEDIATE('link1', 'INSERT INTO t1 VALUES(''한글 테스트'', 3)');
Execute success.
iSQL> SELECT * FROM T1@link1;
C1                              C2
-----------------------------------------------
한글 테스트                     3
1 row selected.

-- 지역 서버(Altibase)에 같은 스키마를 가진 테이블 생성
iSQL> CREATE TABLE T1 ( C1 CHAR( 40 ), c2 integer );
Create success.

iSQL> CREATE OR REPLACE PROCEDURE PROC1
            AS
            CURSOR CUR1 IS
            SELECT * FROM REMOTE_TABLE(link1,'SELECT * FROM T1 ORDER BY C2');
        BEGIN
            FOR M IN CUR1
            LOOP
                INSERT INTO T1 VALUES(M.C1, M.C2);
        END LOOP;
        END;
        /
Create success.


iSQL> EXEC PROC1;
Execute success.
iSQL> SELECT C1 FROM T1 ORDER BY C2;
C1
----------------------------------
한글 테스트
1 row1 selected.
```

**2로 설정 하는 경우**

- 원격 서버의 캐릭터셋이 한 글자 당 2바이트이고 원격 서버의 CHAR, VARCHAR 타입의 단위가 CHAR인 경우

  | 지역 서버 캐릭터셋 | 1 글자 크기 | 원격 서버 캐릭터셋 | 1 글자 크기 |
  | :----------------: | :---------: | :----------------: | :---------: |
  |       MS949        |      2      |       MS949        |      2      |
  |       MS949        |      2      |      KSC5601       |      2      |


예제) 지역 서버와 원격 서버의 캐릭터셋이 MS949이고 CHAR 데이터 타입 단위를 CHAR로 생성

```sql
-- 원격 서버에 캐릭터(CHAR) 단위로 CHAR 데이터 타입 칼럼 생성
iSQL> EXEC REMOTE_EXECUTE_IMMEDIATE('link1', 'CREATE TABLE t1(c1 CHAR(20 char), c2 integer)');
Execute success.
iSQL> EXEC REMOTE_EXECUTE_IMMEDIATE('link1', 'INSERT INTO t1 VALUES(''일이삼사오육칠팔구십'', 3)');
Execute success.
iSQL> SELECT * FROM T1@link1;
C1 C2
---------------------------------------------------------
일이삼사오육칠팔구십 3
1 row selected.
 
-- 지역 서버(Altibase)에 테이블 생성 시 원격 서버 테이블의 스키마를 바이트단위로 계산해서 생성 (원격 칼럼 크기(20) * 한 글자 크기(2) = 40으로 선언)
iSQL> CREATE TABLE T1 ( C1 CHAR( 40 ), c2 integer );
Create success.
iSQL> CREATE OR REPLACE PROCEDURE PROC1
 AS
 CURSOR CUR1 IS
 SELECT * FROM REMOTE_TABLE(link1,'SELECT * FROM T1 ORDER BY C2');
 BEGIN
 FOR M IN CUR1
 LOOP
 INSERT INTO T1 VALUES(M.C1, M.C2);
 END LOOP;
 END;
 /
Create success.
 
iSQL> EXEC PROC1;
Execute success.
iSQL> SELECT C1 FROM T1 ORDER BY C2;
C1
--------------------------------------------
일이삼사오육칠팔구십
1 row selected.
```

**3으로 설정 하는 경우**

원격 서버의 캐릭터셋이 한 글자 당 3바이트이고 원격 서버의 CHAR, VARCHAR 타입의 단위가 CHAR인 경우

| 지역 서버 캐릭터셋 | 1 글자 크기 | 원격 서버 캐릭터셋 | 1 글자 크기 |
|:-----------:|:--------------:|:-----------:|:---------------:|
| UTF-8       | 3              | UTF-8       | 3               |

예제
```sql
-- 원격 서버에 캐릭터(CHAR) 단위로 CHAR 데이터 타입 칼럼 생성
iSQL> EXEC REMOTE_EXECUTE_IMMEDIATE('link1', 'CREATE TABLE t1(c1 CHAR(20 char), c2 integer)');
Execute success.
iSQL> EXEC REMOTE_EXECUTE_IMMEDIATE('link1', 'INSERT INTO t1 VALUES(''일이삼사오육칠팔구십'', 3)');
Execute success.
iSQL> SELECT * FROM T1@link1;
C1 C2
---------------------------------------------------------
일이삼사오육칠팔구십 3
1 row selected.

-- 지역 서버(Altibase)에 테이블 생성 시 원격 서버 테이블의 스키마를 바이트단위로 계산해서 생성(원격 칼럼 크기(20) * 한 글자 크기(3) = 60으로 선언)
iSQL> CREATE TABLE T1 ( C1 CHAR( 60 ), c2 integer );
Create success.
iSQL> CREATE OR REPLACE PROCEDURE PROC1
 AS
 CURSOR CUR1 IS
 SELECT * FROM REMOTE_TABLE(link1,'SELECT * FROM T1 ORDER BY C2');
 BEGIN
 FOR M IN CUR1
 LOOP
 INSERT INTO T1 VALUES(M.C1, M.C2);
 END LOOP;
 END;
 /
Create success.
 
iSQL> EXEC PROC1;
Execute success.
iSQL> SELECT C1 FROM T1 ORDER BY C2;
C1
--------------------------------------------
일이삼사오육칠팔구십
1 row selected.
```

