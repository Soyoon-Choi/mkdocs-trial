# A. 부록: 이기종간 데이터 타입 호환 테이블

dataCompJ가 지원하는 이기종 데이터베이스 간의 데이터 타입 매핑 테이블이다.

dataCompJ가 지원하지 않는 데이터 타입을 가진 테이블을 대상으로 데이터 비교를 수행하면 다음과 같이 처리된다.

-   Master 테이블과 Slave 테이블 모두 dataCompJ가 지원하지 않는 데이터 타입인 경우: 구축(Build) 단계에서 지원하지 않는 데이터 타입이라는 에러를 리포트 파일(dataCompJ_report.txt)에 출력하고, 실행(Run) 단계를 수행하지 않는다.

-   Master 테이블과 Slave 테이블 둘 중 하나만 지원하는 데이터 타입인 경우: 구축(Build) 단계에서 테이블의 비교 대상 컬럼의 개수가 다르다는 에러를 리포트 파일(dataCompJ_report.txt)에 출력하고, 실행(run) 단계를 수행하지 않는다.

dataCompJ가 지원하는 데이터 타입이지만, 비교 대상 테이블의 컬럼 데이터 타입이 이기종간 데이터 타입 호환 테이블과 다른 데이터 타입 조합을 사용하는 경우 다음과 같이 처리된다.

-   데이터 비교 자체가 아예 불가능한 타입의 경우 (예를 들어, 정수형과 문자형 데이터 타입간의 비교): 구축(build) 단계에서 호환되지 않는 타입이라는 에러를 리포트 파일(dataCompJ_report.txt)에 출력하고, 실행(run) 단계를 수행하지 않는다.

-   비교는 가능하지만 상이한 데이터 타입의 경우 (예를 들어, 정수형과 부동 소수점 형): 구축(build) 단계에서 처리할 수 없으므로, 그대로 실행(run) 단계를 수행한다. 단, 수행 결과에 모든 레코드가 불일치 레코드로 처리된다.

#### Altibase to Oracle

| Altibase | Oracle         | 설명                                                         |
| -------- | -------------- | ------------------------------------------------------------ |
| SMALLINT | NUMBER         |                                                              |
| INTEGER  | NUMBER         |                                                              |
| BIGINT   | NUMBER         |                                                              |
| NUMERIC  | NUMBER         |                                                              |
| REAL     | NUMBER         |                                                              |
| DOUBLE   | NUMBER         |                                                              |
| FLOAT    | FLOAT          |                                                              |
| DATE     | DATE TIMESTAMP | - DATE - TIMESTAMP의 경우 소수점의 자릿수가 짧은 쪽을 기준으로 하여 비교한다. 예를 들어 Altibase DATE는 마이크로 초까지 지원하고, Oracle의 TIMESTAMP는 나노 초까지 지원 한다. 이 경우, 레코드의 동일 여부 비교는 나노 초를 기준으로 한다.<br />- DATE-DATE의 경우 Oracle DATE 타입은 YYYY-MM-DD HH:MM:SS까지 지원한다. 따라서, 이 경우 Altibase DATE 타입의 데이터에서 소수점 이하의 초는 무시하고 동일한 YYYY-MM-DD HH:MM:SS 형식으로 비교한다. |
| CHAR     | CHAR           |                                                              |
| VARCHAR  | VARCHAR2       |                                                              |
| NCHAR    | NCHAR          |                                                              |
| NVARCHAR | NVARCHAR2      |                                                              |

#### Altibase to MariaDB

| Altibase | MariaDB                                       | 설명                                                         |
| -------- | --------------------------------------------- | ------------------------------------------------------------ |
| SMALLINT | SMALLINT                                      |                                                              |
| INTEGER  | INT                                           |                                                              |
| BIGINT   | BIGINT                                        |                                                              |
| NUMERIC  | DECIMAL                                       |                                                              |
| REAL     | FLOAT                                         |                                                              |
| DOUBLE   | DOUBLE                                        |                                                              |
| FLOAT    | N/A                                           | Altibase Float 타입에 해당하는 MariaDB의 데이터 타입은 없다. |
| DATE     | DATE, DATETIME, TIMESTAMP                     | - DATE-DATE: MariaDB의 DATE는 YYYY-MM-DD까지 지원한다. 따라서, 이 경우 Altibase DATE 타입의 데이터에서 날짜 이하는 무시하고 동일한 YYYY-MM-DD 형식으로 비교한다. <br />- DATE-DATETIME: MariaDB의 DATE는 YYYY-MM-DD HH:MM:SS까지 지원한다. 따라서, 이 경우 Altibase DATE 타입의 데이터에서 소수점 이하의 초는 무시하고 동일한 YYYY-MM-DD HH:MM:SS 형식으로 비교한다.<br />- DATE-TIMESTAMP: MariaDB의 DATE는 YYYY-MM-DD HH:MM:DD Microseconds 0 \~ 6 (default: 0)까지 지원한다. 따라서, Altibase DATE 데이터에서 동일한 부분을 추출하여 비교한다. |
| CHAR     | CHAR                                          |                                                              |
| VARCHAR  | VARCHAR, TINYTEXT, TEXT, MEDIUMTEXT, LONGTEXT |                                                              |
| NCHAR    | CHAR with Character set                       |                                                              |
| NVARCHAR | VARCHAR with Character set                    |                                                              |
