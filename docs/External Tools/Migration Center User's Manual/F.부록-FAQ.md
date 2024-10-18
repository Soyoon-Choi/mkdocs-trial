# F.부록: FAQ

### DBMS 공통

#### 데이터 이관 중에 OutOfMemoryError가 발생한다.

`원인`

다수의 쓰레드들이 대상 데이터베이스에 배치작업으로 데이터를 삽입하는 과정에서 메모리가 부족하여 발생할 수 있다.

`해결 방법`

OutOfMemoryError에서 출력한 에러 메시지에 따라 아래와 같이 3가지 경우로 나눌 수 있다.

- `<Java heap space>`

  상황에 따라 아래 작성된 두 가지 방법을 선택해 적용한다.

  - 메모리 사용량을 낮추도록 성능 프로퍼티 값 변경

    1. 프로젝트를 연다.
    2. 메뉴 Migration -\> Migration Options를 클릭한다.
    3. Batch Size와 Thread Count의 값을 낮춘다.

  - 프로그램이 사용할 수 있는 최대 메모리 크기 증가

    1. 실행 파일(migcenter.bat 또는 migcenter.sh)을 편집기로 연다.

    2. JVM 내 heap 최대 크기를 정하는 옵션 -Xmx의 값을 기존 값보다 높게 설정한다.

    > Note: Windows 32 bit machine에서는 OS dependency로 인해 Xmx 값을 최대 1.5 GB까지 설정할 수 있다.

- `<PermGen space>`

  1. 실행 파일(migcenter.bat 또는 migcenter.sh)을 편집기로 연다.

  2. JVM 내 permanent generation space의 최대 크기를 정하는 옵셥 -XX:MaxPermSize의 값을 기존 값보다 크게 설정한다.

- `<Metaspace>`

  사용중인 JVM의 버전이 Java 8 이상인 경우, Metaspace의 공간 부족이 원인일 수 있다. Java 8부터 구현된 Metaspace는 PermGen (permanent generation space)의 대체제이다.

  1. 실행 파일(migcenter.bat 또는 migcenter.sh)을 편집기로 연다.

  2. JVM 내 permanent generation space의 최대 크기를 정하는 옵션 -XX:MaxPermSize를
     metaspace의 최대 크기를 정하는 옵션으로 변경한 뒤, 기존 값보다 높게 수정한다.
     - 변경 전 : -XX:MaxPermSize=128m

     - 변경 후 : -XX:MaxMetaspaceSize=256m

- 참고

  - <https://dzone.com/articles/java-8-permgen-metaspace>
  - <https://www.infoq.com/articles/Java-PERMGEN-Removed>

#### 데이터 타입이 LOB인 테이블 컬럼의 NOT NULL 제약조건이 이관되지 않는다.

`원인`

마이그레이션 센터가 LOB 컬럼의 NOT NULL 제약조건을 임의로 제거하여 발생하는 현상이다.

마이그레이션 센터는 파라미터가 포함된 쿼리문(예: insert into tablename values(?,?))을 사용해서 대상 DB에 데이터를 삽입한다.

Altibase는 다른 컬럼과는 달리 LOB 컬럼에 데이터를 입력할 경우에는 먼저 데이터를 null로 초기화한 다음, LOB Locator를 통해 데이터를 받아서 입력하는 두 단계로 처리한다. 따라서 해당 컬럼에 NOT NULL 제약조건이 있다면 데이터를 null로 초기화할 수 없어서 insert가 실패하게 된다.

이런 제약 때문에, 마이그레이션 센터는 LOB 컬럼의 NOT NULL 제약조건을 임의로 제거해서 마이그레이션을 수행한다.

이러한 내용은 아래 매뉴얼에서 확인할 수 있다. (General Reference - 1. 자료형 - LOB 데이타 타입 - 제한사항)

오라클은 커밋 시에만 제약 조건에 대한 검사를 수행하기 때문에, 위와 같은 조건에서도 데이터를 삽입할 수 있다.

`해결 방법`

이관 후, Altibase에서 해당 컬럼에 NOT NULL 제약조건을 추가하는 SQL문을 실행한다.

#### Database 문자 집합 관련 주의사항

기본적으로 원본 데이터베이스와 대상 데이터베이스의 DB 문자 집합을 동일하게 지정하여 사용하기를 권장한다. 

만약 특수한 상황 때문에 문자 집합을 다르게 지정해야 한다면, 각각의 DB 문자 집합 호환 여부를 꼭 확인해야 한다. 호환되지 않는 문자 집합 간의 이관을 강제 수행할 경우, 데이터가 깨지게 된다.

`사례 1 : 원본 데이터베이스 KSC5601에서 대상 데이터베이스 UTF8`  `이관 가능`

KSC5601 한글 데이터는 UTF8로 표기될 수 있다. 따라서 각각의 문자 집합은 서로 호환된다. 

Note: 데이터 길이가 더 길어질 수 있으므로 테이블 객체 이관 시 문자형 타입 컬럼은 사이즈를 늘려야 한다.

`사례 2 : 원본 데이터베이스 KSC5601에서 대상 데이터베이스 GB231280` `이관 불가능`

KSC5601 한글 데이터는 GB231280으로 표기될 수 없다. 따라서 각각의 문자 집합은 서로 호환되지 않는다. 이러한 조건에서 꼭 데이터 이관이 필요한 경우, 대상 데이터베이스의 테이블 컬럼 데이터타입 CHAR, VARCHAR를 모두 NCHAR, NVARCHAR로 변경한 뒤, 데이터 이관을 수행해야 한다.

`JDBC & 마이그레이션 센터의 문자 집합 처리 과정`

1. 원본 데이터베이스로부터 데이터를 fetch할 때, char 데이터를 원본 데이터베이스 DB 문자 집합 포맷으로 가져와 바이트 배열에 저장한다.

2. 바이트 배열에 저장된 데이터를 UTF-16 형태로 변환하여 Java 기본 타입인 String 객체에 저장한다.

3. 대상 데이터베이스에 데이터를 삽입하는 PreparedStatement 객체에 setString 함수로 해당 String 객체를 전달한다.

4. JDBC 드라이버 내부에서 대상 데이터베이스의 DB 문자 집합에 맞춰 데이터를 변환하고 삽입한다.

#### JDBC 드라이버 파일 선택 중 프로그램이 비정상 종료한다.

`원인`

Windows 환경에서 마이그레이션 센터를 실행할 때 발생할 수 있는 오류이다. 연결정보 등록 시 JDBC 드라이버 파일을 선택하던 중, 디렉토리를 변경하면 프로그램이 비정상 종료되는 문제가 나타날 수 있다. JVM과 Windows 운영체제 사이의 커뮤니케이션 문제로 인해 발생하는 Java JVM crash이다. 아래 링크를 통해, 오래된 버전의 JVM에서 발생하는 Java crash 문제를 확인할 수 있다. <http://www.java.com/en/download/help/error_hotspot.xml>

`해결 방법`

최신 버전의 JRE를 설치하고 migcenter.bat 파일 내의 JAVA_HOME 경로를 수정한 뒤, 마이그레이션 센터를 재실행한다.

#### CLI 모드로 실행 시, UnsatisfiedLinkError: /usr/lib/jvm/java-8-oracle/jre/lib/amd64/libawt_xawt.so: libXrender.so.1: cannot open shared object file: No such file or directory 발생

JVM에서 64-bit libXrender.so 파일을 요청했지만, OS에 해당 패키지가 설치되지 않았을 때 발생하는 오류이다. 해당 패키지는 AWT나 Swing을 포함한 64-bit 어플리케이션을 실행할 때 필요하다.

`원인`

주로 64비트 장비에  32비트 JRE를 설치한 뒤, 이를 사용하여 자바 프로그램을 실행하려 할 때 발생한다.

`해결 방법`

장비의 비트 값에 맞는 JRE를 새로 설치한 뒤, JAVA_HOME을 해당 위치로 변경한다.
데비안 계열의 리눅스는 아래와 같은 명령어를 실행하여 패키지를 설치한다.

~~~bash
sudo apt-get install libXrender1
~~~

`참고`

- http://www.jmeter-archive.org/Bug-in-running-Jmeter-on-Ubuntu-12-04-td5722692.html
- https://www.spigotmc.org/threads/bungeecord-not-starting-up-on-java-8.24652/ 

#### 마이그레이션 센터 실행시 "Could not create the java virtual machine" 메세지를 출력하고 시작 실패한다.

`원인`

bat, sh에서 설정된 최대 메모리 할당값(`-Xmx`) 자바 옵션이 시스템에서 할당 가능한 메모리보다 더 큰 경우 발생 가능한 오류이다. 특히 Windows O/S 32bit에서 자주 리포팅되는 오류이다. 

`해결 방법`

bat, sh에서 -Xms -Xmx 값을 사용자 환경에 맞춰 변경한 뒤, Migration Center를 재실행한다.

### Oracle

#### 오류 메시지 'ORA-01652 unable to extend temp segment by 128 in tablespace TEMP'가 출력된다.

`원인`

대용량 쿼리 처리 중, 오라클의 임시 테이블스페이스 공간이 부족하여 발생한 에러이다.

`해결 방법`

해당 사용자가 사용하는 임시 테이블스페이스 공간을 확장해야 한다.

#### Run 단계 수행 중, 오류 메시지 'Fetch data from source database has been failed. Stream has already been closed'와 함께 일부 데이터의 이관이 실패한다.

`원인`

한글 환경에서는 `Fetch data from source database has been failed. 스트림이 이미 종료되었습니다.`라는 메시지로 출력되기도 한다.

LONG 또는 LONG RAW 컬럼과 LOB 컬럼이 함께 들어있는 테이블은 데이터 이관 중 문제가 발생할 수 있다. 아래는 [Oracle JDBC Developer's Guide](https://docs.oracle.com/cd/E11882_01/java.112/e16548/jstreams.htm#JJDBC28411)에서 발췌한 내용이다.

> 12. *Java Streams in JDBC - Streaming LONG or LONG RAW Columns*
>
> *Because the column data remains in the communications channel, the streaming mode interferes with all other use of the connection. Any use of the connection, other than reading the column data, will discard the column data from the channel.*

LONG 또는 LONG RAW 컬럼의 데이터 전송은 스트림을 통해 이루어지는데, 이 데이터 전송 시점에 해당 Connection을 이용한 다른 데이터 타입의 스트림 전송은 방해 받는다고 기술되어있다. 이는 LONG 또는 LONG RAW 컬럼과 LOB 컬럼이 하나의 테이블 내에 있을 경우, 해당 테이블의 데이터 이관 성공 여부를 보장할 수 없음을 의미한다. 또한 위와 같은 이유로 오라클에서는 이러한 구성을 사용하지 않도록 권고하고 있다.

`해결 방법`

해당 테이블은 마이그레이션 센터를 통해 데이터 이관을 수행할 수 없다.

#### Reconcile 단계를 시작할 때, 오류 메시지 'Unable to find any volatile tablespace to store temporary tables in the destination database'가 출력된다.

`원인`

원본 데이터베이스인 오라클의 이관 객체 목록 중, 전역 임시 테이블(global temporary table)이 존재할 경우, 반드시 대상 데이터베이스인 Altibase에 휘발성 테이블스페이스가 존재해야 한다. 오라클의 전역 임시 테이블은 Altibase의 임시 테이블로 이관되며, Altibase의 임시 테이블은 휘발성 테이블스페이스에만 저장 가능하기 때문이다. (매뉴얼 참조: SQL Reference - 3. 데이터 정의어 - CREATE TABLE -설명)

Reconcile 단계를 수행할 때, 마이그레이션 센터는 사용자가 접근 가능한 Altibase 테이블스페이스들의 목록을 가져와 데이터베이스 간 테이블스페이스 및 테이블 맵핑을 시도한다. 이 때, 오라클에 존재하는 전역 임시 테이블과 맵핑할 Altibase의 휘발성 테이블스페이스가 없을 경우, 이러한 오류가 발생한다.

`해결 방법`

대상 데이터베이스인 Altibase에 휘발성 테이블스페이스를 생성하고 접근 권한을 부여한 뒤, 다시 reconcile 단계를 수행한다.

#### 데이터 이관 중에 SQLException: Protocol violation(프로토콜 위반)이 발생한다.

`원인`

통신 중에 OOM 에러가 발생하여 이를 분실하고, 프로토콜 위반 에러를 반환하였다.

`해결 방법`

프로그램이 사용할 수 있는 최대 메모리 크기를 키운다.

1. 실행 파일(migcenter.bat 또는 migcenter.sh)을 편집기로 연다.
2. JVM 내 heap 최대 크기를 정하는 옵션 -Xmx의 값을 기존 값보다 크게 수정한다.

`참고`

- https://stackoverflow.com/questions/29372626/sqlexception-protocol-violation-in-oracle

- https://stackoverflow.com/questions/18227868/protocol-violation-oracle-jdbc-driver-issue?rq=1

#### 데이터 이관 중에 OutOfMemoryError가 발생한 이후에 여러 다양한 SQLException 들이 발생할 수 있다.

대량의 데이터 이관 중에 오라클에서 fetch 또는 bind 관련 SQLException이 여러 건 발생하는 경우가 있다. 이런 경우, 테이블 모드에서 해당 테이블 한 개만 이관해서 성공한다면, OOM으로 인한 오류를 의심해 볼 수 있다.

~~~java
Caused by: java.sql.SQLException: Fail to convert to internal representation
at oracle.jdbc.driver.CharCommonAccessor.getBigDecimal(CharCommonAccessor.java:414)

Invalid column type: getCLOB not implemented for class oracle.jdbc.driver.T4CVarcharAccessor
~~~

`원인`

Oracle JDBC driver 내부적으로 OOM 발생 이후 다양한 오동작이 가능하다. 

`해결 방법`

[DBMS 공통](#dbms-공통)에서 [OutOfMemoryError 항목](#데이터-이관-중에-outofmemoryerror가-발생한다) 참조.

#### 빌드 단계에서 NullPointerException 이 발생할 수 있다.

원본 데이터베이스가 Oracle 9i, 10인 경우 Oracle JDBC 드라이버 호환성 오류로 인해 build 단계에서 아래와 같은 NullPointerException이 발생할 수 있다.

```
Fail to retrieve Source DDL: java.lang.NullPointerException
at oracle.jdbc.driver.T4C8Oall.getNumRows(T4C8Oall.java:1046)
at oracle.jdbc.driver.T4CPreparedStatement.executeForRows(T4CPreparedStatement.java:1047)
at oracle.jdbc.driver.OracleStatement.executeMaybeDescribe(OracleStatement.java:1207)
at oracle.jdbc.driver.OracleStatement.doExecuteWithTimeout(OracleStatement.java:1296)
at oracle.jdbc.driver.OraclePreparedStatement.executeInternal(OraclePreparedStatement.java:3608)
at oracle.jdbc.driver.OraclePreparedStatement.executeQuery(OraclePreparedStatement.java:3652)
at oracle.jdbc.driver.OraclePreparedStatementWrapper.executeQuery(OraclePreparedStatementWrapper.java:1207)
at com.altibase.migLib.meta.SrcDbMeta_Oracle_9_0_0_0.getSrcDdlDbmsMetaData(SrcDbMeta_Oracle_9_0_0_0.java:2251)
```

`원인`

Oracle JDBC 드라이버 호환성 문제

`해결 방법`

MigrationCenter의 Oracle용 JDBC 드라이버 파일을 사용중인 Oracle DBMS의 JDBC 드라이버 파일로 교체한다.

### MS-SQL

#### MS-SQL 연결정보를 등록할 때, “Test” 버튼을 누르면 접속에 실패하는 오류 메시지가 출력될 수 있다.

`원인`

연결정보 등록 중 Test 버튼을 눌렀을 때, 오류 메시지와 함께 접속에 실패한다.

MS-SQL 연결정보를 등록할 때, Test 버튼을 누르면 아래와 같은 오류 메시지가 출력될 수 있다.

- `Migration Center can support MS-SQL user who has a single schema only.`

- `User doesn't have appropriate schema in target database.`

연결정보의 사용자가 가진 스키마 관계가 Altibase와 호환 불가능한 상태이기 때문에, 등록이 허용되지 않는다.

MS-SQL은 Altibase와 사용자와 스키마 간의 관계가 다르다. Altibase는 각 사용자에게 하나의 스키마가 할당되며, 데이터베이스 객체가 해당 스키마에 종속되는 구조이다. 이에 반해 MS-SQL은 한 사용자가 복수의 스키마를 소유할 수 있으며, 각 스키마에 데이터베이스 객체가 종속된다. 이러한 차이로 인해 마이그레이션 센터는 MS-SQL
사용자가 하나의 스키마만을 소유한 경우에만 연결정보 등록을 허용한다.

따라서, MS-SQL 사용자가 스키마를 소유하지 않거나 복수의 스키마를 소유한 경우에는 연결정보를 등록할 수 없다.

`해결 방법`

연결정보의 사용자가 하나의 스키마만 갖도록 수정한다.

#### 연결정보 등록 중 “Test” 버튼을 눌렀을 때, 프로그램이 멈춘다.

`원인`

장비에 설치된 JVM과 마이그레이션 센터에 내장된 JVM 간의 충돌이 원인으로 추정된다. 실행파일 migcenter.bat로 마이그레이션 센터를 시작하면 제품에 내장된 JRE를 통해 실행되는데, 실행 장비의 운영체제가 Windows 이고 이미 JRE이 설치되어 있을 때 이러한 문제가 발생할 수 있다.

`해결 방법`

실행 파일 migcenter.bat를 편집기로 열어, 환경변수 JAVA_HOME의 값을 장비에 기존에 설치된 JRE 위치로 변경해야 한다. 변경할 JRE는 반드시 8 이상이어야 한다.

#### 오류 메시지 'Unable to insert (or update) NULL into NOT NULL column.'와 함께 데이터 이관에 실패한다.

`원인`

MS-SQL에서 NOT NULL 제약조건이 걸린 테이블 컬럼에 길이가 0인 문자열이 삽입되어 있기 때문이다.

Altibase에서는 길이가 0인 문자열은 NULL을 의미하기 때문에, NOT NULL 제약조건이 걸린 테이블 컬럼에 길이가 0인 문자열을 삽입하는 것을 허용하지 않는다.

`해결 방법`

Reconcile 단계 - DDL Editing에서 해당 테이블의 Destination DDL로부터 NOT NULL 제약 조건을 삭제한 뒤, `Save` 버튼을 클릭하여 저장한다.

#### 중복된 외래키의 이관이 실패한다.

`원인`

MS-SQL에서 외래키가 중복 생성되어 있는 경우, Altibase에서는 이를 허용하지 않기 때문에 중복된 외래키 중 하나만 이관된다.

`해결 방법`

Run 단계 수행 후 생성된 리포트의 Missing 탭에서 이관에 실패한 외래키를 확인할 수 있다.

#### 오류 메세지 'The server selected protocol version TLS10 is not accepted by client preferences'와 함께 서버 접속이 실패한다.

`원인`

Migration Center를 구동하는데 사용한 Java Runtime Environment (JRE) 의 기본 TLS 버전이 1.2 이상으로 변경되었는데, MS-SQL 서버에서 해당 TLS 버전을 지원하지 않아서 발생한 오류이다.

`해결 방법`

$JAVA_HOME/jre/lib/security/java.security 파일의 jdk.tls.disabledAlgorithms 항목에서 TLSv1, TLSv1.1을 제거하면 이전 버전의 TLS를 사용 가능하다. 

~~~java
//jdk.tls.disabledAlgorithms=SSLv3, TLSv1, TLSv1.1, RC4, DES, MD5withRSA, 
jdk.tls.disabledAlgorithms=SSLv3, RC4, DES, MD5withRSA, 
~~~

TLS 1.2 이상 버전을 의무적으로 사용해야 한다면, [KB3135244 - TLS 1.2 support for Microsoft SQL Server](https://support.microsoft.com/en-us/topic/kb3135244-tls-1-2-support-for-microsoft-sql-server-e4472ef8-90a9-13c1-e4d8-44aad198cdbe)를 참조하여 Windows, MS-SQL 서버, MS-SQL JDBC 드라이버 파일을 업데이트 해야 한다.

#### 마이그레이션 센터를 실행하는 자바 버전과 맞지 않은 JDBC 드라이버를 사용하면 Unable to connect to DB. javax/xml/bind/DatatypeConverter 에러가 발생할 수 있다.

자바 11 이상에서 마이그레이션 센터를 실행하고 JRE 10 이하 버전의 JDBC 드라이버를 사용하면 Unable to connect to DB. javax/xml/bind/DatatypeConverter 에러가 발생한다.

`원인`

JRE 10 이하 버전의 JDBC 드라이버에서 javax.xml.bind 모듈을 참조하여 발생하는 에러이다. javax.xml.bind 모듈은 자바 11 이상에서 제거되었다. 

`해결 방법`

마이그레이션 센터를 실행하는 자바 버전에 해당하는 JDBC 드라이버 파일을 사용한다. 

예) mssql-jdbc-7.2.2.***jre11***.jar

<br/>

### Altibase

#### 버전 5.1.5 이하의 Altibase를 이관할 때, 문자가 깨진다.

`원인`

버전 5.1.5 이하의 Altibase는 globalization을 지원하지 않아 JDBC가 데이터베이스의 문자 집합 을 알 수 없다.

`해결 방법`

마이그레이션 센터 내 해당 데이터베이스 연결정보의 인코딩 옵션에 대상 데이터베이스에 설정된 문자 집합 값(예, KSC5601)을 넣어야 한다. Altibase 캐릭터 셋 확인 방법은 다음과 같다.

- Altibase 4.3.9 \~ 5.1.5 버전

  ~~~sql
  SELECT VALUE1 FROM V$PROPERTY WHERE NAME = 'NLS_USE';
  ~~~

- Altibase 5.3.3 버전 이상

  ~~~sql
  SELECT NLS_CHARACTERSET FROM V$NLS_PARAMETERS;
  ~~~

#### Reconcile 단계의 “Tablespace to Tablespace Mapping”에 특정 테이블스페이스가 나오지 않는다.

`원인`

마이그레이션 센터에 접속중인 Altibase의 사용자가 해당 테이블스페이스에 대한 접근 권한이 없어서 발생한다.

`해결 방법`

Altibase 사용자에게 해당 테이블스페이스에 대한 접근 권한을 부여한다.

#### 버전 4.5.1.0 이하의 알티베이스를 이관할 때, 데이터타입이 BLOB, byte, nibble인 컬럼의 정보를 가져오는데 실패한다.

`원인`

해당 버전의 알티베이스 JDBC driver가 BLOB, byte, nibble 데이터타입을 UNKOWN으로 리턴하여 컬럼의 데이터타입을 알 수 없다. 

`해결 방법`

BLOB, byte, nibble 데이터타입을 가진 테이블은 aexport와 iloader를 사용하여 이관한다.

#### Altibase 6.1.1 이하 버전으로부터 이관된 데이터타입 bit, varbit, nibble의 일부 데이터가 원본 데이터베이스와 일치하지 않는다.

`원인`

알티베이스 6.1.1 이하 버전의 JDBC driver가 batch execution으로 bit, varbit, 또는 nibble 타입 데이터를 삽입할 때, 일부 데이터를 정상적으로 이관하는데 실패한다.

`해결 방법`

프로젝트를 열고 메뉴 Migration - Migration Option을 클릭하여 Batch Execution을 'No'로 선택한 뒤, 데이터 이관을 수행한다.

<br/>

### Informix

#### 데이터 이관 중에 Informix JDBC Driver에서 java.sql.SQLException: Encoding or code set not supported. 발생

데이터 이관 중에 Informix에서 fetch 중에 아래와 같은 SQLException이 발생하였다. Informix DB에 Multi-byte 문자의 바이트가 잘린 채로 입력된 경우 이 값을 조회할 때 발생하는 exception이다.

```
java.sql.SQLException: Encoding or code set not supported.
at com.informix.util.IfxErrMsg.getSQLException(IfxErrMsg.java:412)
at com.informix.jdbc.IfxChar.fromIfx(IfxChar.java:235)
at com.informix.jdbc.IfxRowColumn.a(IfxRowColumn.java:380)
at com.informix.jdbc.IfxRowColumn.a(IfxRowColumn.java:282)
at com.informix.jdbc.IfxSqli.a(IfxSqli.java:4657)
at com.informix.jdbc.IfxResultSet.a(IfxResultSet.java:666)
at com.informix.jdbc.IfxResultSet.b(IfxResultSet.java:638)
at com.informix.jdbc.IfxResultSet.getString(IfxResultSet.java:724)
at com.altibase.migLib.run.databinder.DataBinder.getValuesFromSrc(DataBinder.java:445)
```

`원인`

Informix DB에 Multi-byte 문자의 바이트가 잘린 채로 입력된 경우 이 값을 조회할 때 해당 exception이 발생한다.

`해결 방법`

Informix 연결 속성에 IFX_USE_STRENC=true 를 추가한다.

`참고`

https://m.blog.naver.com/PostView.nhn?blogId=jangkeunna&logNo=70146227929&proxyReferer=https%3A%2F%2Fwww.google.co.kr%2F

<br/>

### MySQL

#### 테이블 컬럼의 데이터 타입이 크기가 1 또는 2인 VARCHAR나 CHAR일 때, 크기가 1인 데이터는 null로 이관된다.

`원인`

크기가 1인 데이터를 가져올 때 MySQL JDBC 드라이버가 null 값을 반환하는 것을 확인하였다면, MySQL JDBC 드라이버 문제로 판단된다.

`해결 방법`

드라이버를 5.0.8 버전의 MySQL Connector/J([link](https://dev.mysql.com/downloads/connector/j/5.0.html))로 교체해야 한다. 재시도에서도 같은 현상이 발생하면, 아래의 과정을 통해 Batch Execution을 취소한다.

1. 프로젝트를 연다.

2. 메뉴 Migration -\> Migration Options를 클릭한다.

3. Batch Execution의 값을 No로 변경한다.

#### 데이터 타입 CHAR, VARCHAR가 NCHAR, NVARCHAR로 변경된다.

`원인`

MySQL은 데이터 타입 NCHAR, NVARCHAR을 지원하지 않는다. 대신 CHAR, VARCHAR 컬럼의 속성으로 국가별 문자 집합(national character set)을 지정할 수 있다. 마이그레이션 센터는 이 국가별 문자 집합이 지정된 CHAR, VARCHAR 컬럼에 한해서 NCHAR, NVARCHAR로 변환한다.

`해결 방법`

해당 현상은 정상적인 동작이다.

Note: 기본 DataType Map에서 MySQL의 NVARCHAR가 Altibase의 NVARCHAR(10666)으로 맵핑되어있다.

MySQL과 Altibase 간 국가별 문자 집합의 글자 당 바이트 수가 서로 다를 경우, 이에 대한 고려 없이 이관을 수행하면 제한 바이트 수 초과로 스키마를 생성하지 못하는 상황이 발생할 수도 있다. 이러한 상황을 피하기 위해, 마이그레이션 센터는 기본적으로 NVARCHAR의 크기를 고정하였다.

만약 해당 테이블 컬럼의 데이터 크기가 크지 않다면, 아래와 같은 절차를 수행하여 원본 데이터베이스의 크기를 그대로 이관할 수 있다.

1. Reconcile 단계: Data Type Mapping에서 NVARCHAR 행 클릭 

2. Change 버튼을 클릭

3. Destination DB Data Type으로 NVARCHAR를 선택하고 Precision을 빈칸으로 둔 뒤, 저장한다.

<br/>

### TimesTen

#### 연결정보 등록 중, “Test” 버튼 클릭 시 오류 메시지 'Problems with loading native library/missing methods: no ttJdbcCS in java.library.path'가 출력된다.

`원인`

TimesTen Type 2 JDBC가 native 라이브러리를 로딩하는데 실패하였을 때 출력되는 메시지이다.

`해결 방법`

마이그레이션 센터를 실행하려는 장비에 TimesTen 클라이언트 패키지를 설치 한 뒤, 마이그레이션 센터를 재실행한다. 해당 장비의 운영체제가 리눅스인 경우에는, 클라이언트 패키지를 설치한 뒤 LD_LIBRARY_PATH에 설치된 클라이언트 패키지의 lib 디렉토리 경로를 추가해야 한다.

#### 연결정보 등록 중, “Test” 버튼 클릭 시 오류 메시지 'Problems with loading native library/missing method: \~\\bin\\ttJdbcCS1122.dll: Can't load AMD 64-bit.dll on a IA 32-bit platform'가 출력된다.

`원인`

마이그레이션 센터가 사용하고 있는 JRE와 TimesTen 클라이언트 패키지의 비트 수가 일치하지 않을 때 위의 메시지가 출력된다.

`해결 방법`

실행 파일(migcenter.bat 또는 migcenter.sh)을 편집기로 열어 환경변수 JAVA_HOME의 값을 변경한다. 설치된 TimesTen 클라이언트 패키지의 비트 수에 맞는 JRE의 경로를 환경변수 JAVA_HOME으로 지정한 뒤, 마이그레이션 센터를 재실행한다.

#### 연결정보 등록 중, “Test” 버튼 클릭 시 오류 메시지 'Data source name not found and no default driver specified'가 출력된다.

`원인`

연결정보에 입력된 DSN값이 잘못되었을 때 출력되는 메시지이다.

`해결 방법`

서버에 등록된 DSN을 DSN 칸에 입력한다.

#### 데이터베이스 연결 등록 및 수정 화면에서, “Test” 버튼 클릭 시 'Problems with loading native library/missing methods: Native Library /path/libttJdbcCS.so already loaded in another classloader' 오류 메시지가 발생한다.

`원인`

Native library를 사용하는 TimesTen type 2 JDBC driver를 로딩한 상태에서 so 파일을 다시 로딩할 때 Java classloader에서 발생하는 예외상황이다. 예를 들어, 연결 테스트를 수행한 후 다른 JDBC Driver를 선택하여 다시 테스트할 때 발생한다. Java Native Interface (JNI) specification에 따르면 native library는 한번만 로딩할 수 있다. 참고: https://docs.oracle.com/javase/1.5.0/docs/guide/jni/spec/invocation.html#library_version

`해결 방법`

마이그레이션 센터를 완전히 종료 후 재시작하여 데이터베이스 연결 등록을 하거나 연결 정보를 수정한다.

<br/>

### Tibero

#### 데이터베이스 연결 등록 및 수정 화면에서, "Test" 버튼 클릭 시 'Specified schema object was not found at: SELECT value FROM V$VERSION WHERE NAME = 'PRODUCT_MAJOR' OR NAME = 'TB_MAJOR' Please review your settings and correct any errors.' 오류 메시지가 발생한다.

`원인`

마이그레이션 센터 접속에 사용된 DB 사용자 계정이 DB 버전 확인을 위한 DICTIONARY 조회 권한이 없어서 발생하는 오류이다.

`해결 방법`

DB 사용자 계정에 DICTIONARY 조회 권한을 부여한다.

- Tibero 4 버전 이하

  버전 4는 DICTIONARY에 대한 시스템 권한이 없으므로, SELECT ANY TABLE 권한을 부여한다. SELECT ANY TABLE은 임의의 스키마에 속한 객체들을 조회할 수 있는 권한이다.

  ~~~sql
  GRANT SELECT ANY TABLE TO user_name;
  ~~~

- Tibero 5 버전 이상

  SELECT ANY DICTIONARY 권한을 부여한다. SELECT ANY DICTIONARY는 SYS, SYSCAT, SYSGIS 소유의 객체(DICTIONARY)를 조회할 수 있는 권한이다.

  ~~~sql
  GRANT SELECT ANY DICTIONARY TO user_name;
  ~~~

`참고`

- [https://www.tmaxtibero.com/img/service/pdf/manual/Tibero_4_SP1_Administrator's_Guide_v2.1.4.pdf](https://www.tmaxtibero.com/img/service/pdf/manual/Tibero_4_SP1_Administrator's_Guide_v2.1.4.pdf)
- [https://technet.tmaxsoft.com/upload/download/online/tibero/pver-20220224-000002/tibero_admin/chapter_security.html#sect_so_privilege](https://technet.tmaxsoft.com/upload/download/online/tibero/pver-20220224-000002/tibero_admin/chapter_security.html#sect_so_privilege)

