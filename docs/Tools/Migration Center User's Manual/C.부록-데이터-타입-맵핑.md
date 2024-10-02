# C.부록: 데이터 타입 맵핑

이기종 데이터베이스 간의 데이터 타입을 맵핑할 때 Migration Center의 기본 정책은 "데이터 손실을 최소화하라"이다. 하지만 데이터가 손실되거나 손상되더라도 사용자가 데이터 타입 맵핑 방식을 직접 정의하는 것을 원할 수도 있다. 이런 요구를 만족시키기 위해 Migration Center는 데이터 타입 맵핑 테이블을 편집하는 방법을
제공한다.

이번 장에서는 Migration Center의 프로젝트 진행 과정에서 기본 데이터 타입 매핑 테이블을 확인하고 변경하는 방법을 설명한다. 또한 Migration Center의 기본 데이터 타입 매핑 테이블에서 사용자가 알아야 할 주의 사항을 설명한다.

### 데이터 타입 맵핑 테이블 변경

사용자는 아래와 같이 Reconcile 단계에서 데이터 타입의 맵핑 테이블을 변경할 수 있다.

**1. Reconcile(조정)**

프로젝트 트리 창에서 마우스 오른쪽 버튼을 클릭하고 Reconcile 메뉴를 선택한다. 또는 Migration 메뉴에서 Reconcile을 선택한다. 이 단계는 Build 단계를 마쳐야 수행할 수 있다.

<div align="left">
    <img src="media/MigrationCenter/datatypemapping-step-1.png">
</div>


**2. Data Type Mapping**

Reconcile 메뉴를 선택하면 아래와 같이 Reconcile 창이 뜬다. 사용자는 이 창에서 Migration Center의 기본 데이터 타입 매핑 테이블을 확인할 수 있고 "1. Data Type Mapping"에서 대상 데이터베이스의 데이터 타입을 변경할 수 있다. 변경하고 싶은 데이터 타입을 선택하고 오른쪽 하단의 Change 버튼을 클릭한다.

<div align="left">
    <img src="media/MigrationCenter/datatypemapping-step-2.png">
</div>


**3. Change Mapping Type**

Change 버튼을 클릭하면 아래의 창이 뜬다. Change Mapping Type 창에서 Destination DB Data Type에서 변경할 데이터 타입을 선택한다. 데이터 타입에 따라 필요 시 Precision과 Scale도 입력하고 OK 버튼을 클릭한다. 

<div align="left">
    <img src="media/MigrationCenter/datatypemapping-step-3.png">
</div>


### 기본 데이터 타입 맵핑 테이블

이기종 데이터베이스 간의 기본 데이터 타입 매핑 테이블과 사용자가 주의할 사항을 설명한다.

Migration Center 7.11부터 원본 데이터베이스의 문자형 데이터 타입을 처리할 때, 대상 데이터베이스의 문자 집합과 컬럼 크기 및 단위(바이트 또는 문자)를 고려하여 변환할 컬럼의 크기를 계산한다. 이때 계산된 크기가 대상 데이터베이스에서 정의한 데이터 타입의 최대 크기를 초과하면, CLOB 데이터 타입으로 변경한다. 이는 원본, 대상 데이터베이스 간의 데이터 타입 최대 크기 차이로 데이터 마이그레이션 시 데이터 손실을 최소화 하기 위한 조치이다. 대상 데이터 타입은 다음과 같다.

- CHAR
- VARCHAR 또는 VARCHAR2, LVARCHAR, TT_VARCHAR 

#### Oracle to Altibase

|      | 원본          | 대상              | 주의 사항                                                    |
| :--: | :------------ | :---------------- | :----------------------------------------------------------- |
|  1   | CHAR          | CHAR              | Altibase의 CHAR 타입은 byte 길이로만 정의할 수 있기 때문에 Oracle에서 문자 길이로 정의된 컬럼의 경우 자동으로 바이트 길이로 변환된다. |
|  2   | NCHAR         | NCHAR             | 원본 및 대상 데이터베이스의 NCHAR 컬럼의 명시적인 크기는 같다(예. NCHAR(10) -\> NCHAR(10)). 그러나, 오라클 JDBC 드라이버에서는 NCHAR 컬럼의 크기가 사용되는 바이트의 개수로 정의되는 반면, Altibase의 JDBC 드라이버에서는 NCHAR 컬럼의 크기가 저장되는 문자의 개수로 정의된다. 이는 Altibase에서 생성되는 NCHAR 컬럼이 필요에 따라 오라클보다 2배 또는 3배 정도 클 것이라는 의미이므로, 이런 점을 유의하도록 한다. |
|  3   | VARCHAR2      | VARCHAR 또는 CLOB | 오라클에서 문자 길이로 정의한 VARCHAR2는 Altibase에서 바이트 단위로 변환된다. Altibase의 VARCHAR는 바이트 단위로만 정의할 수 있다. |
|  4   | NVARCHAR2     | NVARCHAR          | NCHAR와 같은 이유로, 컬럼 크기가 서로 다르다.                |
|  5   | LONG          | CLOB              |                                                              |
|  6   | NUMBER        | NUMBER            | 오라클에서 precision과 scale 없이 정의된 NUMBER 타입 컬럼은 Altibase에서도 동일하게 precision과 scale이 없는 NUMBER 타입으로 변환된다. \*참고: 오라클과 Altibase 모두 precision과 scale 없이 NUMBER 타입으로 컬럼을 정의하면 데이터베이스 내부적으로 FLOAT 타입으로 다루어진다. |
|  7   | FLOAT         | FLOAT             |                                                              |
|  8   | BINARY FLOAT  | FLOAT             |                                                              |
|  9   | BINARY DOUBLE | VARCHAR(310)      | Altibase 에는 오라클 BINARY DOUBLE 타입과 호환되는 데이터 타입이 없으므로 데이터 손실을 막기 위해 문자 형으로 저장된다. |
|  10  | DATE          | DATE              |                                                              |
|  11  | TIMESTAMP     | DATE              | 스케일의 차이로 인해서 소량의 데이터 손실이 발생할 수 있다. 오라클에서는 타임스탬프 값의 스케일이 나노초(9자리 수)인 반면, Altibase에서는 타임스탬프 값의 스케일이 마이크로초(6자리 수)이다. |
|  12  | RAW           | BLOB              |                                                              |
|  13  | LONG RAW      | BLOB              |                                                              |
|  14  | BLOB          | BLOB              |                                                              |
|  15  | CLOB          | CLOB              |                                                              |
|  16  | NCLOB         | NVARCHAR(10666)   | Altibase에는 오라클 NCLOB 타입과 호환 가능한 데이터 타입이 없으므로, 최대 크기의 NVARCHAR 타입으로 변환된다. 실제 데이터 크기가 NVARCHAR 최대 크기를 초과하는 경우, 데이터를 마이그레이션하는 동안 데이터 손실이 발생할 수도 있다. |
|  17  | ROWID         | VARCHAR(18)       | 오라클의 ROWID는 문자형 데이터 타입으로 변환한다. Altibase는 ROWID라는 데이터 타입을 지원하지 않는다. |

#### MS SQL Server to Altibase

|      | 원본             | 대상             | 주의 사항                                                    |
| :--- | :--------------- | :--------------- | :----------------------------------------------------------- |
| 1    | BIGINT           | BIGINT           |                                                              |
| 2    | DECIMAL          | NUMERIC          |                                                              |
| 3    | INT              | INTEGER          |                                                              |
| 4    | NUMERIC          | NUMERIC          |                                                              |
| 5    | SMALLINT         | SMALLINT         |                                                              |
| 6    | MONEY            | FLOAT            |                                                              |
| 7    | TINYINT          | SMALLINT         |                                                              |
| 8    | SMALLMONEY       | FLOAT            |                                                              |
| 9    | BIT              | CHAR(1)          |                                                              |
| 10   | FLOAT            | VARCHAR(310)     | Altibase에는 SQL Server FLOAT 타입과 호환 가능한 데이터 타입이 없으므로, 데이터 손실을 막기 위해 VARCHAR(310)으로 맵핑된다. |
| 11   | REAL             | FLOAT            |                                                              |
| 12   | DATE             | DATE             |                                                              |
| 13   | DATETIME2        | DATE             | 스케일의 차이로 인해서 시간의 fraction 손실이 발생할 수 있다. SQL Server의 DATETIME2 타입 스케일이 나노초의 100배(7자리 수)인 반면, Altibase에서는 DATE 타입의 스케일이 마이크로초(6자리 수)이다. |
| 14   | DATETIME         | DATE             |                                                              |
| 15   | SMALLDATETIME    | DATE             |                                                              |
| 16   | CHAR             | CHAR             |                                                              |
| 17   | TEXT             | CLOB             |                                                              |
| 18   | VARCHAR          | VARCHAR          |                                                              |
| 19   | VARCHAR (MAX)    | CLOB             |                                                              |
| 20   | NVARCHAR         | NVARCHAR         |                                                              |
| 21   | NVARCHAR (MAX)   | NVARCHAR (10666) | Altibase에는 SQL Server NTEXT 타입과 호환 가능한 데이터 타입이 없다. 최대 크기의 NVARCHAR 타입이 사용된다. 실제 데이터 길이가 최대 NVARCHAR 크기를 초과하는 경우, 데이터를 마이그레이션하는 동안 데이터 손실이 발생할 수도 있다. |
| 22   | BINARY           | BYTE             |                                                              |
| 23   | IMAGE            | BLOB             |                                                              |
| 24   | VARBINARY        | BLOB             |                                                              |
| 25   | ALLIDENTITY      | NUMERIC(38, 0)   |                                                              |
| 26   | UNIQUEIDENTIFIER | VARCHAR(80)      | Altibase에는 SQL Server UNIQUEIDENTIFIER 타입과 호환 가능한 데이터 타입이 없으므로, 데이터 손실을 방지하기 위해 VARCHAR 타입이 사용된다. |
| 27   | SYSNAME          | NVARCHAR (128)   |                                                              |

#### MySQL to Altibase

|      | 원본               | 대상                            | 주의 사항                                                    |
| :--: | :----------------- | :------------------------------ | :----------------------------------------------------------- |
|  1   | TINYINT            | SMALLINT                        |                                                              |
|  2   | TINYINT UNSIGNED   | SMALLINT                        |                                                              |
|  3   | SMALLINT           | INTEGER                         |                                                              |
|  4   | SMALLINT UNSIGNED  | INTEGER                         |                                                              |
|  5   | MEDIUMINT          | INTEGER                         |                                                              |
|  6   | MEDIUMINT UNSIGNED | INTEGER                         |                                                              |
|  7   | INT (INTEGER)      | INTEGER                         | 주의: Altibase의 INT 타입의 최솟값(-2,147,483,647)은 MySQL INT 타입의 최솟값(-2,147,483,648) 보다 크다. |
|  8   | INT UNSIGNED       | BIGINT                          |                                                              |
|  9   | BIGINT             | BIGINT                          | 주의: Altibase의 BIGINT 타입의 최솟값(-9,223,372,036,854,775,807)은 MySQL BIGINT 타입의 최솟값(-9,223,372,036,854,775,808) 보다 크다. |
|  10  | BIGINT UNSIGNED    | NUMERIC(20,0)                   | Altibase에는 MySQL BIGINT UNSIGNED 타입과 호환 가능한 데이터 타입이 없으므로, 데이터 손실을 막기 위해 NUMERIC 타입으로 맵핑된다 |
|  11  | DECIMAL (NUMERIC)  | VARCHAR(70)                     | Altibase에는 MySQL DECIMAL 타입과 호환 가능한 데이터 타입이 없으므로, 데이터 손실을 막기 위해 VARCHAR 타입으로 맵핑된다. |
|  12  | FLOAT              | FLOAT                           |                                                              |
|  13  | DOUBLE             | VARCHAR(310)                    | Altibase에는 MySQL DECIMAL 타입과 호환 가능한 데이터 타입이 없으므로, 데이터 손실을 막기 위해 VARCHAR 타입으로 맵핑된다. |
|  14  | BIT                | VARBIT                          |                                                              |
|  15  | DATETIME           | DATE                            | 시각 부분이 0으로 설정된다.                                  |
|  16  | DATE               | DATE                            |                                                              |
|  17  | TIMESTAMP          | DATE                            | TIMEZONE 제외                                                |
|  18  | CHAR               | CHAR 또는 NCHAR                 | MySQL의 CHAR 컬럼의 문자 집합이 유니코드이면 Altibase의 문자 집합에 따라 Altibase의 데이터 타입이 결정된다. <br />\- MySQL의 CHAR 컬럼의 문자 집합이 유니코드일 때<br />  \- Altibase 문자 집합이 유니코드이면 CHAR<br />  - Altibase 문자 집합이 유니코드가 아니면 NCHAR |
|  19  | VARCHAR            | VARCHAR 또는 NVARCHAR 또는 CLOB | MySQL의 VARCHAR 컬럼의 문자 집합이 유니코드이면 Altibase의 문자 집합에 따라 Altibase의 데이터 타입이 결정된다. <br />\- MySQL의 VARCHAR 컬럼의 문자 집합이 유니코드일 때<br />  \- Altibase 문자 집합이 유니코드이면 CHAR<br />  - Altibase 문자 집합이 유니코드가 아니면 NVARCHAR<br /><br />MySQL의 VARCHAR 컬럼이 Altibase의 VARCHAR 최대 크기인 32,000바이트를 초과하면 Altibase의 데이터 타입을 CLOB으로 변환한다. 이는 MySQL과 Altibase의 데이터 타입 간에 최대 크기 차이로 마이그레이션 시 발생할 수 있는 데이터 손실을 방지하기 위해서이다. MySQL의 VARCHAR 최대 크기는 65,536바이트로 Altibase보다 크다. |
|  20  | BINARY             | BYTE                            |                                                              |
|  21  | VARBINARY          | BLOB                            |                                                              |
|  22  | TINYBLOB           | BLOB                            |                                                              |
|  23  | MEDIUMBLOB         | BLOB                            |                                                              |
|  24  | BLOB               | BLOB                            |                                                              |
|  25  | LONGBLOB           | BLOB                            |                                                              |
|  26  | TINYTEXT           | VARCHAR(255)                    |                                                              |
|  27  | TEXT               | CLOB                            |                                                              |
|  28  | MEDIUMTEXT         | CLOB                            |                                                              |
|  29  | LONGTEXT           | CLOB                            |                                                              |
|  30  | ENUM               | VARCHAR(10666)                  | Altibase에는 MySQL ENUM 타입과 호환 가능한 데이터 타입이 없으므로, 데이터 손실을 막기 위해 VARCHAR 타입으로 맵핑된다. |
|  31  | SET                | VARCHAR(10666)                  | Altibase에는 MySQL SET 타입과 호환 가능한 데이터 타입이 없으므로, 데이터 손실을 막기 위해 VARCHAR 타입으로 맵핑된다. |

#### Informix 11.5 to Altibase

|      | 원본          | 대상              | 주의 사항                                                    |
| :--: | :------------ | :---------------- | :----------------------------------------------------------- |
|  1   | BIGINT        | BIGINT            |                                                              |
|  2   | INT8          | BIGINT            |                                                              |
|  3   | INT           | INTEGER           |                                                              |
|  4   | SMALLINT      | SMALLINT          |                                                              |
|  5   | BIGSERIAL     | BIGINT            |                                                              |
|  6   | SERIAL8       | BIGINT            |                                                              |
|  7   | SERIAL        | INTEGER           |                                                              |
|  8   | FLOAT         | DOUBLE            |                                                              |
|  9   | REAL          | REAL              |                                                              |
|  10  | SMALLFLOAT    | REAL              |                                                              |
|  11  | MONEY         | NUMERIC           |                                                              |
|  12  | DECIMAL_FLOAT | FLOAT             |                                                              |
|  13  | DATE          | DATE              |                                                              |
|  14  | DATETIME      | DATE              |                                                              |
|  15  | BOOLEAN       | CHAR(1)           |                                                              |
|  16  | CHAR          | CHAR 또는 CLOB    | Informix의 CHAR 컬럼이 Altibase의 CHAR 최대 크기인 32,000바이트를 초과하면 Altibase의 데이터 타입을 CLOB으로 변환한다. 이는 Informix와 Altibase의 데이터 타입 간에 최대 크기 차이로 마이그레이션 시 발생할 수 있는 데이터 손실을 방지하기 위해서이다. Informix의 CHAR 최대 크기는 32,767바이트로 Altibase보다 크다. |
|  17  | NCHAR         | NCHAR             | NCHAR 데이터 타입의 최대 크기는 Informix(32,767)가 Altibase(32,000)보다 크기 때문에 데이터 손실이 발생할 수 있음을 염두에 두어야 한다. |
|  18  | VARCHAR       | VARCHAR           |                                                              |
|  19  | NVARCHAR      | NVARCHAR          |                                                              |
|  20  | LVARCHAR      | VARCHAR 또는 CLOB | Informix의 LVARCHAR 컬럼이 Altibase의 VARCHAR 최대 크기인 32,000바이트를 초과하면 Altibase의 데이터 타입을 CLOB으로 변환한다. 이는 Informix와 Altibase의 데이터 타입 간에 최대 크기 차이로 마이그레이션 시 발생할 수 있는 데이터 손실을 방지하기 위해서이다. Informix의 LVARCHAR 최대 크기는 32,767바이트로 Altibase보다 크다. |
|  21  | TEXT          | CLOB              |                                                              |
|  22  | CLOB          | CLOB              |                                                              |
|  23  | BYTE          | BLOB              |                                                              |
|  24  | BLOB          | BLOB              |                                                              |
|  25  | INTERVAL      | NUMBER(38)        |                                                              |

#### TimesTen to Altibase

|      | 원본          | 대상              | 주의 사항                                                    |
| :--: | :------------ | :---------------- | :----------------------------------------------------------- |
|  1   | BINARY        | BLOB              |                                                              |
|  2   | BINARY_DOUBLE | VARCHAR(310)      |                                                              |
|  3   | BINARY_FLOAT  | FLOAT             |                                                              |
|  4   | BLOB          | BLOB              |                                                              |
|  5   | CHAR          | CHAR              | Altibase의 CHAR 타입은 byte 길이로만 정의할 수 있기 때문에 TimesTen에서 문자 길이로 정의된 컬럼의 경우 자동으로 바이트 길이로 변환된다. |
|  6   | CLOB          | CLOB              |                                                              |
|  7   | DATE          | DATE              |                                                              |
|  8   | NCHAR         | NCHAR             |                                                              |
|  9   | NCLOB         | NVARCHAR(10666)   |                                                              |
|  10  | NUMBER        | NUMBER            |                                                              |
|  11  | NVARCHAR2     | NVARCHAR          | TimesTen의 VARCHAR2 최대 크기는 2,097,152 바이트로 Altibase의 VARCHAR 최대 크기 32,000 바이트보다 크기 때문에 데이터 손실이 발생할 수 있다. |
|  12  | ROWID         | VARCHAR(18)       |                                                              |
|  13  | TIME          | DATE              |                                                              |
|  14  | TIMESTAMP     | DATE              | TimesTen의 TIMESTAMP 최대 스케일이 나노초(9자릿수)로 Altibase의 DATE 최대 스케일 마이크로초(6자릿수)보다 크기 때문에 데이터 손실이 발생할 수 있다. |
|  15  | TT_BIGINT     | BIGINT            | TimesTen의 TT_BIGINT 최소 크기는 -9,223,372,036,854,775,808로 Altibase의 BIGINT 최소 크기 -9,223,372,036,854,775,807보다 작기 때문에 데이터 손실이 발생할 수 있다. |
|  16  | TT_CHAR       | CHAR              |                                                              |
|  17  | TT_DATE       | DATE              |                                                              |
|  18  | TT_DECIMAL    | NUMBER            | TimesTen의 TT_DECIMAL 최대 크기는 precision(40)으로 Altibase의 NUMBER 최대 크기 precision(38)보다 크기 때문에 데이터 손실이 발생할 수 있다. |
|  19  | TT_INTEGER    | INTEGER           | TimesTen의 TT_INTEGER 최소 크기는 -2,147,483,648로 Altibase의 INTEGER 최소 크기 -2,147,483,647보다 작기 때문에 데이터 손실이 발생할 수 있다. |
|  20  | TT_NCHAR      | NCHAR             |                                                              |
|  21  | TT_NVARCHAR   | NVARCHAR          | TimesTen의 TT_NVARCHAR 최대 크기(2,097,152 바이트)는 Altibase의 NVARCHAR 최대 크기(32,000 바이트)보다 크기 때문에 데이터 손실이 발생할 수 있다. |
|  22  | TT_SMALLINT   | SMALLINT          | TimesTen의 TT_SMALLINT 최소 크기(-32,768)는 Altibase의 SMALLINT 최소 크기(-32,767)보다 작기 때문에 데이터 손실이 발생할 수 있다. |
|  23  | TT_TIMESTAMP  | DATE              | TimesTen의 TT_TIMESTAMP 최대 스케일이 나노초(7자릿수)로 Altibase의 DATE 최대 스케일 마이크로초(6자릿수)보다 크기 때문에 데이터 손실이 발생할 수 있다. |
|  24  | TT_TINYINT    | SMALLINT          |                                                              |
|  25  | TT_VARCHAR    | VARCHAR 또는 CLOB | TimesTen의 TT_VARCHAR 컬럼이 Altibase의 VARCHAR 최대 크기인 32,000바이트를 초과하면 Altibase의 데이터 타입을 CLOB으로 변환한다. 이는 TimesTen과 Altibase의 데이터 타입 간에 최대 크기 차이로 마이그레이션 시 발생할 수 있는 데이터 손실을 방지하기 위해서이다. TimesTen의 TT_VARCHAR 최대 크기는 4,194,304바이트로 Altibase보다 크다. |
|  26  | VARBINARY     | BLOB              |                                                              |
|  27  | VARCHAR2      | VARCHAR 또는 CLOB | 1. TimesTen의 VARCHAR2 컬럼이 Altibase의 VARCHAR 최대 크기인 32,000바이트를 초과하면 Altibase의 데이터 타입을 CLOB으로 변환한다. 이는 TimesTen과 Altibase의 데이터 타입 간에 최대 크기 차이로 마이그레이션 시 발생할 수 있는 데이터 손실을 방지하기 위해서이다. TimesTen의 VARCHAR2 최대 크기는 4,194,304바이트로 Altibase보다 크다.<br />2. TimesTen에서 문자 길이로 정의한 VARCHAR2는 Altibase에서 바이트 단위로 변환된다. Altibase의 VARCHAR는 바이트 단위로만 정의할 수 있다. |

#### CUBRID to Altibase

|      | 원본       | 대상              | 주의 사항                                                    |
| :--: | :--------- | :---------------- | :----------------------------------------------------------- |
|  1   | SHORT      | SMALLINT          | CUBRID의 SHORT 최솟값(-32,768)이 Altibase의 SMALLINT 최솟값(-32,767)보다 작다 |
|  2   | INTEGER    | INTEGER           | CUBRID의 최솟값(-2,147,483,648)이 Altibase의 최솟값(-2,147,483,647)보다 작다. |
|  3   | BIGINT     | BIGINT            | CUBRID의 최솟값(-9,223,372,036,854,775,808)이 Altibase의 최솟값(-9,223,372,036,854,775,807)보다 작다. |
|  4   | NUMERIC    | NUMERIC           |                                                              |
|  5   | FLOAT      | REAL              |                                                              |
|  6   | DOUBLE     | DOUBLE            |                                                              |
|  7   | MONETARY   | DOUBLE            |                                                              |
|  8   | DATE       | DATE              |                                                              |
|  9   | TIME       | DATE              |                                                              |
|  10  | TIMESTAMP  | DATE              |                                                              |
|  11  | DATETIME   | DATE              |                                                              |
|  12  | CHAR       | CHAR 또는 CLOB    | CUBRID의 CHAR 컬럼이 Altibase의 CHAR 최대 크기인 32,000바이트를 초과하면 Altibase의 데이터 타입을 CLOB으로 변환한다. 이는 CUBRID와 Altibase의 데이터 타입 간에 최대 크기 차이로 마이그레이션 시 발생할 수 있는 데이터 손실을 방지하기 위해서이다. CUBRID의 CHAR 최대 크기는 1,073,741,823바이트로 Altibase보다 크다. |
|  13  | VARCHAR    | VARCHAR 또는 CLOB | CUBRID의 VARCHAR 컬럼이 Altibase의 VARCHAR 최대 크기인 32,000바이트를 초과하면 Altibase의 데이터 타입을 CLOB으로 변환한다. 이는 CUBRID와 Altibase 간에 최대 크기 차이로 마이그레이션 시 발생할 수 있는 데이터 손실을 방지하기 위해서이다. CUBRID의 VARCHAR 최대 크기는 1,073,741,823바이트로, Altibase보다 크다. |
|  14  | NCHAR      | NCHAR             | CUBRID의 NCHAR 타입 최대 크기가 1,073,741,823 바이트로 Altibase의 NCHAR 타입 최대 크기 16,000 바이트보다 크기 때문에 데이터 손실이 발생할 수 있다. |
|  15  | VARCHAR    | NVARCHAR          | CUBRID의 VARCHAR 타입 최대 크기가 1,073,741,823 바이트로 Altibase의 NVARCHAR 타입 최대 크기 16,000 바이트보다 크기 때문에 데이터 손실이 발생할 수 있다. |
|  16  | STRING     | VARCHAR           | CUBRID의 VARCHAR 타입과 동일한 데이터 타입으로 Altibase의 VARCHAR 타입 최대 크기 32,000 바이트보다 크기 때문에 데이터 손실이 발생할 수 있다. |
|  17  | BIT        | BLOB              |                                                              |
|  18  | VARBIT     | BLOB              |                                                              |
|  19  | BLOB       | BLOB              |                                                              |
|  20  | CLOB       | CLOB              |                                                              |
|  21  | ENUM       | VARCHAR(3200)     | Altibase가 지원하지 않는 데이터 타입이다. CUBRID의 열거형 문자열 상수들은 Altibase의 VARCHAR 타입으로 임의 변경하여 마이그레이션을 수행한다. |
|  22  | COLLECTION | VARCHAR(3200)     | Altibase가 지원하지 않는 데이터 타입이다. CUBRID의 COLLECTION 타입은 Altibase의 VARCHAR 타입으로 임의 변경하여 마이그레이션을 수행한다. |

#### Altibase to Oracle

|      | 원본     | 대상          | 주의 사항                                                    |
| :--: | :------- | :------------ | :----------------------------------------------------------- |
|  1   | CHAR     | CHAR          | Altibase의 CHAR 컬럼이 Oracle의 CHAR 최대 크기인 2,000바이트(또는 글자)를 초과하면 Oracle의 데이터 타입을 CLOB으로 변환한다. 이는 Altibase와 오라클 간에 최대 크기 차이로 마이그레이션 시 발생할 수 있는 데이터 손실을 방지하기 위해서이다. Altibase의 CHAR 최대 크기는 32,000바이트로 오라클의 최대 크기보다 크다. |
|  2   | NCHAR    | NCHAR         | Altibase NCHAR의 최대 크기는 32000바이트, Oracle NCHAR의 최대 크기는 2000 bytes이므로 데이터 손실이 발생할 수 있다. |
|  3   | VARCHAR  | VARCHAR2      | Altibase의 VARCHAR 컬럼이 Oracle의 VARCHAR2 최대 크기인 4,000바이트(또는 글자)를 초과하면 Oracle의 데이터 타입을 CLOB으로 변환한다. 이는 오라클과 Altibase의 데이터 타입 간에 최대 크기 차이로 마이그레이션 시 발생할 수 있는 데이터 손실을 방지하기 위해서이다. Altibase의 VARCHAR 최대 크기는 32,000바이트로, Oracle보다 크다. |
|  4   | NVARCHAR | NVARCHAR2     | Altibase NVARCHAR의 최대 크기는 32000바이트, Oracle NVARCHAR2의 최대 크기는 4000 bytes이므로 데이터 손실이 발생할 수 있다. |
|  5   | SMALLINT | NUMBER        |                                                              |
|  6   | INTEGER  | NUMBER        |                                                              |
|  7   | BIGINT   | NUMBER        |                                                              |
|  8   | REAL     | BINARY_FLOAT  |                                                              |
|  9   | DOUBLE   | BINARY_DOUBLE |                                                              |
|  10  | FLOAT    | FLOAT         |                                                              |
|  11  | NUMERIC  | NUMBER        |                                                              |
|  12  | DATE     | TIMESTAMP     |                                                              |
|  13  | BIT      | CHAR          | CHAR의 최대크기는 2,000바이트, BIT는 64,000비트 즉, 8,000바이트이므로 데이터 손실이 발생할 수 있다. |
|  14  | VARBIT   | VARCHAR2      | VARCHAR2 의 최대크기는 4,000 바이트 , VARBIT는 64,000비트 즉, 8,000바이트이므로 데이터 손실이 발생할 수 있다. |
|  15  | BYTE     | RAW           | BYTE의 최대 크기는 32,000, RAW의 최대 크기는 2,000 바이트이므로 데이터 손실이 발생할 수 있다. |
|  16  | VARBYTE  | RAW           | VARBYTE의 최대 크기는 32,000, RAW의 최대 크기는 2,000 바이트이므로 데이터 손실이 발생할 수 있다. |
|  17  | NIBBLE   | RAW           |                                                              |
|  18  | BLOB     | BLOB          |                                                              |
|  19  | CLOB     | CLOB          |                                                              |

#### Tibero to Altibase

|      | 원본          | 대상            | 주의 사항                                                    |
| :--: | :------------ | --------------- | :----------------------------------------------------------- |
|  1   | CHAR          | CHAR            | Altibase의 CHAR 타입은 byte 길이로만 정의할 수 있기 때문에 Tibero에서 문자 길이로 정의된 컬럼의 경우 자동으로 바이트 길이로 변환된다. |
|  2   | NCHAR         | NCHAR           |                                                              |
|  3   | VARCHAR       | VARCHAR         | Altibase의 VARCHAR 타입은 byte 길이로만 정의할 수 있기 때문에 Tibero에서 문자 길이로 정의된 컬럼의 경우 자동으로 바이트 길이로 변환된다. |
|  4   | NVARCHAR      | NVARCHAR        |                                                              |
|  5   | LONG          | CLOB            |                                                              |
|  6   | NUMBER        | NUMERIC         | 티베로에서 precision과 scale 없이 정의된 NUMBER 타입 컬럼은 Altibase에서도 동일하게 precision과 scale이 없는 NUMBER 타입으로 변환된다. \*참고: 티베로와 Altibase 모두 precision과 scale이 없는 NUMBER 타입으로 컬럼을 정의하면 데이터베이스 내부적으로 FLOAT 타입으로 처리한다. |
|  7   | BINARY FLOAT  | FLOAT           |                                                              |
|  8   | BINARY DOUBLE | VARCHAR(310)    | Altibase에는 티베로의 BINARY DOUBLE 타입과 호환되는 데이터 타입이 없으므로 데이터 손실을 막기 위해 문자형으로 저장된다. |
|  9   | DATE          | DATE            |                                                              |
|  10  | TIME          | DATE            |                                                              |
|  11  | TIMESTAMP     | DATE            | Scale의 차이로 인해서 소량의 데이터 손실이 발생할 수 있다. 티베로에서는 타임스탬프 값의 스케일이 나노초(9자리 수)인 반면, , Altibase에서는 타임스탬프 값의 scale이 마이크로초(6자리 수)이다. |
|  12  | RAW           | BLOB            |                                                              |
|  13  | LONG RAW      | BLOB            |                                                              |
|  14  | BLOB          | BLOB            |                                                              |
|  15  | CLOB          | CLOB            |                                                              |
|  16  | NCLOB         | NVARCHAR(10666) | Altibase에는 티베로 NCLOB 타입과 호환 가능한 데이터 타입이 없으므로, 최대 크기의 NVARCHAR 타입으로 변환된다. 실제 데이터 크기가 NVARCHAR의 최대 크기를 초과하는 경우, 데이터를 마이그레이션하는 동안 데이터 손실이 발생할 수 있다. |
|  17  | ROWID         | VARCHAR(18)     | 티베로의 ROWID는 문자형 데이터 타입으로 변환한다. Altibase는 ROWID라는 데이터 타입을 지원하지 않는다. |

#### PostgreSQL to Altibase

다음은 PostgreSQL와 Altibase의 데이터 타입의 차이와 마이그레이션 시 주의해야 할 사항을 나타낸 표이다.

|      | PostgreSQL                      | Altibase          | 주의 사항                                                    |
| :--: | :------------------------------ | :---------------- | :----------------------------------------------------------- |
|  1   | SMALLINT                        | SMALLINT          | PostgreSQL과 Altibase의 표현 범위 차이로 마이그레이션 시 데이터 손실이 발생할 수 있다. PostgreSQL의 SMALLINT는 **-32,768** ~ 32,767이고 Altibase는 **-32,767** ~ 32,767이다. |
|  2   | INTEGER                         | INTEGER           | PostgreSQL과 Altibase의 표현 범위 차이로 마이그레이션 시 데이터 손실이 발생할 수 있다. PostgreSQL의 INTEGER는 **-2,147,483,648** ~ 2,147,483,647이고 Altibase는 **-2,147,483,647** ~ 2,147,483,647이다. |
|  3   | BIGINT                          | BIGINT            | PostgreSQL과 Altibase의 표현 범위 차이로 마이그레이션 시 데이터 손실이 발생할 수 있다. PostgreSQL의 BIGINT는 **-9,223,372,036,854,775,808** ~ 9,223,372,036,854,775,807이고 Altibase는 **-9,223,372,036,854,775,807** ~ 9,223,372,036,854,775,807이다. |
|  4   | NUMERIC (DECIMAL)               | NUMERIC           | PostgreSQL과 Altibase의 표현 범위 차이로 마이그레이션 시 데이터 손실이 발생할 수 있다. PostgreSQL은 Precision: 1 ~ 1,000, Scale: 0 ~ _precision_ 이고 Altibase는 Precision: 1 ~ 38, Scale: -84 ~ 128이다. <br />또한, Altibase는 Infinity와 -Infinity 그리고 NaN을 표현할 수 없기 때문에 해당 값들에서 데이터 손실이 발생할 수 있다. |
|  5   | REAL                            | REAL              |                                                              |
|  6   | DOUBLE PRECISION                | DOUBLE            |                                                              |
|  7   | MONEY                           | VARCHAR(30)       | 데이터 타입 MONEY는 Altibase에서 문자형 데이터 타입 VARCHAR(30)으로 변환된다.<br>MONEY의 형식이 천단위 구분자가 쉼표(,)이고 소숫점 구분자가 마침표(.)라면 Reconcile 단계에서 숫자형 데이터 타입 NUMERIC(20,2)으로 변환할 수 있다. |
|  8   | CHARACTER <br/> CHAR            | CHAR              |                                                              |
|  9   | CHARACTER VARYING <br/> VARCHAR | VARCHAR 또는 CLOB | PostgreSQL와 Altibase의 문자 집합에 따라 마이그레이션 센터에 의해 자동 보정된 컬럼 길이가 32,000바이트보다 작으면 VARCHAR로, 32,000바이트를 초과하면 CLOB으로 변환한다. 32,000바이트는 Altibase의 VARCHAR 타입의 최대 크기이다. |
|  10  | TEXT                            | CLOB              | PostgreSQL의 TEXT는 CLOB으로 변환한다.                       |
|  11  | BOOLEAN                         | CHAR(1)           | PostgreSQL의 BOOLEAN은 CHAR(1)으로 변환한다. true는 't'로, false는 'f로 변환하여 저장하며 unknown은 널(null)로 저장한다. |
|  12  | DATE                            | DATE              | PostgreSQL의 DATE에 저장된 -infinity와 infinity는 Altibase에서 각각 21506-12-03, 11567-08-17로 변환된다. 참고로, -infinity와 infinity는 PostgreSQL의 특수한 값으로 내부적으로 각각 292269055-12-03, 292278994-08-17로 표현된다. |
|  13  | TIME WITH TIME ZONE             | DATE              | Altibase는 시간만 표현하는 데이터 타입이 없어 DATE 타입으로 변환하고 TIME ZONE 정보는 유실된다. |
|  14  | TIME WITHOUT TIME ZONE          | DATE              | Altibase는 시간만 표현하는 데이터 타입이 없어 DATE 타입으로 변환한다. |
|  15  | TIMESTAMP WITH TIME ZONE        | DATE              | TIME ZONE 정보는 유실되며, -infinity와 infinity는 Altibase에서 각각 11567-08-17, 21506-12-03 으로 변환된다. |
|  16  | TIMESTAMP WITHOUT TIME ZONE     | DATE              | PostgreSQL의 데이터 타입 TIMESTAMP WITHOUT TIME ZONE에 저장된 -infinity와 infinity는 각각 Altibase에서 11567-08-17 08:00:00.0, 21506-12-03 08:00:00.0으로 변환된다. |
|  17  | INTERVAL                        | VARCHAR(100)      | Altibase에는 호환되는 데이터 타입이 없으므로, 데이터 손실을 막기 위해 VARCHAR타입으로 저장된다. |
|  18  | CIDR                            | VARCHAR(43)       | Altibase에는 호환되는 데이터 타입이 없으므로, 데이터 손실을 막기 위해 VARCHAR타입으로 저장된다. |
|  19  | INET                            | VARCHAR(43)       | Altibase에는 호환되는 데이터 타입이 없으므로, 데이터 손실을 막기 위해 VARCHAR타입으로 저장된다. |
|  20  | MACADDR                         | VARCHAR(17)       | Altibase에는 호환되는 데이터 타입이 없으므로, 데이터 손실을 막기 위해 VARCHAR타입으로 저장된다. |
|  21  | BIT                             | BIT               | PostgreSQL의 BIT 컬럼 크기가 64,000비트 이하면 BIT로, 64,000비트를 초과하면 CLOB으로 변환한다. 이는 PostgreSQL과 Altibase의 데이터 타입 간에 최대 크기 차이로 마이그레이션 시 발생할 수 있는 데이터 손실을 방지하기 위해서이다. PostgreSQL의 BIT 최대 크기는 83,886,080비트로 Altibase의 64,000비트 보다 크다. |
|  22  | BIT VARYING                     | VARBIT 또는 CLOB  | PostgreSQL의 BIT VARYING 컬럼 크기가 64,000비트 이하이면 VARBIT 타입으로, 64,000비트를 초과하면 CLOB으로 변환한다. 이는 PostgreSQL과 Altibase의 데이터 타입 간에 최대 크기 차이로 마이그레이션 시 발생할 수 있는 데이터 손실을 방지하기 위해서이다. PostgreSQL의 BIT VARYING 최대 크기는 83,886,080비트로 Altibase의 64,000비트 보다 크다. |
|  23  | XML                             | CLOB              | Altibase에는 호환되는 데이터 타입이 없으므로, 데이터 손실을 막기 위해 CLOB 타입으로 저장된다. |
|  24  | JSON                            | CLOB              | Altibase에는 호환되는 데이터 타입이 없으므로, 데이터 손실을 막기 위해 CLOB 타입으로 저장된다. |
|  25  | JSONB                           | BLOB              | Altibase에는 호환되는 데이터 타입이 없으므로, 데이터 손실을 막기 위해 BLOB 타입으로 저장된다. |
|  26  | ENUM                            | VARCHAR(32000)    | Altibase에는 호환되는 데이터 타입이 없으므로, 데이터 손실을 막기 위해 VARCHAR타입으로 저장된다. |
|  27  | UUID                            | VARCHAR(36)       | Altibase에는 호환되는 데이터 타입이 없으므로, 데이터 손실을 막기 위해 VARCHAR타입으로 저장된다. |
|  28  | ARRAY                           | VARCHAR(32000)    | Altibase에는 호환되는 데이터 타입이 없으므로, 데이터 손실을 막기 위해 VARCHAR타입으로 저장된다. |
|  29  | COMPOSITE                       | VARCHAR(32000)    | Altibase에는 호환되는 데이터 타입이 없으므로, 데이터 손실을 막기 위해 VARCHAR타입으로 저장된다. |
|  30  | RANGE                           | VARCHAR(32000)    | Altibase에는 호환되는 데이터 타입이 없으므로, 데이터 손실을 막기 위해 VARCHAR타입으로 저장된다. |
|  31  | POINT                           | VARCHAR(32000)    | Altibase에는 호환되는 데이터 타입이 없으므로, 데이터 손실을 막기 위해 VARCHAR타입으로 저장된다. |
|  32  | LINE                            | VARCHAR(32000)    | Altibase에는 호환되는 데이터 타입이 없으므로, 데이터 손실을 막기 위해 VARCHAR타입으로 저장된다. |
|  33  | LSEG                            | VARCHAR(32000)    | Altibase에는 호환되는 데이터 타입이 없으므로, 데이터 손실을 막기 위해 VARCHAR타입으로 저장된다. |
|  34  | BOX                             | VARCHAR(32000)    | Altibase에는 호환되는 데이터 타입이 없으므로, 데이터 손실을 막기 위해 VARCHAR타입으로 저장된다. |
|  35  | PATH                            | VARCHAR(32000)    | Altibase에는 호환되는 데이터 타입이 없으므로, 데이터 손실을 막기 위해 VARCHAR타입으로 저장된다. |
|  36  | POLYGON                         | VARCHAR(32000)    | Altibase에는 호환되는 데이터 타입이 없으므로, 데이터 손실을 막기 위해 VARCHAR타입으로 저장된다. |
|  37  | CIRCLE                          | VARCHAR(32000)    | Altibase에는 호환되는 데이터 타입이 없으므로, 데이터 손실을 막기 위해 VARCHAR타입으로 저장된다. |


### 이종 문자 집합을 고려한 문자형 컬럼 길이 자동 보정

마이그레이션시 원본(Source)과 대상(Destination) 데이터베이스의 문자 집합(character set)이 서로 다른 경우, 문자형 데이터 타입 (CHAR, VARCHAR)은 길이 변환이 필요하다.
예를 들어 원본 데이터베이스는 한 문자당 최대 2바이트 저장소가 필요한 MS949 문자집합으로, 대상 데이터베이스는 한 문자당 3바이트가 필요한 UTF8 문자 집합으로 설정되어 있다면, 데이터 잘림 없이 마이그레이션을 하기 위해서는 대상 데이터베이스의 문자형 데이터 타입의 크기가 원본의 1.5배가 되어야 한다.

Migration Center는 이러한 길이 변환을 자동으로 해 주며, 문자형 데이터 타입의 길이 보정식은 아래와 같다.

```
Dest. Size = Ceil(Correction Factor * Src. Size)
Correction Factor = Dest. MaxBytes / Src. MaxBytes
* MaxBytes = The maximum number of bytes required to store one character
```

단, 원본의 MaxBytes가 1이거나 보정 계수 (Correction Factor)가 1보다 작은 경우에는 길이 변환을 하지 않는다.

원본과 대상 데이터베이스의 MaxBytes와 보정 계수는 Build Report의 Summary 페이지에서 확인할 수 있다.

#### 주의 사항

대용량 테이블의 경우 길이 보정으로 인해 대상 데이터베이스의 데이터 저장 사이즈가 원본보다 훨씬 커질 수 있다. 길이를 변환하지 않아도 데이터가 잘리지 않는다는 보장이 있다면 조정(Reconcile) 단계에서 수동으로 길이를 지정할 수 있다.

#### 데이터베이스별 지원 문자 집합

아래 표에 없는 문자 집합의 경우에는 Migration Center가 길이 보정을 하지 않는다.

##### Altibase

| Character Set | Max. Bytes Per Character |
| ------------- | ------------------------ |
| KO16KSC5601   | 2                        |
| MS949         | 2                        |
| BIG5          | 2                        |
| GB231280      | 2                        |
| MS936         | 2                        |
| UTF8          | 3                        |
| SHIFTJIS      | 2                        |
| MS932         | 2                        |
| EUCJP         | 3                        |

##### Cubrid

| Character Set | Max. Bytes Per Character |
| ------------- | ------------------------ |
| utf8          | 3                        |
| euckr         | 2                        |

##### Informix

| Character Set      | Max. Bytes Per Character |
| ------------------ | ------------------------ |
| zh_cn.GB18030_2000 | 4                        |
| zh_tw.big5         | 2                        |
| zh_tw.euctw        | 4                        |
| zh_cn.gb           | 2                        |
| zh_tw.sbig5        | 2                        |
| zh_tw.ccdc         | 2                        |
| ja_jp.sjis-s       | 2                        |
| ja_jp.ujis         | 3                        |
| ja_up.sjis         | 2                        |
| ko_kr.cp949        | 2                        |
| ko_kr.ksc          | 2                        |

##### MySQL

아래 쿼리의 결과 집합을 참조하기 바란다.

```
SELECT CHARACTER_SET_NAME,MAXLEN FROM INFORMATION_SCHEMA.CHARACTER_SETS;
```

##### SQL Server

| Code Page | Max. Bytes Per Character |
| --------- | ------------------------ |
| 932       | 2                        |
| 936       | 2                        |
| 949       | 2                        |
| 950       | 2                        |

##### Oracle

| Character Set | Max. Bytes Per Character |
| ------------- | ------------------------ |
| AL32UTF8      | 4                        |
| JA16EUC       | 3                        |
| JA16EUCTILDE  | 3                        |
| JA16SJIS      | 2                        |
| JA16SJISTILDE | 2                        |
| KO16MSWIN949  | 2                        |
| UTF8          | 3                        |
| ZHS16GBK      | 2                        |
| ZHT16HKSCS    | 2                        |
| ZHT16MSWIN950 | 2                        |
| ZHT32EUC      | 4                        |

##### Tibero

| Character Set | Max. Bytes Per Character |
| ------------- | ------------------------ |
| UTF8          | 3                        |
| EUCKR         | 2                        |
| MSWIN949      | 2                        |
| SJIS          | 2                        |
| JA16SJIS      | 2                        |
| JA16SJISTILDE | 2                        |
| JA16EUC       | 3                        |
| JA16EUCTILDE  | 3                        |
| GBK           | 2                        |
| ZHT16HKSCS    | 2                        |

##### TimesTen

| Character Set  | Max. Bytes Per Character |
| -------------- | ------------------------ |
| AL16UTF16      | 4                        |
| AL32UTF8       | 4                        |
| JA16EUC        | 3                        |
| JA16EUCTILDE   | 3                        |
| JA16SJIS       | 2                        |
| JA16SJISTILDE  | 2                        |
| KO16KSC5601    | 2                        |
| KO16MSWIN949   | 2                        |
| ZHS16CGB231280 | 2                        |
| ZHS16GBK       | 2                        |
| ZHS32GB18030   | 4                        |
| ZHT16BIG5      | 2                        |
| ZHT16HKSCS     | 2                        |
| ZHT16MSWIN950  | 2                        |
| ZHT32EUC       | 4                        |

##### PostgreSQL

| Character Set  | Max. Bytes Per Character |
| :------------- | :----------------------: |
| BIG5           |            2             |
| EUC_CN         |            3             |
| EUC_JP         |            3             |
| EUC_JIS_2004   |            3             |
| EUC_KR         |            3             |
| EUC_TW         |            3             |
| GB18030        |            4             |
| GBK            |            2             |
| ISO_8859_5     |            1             |
| ISO_8859_6     |            1             |
| ISO_8859_7     |            1             |
| ISO_8859_8     |            1             |
| JOHAB          |            3             |
| KOI8R          |            1             |
| KOI8U          |            1             |
| LATIN1         |            1             |
| LATIN2         |            1             |
| LATIN3         |            1             |
| LATIN4         |            1             |
| LATIN5         |            1             |
| LATIN6         |            1             |
| LATIN7         |            1             |
| LATIN8         |            1             |
| LATIN9         |            1             |
| LATIN10        |            1             |
| MULE_INTERNAL  |            4             |
| SJIS           |            2             |
| SHIFT_JIS_2004 |            2             |
| SQL_ASCII      |            1             |
| UHC            |            2             |
| UTF8           |            4             |
| WIN866         |            1             |
| WIN874         |            1             |
| WIN1250        |            1             |
| WIN1251        |            1             |
| WIN1252        |            1             |
| WIN1253        |            1             |
| WIN1254        |            1             |
| WIN1255        |            1             |
| WIN1256        |            1             |
| WIN1257        |            1             |
| WIN1258        |            1             |

<br/>

