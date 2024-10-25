# B.부록: 데이터형

이 부록은 Altibase의 데이터 타입과 SQL 데이터 타입, C 데이터 타입의 종류를
설명하고, 각각의 데이터 타입간에 변경이 가능한지 여부를 나타낸다.

### SQL 데이터형

ODBC 드라이버와 Altibase CLI가 Altibase SQL 데이터 타입을 ODBC 스펙에 정의된 SQL
type 식별자들에 어떻해 대응하는가에 대한 정보와 Altibase SQL 데이터 타입을 ODBC
스펙의 SQL type 식별자들에 어떻게 대응하는가에 대한 정보는 SQLGetTypeInfo()를
호출함으로서 반환된다.

ODBC 드라이버와 Altibase CLI가 어떤 데이터 타입을 지원하는가는
SQLGetTypeInfo()를 호출함으로서 알 수 있다.

다음 테이블은 Altibase CLI가 지원하는 SQL 데이터 타입들에 대한 유효한 SQL type
식별자들의 목록이다.

| SQL type 식별자    | ALTIBASE 데이터 타입 | 부연 설명                                                    |
| ------------------ | -------------------- | ------------------------------------------------------------ |
| SQL_CHAR           | CHAR(n)              | 고정된 길이(n)의 데이터 타입                                 |
| SQL_VARCHAR        | VARCHAR(n)           | 가변 길이의 데이터 타입: FIXED로 선언했을 경우는 명시된 크기 만큼 저장소의 크기가 설정, VARIABLE로 선언했을 경우는 명시된 크기 내에서 가변 길이를 가짐 |
| SQL_WCHAR          | NCHAR(n)             | 고정된 길이(n)의 유니코드 문자형 데이터 타입. N은 문자 개수임 |
| SQL_WVARCHAR       | NVARCHAR(n)          | 가변 길이의 유니코드 문자형 데이터 타입: FIXED로 선언했을 경우는 명시된 크기 만큼 저장소의 크기가 설정, VARIABLE로 선언했을 경우는 명시된 크기 내에서 가변 길이를 가짐. N은 문자 개수임 |
| SQL_DECIMAL        | DECIMAL(p, s)        | NUMERIC 데이터 타입과 동일한 데이터 타입                     |
| SQL_NUMERIC        | NUMERIC(p, s)        | Precision과 scale을 가지는 숫자형 데이터 타입으로 precision 만큼의 유효 숫자와 scale 만큼의 소수점이하 정밀도를 가지는 고정 소수점형 (1\<=p\<=38, -84\<=s\<=126) |
| SQL_SMALLINT       | SMALLINT             | 2 bytes 크기의 데이터 타입 (-2^15+1 \~ 2^15-1)               |
| SQL_INTEGER        | INTEGER              | 4 bytes 크기의 데이터 타입 (-2^31+1 \~ 2^31-1)               |
| SQL_BIGINT         | BIGINT               | 8 bytes 크기의 데이터 타입 (-2^63+1 \~2^63-1)                |
| SQL_REAL           | REAL                 | C의 FLOAT과 동일한 데이터 타입                               |
| SQL_FLOAT          | FLOAT(p)             | \-1E+120에서 1E+120까지의 부동 소수점 숫자 데이터 (1\<=p\<=38) |
| SQL_DOUBLE         | DOUBLE               | C의 DOUBLE과 동일한 데이터 타입                              |
| SQL_BLOB           | BLOB                 | 최대 4GB-1Byte 길이를 가지는 가변길이 이진 데이터 타입    |
| SQL_CLOB           | CLOB                 | 최대 4GB-1Byte 길이를 가지는 가변길이 문자 데이터 타입    |
| SQL_TYPE_DATE      | DATE                 | 날짜를 표현하는 데이터 타입                                  |
| SQL_TYPE_TIME      | DATE                 | 날짜를 표현하는 데이터 타입                                  |
| SQL_TYPE_TIMESTAMP | DATE                 | 날짜를 표현하는 데이터 타입                                  |
| SQL_INTERVAL       | \-                   | DATE – DATE의 결과 타입                                      |
| SQL_BYTES          | BYTE(n)              | 명시된 크기(n)만큼 고정된 길이를 가지는 이진 데이터 타입 (1 byte\<=n\<=32000 bytes) |
| SQL_NIBBLE         | NIBBLE(n)            | 명시된 크기(n)만큼 가변 길이를 가지는 이진 데이터 타입 (1 character\<=n\<=254 characters) |
| SQL_GEOMETRY       | GEOMETRY             | 내부적으로 7개의 데이터 타입(Point, LineString, Polygon, GeometryCollection, MultiLineString, MultiPolygon, MultiPoint)의 속성을 함축하고 있으며 이 함축된 속성은 각 타입에 따라 지원되는 함수로서 구분 가능: FIXED로 선언했을 경우는 고정길이의 저장 공간을 사용하고, VARIABLE로 선언했을 경우는 가변 길이의 저장 공간을 사용 |

### C 데이터형

C 데이터 타입들은 애플리케이션에서 데이터를 저장하기 위해 사용되는 C 버퍼의
데이터 타입을 나타낸다.

C 데이터 타입은 *type* 인자와 함께 SQLBindCol()과 SQLGetData()에 그리고 cType과
함께 SQLBindParameter()에 명시된다.

다음 테이블은 C 데이터 타입에 대해 유효한 타입 식별자들의 목록이다. 또한,
테이블은 각 식별자에 해당하는 ODBC 스펙의 C 데이터 타입과 이 데이터 타입의
정의를 나열한다.

| C Type 식별자        | ODBC C typedef       | C type                                                       |
| -------------------- | -------------------- | ------------------------------------------------------------ |
| SQL_C_CHAR           | SQLSCHAR \*          | char \*                                                      |
| SQL_C_WCHAR          | SQLWCHAR \*          | short \*                                                     |
| SQL_C_STINYINT       | SQLSCHAR             | signed char                                                  |
| SQL_C_UTINYINT       | SQLCHAR              | unsigned char                                                |
| SQL_C_SBIGINT        | SQLBIGINT            | \_int64                                                      |
| SQL_C_UBIGINT        | SQLUBIGINT           | unsigned \_int64                                             |
| SQL_C_SSHORT         | SQLSMALLINT          | short int                                                    |
| SQL_C_USHORT         | SQLUSMALLINT         | unsigned short int                                           |
| SQL_C_SLONG          | SQLINTEGER           | int                                                          |
| SQL_C_ULONG          | SQLUINTEGER          | unsigned int                                                 |
| SQL_C_FLOAT          | SQLREAL              | float                                                        |
| SQL_C_DOUBLE         | SQLDOUBLE            | double                                                       |
| SQL_C_BINARY         | SQLCHAR \*           | unsigned char \*                                             |
| C Type 식별자        | ODBC C typedef       | C type                                                       |
| SQL_C_TYPE_DATE      | SQL_DATE_STRUCT      | struct tagDATE_STRUCT { SQLSMALLINT year; SQLSMALLINT month; SQLSMALLINT day; } DATE_STRUCT |
| SQL_C_TYPE_TIME      | SQL_TIME_STRUCT      | struct tagTIME_STRUCT { SQLSMALLINT hour; SQLSMALLINT minute; SQLSMALLINT second; } TIME_STRUCT |
| SQL_C_TYPE_TIMESTAMP | SQL_TIMESTAMP_STRUCT | struct tagTIMESTAMP_STRUCT {SQLSMALLINT year; SQLSMALLINT month; SQLSMALLINT day; SQLSMALLINT hour; SQLSMALLINT minute; SQLSMALLINT second; SQLINTEGER fraction; **}** TIMESTAMP_STRUCT; |
| SQL_C_NIBBLE         | SQL_NIBBLE_STRUCT    | struct tagNIBBLE_STRUCT { SQLCHAR length; SQLCHAR value[1]; } NIBBLE_STRUCT |
| SQL_C_NUMERIC        | SQL_NUMERIC_STRUCT   | struct tagSQL_NUMERIC_STRUCT{SQLCHAR precision; SQLSCHAR scale; SQLCHAR sign; SQLCHAR val[SQL_MAX_NUMERIC_LEN]; } SQL_NUMERIC_STRUCT;<br /><br />SQLCHAR val는 little endian 기반으로 처리된다. 따라서 big endian OS를 사용하는경우에도 little endian byte order로 세팅해 줘야 된다. |
|                      |                      |                                                              |

### SQL 데이터형을 C 데이터형으로 변환하기

![](../../media/CLI/CLI.1.94.1.jpg)



|                    | SQL_C_CHAR | SQL_C_WCHAR | SQL_C_BIT | SQL_C_STINYINT | SQL_C_UTINYINT | SQL_C_SBIGINT | SQL_C_UBIGINT | SQL_C_SSHORT | SQL_C_USHORT | SQL_C_SLONG | SQL_C_ULONG | SQL_C_FLOAT | SQL_C_DOUBLE | SQL_C_BINARY | SQL_C_TYPE_DATE | SQL_C_TYPE_TIME | SQL_C_TYPE_TIMESTAMP | SQL_C_BYTES | SQL_C_NIBBLE | SQL_C_NUMERIC |
| ------------------ | ---------- | ----------- | --------- | -------------- | -------------- | ------------- | ------------- | ------------ | ------------ | ----------- | ----------- | ----------- | ------------ | ------------ | --------------- | --------------- | -------------------- | ----------- | ------------ | ------------- |
| SQL_CHAR           | \#         |             | ○         | ○              | ○              |               |               |              |              |             |             |             |              | ○            |                 |                 |                      |             |              | ○             |
| SQL_VARCHAR        | \#         |             | ○         | ○              | ○              |               |               |              |              |             |             |             |              | ○            |                 |                 |                      |             |              | ○             |
| SQL_WCHAR          |            | \#          | ○         | ○              | ○              |               |               |              |              |             |             |             |              | ○            |                 |                 |                      |             |              | ○             |
| SQL_WVARCHAR       |            | \#          | ○         | ○              | ○              |               |               |              |              |             |             |             |              | ○            |                 |                 |                      |             |              | ○             |
| SQL_DECIMAL        | \#         |             | ○         | ○              | ○              | ○             | ○             | ○            | ○            | ○           | ○           | \#          | ○            | ○            |                 |                 |                      |             |              | ○             |
| SQL_NUMERIC        | \#         |             | ○         | ○              | ○              | ○             | ○             | ○            | ○            | ○           | ○           | \#          | ○            | ○            |                 |                 |                      |             |              | ○             |
| SQL_SMALLINT       | ○          |             | ○         | ○              | ○              | ○             | ○             | \#           | ○            | ○           | ○           | ○           | ○            | ○            |                 |                 |                      |             |              | ○             |
| (signed)           |            |             |           |                |                |               |               |              |              |             |             |             |              |              |                 |                 |                      |             |              |               |
| SQL_INTEGER        | ○          |             | ○         | ○              | ○              | ○             | ○             | ○            | ○            | \#          | ○           | ○           | ○            | ○            |                 |                 |                      |             |              | ○             |
| (signed)           |            |             |           |                |                |               |               |              |              |             |             |             |              |              |                 |                 |                      |             |              |               |
| SQL_BIGINT         | ○          |             | ○         | ○              | ○              | \#            | ○             | ○            | ○            | ○           | ○           | ○           | ○            | ○            |                 |                 |                      |             |              | ○             |
| (signed)           |            |             |           |                |                |               |               |              |              |             |             |             |              |              |                 |                 |                      |             |              |               |
| SQL_REAL           | ○          |             | ○         | ○              | ○              | ○             | ○             | ○            | ○            | ○           | ○           | \#          | ○            | ○            |                 |                 |                      |             |              | ○             |
| SQL_FLOAT          | \#         |             | ○         | ○              | ○              | ○             | ○             | ○            | ○            | ○           | ○           | \#          | ○            | ○            |                 |                 |                      |             |              | ○             |
| SQL_DOUBLE         | ○          |             | ○         | ○              | ○              | ○             | ○             | ○            | ○            | ○           | ○           | ○           | \#           | ○            |                 |                 |                      |             |              | ○             |
| SQL_BINARY         | ○          |             |           |                |                |               |               |              |              |             |             |             |              | \#           |                 |                 |                      |             |              |               |
| SQL_TYPE_DATE      | ○          |             |           |                |                |               |               |              |              |             |             |             |              | ○            | \#              |                 | ○                    |             |              |               |
| SQL_TYPE_TIME      | ○          |             |           |                |                |               |               |              |              |             |             |             |              | ○            |                 | \#              | ○                    |             |              |               |
| SQL_TYPE_TIMESTAMP | ○          |             |           |                |                |               |               |              |              |             |             |             |              | ○            | ○               | ○               | \#                   |             |              |               |
| SQL_INTERVAL       | ○          |             |           |                |                |               |               |              |              |             |             | ○           | \#           | ○            |                 |                 |                      |             |              |               |
| SQL_BYTES          | ○          |             |           |                |                |               |               |              |              |             |             |             |              | ○            |                 |                 |                      | \#          |              |               |
| SQL_NIBBLE         | ○          |             |           |                |                |               |               |              |              |             |             |             |              | ○            |                 |                 |                      |             | \#           |               |
| SQL_GEOMETRY       |            |             |           |                |                |               |               |              |              |             |             |             |              | \#           |                 |                 |                      |             |              |               |

\# : Default conversion

○ : Supported conversion



*SQL_NUMERIC -- SQL_C_BINARY의 경우 SQL_NUMERIC_STRUCT 으로 변환된다.



### C 데이터형을 SQL 데이터형으로 변환하기

![](../../media/CLI/CLI.1.95.1.jpg)



|                      | SQL_CHAR | SQL_VARCHAR | SQL_WCHAR | SQL_WVARCHAR | SQL_DECIMAL | SQL_NUMERIC | SQL_SMALLINT(signed) | SQL_INTEGER(signed) | SQL_BIGINT(signed) | SQL_REAL | SQL_FLOAT | SQL_DOUBLE | SQL_BINARY | SQL_DATE | SQL_INTERVAL | SQL_BYTES | SQL_NIBBLE | SQL_GEOMETRY |
| -------------------- | -------- | ----------- | --------- | ------------ | ----------- | ----------- | -------------------- | ------------------- | ------------------ | -------- | --------- | ---------- | ---------- | -------- | ------------ | --------- | ---------- | ------------ |
| SQL_C_CHAR           | \#       | \#          |           |              | \#          | \#          | ○                    | ○                   | ○                  | ○        | ○         | ○          | ○          | ○        |              | ○         | ○          |              |
| SQL_C_WCHAR          |          |             | \#        | \#           |             |             |                      |                     |                    |          |           |            |            |          |              |           |            |              |
| SQL_C_BIT            | ○        | ○           | ○         | ○            | ○           | ○           | ○                    | ○                   | ○                  | ○        | ○         | ○          |            |          |              |           |            |              |
| SQL_C_STINYINT       | ○        | ○           | ○         | ○            | ○           | ○           | ○                    | ○                   | ○                  | ○        | ○         | ○          |            |          |              |           |            |              |
| SQL_C_UTINYINT       | ○        | ○           | ○         | ○            | ○           | ○           | ○                    | ○                   | ○                  | ○        | ○         | ○          |            |          |              |           |            |              |
| SQL_C_SBIGINT        | ○        | ○           | ○         | ○            | ○           | ○           | ○                    | ○                   | \#                 | ○        | ○         | ○          |            |          |              |           |            |              |
| SQL_C_UBIGINT        | ○        | ○           | ○         | ○            | ○           | ○           | ○                    | ○                   | ○                  | ○        | ○         | ○          |            |          |              |           |            |              |
| SQL_C_SSHORT         | ○        | ○           | ○         | ○            | ○           | ○           | \#                   | ○                   | ○                  | ○        | ○         | ○          |            |          |              |           |            |              |
| SQL_C_USHORT         | ○        | ○           | ○         | ○            | ○           | ○           | ○                    | ○                   | ○                  | ○        | ○         | ○          |            |          |              |           |            |              |
| SQL_C_SLONG          | ○        | ○           | ○         | ○            | ○           | ○           | ○                    | \#                  | ○                  | ○        | ○         | ○          |            |          |              |           |            |              |
| SQL_C_ULONG          | ○        | ○           | ○         | ○            | ○           | ○           | ○                    | ○                   | ○                  | ○        | ○         | ○          |            |          |              |           |            |              |
| SQL_C_FLOAT          | ○        | ○           | ○         | ○            | ○           | ○           | ○                    | ○                   | ○                  | \#       | ○         | ○          |            |          |              |           |            |              |
| SQL_C_DOUBLE         | ○        | ○           | ○         | ○            | ○           | ○           | ○                    | ○                   | ○                  | ○        | \#        | \#         |            |          |              |           |            |              |
| SQL_C_BINARY         | ○        | ○           | ○         | ○            |             | ○           |                      |                     |                    |          |           |            | \#         |          |              |           |            | ○            |
| SQL_C_TYPE_DATE      |          |             |           |              |             |             |                      |                     |                    |          |           |            |            |          |              |           |            |              |
| SQL_C_TYPE_TIME      |          |             |           |              |             |             |                      |                     |                    |          |           |            |            | ○        |              |           |            |              |
| SQL_C_TYPE_TIMESTAMP |          |             |           |              |             |             |                      |                     |                    |          |           |            |            | ○        |              |           |            |              |
| SQL_C_BYTES          |          |             |           |              |             |             |                      |                     |                    |          |           |            |            | ○        |              | \#        |            |              |
| SQL_C_NIBBLE         |          |             |           |              |             |             |                      |                     |                    |          |           |            |            |          |              |           | \#         |              |
| SQL_C_NUMERIC        |          |             |           |              | ○           | ○           | ○                    | ○                   | ○                  |          | ○         |            |            |          |              |           |            |              |

\# : Default conversion

○ : Supported conversion



*SQL_NUMERIC -- SQL_C_BINARY의 경우 SQL_NUMERIC_STRUCT 으로 변환된다.



