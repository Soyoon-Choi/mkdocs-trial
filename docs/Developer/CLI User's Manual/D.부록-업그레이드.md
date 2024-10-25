# D.부록: 업그레이드

이 부록은 Altibase 4를 위한 ODBC 또는 Altibase CLI 응용 프로그램들을 Altibase
5에서도 사용할 수 있도록 필요한 사항들을 정리했다.

Altibase 5로 업그레이드 되면서 지원하는 CLI 인터페이스의 수준이 확장됐다. 특히
X/Open CLI 표준과 ODBC 스펙을 최대한 준수하여 사용자의 응용 프로그램뿐 아니라
범용 애플리케이션과의 호환성을 높였다.

이 부록에서는 Altibase 5로 업그레이드되면서 추가되거나 재정의된 데이터 타입과
기타 변경 사항들을 설명한다.

-   데이터 타입

-   기타 변경사항

### 데이터 타입

이 절에서는 Altibase 5에서 새롭게 추가된 데이터 타입들을 설명한다.

이전 버전보다 표준을 더욱 준수하여 기존의 애플리케이션을 컴파일할 때 발생할 수
있는 문제들을 해결하도록 한다.

#### SQLCHAR, SQLSCHAR

이전의 CLI 애플리케이션들은 SQLCHAR와 char를 혼용해서 사용했다. 그러나 표준
지향의 SQLCHAR는 아래와 같이 새롭게 정의된다.

```
typedef unsigned char SQLCHAR;
typedef signed char SQLSCHAR;
```

따라서 기존 응용 프로그램에서 아래와 같은 구문으로 컴파일할 때 오류가 발생한다.

```
char *query = “....”;
SQLPrepare(stmt, query, SQL_NTS);
```

이런 문제를 해결하기 위해 아래와 같이 타입 캐스팅을 수정하면 된다.

```
char *query = “....”;
SQLPrepare(stmt, (SQLCHAR *)query, SQL_NTS);
```

#### SQL_BIT, SQL_VARBIT

Altibase는 버전 5부터 SQL 92 표준의 BIT 타입뿐 아니라 사용자 편의를 위한 VARBIT
타입을 지원한다. BIT와 VARBIT에 대한 자세한 내용은 *SQL Reference*을 참조하기
바란다.

##### BIT to C type

다음은 BIT 관련 변환 테이블을 나타낸다.
<table>
   <tr>
      <th>C type id</th>
      <th>Test</th>
      <th>*TargetValuePtr</th>
      <th>*StrLen_or_IndPtr</th>
      <th>SQLSTATE</th>
   </tr>
   <tr>
      <td rowspan="2">SQL_C_CHAR</td>
      <td>BufferLength > 1</td>      
      <td>Data (‘0’ 혹은 ‘1’)</td>
      <td>1 </td>  
      <td>n/a</td>
   </tr>  
   <tr>
      <td>BufferLength <= 1</td>      
      <td>Undefined</td>
      <td>Undefined </td>  
      <td>22003</td>
   </tr>  
   <tr>
       <td> SQL_C_STINYINT
SQL_C_UTINYINT
SQL_C_SBIGINT
SQL_C_UBIGINT
SQL_C_SSHORT
SQL_C_USHORT
SQL_C_SLONG
SQL_C_ULONG
SQL_C_FLOAT
SQL_C_DOUBLE
SQL_C_NUMERIC
</td>
       <td>None
(BufferLength 의 값은 이와 같은 고정크기 타입으로의 컨버젼시에는 무시된다)
  </td>
  <td>Data (0 혹은 1)</td>
  <td>C type 의 size</td>
  <td>n/a</td> 
   </tr>
   <tr>
       <td>SQL_C_BIT</td>
       <td>None</td>
       <td>Data (0 혹은 1)</td>
       <td>1</td>
       <td>n/a</td>
   </tr>
    <tr>
       <td>SQL_C_BINARY</td>
       <td>None</td>
       <td>Data 
(포맷은 아래 참조)
</td>
       <td>사용자가 바인드한 메모리에 write 할 데이터의 길이</td>
       <td>n/a</td>
   </tr>
</table>


##### VARBIT to C type

다음은 VARBIT 관련 변환 테이블을 나타낸다.
<table>
   <tr>
      <th>C type id</th>
      <th>Test</th>
      <th>*TargetValuePtr</th>
      <th>*StrLen_or_IndPtr</th>
      <th>SQLSTATE</th>
   </tr>
   <tr>
      <td rowspan="2">SQL_C_CHAR</td>
      <td>BufferLength > 1</td>      
      <td>Data</td>
      <td>varbit 의 precision </td>  
      <td>n/a</td>
   </tr>  
   <tr>
      <td>BufferLength <= 1</td>      
      <td>Undefined</td>
      <td>Undefined </td>  
      <td>22003</td>
   </tr>  
   <tr>
       <td> SQL_C_BIT</td>
       <td>None  </td>
       <td>Data (0 혹은 1)</td>
       <td>1</td>
       <td>n/a</td> 
   </tr>
   <tr>
       <td>SQL_C_BINARY</td>
       <td></td>
       <td>Data 
(포맷은 BIT와 동일)
</td>
       <td>사용자가 바인드한 메모리에 write 할 데이터의 길이</td>
       <td>n/a</td>
   </tr>
</table>

##### C type to BIT/VARBIT

현재 BIT/VARBIT로 변환될 수 있는 타입이 존재하지 않는다.

##### 바이너리 형식
<table>
    <tr>
      <td>0 7</td>      
      <td>8 15</td>
      <td>16 23 </td>  
      <td>24 31</td>
      <td>32 39</td>
      <td>...</td>
      <td>8n 8n+7</td>
   </tr>  
   <tr>
      <td colspan="4">Precision</td>
      <td colspan="3">Data ....</td>      
   </tr>  
</table>

where n= (Precision+7)/8 + 3

Precision : Length of BIT data

Data : BIT Data

##### 데이터 타입 변환 예제

###### BIT/VARBIT SQL_C_BINARY

BIT를 SQL_C_BINARY로 바인드하여 페치할 때에는 서버에서 전달되는 데이터를
사용자에게 그대로 전달해준다. 사용자 버퍼에 저장되는 데이터의 형식은 앞에서
설명한 것과 같다.

다음의 예제처럼 구조체 struct bit_t를 정의해서 사용하면 보다 편리하게 서버에
접근할 수 있다.

```
CREATE TABLE T1(I1 BIT(17), I2 VARBIT(37));
INSERT INTO T1 VALUES(BIT'11111011010011011', 
VARBIT'0010010010101110001010100010010011011');
INSERT INTO T1 VALUES(BIT'110011011',
VARBIT'001110001010100010010011011');

----------------------

void dump(unsigned char *Buffer, SQLINTEGER Length)
{
for (SQLINTEGER i = 0; i < Length; i++) 
{
printf(“%02X “, *(Buffer + i));
}
}

typedef struct bit_t
{
SQLUINTEGER mPrecision;
unsigned char mData[1];
} bit_t;

bit_t *Bit;
bit_t *Varbit;
SQLLEN Length;
SQLRETURN rc;

Bit = (bit_t *)malloc(BUFFER_SIZE);
Varbit = (bit_t *)malloc(BUFFER_SIZE);

SQLBindCol( stmt, 1, 
SQL_C_BINARY, 
(SQLPOINTER)Bit, 
BUFFER_SIZE, 
&LengthBit);

SQLBindCol( stmt, 2, 
SQL_C_BINARY, 
(SQLPOINTER)Varbit, 
BUFFER_SIZE, 
&LengthVarbit);
do
{
memset(Buffer, 0, BUFFER_SIZE);
rc = SQLFetch(stmt);

printf(“-----\n”);

printf(“>> Bit\n”);
printf(“Length : %d\n”, LengthBit);
printf(“Precision : %d\n”, Bit->mPrecision);
dump(Bit->mData, LengthBit – sizeof(SQLUINTEGER));

printf(“>> Varbit\n”);
printf(“Length : %d\n”, LengthVarbit);
printf(“Precision : %d\n”, Varbit->mPrecision);
dump(Varbit->mData, LengthVarbit – sizeof(SQLUINTEGER));
} while (rc != SQL_NO_DATA);
위의 프로그램을 실행시켰을 때 결과는 다음과 같다.
------
>> Bit
Length : 7
Precision : 17
FB 4D 80 (1111 1011 0100 1101 1)
>> Varbit
Length : 9
Precision : 37
24 AE 2A 24 D8 (0010 0100 1010 1110 0010 1010 0010 0100 1101 1)
------
>> Bit
Length : 7
Precision : 17 -> BIT 는 0으로 패딩하므로 17.
CD 80 00 (1100 1101 1000 0000)
>> Varbit
Length : 8
Precision : 27 -> VARBIT 는 패딩하지 않으므로 27.
38 A8 93 60 (0011 1000 1010 1000 1001 0011 011)
```

만약, BUFFER_SIZE가 필요한 메모리 크기보다 작을 경우 SQLFetch()는
SQL_SUCCESS_WITH_INFO를 리턴하고, BUFFER_SIZE 만큼만 바인드 된 메모리에 쓴다.

###### BIT/VARBIT to SQL_C_BIT

ODBC의 SQL_C_BIT는 0 또는 1의 값을 갖는 8비트의 부호 없는 정수이기 때문에 주의가
필요하다. 즉, SQL_C_BIT로 바인드하여 페치할 경우 서버의 테이블에 BIT ‘011001’이
저장되었어도 바인드 된 변수에는 0x64가 아니라 0x01이 들어간다

###### BIT to SQL_C_CHAR

BIT 칼럼을 페치할 때 SQL_C_CHAR 로 바인드했다면, 결과는 ODBC 타입 변환 규칙에
따라 항상 0 또는 1을 갖는다.

```
CREATE TABLE T1 (I1 BIT(12));
INSERT INTO T1 VALUES(BIT’110011000010’);
INSERT INTO T1 VALUES(BIT’010011000010’);

SQLCHAR sData[128];
SQLLEN sLength;

sQuery = (SQLCHAR *)”SELECT I1 FROM T1”;

SQLBindCol(stmt, 1, SQL_C_CHAR, sData, sizeof(sData), sLength);

SQLExecDirect(stmt, sQuery, SQL_NTS);

while (SQLFetch(stmt) != SQL_NO_DATA)
{
printf(“bit value = %s, ”, sData);
printf(“sLength = %d\n”, sLength);
}
위의 프로그램을 실행시키면, 다음과 같이 출력된다.
1, sLength = 1
0, sLength = 1
```

###### VARBIT to SQL_C_CHAR

ODBC 표준에 VARBIT 타입이 없어 변환 툴을 자체적으로 만들었기 때문에, VARBIT
칼럼을 페치할 때에는 해당 칼럼의 데이터가 모두 페치된다.

```
CREATE TABLE T1 (I1 VARBIT(12));
INSERT INTO T1 VALUES(VARBIT’110011000010’);
INSERT INTO T1 VALUES(VARBIT’01011010’);

SQLCHAR sData[128];
SQLLEN sLength;
sQuery = (SQLCHAR *)”SELECT I1 FROM T1”;
SQLBindCol(stmt, 1, SQL_C_CHAR, sData, sizeof(sData), &sLength);
SQLExecDirect(stmt, sQuery, SQL_NTS);
while (SQLFetch(stmt) != SQL_NO_DATA)
{
printf(“bit value = %s, ”, sData);
printf(“sLength = %d\n”, sLength);
}
위의 프로그램을 실행시키면, 다음과 같이 출력된다.
110011000010, sLength = 12
01011010, sLength = 8
```

#### SQL_NIBBLE

Altibase 4에서 지원하던 SQL_C_NIBBLE 타입은 Altibase 5에서 사용하지 않는다.
그러나 SQL_C_BINARY를 이용하여 원하는 데이터를 페치할 수 있다.

##### NIBBLE to C type

SQL_C_CHAR 및 SQL_C_BINARY로의 변환만 가능하다.
<table>
   <tr>
      <th>C type id</th>
      <th>Test</th>
      <th>*TargetValuePtr</th>
      <th>*StrLen_or_IndPtr</th>
      <th>SQLSTATE</th>
   </tr>
   <tr>
      <td rowspan="2">SQL_C_CHAR</td>
      <td>BufferLength > 1</td>      
      <td>Data (‘0’ 또는 ‘1’)</td>
      <td>사용자가 바인드 한 메모리에 write 할 데이터의 길이 (null 종료문자 제외) </td>  
      <td>n/a</td>
   </tr>  
   <tr>
      <td>BufferLength <= 1</td>      
      <td>Undefined</td>
      <td>Undefined </td>  
      <td>22003</td>
   </tr>  
   <tr>
       <td> SQL_C_BINARY</td>
       <td>None  </td>
       <td>Data 
(포맷은 아래 참조)
</td>
       <td>사용자가 바인드 한 메모리에 write 할 데이터의 길이</td>
       <td>n/a</td> 
   </tr>
</table>
방법은 BIT를 BINARY로 페치할 때와 동일하지만, NIBBLE의 BINARY 형식은 BIT와 달리
precision 필드가 1바이트 정수라는 것을 주의해야 한다.

##### 바이너리 형식

<table>
    <tr>
      <td>0 7</td>      
      <td>8 15</td>
      <td>...</td>
      <td>8n 8n+7</td>
   </tr>  
   <tr>
      <td colspan="2">Precision</td>
      <td colspan="2">Data ....</td>      
   </tr>  
</table>
Where n = (Precision+1)/2

Precision : Length of NIBBLE data

Data : Nibble Data

##### 데이터 타입 변환 예제

###### NIBBLE to SQL_C_BINARY

NIBBLE을 SQL_C_BINARY로 바인드하여 페치할 때에는 서버에서 전달되는 데이터를
사용자에게 그대로 전달해준다. 사용자 버퍼에 저장되는 데이터의 형식은 앞에서
설명한 것과 같다.

다음의 예제에서 사용하는 것처럼 nibble_t 구조체를 정의해서 사용하면 보다
편리하게 접근할 수 있다.

```
CREATE TABLE T1(I1 NIBBLE, I2 NIBBLE(10), I3 NIBBLE(21) NOT NULL);
INSERT INTO T1 VALUES(NIBBLE'A', NIBBLE'0123456789', NIBBLE'0123456789ABCDEF00121');
INSERT INTO T1 VALUES(NIBBLE'B', NIBBLE'789', NIBBLE'ABCD1234');

-------------------

void dump(unsigned char *Buffer, int Length)
{
for (int i = 0; i < Length; i++) printf(“%02X “, *(Buffer + i));
}

typedef struct nibble_t
{
unsigned char mPrecision;
unsigned char mData[1];
} nibble_t;

nibble_t *Buffer;
SQLLEN Length;
SQLRETURN rc;

Buffer = (nibble_t *)malloc(BUFFER_SIZE);

SQLBindCol(stmt, 2, SQL_C_BINARY, (SQLPOINTER)Buffer, BUFFER_SIZE, &Length);
do
{
memset(Buffer, 0, BUFFER_SIZE);
rc = SQLFetch(stmt);

printf(“----\n”);
printf(“Length : %d\n”, Length);
printf(“Precision : %d\n”, Buffer->mPrecision);
dump(Buffer->mData, Length – sizeof(SQLUINTEGER));
} while (rc != SQL_NO_DATA);
위의 프로그램을 실행시키면, 다음과 같은 결과가 나온다.
Length : 6
Precision : 10
01 23 45 67 89
----
Length : 3
Precision : 3
78 90
```

###### NIBBLE to SQL_C_CHAR

이 경우 특이사항이 없으므로, 예제와 결과는 생략한다.

#### SQL_BYTE

Altibase 4에 있던 SQL_C_BYTE 대신 SQL_C_BINARY로 바인드하여 동일한 방식으로
동작한다.

##### BYTE to C types

SQL_C_CHAR, SQL_C_BINARY 외의 다른 타입으로의 변환은 불가능하다. 그러나 바이너리
데이터를 SQL_C_CHAR로 변환할 때 원천 데이터의 1 바이트가 ASCII 2 글자로 표현되는
것을 주의해야 한다.
<table>
   <tr>
      <th>C type id</th>
      <th>Test</th>
      <th>*TargetValuePtr</th>
      <th>*StrLen_or_IndPtr</th>
      <th>SQLSTATE</th>
   </tr>
   <tr>
      <td rowspan="2">SQL_C_CHAR</td>
      <td>(Byte length of data) * 2 < BufferLength </td>      
      <td>Data</td>
      <td>Length of data in bytes</td>  
      <td>n/a</td>
   </tr>  
   <tr>
      <td>(Byte length of data) * 2 >= BufferLength</td>      
      <td>Truncated data</td>
      <td>Length of data in bytes </td>  
      <td>01004</td>
   </tr>  
   <tr>
       <td rowspan="2"> SQL_C_BINARY</td>
       <td>Byte length of data <= BufferLength  </td>
       <td>Data </td>
       <td>Length of data in bytes</td>
       <td>n/a</td> 
   </tr>
   <tr>
       <td>Byte length of data > BufferLength</td>
       <td>Truncated data</td>
       <td>Length of data in bytes</td>
       <td>01004</td>
   </tr>
</table>
Altibase CLI는 바이너리 데이터를 SQL_C_CHAR로 변환할 때 각각의 바이트가 항상
16진수의 쌍(pair)으로 변환되고, 널 터미네이트(NULL terminate) 시킨다. 따라서
바인드 한 SQL_C_CHAR 버퍼의 크기가 짝수일 때에는 바인드 한 버퍼의 마지막
바이트에 NULL termination 문자가 찍히는 것이 아니라, 바인드 한 버퍼의 마지막에서
한 바이트 앞의 위치에 NULL termination 문자가 찍힌다.

<table>
   <tr>
      <th>Source binary data
(16진수)
</th>
      <th>Size of bound buffer
(bytes)
</th>
      <th>Contents of the buffer bound as SQL_C_CHAR</th>
      <th>*StrLen_or_IndPtr</th>
      <th>SQLSTATE</th>
   </tr>
   <tr>
      <td rowspan="2">AA BB 11 12</td>
      <td>8 </td>      
      <td>hex : 41 41 42 42 31 31 00 ??<sup>1</sup> 
string : “AABB11”
</td>
      <td>8</td>  
      <td>01004</td>
   </tr>  
     <tr>
      <td>9 </td>      
      <td>hex : 41 41 42 42 31 31 31 32 00
string : “AABB1112”
</td>
      <td>8</td>  
      <td>n/a</td>
   </tr>  
</table>
[<sup>1</sup>] ??로 표기한 부분은 정의하지 않는다.

##### 바이너리 형식

바이트 타입은 NIBBLE이나 BIT처럼 형식이 따로 존재하는 것이 아니라, 이진 데이터의
칼럼이다.

##### 데이터 타입 변환 예제

###### BYTE to SQL_C_CHAR

```
CREATE TABLE T1(I1 BYTE(30));
INSERT INTO T1 VALUES(BYTE’56789ABC’);

-------------------
SQLLEN Length;
SQLRETURN rc;

// 실행 쿼리 : SELECT * FROM T1;

Buffer = (nibble_t *)malloc(BUFFER_SIZE);

SQLBindCol(stmt, 1, SQL_C_CHAR, (SQLPOINTER)Buffer, BUFFER_SIZE, &Length);
do
{
memset(Buffer, 0, BUFFER_SIZE);
rc = SQLFetch(stmt);
printf(“Length : %d\n”, Length);
printf(“Data : %s\n”, Length);
} while (rc != SQL_NO_DATA);
위의 프로그램을 실행시키면, 다음과 같은 결과가 나온다.
실행 결과 1 : BUFFER_SIZE >= 9
Length : 8
Data : 56789ABC

실행 결과 2 : BUFFER_SIZE == 8
Length : 8
Data : 56789A -> 8 바이트 버퍼에 바인딩 했는데 6글자만 나왔음.

실행 결과 3 : BUFFER_SIZE == 7
Length : 8
Data : 56789A -> BUFFER_SIZE == 8 일 때와 결과가 동일함.

실행 결과 4 : BUFFER_SIZE == 6
Length : 8
Data : 5678

실행 결과들 중에서 1번을 제외한 나머지에 대해서는 SQLFetch()가 SQL_SUCCESS_WITH_INFO를 반환한다. 해당 SQLSTATE는 01004이다.
```

###### BYTE to SQL_C_BINARY

바이너리로 바인딩 하는 것은 특이사항이 없다.

#### DATE : SQL_TYPE_TIMESTAMP

Altibase 5에서는 DATE 칼럼에 SQLDescribeCol() 또는SQLColAttribute()를 이용하여
SQL type으로 가져올 경우, SQL_TYPE_TIMESTAMP를 반환한다. SQL_TYPE_TIMESTAMP는
ODBC 표준 타입 중에서 Altibase의 DATE 타입과 유사한 타입으로 년, 월, 일, 시, 분,
초로 구성됐다.

그러나 Altibase 4에서는 DATE 타입이 날짜, 시간 등의 기본요소와 이들을 구분하는
특수문자 등 다량의 데이터로 구성되어 있어, SQLColAttribute() 또는
SQLDescribeCol()을 호출하면 SQL type으로 SQL_DATE가 반환됐다.

따라서 Altibase 5의 Altibase CLI를 사용할 때에는 ODBC 3.0의 타입 상수인
SQL_TYPE_DATE, SQL_TYPE_TIME, SQL_TYPE_TIMESTAMP를 사용하기를 권장한다.

#### LOB

##### 데이터 타입

Altibase 4에서 LOB 타입은 길이가 페이지 크기로 제한되었으나, Altibase 5에서는
최대 4GB-1Byte 까지 지원하는 BLOB, CLOB으로 구성된다.

###### Altibase 4 DDL

```
CREATE TABLE T1 (I1 BLOB(3));
```

###### Altibase 5 DDL

```
CREATE TABLE T1 (I1 BLOB); ---> 괄호 안의 precision 이 사라짐.
```

##### LOB 함수 사용

Altibase CLI 애플리케이션에서 LOB을 사용하기 위해 제공되는 전용 함수가 제공된다.
LOB을 위한 특수 함수에 대한 자세한 내용은 3장 LOB 인터페이스를 참조한다.

LOB을 위한 함수 외에도 일반적인 바이너리, 문자형 타입에서 사용할 수 있는 함수도
사용이 가능하다. 이러한 특징 때문에 ODBC 애플리케이션에서 표준 ODBC를 사용하여
LOB 데이터의 저장 및 검색 등이 가능하다.

그러나 부분 수정(partial update), 부분 검색(partial retrieve)과 같은 기능은 ODBC
응용 프로그램에서 사용할 수 없다. 단 CLI 응용 프로그램에서는 SQLGetLob,
SQLPutLob 등의 함수를 이용하여 사용이 가능하다.

```
CREATE TABLE T1 (I1 BLOB, I2 CLOB);  // CONNECTION의 AUTOCOMMIT 모드를 OFF 시킨다.

SQLCHAR sBlobData[128];
SQLCHAR sClobData[128];
SQLLEN sBlobLength;
SQLLEN sClobLength;

SQLCHAR *sQuery = (SQLCHAR *)”INSERT INTO T1 VALUES(?, ?)”;
SQLPrepare(stmt, sQuery, SQL_NTS);

SQLBindParameter(stmt, 1, SQL_C_BINARY, SQL_BLOB,0, 0, sBlobData, sizeof(sBlobData), &sBlobLength);
SQLBindParameter(stmt, 2, SQL_C_CHAR, SQL_CLOB,0, 0, sClobData, sizeof(sClobData), &sClobLength);
sBlobLength = create_blob_data(sBlobData);
sprintf((char *)sClobData, “this is clob data”);
sClobLength = SQL_NTS;

SQLExecute(stmt);
```

##### ODBC 응용프로그램에서 LOB 사용하기

ODBC 응용 프로그램에서 LOB 칼럼을 페치(fetch)하거나 LOB 칼럼에 데이터를 저장할
때에는 SQLDescribeCol, SQLColAttribute 또는 SQLDescribeParam 함수를 호출한다.

LOB 칼럼에서 이들 함수를 수행하면 SQL_BLOB, SQL_CLOB의 데이터 타입으로 반환된다.
그러나 ODBC 응용 프로그램은 SQL_BLOB이나 SQL_CLOB과 같은 데이터 타입을 인지할 수
없다.

따라서 ODBC 응용 프로그램이 인식할 수 있는 데이터 타입으로 반환해야 한다. 이러한
문제는 odbc.ini에 LongDataCompat = on 으로 옵션을 주어서 해결할 수 있다. 이
옵션을 실행할 경우 LOB 칼럼에 SQLColAttribute() 등의 함수를 호출하면, SQL_BLOB
대신 SQL_LONGVARBINARY를, SQL_CLOB 대신 SQL_LONGVARCHAR를 해당 칼럼의 타입으로
반환한다.

##### PHP 프로그램에서 LOB 사용 예제

다음은 PHP 응용 프로그램에서 LOB을 사용하는 예제이다.

프로그램을 실행하기 전에 php.ini에서 다음의 두가지 속성을 확인해야 한다.

```
odbc.defaultlrl = 4096 (반드시 1 이상의 값으로 설정한다)
odbc.defaultbinmode = 0 (LOB을 쓰기 위해서 0으로 설정해야 추가메모리를 할당하지 않고 동작한다)
~/.odbc.ini는 아래와 같다.
[Altibase]
Driver = AltibaseODBCDriver
Description = Altibase DSN
ServerType = Altibase
UserName = SYS
Password = MANAGER
Server = 127.0.0.1
Port = 20073
LongDataCompat = on
NLS_USE = US7ASCII
php 프로그램
<?
/*
* =================================================
* 연결 시도
* =================================================
*/

$Connection = @odbc_connect("Altibase", "SYS", "MANAGER");
if (!$Connection)
{
echo "ConnectFail!!!\n";
exit;
}

/*
* =================================================
* 테이블 생성
* =================================================
*/

@odbc_exec($Connection, "DROP TABLE T2 ");
if (!@odbc_exec($Connection, 
"CREATE TABLE T2 (I1 INTEGER, B2 BLOB, C3 CLOB) TABLESPACE SYS_TBS_DATA"))
{
echo "create test table Fail!!!\n";
exit;
}

/*
* =================================================
* LOB 사용을 위한 autocommit off
* =================================================
*/

odbc_autocommit($Connection, FALSE);

/*
* =================================================
* 데이터의 삽입
* =================================================
*/

$query = "INSERT INTO T2 VALUES (?, ?, ?)";
$Result1 = @odbc_prepare($Connection, $query);
if (!$Result1)
{
$msg = odbc_errormsg($Connection);
echo "prepare insert: $msg\n";
exit;
}

for ($i = 0; $i < 10; $i++)
{

/*
* ----------------------
* 파일에서 읽기
* ----------------------
*/

$fileno2 = $i + 1;
$filename2 = "a$fileno2.txt";
print("filename = $filename2\n");
$fp = fopen($filename2, "r");
$blob = fread($fp, 1000000);
fclose($fp);

$fileno3 = 10 - $i;
$filename3 = "a$fileno3.txt";
print("filename = $filename3\n");
$fp = fopen($filename3, "r");
$clob = fread($fp, 1000000);
fclose($fp);

/*
* ----------------------
* INSERT
* ----------------------
*/
	
$Result2 = @odbc_execute($Result1, array($i, $blob, $clob));
	
print("inserting $i ,$filename2 and $filename3 into T2 ......... ");
	
if (!$Result2)
{
print("FAIL\n");
$msg = odbc_errormsg($Connection);
echo "execute insert: $msg \n";
exit;
}

print("OK\n");
}

/*
* =================================================
* COMMIT
* =================================================
*/

odbc_commit($Connection);

/*
* =================================================
* INSERT된 데이터 확인
* =================================================
*/
print "\n\n";
print "==========================================\n";
print "Selecting from table\n";
print "==========================================\n";

$query = "select * from t2";
$Result1 = @odbc_exec($Connection, $query);
if (!$Result1)
{
$msg = odbc_errormsg($Connection);
echo "ERROR select: $msg\n";
exit;
}

$rownumber = 0;
while (odbc_fetch_row($Result1))
{
$data1 = odbc_result($Result1, 1);
$data2 = odbc_result($Result1, 2);
$data3 = odbc_result($Result1, 3);
$len2 = strlen($data2); 
$len3 = strlen($data3); 
	
print "\n==========================================\n";
print "Row $rownumber....\n";
$rownumber++;
print "data1 = ".$data1."\n";
print "-------\n";
print "data2 = \n";
// print $data2; // binary data 이므로 출력 생략
print "\n";
print "dataLen2 = [$len2]\n";
print "-------\n";
print "data3 = \n";
print $data3;
print "\n";
print "dataLen3 = [$len3]\n";
}

odbc_commit($Connection);

@odbc_close($Connection);
?>
```

### 기타 변경사항

이 절에서는 데이터 타입 이외의 변경 사항들에 대해 설명한다.

#### SQLCloseCursor

Altibase 4의 Altibase CLI 라이브러리에는 ODBC state machine이 있지 않기 때문에
아래의 순서로 함수를 호출한다.

```
SQLHSTMT stmt;
SQLAllocHandle(SQL_HANDLE_STMT, dbc, &stmt);
SQLPrepare(stmt, (SQLCHAR *)”SELECT I1 FROM T1”, SQL_NTS);

SQLExecute(stmt);
SQLFetch(stmt);
SQLExecute(stmt);
```

그러나 Altibase 5의 Altibase CLI 드라이버로 위의 코드를 실행하면,
SQLExecute(stmt)에서 Function sequence error가 발생한다.

이러한 오류가 발생하는 이유는 처음 SQLExecute()를 수행한 stmt가 result set을
생성시키는 문장이기 때문이다. 따라서 ODBC cursor가 open 되며, stmt의 상태는 S5로
된다 (MSDN ODBC specification 참조). 그러나 S5 상태에서는 SQLExecute()를 수행할
수 없어 오류가 발생한다.

이 상태에서 다시 SQLExecute()를 수행하려면, 아래와 같이 명시적으로
SQLCloseCursor()를 호출하여 stmt를 S1 이나 S3 상태로 만들어야 한다.

```
SQLExecute(stmt);
SQLFetch(stmt);
SQLCloseCursor(stmt); 

SQLExecute(stmt);
```

#### SQLBindParameter – ColumnSize 인자

Altibase 5에서는 SQLBindParameter의 인자들 중 6 번째
인자인 ColumnSize의 사용이 이전 버전과 달라졌다.

이전 버전에서는 이 인자에 0을 입력해도 문제가 없었다. 그러나 Altibase 5에서는
서버로 전송하는 데이터의 최대 길이를 입력하지 않으면 수행할 때 마다 해당 정보를
확인하므로 성능에 문제가 발생한다.

#### SQLBindParameter – StrLen_or_IndPtr 인자

Altibase 4의 CLI 라이브러리에서는 StrLen_or_IndPtr 인자가 가리키는 데이터가
가변길이일 때에만 참조를 했다.

그러나 Altibase 5에서 SQLPutData()와 SQLParamData() 함수를 구현하게 되면서,
StrLen_or_IndPtr 인자가 가리키는 곳의 메모리에 있는 값은 SQLExecute() 또는
SQLExecDirect()를 수행할 때마다 참조한다.

따라서 SQLBindParameter()의 마지막 인자인 StrLen_or_Ind를 널(NULL) 포인터가 아닌
유효한 포인터 변수로 전달하였다면, 포인터가 가리키는 곳의 메모리가 제대로
초기화되었는지 주의해야 한다.

만약 해당 메모리가 제대로 초기화되지 않고, SQL_DATA_AT_EXEC 상수 (-2) 이거나
SQL_LEN_DATA_AT_EXEC() 매크로의 결과 값인 -100 이하의 값을 가졌을 때, CLI
라이브러리는 사용자가 해당 인자를 SQLPutData()를 이용해서 전달하겠다는 의도로
해석한다. 그리고 SQLExecute() 함수를 호출했을 때 SQL_NEED_DATA를 반환한다.

위와 같이 초기화되지 않은 값 때문에 SQLExecDirect() 등의 함수가 의도하지 않은
값(SQL_NEED_DATA)을 반환한다면, 그 다음 호출하는 함수들에도 영향을 준다. 그리고
다음부터 호출하는 함수에서 모두 Function Sequence Error가 발생하여, SQL_ERROR가
반환되는 것을 주의해야 한다.

#### SQLPutData(), SQLParamData()

Altibase 5의 Altibase CLI는 이전 버전에서 지원하지 않았던 SQLPutData()와
SQLParamData()를 지원한다. 각각의 함수의 자세한 사용법은 MSDN을 참조하기 바란다.

다음 예제는 상기 함수 및 앞서 설명한 StrLen_or_IndPtr 인자를 사용한 예제
프로그램이다.

```
Table Schema : 
CREATE TABLE T2_CHAR (I1 INTEGER, I2 CHAR(50));

void putdata_test(void)
{
SQLRETURN sRetCode;
SQLHANDLE sStmt;

SQLINTEGER i1;
SQLLEN i1ind;

SQLCHAR *i2[10] =
{
(unsigned char *)"0000000000000.",
(unsigned char *)"1111111111111. test has been done.",
(unsigned char *)"2222222222222. Abra ca dabra",
(unsigned char *)"3333333333333. Short accounts make long friends.",
(unsigned char *)"4444444444444. Whar the hell are you doing man!",
(unsigned char *)"5555555555555. Oops! I missed this row. What an idiot!",
(unsigned char *)"6666666666666. SQLPutData test is well under way.",
(unsigned char *)"7777777777777. The length of this line is well over 50 characters.",
(unsigned char *)"8888888888888. Hehehe",
(unsigned char *)"9999999999999. Can you see this?",
};

SQLLEN i2ind;

SQLINTEGER i;

SQLINTEGER sMarker = 0;

i1ind = SQL_DATA_AT_EXEC;
i2ind = SQL_DATA_AT_EXEC;

sRetCode = SQLAllocHandle(SQL_HANDLE_STMT, gHdbc, &sStmt);
check_error(SQL_HANDLE_DBC, gHdbc, "STMT handle allocation", sRetCode);

sRetCode = SQLBindParameter(sStmt, 1, SQL_PARAM_INPUT, 
SQL_C_SLONG, SQL_INTEGER, 
0, 0, (SQLPOINTER *)1, 0, &i1ind);

sRetCode = SQLBindParameter(sStmt, 2, SQL_PARAM_INPUT, 
SQL_C_CHAR, SQL_CHAR, 
60, 0, (SQLPOINTER *)2, 0, &i2ind);

sRetCode = SQLPrepare(sStmt, 
(SQLCHAR *)"insert into t2_char values (?, ?)", SQL_NTS);

for(i = 0; i < 10; i++)
{
i1 = i + 1000;

printf("\n");
printf(">>>>>>>> row %d : inserting %d, \"%s\"\n", i, i1, i2[i]);
sRetCode = SQLExecute(sStmt);

if(sRetCode == SQL_NEED_DATA)
{
sRetCode = SQLParamData(sStmt, (void **)&sMarker);

while(sRetCode == SQL_NEED_DATA)
{
printf("SQLParamData gave : %d\n", sMarker);

if(sMarker == 1)
{
sRetCode = SQLPutData(sStmt, &i1, 0);
}
else if(sMarker == 2)
{
int unitsize = 20;
int size;
int pos;
int len;

len = strlen((char *)(i2[i]));
for(pos = 0; pos < len;)
{
size = len - pos;
if(unitsize < size)
{
size = unitsize;
}
sRetCode = SQLPutData(sStmt, i2[i] + pos, size);

pos += size;
}
}
else
{
printf("bbbbbbbbbbbbbbbbbbbbbbbbbbbbb!!! unknown marker value\n");
exit(1);
}

sRetCode = SQLParamData(sStmt, (void **)&sMarker);
}
}
}

sRetCode = SQLFreeHandle(SQL_HANDLE_STMT, sStmt);
check_error(SQL_HANDLE_DBC, gHdbc, "STMT free", sRetCode);
}
```

#### ALTER SESSION 구문의 사용 제한

Altibase 4에서는 세션 속성(property)인 AUTOCOMMIT MODE, DEFAULT_DATE_FORMAT를
다음과 같이 지정했다.

```
SQLExecDirect(stmt, 
“ALTER SESSION SET AUTOCOMMIT=FALSE”, 
SQL_NTS);

SQLExecDirect(stmt,
“ALTER SESSION SET DEFAULT_DATE_FORMAT='YYYY/MM/DD'",
SQL_NTS); 
```

위의 두 세션 속성은 Altibase CLI의 변환(conversion) 및 트랜잭션 관련 함수들의
동작에 결정적인 영향을 주기 때문에 반드시 Altibase CLI 드라이버가 이에 대한
정보를 가지고 있어야 한다.

그러나 SQLExecDirect() 함수를 이용하여 SQL 구문을 서버에 직접 전송할 경우
Altibase CLI 드라이버가 해당 속성의 변경사항을 알 수 없다. 물론 해당 속성의 값을
알기 위해 Altibase CLI 드라이버가 서버에서 정보를 얻어올 수도 있지만 이는 성능을
저하시킬 수 있다.

이러한 문제 해결을 위해 Altibase 5에서는 SQLSetConnectAttr()으로 해당 속성을
수정하여, 별도의 절차 없이 Altibase CLI 드라이버가 유지하는 속성과 서버에 세팅된
속성이 항상 일치할 수 있도록 했다. Altibase CLI를 이용할 때 Altibase 5에서는
다음과 같이 프로그래밍하라.

```
SQLSetConnectAttr(conn,
SQL_ATTR_AUTOCOMMIT,
(SQLPOINTER)SQL_AUTOCOMMIT_OFF,
0);
SQLSetConnectAttr(conn,
ALTIBASE_DATE_FORMAT,
(SQLPOINTER)"YYYY/MM/DD",
SQL_NTS); 
```

#### SQLRowCount(), SQLMoreResults() functions

Altibase CLI의 결과 값(Result)은 다음 두 가지로 나뉜다.

-   Number of affected rows

-   Result set

Altibase CLI는 Altibase 5에서 다중 결과(multiple results)를 고려하고 있다. 즉,
한 번의 실행으로 복수의 결과들을 얻을 수 있다는 의미이다. 따라서 배열(Array)
바인딩을 사용할 때, SQLRowCount() 함수의 반환 값은 Altibase 4의 값과는 차이가
있다.

-   SQLRowCount() : “current” result 에서 affected row count를 얻는 함수

-   SQLMoreResults() : “next” result 로 이동하는 함수. current result 가 마지막
    result 이면 SQL_NO_DATA를 리턴한다.

##### 예제

```
CREATE TABLE T1 (I1 INTEGER);
INSERT INTO T1 VALUES(1);
INSERT INTO T1 VALUES(2); ........ 1000 번 반복.

SELECT * FROM T1;
T1
----- 
1 
2 
3 
. 
. 
. 
1000 
-----

SQLINTEGER p1[3];
SQLINTEGER p2[3];
SQLLEN rowcount = 0L;
SQLLEN totalRowcount = 0L;

p1[0] = 10; p2[0] = 20;
p1[1] = 100; p2[1] = 200;
p1[2] = 11; p2[2] = 14;

SQLSetStmtAttr(stmt, SQL_ATTR_PARAMSET_SIZE, 3); // <--- array binding

SQLBindParameter(stmt, 1, p1 ..);
SQLBindParameter(stmt, 2, p2 ..);

SQLExecDirect(stmt, 
(SQLCHAR *)"DELETE FROM T1 WHERE I1>? AND I1<?”, 
SQL_NTS);

do {
SQLRowCount(stmt, &rowcount);
printf("%d\n", rowcount);
totalRowcount += rowcount;
rc = SQLMoreResults(stmt);
} while (rc != SQL_NO_DATA);

printf(“totalRowcount = %d\n”, totalRowCount);
실행결과
9   -> DELETE FROM T1 WHERE I1>10 AND I1<20 에 대한 affected row count
199 -> DELETE FROM T1 WHERE I1>100 AND I1<200 에 대한 affected row count
0   -> DELETE FROM T1 WHERE I1>11 AND I1<14 에 대한 affected row count 
(첫번째 execution에서 지워졌으므로 레코드 존재하지 않음)
208 -> affected row count 의 합계.
```

각각의 인자를 받은 구문들의 실행 결과는 각각 생성되어 Altibase CLI 드라이버로
전달된다. 이렇게 여러 개의 결과가 생성될 경우 각각의 결과들은 SQLMoreResults()
함수를 통해 다음 결과로 이동하고, SQLRowCount()로 결과를 가져온다.

Altibase 4에서는 위의 세 개의 결과를 모두 합치면 SQLRowCount()가 208 이라는
결과를 반환한다.

만약 Altibase 5에서 Altibase 4와 동일한 결과를 얻기 위해서는 SQLMoreResults()
함수를 SQL_NO_DATA를 반환할 때까지 반복하고, SQLRowCount()로 가져온 결과를
더해줘야 한다.

#### 크기 제한 없는 Array Execute, Array Fetch

Altibase 5에서는 통신 버퍼 크기 만큼 Array Execute, Array Fetch를 할 수 있는
제약이 사라졌다.

따라서 메모리가 허용하는 만큼 Array binding을 할 수 있게 되었으며,
CM_BUFF_SIZE의 속성도 더 이상 지원하지 않는다.

#### 사라진 속성들

##### 배치 프로세싱 모드

연결 문자열(connection string)의 배치 키워드가 더 이상 지원되지 않는다.

또한 연결 속성인 SQL_ATTR_BATCH도 더 이상 지원되지 않는다.

##### SQL_ATTR_MAX_ROWS

Altibase 4에서는 성능 향상과 관련하여 prefetch 하는 행의 숫자를 지정하는 의미로
사용했다. 그러나 ODBC 문서에 따르면 이 속성은 SELECT 구문의 LIMIT 절과 비슷한
의미를 가진다. 이와 같은 기능은 Altibase CLI에서는 지원하지 않는다.

따라서 위 속성을 SQLSetStmtAttr() 함수로 세팅할 경우, ‘Optional feature not
implemented’ 오류가 발생하므로 주의해야 한다.

