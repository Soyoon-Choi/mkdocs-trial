# B.부록: 마이그레이션 가능한 데이터베이스 객체

"구축" 방식에 따라 데이터베이스 객체의 이관 여부 및 유의사항을 설명한다.

Migration Center에서 지원하지 않는 원본 데이터베이스의 객체는 사용자가 직접 수동으로 변환해야 한다. Migration Center 7.11부터 구축(Build) 단계에서 객체 생성 구문을 아래 두 파일에 기록하고 있으므로 사용자는 이 파일들을 변환 작업에 참고할 수 있다.

- SrcDbObj_Create.sql
- BuildReport4Unsupported.html

### Altibase to Altibase

| 데이터베이스 객체 유형 | 'Build User'로 마이그레이션 가능 여부 | 'Build Table'로 마이그레이션 가능 여부 | 비고                                                         |
| :--------------------- | :-----------------------------------: | :------------------------------------: | ------------------------------------------------------------ |
| Table                  |                   O                   |                   O                    | 테이블과 컬럼에 명시된 주석(comment)도 함께 마이그레이션된다. |
| Primary Key 제약       |                   O                   |                   O                    |                                                              |
| Unique 제약            |                   O                   |                   O                    |                                                              |
| Check 제약             |                   O                   |                   O                    |                                                              |
| Foreign Key 제약       |                   O                   |                   O                    |                                                              |
| Index                  |                   O                   |                   O                    |                                                              |
| Sequence               |                   O                   |                   X                    |                                                              |
| Queue                  |                   O                   |                   X                    |                                                              |
| Private Synonym        |               부분 지원               |                   X                    | 다른 schema 내의 객체를 참조하는 시노님도 마이그레이션된다.  |
| Procedure              |               부분 지원               |                   X                    | 별도의 변환작업 없이 원본 DDL 그대로 수행된다.               |
| Function               |               부분 지원               |                   X                    | 별도의 변환작업 없이 원본 DDL 그대로 수행된다.               |
| Package                |               부분 지원               |                   X                    | 별도의 변환작업 없이 원본 DDL 그대로 수행된다.               |
| View                   |               부분 지원               |                   X                    | 별도의 변환작업 없이 원본 DDL 그대로 수행된다.               |
| Materialized View      |               부분 지원               |                   X                    | 별도의 변환작업 없이 원본 DDL 그대로 수행된다.               |
| Trigger                |               부분 지원               |                   X                    | 별도의 변환작업 없이 원본 DDL 그대로 수행된다.               |

### Altibase to Oracle

| 데이터베이스 객체 유형 | 'Build User'로 마이그레이션 가능 여부 | 'Build Table'로 마이그레이션 가능 여부 | 비고                                                         |
| :--------------------- | :-----------------------------------: | :------------------------------------: | :----------------------------------------------------------- |
| Table                  |                   O                   |                   O                    |                                                              |
| Primary Key 제약       |                   O                   |                   O                    |                                                              |
| Unique 제약            |                   O                   |                   O                    |                                                              |
| Check 제약             |                   O                   |                   O                    |                                                              |
| Foreign Key 제약       |                   O                   |                   O                    |                                                              |
| Index                  |                   O                   |                   O                    |                                                              |
| Sequence               |                   O                   |                   X                    |                                                              |
| Queue                  |                   X                   |                   X                    | 변환 가능한 객체가 없기 때문에, build 단계에서 자동으로 제외된다. |
| Private Synonym        |               부분 지원               |                   X                    | 다른 schema 내의 객체를 참조하는 시노님도 마이그레이션된다.  |
| Procedure              |               부분 지원               |                   X                    | 별도의 변환작업 없이 원본 DDL 그대로 수행된다.               |
| Function               |               부분 지원               |                   X                    | 별도의 변환작업 없이 원본 DDL 그대로 수행된다.               |
| Package                |               부분 지원               |                   X                    | 별도의 변환작업 없이 원본 DDL 그대로 수행된다.               |
| View                   |               부분 지원               |                   X                    | 별도의 변환작업 없이 원본 DDL 그대로 수행된다.               |
| Materialized View      |               부분 지원               |                   X                    | 별도의 변환작업 없이 원본 DDL 그대로 수행된다. 참고로 migration을 위해서는 베이스 테이블에 primary key가 있어야 한다. |
| Trigger                |               부분 지원               |                   X                    | 별도의 변환작업 없이 원본 DDL 그대로 수행된다.               |

### CUBRID to Altibase

| 데이터베이스 객체 유형   | 'Build User'로 마이그레이션 가능 여부 | 'Build Table'로 마이그레이션 가능 여부 | 비고                                                         |
| :----------------------- | :-----------------------------------: | :------------------------------------: | :----------------------------------------------------------- |
| Table                    |                   O                   |                   O                    | 테이블과 컬럼에 명시된 주석(comment)도 함께 마이그레이션된다. |
| Primary Key 제약         |                   O                   |                   O                    |                                                              |
| Unique 제약              |                   O                   |                   O                    |                                                              |
| Foreign Key 제약         |                   O                   |                   O                    |                                                              |
| Index                    |                   O                   |                   O                    | CUBRID의 Reverse index와 Prefix length index는 Altibase에서 지원하지 않는다. Reverse index는 인덱스 생성시 키 값을 역으로 넣는 방식으로, Altibase 마이그레이션에서 지원하지 않는다. Prefix length index는 키 값의 일정 부분만을 인덱싱하는 기법으로, 마이그레이션시 Altibase의 일반 인덱스로 대체된다. |
| auto_increment 컬럼 속성 |                   O                   |                   O                    | Sequence로 마이그레이션된다.                                 |
| Serial                   |                   O                   |                   X                    | Sequence로 마이그레이션된다.                                 |
| Procedure                |                   X                   |                   X                    | 구축(Build) 단계에서 원본 데이터베이스에서 수집한 객체 생성 구문을 SrcDbObj_Create.sql과 BuildReport4Unsupported.html 파일에 기록한다. |
| Function                 |                   X                   |                   X                    | 구축(Build) 단계에서 원본 데이터베이스에서 수집한 객체 생성 구문을 SrcDbObj_Create.sql과 BuildReport4Unsupported.html 파일에 기록한다. |
| View                     |                   X                   |                   X                    | 구축(Build) 단계에서 원본 데이터베이스에서 수집한 객체 생성 구문을 SrcDbObj_Create.sql과 BuildReport4Unsupported.html 파일에 기록한다. |
| Trigger                  |                   X                   |                   X                    | 구축(Build) 단계에서 원본 데이터베이스에서 수집한 객체 생성 구문을 SrcDbObj_Create.sql과 BuildReport4Unsupported.html 파일에 기록한다. |

### Informix to Altibase

| 데이터베이스 객체 유형 | 'Build User'로 마이그레이션 가능 여부 | 'Build Table'로 마이그레이션 가능 여부 | 비고                                                         |
| :--------------------- | :-----------------------------------: | :------------------------------------: | :----------------------------------------------------------- |
| Table                  |                   O                   |                   O                    | 테이블과 컬럼에 명시된 주석(comment)도 함께 마이그레이션된다. |
| Primary Key 제약       |                   O                   |                   O                    |                                                              |
| Unique 제약            |                   O                   |                   O                    |                                                              |
| Check 제약             |                   O                   |                   O                    |                                                              |
| Foreign Key 제약       |                   O                   |                   O                    |                                                              |
| Index                  |                   O                   |                   O                    |                                                              |
| Serial 컬럼 타입       |                   O                   |                   O                    | Sequence로 마이그레이션된다.                                 |
| Sequence               |                   O                   |                   X                    |                                                              |
| Private Synonym        |               부분 지원               |                   X                    | 동일 schema 내의 객체를 참조하는 시노님만 마이그레이션된다.  |
| Procedure              |                   X                   |                   X                    | 구축(Build) 단계에서 원본 데이터베이스에서 수집한 객체 생성 구문을 SrcDbObj_Create.sql과 BuildReport4Unsupported.html 파일에 기록한다. |
| Function               |                   X                   |                   X                    | 구축(Build) 단계에서 원본 데이터베이스에서 수집한 객체 생성 구문을 SrcDbObj_Create.sql과 BuildReport4Unsupported.html 파일에 기록한다. |
| View                   |                   X                   |                   X                    | 구축(Build) 단계에서 원본 데이터베이스에서 수집한 객체 생성 구문을 SrcDbObj_Create.sql과 BuildReport4Unsupported.html 파일에 기록한다. |
| Trigger                |                   X                   |                   X                    | 구축(Build) 단계에서 원본 데이터베이스에서 수집한 객체 생성 구문을 SrcDbObj_Create.sql과 BuildReport4Unsupported.html 파일에 기록한다. |

### MySQL to Altibase

| 데이터베이스 객체 유형   | 'Build User'로 마이그레이션 가능 여부 | 'Build Table'로 마이그레이션 가능 여부 | 비고                                                         |
| :----------------------- | :-----------------------------------: | :------------------------------------: | :----------------------------------------------------------- |
| Table                    |                   O                   |                   O                    | 테이블과 컬럼에 명시된 주석(comment)도 함께 마이그레이션된다. |
| Primary Key 제약         |                   O                   |                   O                    |                                                              |
| Unique 제약              |                   O                   |                   O                    |                                                              |
| Check 제약               |                   O                   |                   O                    |                                                              |
| Foreign Key 제약         |                   O                   |                   O                    |                                                              |
| Index                    |                   O                   |                   O                    |                                                              |
| auto_increment 컬럼 속성 |                   O                   |                   O                    | Sequence로 마이그레이션된다.                                 |
| Procedure                |                   X                   |                   X                    | 구축(Build) 단계에서 원본 데이터베이스에서 수집한 객체 생성 구문을 SrcDbObj_Create.sql과 BuildReport4Unsupported.html 파일에 기록한다. |
| Function                 |                   X                   |                   X                    | 구축(Build) 단계에서 원본 데이터베이스에서 수집한 객체 생성 구문을 SrcDbObj_Create.sql과 BuildReport4Unsupported.html 파일에 기록한다. |
| View                     |                   X                   |                   X                    | 구축(Build) 단계에서 원본 데이터베이스에서 수집한 객체 생성 구문을 SrcDbObj_Create.sql과 BuildReport4Unsupported.html 파일에 기록한다. |
| Trigger                  |                   X                   |                   X                    | 구축(Build) 단계에서 원본 데이터베이스에서 수집한 객체 생성 구문을 SrcDbObj_Create.sql과 BuildReport4Unsupported.html 파일에 기록한다. |

### Oracle to Altibase

| 데이터베이스 객체 유형 | 'Build User'로 마이그레이션 가능 여부 | 'Build Table'로 마이그레이션 가능 여부 | 비고                                                         |
| :--------------------- | :-----------------------------------: | :------------------------------------: | :----------------------------------------------------------- |
| Table                  |                   O                   |                   O                    | 임시 테이블을 마이그레이션하기 위해서는 휘발성 테이블스페이스가 Altibase에 있어야 한다. Altibase의 임시 테이블은 휘발성 테이블스페이스에만 생성할 수 있기 때문이다.테이블과 컬럼에 명시된 주석(comment)도 함께 마이그레이션된다. |
| Primary Key 제약       |                   O                   |                   O                    |                                                              |
| Unique 제약            |                   O                   |                   O                    |                                                              |
| Check 제약             |                   O                   |                   O                    |                                                              |
| Foreign Key 제약       |                   O                   |                   O                    |                                                              |
| Index                  |                   O                   |                   O                    |                                                              |
| Sequence               |                   O                   |                   X                    |                                                              |
| Private Synonym        |               부분 지원               |                   X                    | 동일 schema 내의 객체를 참조하는 시노님만 마이그레이션된다.  |
| Procedure              |               부분 지원               |                   X                    | PSM 변환기에 정의된 규칙에 따라 객체 생성 문장을 변환하고 마이그레이션을 시도한다. |
| Function               |               부분 지원               |                   X                    | PSM 변환기에 정의된 규칙에 따라 객체 생성 문장을 변환하고 마이그레이션을 시도한다. |
| Package                |               부분 지원               |                   X                    | PSM 변환기에 정의된 규칙에 따라 객체 생성 문장을 변환하고 마이그레이션을 시도한다. |
| View                   |               부분 지원               |                   X                    | PSM 변환기에 정의된 규칙에 따라 객체 생성 문장을 변환하고 마이그레이션을 시도한다. |
| Materialized View      |               부분 지원               |                   X                    | PSM 변환기에 정의된 규칙에 따라 객체 생성 문장을 변환하고 마이그레이션을 시도한다. |
| Trigger                |               부분 지원               |                   X                    | PSM 변환기에 정의된 규칙에 따라 객체 생성 문장을 변환하고 마이그레이션을 시도한다. |

### SQL Server to Altibase

| 데이터베이스 객체 유형 | 'Build User'로 마이그레이션 가능 여부 | 'Build Table'로 마이그레이션 가능 여부 | 비고                                                         |
| :--------------------- | :-----------------------------------: | :------------------------------------: | :----------------------------------------------------------- |
| Table                  |                   O                   |                   O                    | 테이블과 컬럼에 명시된 주석(comment)도 함께 마이그레이션된다. |
| Primary Key 제약       |                   O                   |                   O                    |                                                              |
| Unique 제약            |                   O                   |                   O                    |                                                              |
| Check 제약             |                   O                   |                   O                    |                                                              |
| Foreign Key 제약       |                   O                   |                   O                    |                                                              |
| Index                  |                   O                   |                   O                    |                                                              |
| Identity 컬럼 속성     |                   O                   |                   O                    | Sequence로 마이그레이션된다.                                 |
| Sequence               |                   O                   |                   X                    | SQL Server 2012 지원                                         |
| Private Synonym        |               부분 지원               |                   X                    | 동일 schema 내의 객체를 참조하는 시노님만 마이그레이션된다.  |
| Procedure              |                   X                   |                   X                    | 구축(Build) 단계에서 원본 데이터베이스에서 수집한 객체 생성 구문을 SrcDbObj_Create.sql과 BuildReport4Unsupported.html 파일에 기록한다. |
| Function               |                   X                   |                   X                    | 구축(Build) 단계에서 원본 데이터베이스에서 수집한 객체 생성 구문을 SrcDbObj_Create.sql과 BuildReport4Unsupported.html 파일에 기록한다. |
| View                   |                   X                   |                   X                    | 구축(Build) 단계에서 원본 데이터베이스에서 수집한 객체 생성 구문을 SrcDbObj_Create.sql과 BuildReport4Unsupported.html 파일에 기록한다. |
| Trigger                |                   X                   |                   X                    | 구축(Build) 단계에서 원본 데이터베이스에서 수집한 객체 생성 구문을 SrcDbObj_Create.sql과 BuildReport4Unsupported.html 파일에 기록한다. |

### TimesTen to Altibase

| 데이터베이스 객체 유형 | 'Build User'로 마이그레이션 가능 여부 | 'Build Table'로 마이그레이션 가능 여부 | 비고                                                         |
| :--------------------- | :-----------------------------------: | :------------------------------------: | :----------------------------------------------------------- |
| Table                  |                   O                   |                   O                    | 임시 테이블을 Altibase(대상 데이터베이스)로 마이그레이션하기 위해서는 휘발성 테이블스페이스가 Altibase에 있어야 한다. Altibase의 임시 테이블은 휘발성 테이블스페이스에만 생성할 수 있기 때문이다. 테이블과 컬럼에 명시된 주석(comment)도 함께 마이그레이션된다. |
| Primary Key 제약       |                   O                   |                   O                    |                                                              |
| Unique 제약            |                   O                   |                   O                    |                                                              |
| Foreign Key 제약       |                   O                   |                   O                    |                                                              |
| Index                  |                   O                   |                   O                    | TimesTen(원본 데이터베이스)의 인덱스는 정렬 순서(ASC/DESC)나 크기에 대한 정보를 제공하지 않는다. 따라서 인덱스 순서는 기본값(ASC)으로 이관하며, 크기는 표시하지 않는다. TimesTen에서 제공되는 세 가지(hash, range, bitmap) 인덱스 중에서 hash·range 인덱스는 Altibase의 B-tree index로 변환되어 생성되며, bitmap 인덱스는 마이그레이션을 지원하지 않는다. 또한 인덱스 컬럼에 primary key나 unique 제약이 있을 경우, 해당 인덱스는 Altibase에서 허용하지 않기 때문에 마이그레이션에서 제외되며 build report의 Missing 탭에서 확인할 수 있다. |
| Sequence               |                   O                   |                   X                    |                                                              |
| Private Synonym        |               부분 지원               |                   X                    | 동일 schema 내의 객체를 참조하는 시노님만 마이그레이션된다.  |
| Procedure              |               부분 지원               |                   X                    | TimesTen 11.2 지원                                           |
| Function               |               부분 지원               |                   X                    | TimesTen 11.2 지원                                           |
| Package                |               부분 지원               |                   X                    | TimesTen 11.2 지원                                           |
| View                   |               부분 지원               |                   X                    | TimesTen 11.2 지원                                           |
| Materialized View      |               부분 지원               |                   X                    | TimesTen 11.2 지원                                           |
| Trigger                |               부분 지원               |                   X                    | TimesTen 11.2 지원                                           |

### Tibero to Altibase

| 데이터베이스 객체 유형 | 'Build User'로 마이그레이션 가능 여부 | 'Build Table'로 마이그레이션 가능 여부 | 비고                                                         |
| :--------------------- | :-----------------------------------: | :------------------------------------: | :----------------------------------------------------------- |
| Table                  |                   O                   |                   O                    | Tibero(원본 데이터베이스)의 임시 테이블을 Altibase(대상 데이터베이스)로 마이그레이션하기 위해서는 휘발성 테이블스페이스가 Altibase에 있어야 한다. Altibase의 임시 테이블은 휘발성 테이블스페이스에만 생성할 수 있기 때문이다. 테이블과 컬럼에 명시된 주석(comment)도 함께 마이그레이션된다. |
| Primary Key 제약       |                   O                   |                   O                    |                                                              |
| Unique 제약            |                   O                   |                   O                    |                                                              |
| Check 제약             |                   O                   |                   O                    |                                                              |
| Foreign Key 제약       |                   O                   |                   O                    |                                                              |
| Index                  |                   O                   |                   O                    | Tibero의 LOB 타입 컬럼에 자동으로 생성되는 index는 Altibase에서 지원하지 않으므로 이관되지 않는다. Build 단계에서 걸러진 이관 불가능한 인덱스 목록은 Build Report의 Missing 탭에서 확인할 수 있다. |
| Sequence               |                   O                   |                   X                    |                                                              |
| Private Synonym        |               부분 지원               |                   X                    | 동일 schema 내의 객체를 참조하는 시노님만 마이그레이션된다.  |
| Procedure              |               부분 지원               |                   X                    | PSM 변환기에 정의된 규칙에 따라 객체 생성 문장을 변환하고 마이그레이션을 시도한다. |
| Function               |               부분 지원               |                   X                    | PSM 변환기에 정의된 규칙에 따라 객체 생성 문장을 변환하고 마이그레이션을 시도한다. |
| Package                |               부분 지원               |                   X                    | PSM 변환기에 정의된 규칙에 따라 객체 생성 문장을 변환하고 마이그레이션을 시도한다. |
| View                   |               부분 지원               |                   X                    | PSM 변환기에 정의된 규칙에 따라 객체 생성 문장을 변환하고 마이그레이션을 시도한다. |
| Materialized View      |               부분 지원               |                   X                    | PSM 변환기에 정의된 규칙에 따라 객체 생성 문장을 변환하고 마이그레이션을 시도한다. |
| Trigger                |               부분 지원               |                   X                    | PSM 변환기에 정의된 규칙에 따라 객체 생성 문장을 변환하고 마이그레이션을 시도한다. |

> 참고:  Tibero의 Procedure, Function, View, Materialized View, Trigger는 객체를 마이그레이션하기 위해 Third-Party에서 제공하는 Oracle용 SQL 파서를 사용한다. 따라서, Oracle 문법과 호환되지 않는 Tibero 고유의 문법으로 생성된 객체는 변환과정에서 파싱 에러가 발생가능하며, 이 경우 사용자가 수동으로 문법을 변환해야 한다.

### PostgreSQL to Altibase

다음은 PostgreSQL에서 Altibase로 마이그레이션할 때 지원하는 데이터베이스 객체와 주의 사항 그리고 지원하지 않는 객체를 설명한 표이다.

| 데이터베이스 객체 유형 | 'Build User'로 마이그레이션 가능 여부 | 'Build Table'로 마이그레이션 가능 여부 | 비고                                                         |
| :--------------------- | :-----------------------------------: | :------------------------------------: | :----------------------------------------------------------- |
| Table                  |                   O                   |                   O                    | 컬럼에 명시된 주석(comment)도 함께 마이그레이션된다.<br />PostgreSQL은 테이블에 생성할 수 있는 최대 컬럼의 개수가 1,600개이고 Altibase는 1,024개이므로, 마이그레이션 수행 시 주의해야 한다. |
| Primary Key 제약       |                   O                   |                   O                    |                                                              |
| Unique 제약            |                   O                   |                   O                    |                                                              |
| Check 제약             |                   O                   |                   O                    |                                                              |
| Foreign Key 제약       |                   O                   |                   O                    | CASCADE, NO ACTION, SET NULL 옵션은 양쪽 모두 같은 옵션으로 마이그레이션 대상이다.<br />RESTRICT 옵션은 Altibase에서 Foreign key 옵션이 없을 때와 동작이 같아서, 마이그레이션 시 이 옵션은 삭제한다.<br />SET DEFAULT 옵션은 Altibase에서 지원하지 않기 때문에 마이그레이션 수행 시 SET NULL로 변환한다. |
| Index                  |                   O                   |                   O                    | PostgreSQL의 다양한 인덱스 타입 중 Altibase에서 지원하는 B-tree와 R-tree만 마이그레이션 대상이다. |
| Sequence               |                   O                   |                   X                    | PostgreSQL 시퀀스의 기본 최댓값 9223372036854775807은 Altibase 시퀀스의 기본 최댓값 9223372036854775806으로 강제 변환한다.<br/>PostgreSQL 시퀀스의 캐시 크기가 1이면 Altibase에서 CACHE 절을 삭제하고 Altibase의 기본 캐시 크기 20으로 생성한다.<br /><br />'Build Table'에서 사용자가 명시적으로 생성한 시퀀스는 마이그레이션 대상에서 제외되나, 마이그레이션 대상 테이블 컬럼의 Serial 데이터 타입을 위해 생성된 시퀀스는 테이블과 함께 마이그레이션된다. |
| Function               |                   X                   |                   X                    | 마이그레이션 미지원 대상이다. 구축(Build) 단계에서 PostgreSQL에서 수집한 객체 생성 구문을 SrcDbObj_Create.sql과 BuildReport4Unsupported.html 파일에 기록한다. |
| View                   |                   X                   |                   X                    | 마이그레이션 미지원 대상이다. 구축(Build) 단계에서 PostgreSQL에서 수집한 객체 생성 구문을 SrcDbObj_Create.sql과 BuildReport4Unsupported.html 파일에 기록한다. |
| Materialized View      |                   X                   |                   X                    | 마이그레이션 미지원 대상이다. 구축(Build) 단계에서 PostgreSQL에서 수집한 객체 생성 구문을 SrcDbObj_Create.sql과 BuildReport4Unsupported.html 파일에 기록한다. |
| Trigger                |                   X                   |                   X                    | 마이그레이션 미지원 대상이다. 구축(Build) 단계에서 PostgreSQL에서 수집한 객체 생성 구문을 SrcDbObj_Create.sql과 BuildReport4Unsupported.html 파일에 기록한다. |

> 참고 : 위 표에 기록되지 않은 PostgreSQL의 객체(예, Exclusion 제약, Type, Enum 등)는 Altibase에 대응되는 객체가 없어 마이그레이션 대상에서 제외한다.

<br/>

