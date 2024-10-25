# A.부록: 데이터 타입 맵핑

이 부록은 Altibase의 데이터 타입과 JDBC 표준 데이터 타입, Java 데이터 타입간에
호환 여부를 기술한다.

### 데이터 타입 맵핑

아래의 표는 JDBC 데이터 타입, Altibase JDBC의 데이터 타입, 및 Java 언어의 타입
간에 기본적으로 맵핑되는 관계를 보여준다.

| JDBC 타입     | Altibase 타입 | Java 타입  |
|---------------|---------------|------------|
| CHAR          | CHAR          | String     |
| VARCHAR       | VARCHAR       | String     |
| LONGVARCHAR   | VARCHAR       | String     |
| NUMERIC       | NUMERIC       | BigDecimal |
| DECIMAL       | NUMERIC       | BigDecimal |
| BIT           | VARBIT        | BitSet     |
| BOOLEAN       | \-            | \-         |
| TINYINT       | SMALLINT      | Short      |
| SMALLINT      | SMALLINT      | Short      |
| INTEGER       | INTEGER       | Integer    |
| BIGINT        | BIGINT        | Long       |
| REAL          | REAL          | Float      |
| FLOAT         | FLOAT         | BigDecimal |
| DOUBLE        | DOUBLE        | Double     |
| BINARY        | BYTE          | byte[]     |
| VARBINARY     | BLOB          | Blob       |
| LONGVARBINARY | BLOB          | Blob       |
| DATE          | DATE          | Timestamp  |
| TIME          | DATE          | Timestamp  |
| TIMESTAMP     | DATE          | Timestamp  |
| CLOB          | CLOB          | Clob       |
| BLOB          | BLOB          | Blob       |
| ARRAY         | \-            | \-         |
| DISTINCT      | \-            | \-         |
| STRUCT        | \-            | \-         |
| REF           | \-            | \-         |
| DATALINK      | \-            | \-         |
| JAVA_OBJECT   | \-            | \-         |
| NULL          | \-            | null       |
| \-            | GEOMETRY      | byte[]     |

### Java 데이터형을 데이터베이스 데이터형으로 변환하기

아래의 표는 setObject 메소드를 사용해서 파라미터에 객체를 설정할 경우, 각 객체별로 어떠한 데이터베이스 데이터입으로 변환이 가능한지를 보여준다.

|                    | SMALLINT | INTEGER | BIGINT | REAL | FLOAT | DOUBLE | DECIMAL/NUMERIC | BIT | CHAR | VARCHAR/LONGVARCHAR | BINARY | VARBINARY/LONGVARBINARY | DATE | TIME | TIMESTAMP | BLOB | CLOB |
|--------------------|----------|---------|--------|------|-------|--------|-----------------|-----|------|---------------------|--------|-------------------------|------|------|-----------|------|------|
| Array              |          |         |        |      |       |        |                 |     |      |                     |        |                         |      |      |           |      |      |
| Blob               |          |         |        |      |       |        |                 |     |      |                     |        |                         |      |      |           | ○    |      |
| Boolean            | ○        | ○       | ○      | ○    | ○     | ○      | ○               | ○   | ○    | ○                   |        |                         |      |      |           |      |      |
| byte[]             |          |         |        |      |       |        |                 |     | ○    | ○                   | ○      | ○                       |      |      |           | ○    |      |
| char[]             | ○        | ○       | ○      | ○    | ○     | ○      | ○               | ○   | ○    | ○                   | ○      | ○                       | ○    | ○    | ○         |      | ○    |
| Clob               |          |         |        |      |       |        |                 |     |      |                     |        |                         |      |      |           |      | ○    |
| Double             | ○        | ○       | ○      | ○    | ○     | ○      | ○               | ○   | ○    | ○                   |        |                         |      |      |           |      |      |
| Float              | ○        | ○       | ○      | ○    | ○     | ○      | ○               | ○   | ○    | ○                   |        |                         |      |      |           |      |      |
| Integer            | ○        | ○       | ○      | ○    | ○     | ○      | ○               | ○   | ○    | ○                   |        |                         |      |      |           |      |      |
| Java class         |          |         |        |      |       |        |                 |     |      |                     |        |                         |      |      |           |      |      |
| BigDecimal         | ○        | ○       | ○      | ○    | ○     | ○      | ○               | ○   | ○    | ○                   |        |                         |      |      |           |      |      |
| java.net.URL       |          |         |        |      |       |        |                 |     |      |                     |        |                         |      |      |           |      |      |
| java.sql.Date      |          |         |        |      |       |        |                 |     | ○    | ○                   |        |                         | ○    | ○    | ○         |      |      |
| java.sql.Time      |          |         |        |      |       |        |                 |     | ○    | ○                   |        |                         | ○    | ○    | ○         |      |      |
| java.sql.Timestamp |          |         |        |      |       |        |                 |     | ○    | ○                   |        |                         | ○    | ○    | ○         |      |      |
| java.util.BitSet   |          |         |        |      |       |        |                 | ○   |      |                     |        |                         |      |      |           |      |      |
| Long               | ○        | ○       | ○      | ○    | ○     | ○      | ○               | ○   | ○    | ○                   |        |                         |      |      |           |      |      |
| Ref                |          |         |        |      |       |        |                 |     |      |                     |        |                         |      |      |           |      |      |
| Short              |          | ○       | ○      | ○    | ○     | ○      | ○               | ○   | ○    | ○                   |        |                         |      |      |           |      |      |
| String             | ○        | ○       | ○      | ○    | ○     | ○      | ○               | ○   | ○    | ○                   | ○      | ○                       | ○    | ○    | ○         |      |      |
| Struct             |          |         |        |      |       |        |                 |     |      |                     |        |                         |      |      |           |      |      |
| InputStream        |          |         |        |      |       |        |                 |     |      |                     |        |                         |      |      |           | ○    |      |
| Reader             |          |         |        |      |       |        |                 |     |      |                     |        |                         |      |      |           |      | ○    |

### 데이터베이스 데이터형을 Java 데이터형으로 변환하기

아래의 표는 데이터베이스의 각 데이터형에 대해 getXXX 메소드를 사용해서 변환이 가능한지를 보여준다.

|                    | SMALLINT | INTEGER | BIGINT | REAL | FLOAT | DOUBLE | DECIMAL/NUMERIC | BIT | CHAR/VARCHAR | LONGVARCHAR | BINARY | VARBINARY/LONGVARBINARY | DATE | TIME | TIMESTAMP | CLOB | BLOB |
|--------------------|----------|---------|--------|------|-------|--------|-----------------|-----|--------------|-------------|--------|-------------------------|------|------|-----------|------|------|
| getArray           |          |         |        |      |       |        |                 |     |              |             |        |                         |      |      |           |      |      |
| getAsciiStream     | ○        | ○       | ○      | ○    | ○     | ○      | ○               | ○   | ○            | ○           | ○      |                         | ○    | ○    | ○         |      |      |
| getBigDecimal      | ○        | ○       | ○      | ○    | ○     | ○      | ○               |     | ○            | ○           |        |                         |      |      |           |      |      |
| getBinaryStream    | ○        |         | ○      | ○    | ○     | ○      | ○               | ○   |              |             | ○      |                         | ○    | ○    | ○         |      |      |
| getBlob            |          |         |        |      |       |        |                 |     |              |             |        | ○                       |      |      |           | ○    |      |
| getBoolean         | ○        | ○       | ○      | ○    | ○     | ○      | ○               | ○   | ○            | ○           | ○      |                         |      |      |           |      |      |
| getByte            | ○        | ○       | ○      | ○    | ○     | ○      | ○               | ○   | ○            | ○           | ○      |                         |      |      |           |      |      |
| getBytes           | ○        | ○       | ○      | ○    | ○     | ○      | ○               | ○   |              |             | ○      |                         | ○    | ○    | ○         |      |      |
| getCharacterStream | ○        | ○       | ○      | ○    | ○     | ○      | ○               | ○   | ○            | ○           | ○      |                         | ○    | ○    | ○         |      |      |
| getClob            |          |         |        |      |       |        |                 |     |              |             |        |                         |      |      |           | ○    |      |
| getDate            |          |         |        |      |       |        |                 |     | ○            | ○           |        |                         | ○    | ○    | ○         |      |      |
| getDouble          | ○        | ○       | ○      | ○    | ○     | ○      | ○               | ○   | ○            | ○           | ○      |                         |      |      |           |      |      |
| getFloat           | ○        | ○       | ○      | ○    | ○     | ○      | ○               | ○   | ○            | ○           | ○      |                         |      |      |           |      |      |
| getInt             | ○        | ○       | ○      | ○    | ○     | ○      | ○               | ○   | ○            | ○           | ○      |                         |      |      |           |      |      |
| getLong            | ○        | ○       | ○      | ○    | ○     | ○      | ○               | ○   | ○            | ○           | ○      |                         |      |      |           |      |      |
| getObject          | ○        | ○       | ○      | ○    | ○     | ○      | ○               | ○   | ○            | ○           | ○      | ○                       | ○    | ○    | ○         | ○    | ○    |
| getRef             |          |         |        |      |       |        |                 |     |              |             |        |                         |      |      |           |      |      |
| getShort           | ○        | ○       | ○      | ○    | ○     | ○      | ○               | ○   | ○            | ○           | ○      |                         |      |      |           |      |      |
| getString          | ○        | ○       | ○      | ○    | ○     | ○      | ○               | ○   | ○            | ○           | ○      |                         | ○    | ○    | ○         |      |      |
| getTime            |          |         |        |      |       |        |                 |     | ○            | ○           |        |                         | ○    | ○    | ○         |      |      |
| getTimestamp       |          |         |        |      |       |        |                 |     | ○            | ○           |        |                         | ○    | ○    | ○         |      |      |
