# A.부록: 마이그레이션 옵션

마이그레이션 옵션은 마이그레이션 프로젝트에 영향을 미치며, GUI 모드에서 "Migration Option" 메뉴 아이템을 선택해서 편집 가능하다. 마이그레이션 옵션은 대부분 프로젝트가 생성된 직후에 편집할 수 있다.

기본 옵션은 "DB to DB" 또는 "DB to File" Migration Type이다:

- DB to DB 마이그레이션 옵션

- DB to File 마이그레이션 옵션

### DB to DB 마이그레이션 옵션

마이그레이션 대상이 되는 원본 데이터베이스의 객체와 테이블의 데이터가 저장하려는 데이터베이스(Altibase)로 직접 마이그레이션된다.

| 이름                                         | 설명                                                         |
| :------------------------------------------- | :----------------------------------------------------------- |
| Execution Thread                             | 데이터 마이그레이션 실행 시 수행할 최대 스레드 개수를 설정한다. 기본 설정은 마이그레이션 센터가 실행된 시스템의 논리 CPU 개수 * 3이다. 설정값 범위는 1 ~ 논리 CPU 개수 * 3을 권장한다. |
| Migration Target                             | 마이그레이션 대상을 선택한다. <br />- Object & Data: 데이터베이스 객체 및 테이블 데이터 <br />- Object: 데이터베이스 객체만 |
| **Object Options**                           |                                                              |
| Foreign Key Migration                        | 마이그레이션 대상에 외래 키 제약 조건 포함 여부를 설정한다. 기본 설정은 No이다. |
| PSM Migration                                | 마이그레이션 대상에 PSM 객체(저장 프로시저, 저장 함수, Materialized View, 뷰, 타입 세트 및 트리거) 포함 여부를 설정한다. 기본 설정은 Yes이다. |
| Drop Existing Objects                        | 마이그레이션 수행 전 데이터베이스 객체 재생성 여부를 설정한다.<br />Yes는 대상 데이터베이스에서 마이그레이션 대상 객체를 삭제(Drop)하고 생성(Create)한다. No는 데이터베이스 객체 삭제 과정 없이 마이그레이션을 수행한다. 기본 설정은 No이다. |
| Keep Partition Table                         | 파티션드 테이블 유지 여부를 설정한다. <br />Yes는 변환 가능한 경우 원본 데이터베이스와 동일한 파티션드 테이블을 생성한다. 이 경우 사용자는 조정(Reconcile) 단계 중 5. Partitioned Table Conversion에서 파티션드 테이블 변환에 필요한 추가 작업을 진행해야 한다. No는 논파티션드 테이블로 변경하여 생성한다. 기본 설정은 No이다. |
| Use Double-quoted Identifier                 | 데이터베이스 객체 이름에 큰 따옴표 사용 여부를 설정한다. 기본 설정은 No이다. |
| Remove FORCE from View DDL                   | 뷰 생성 구문에서 'FORCE' 키워드 삭제 여부를 설정한다. 기본 설정은 Yes이다. |
| Postfix for reserved word                    | 원본 데이터베이스 객체 이름이 Altibase 예약어와 충돌할 경우 객체 이름에 추가할 접미사를 설정한다. 기본 설정은 _POC이다. |
| **Data Options**                             |                                                              |
| Batch Execution                              | 성능 향상을 위한 JDBC 배치 입력 사용 여부를 설정한다. 기본 설정은 Yes이다. |
| Batch Size                                   | JDBC 배치 입력 사용 시 배치 크기를 지정한다. 기본 설정은 10000이다. |
| Batch LOB type                               | BLOB, CLOB 데이터 타입의 배치 처리 여부를 지정한다. <br/>Yes는 배치 처리를 허용하는 것을 의미한다. 단, LOB 데이터 크기에 따라 메모리 초과 (Out Of Memory) 등의 문제가 발생할 수 있음을 주의해야 한다. 또한 배치 기능을 지원하지 않는 TimesTen에서 예외가 발생할 수 있다. <br />No는 배치 처리를 허용하지 않는다. 기본 설정은 No이다. |
| Log Insert-failed Data                       | 데이터 마이그레이션 중 입력 실패한 행(row)을 로그 파일에 작성할 것인지 설정한다. 이 옵션은 Batch Execution 옵션이 No인 경우 활성화된다. 기본 설정은 No이다. |
| File Encoding                                | 입력 실패한 레코드를 파일에 기록할 때 인코딩 문자 집합을 지정한다. Log Insert-failed Data 옵션이 Yes인 경우 활성화된다. 기본설정은 UTF8이다. |
| **Data Validation Options**                  |                                                              |
| Operation                                    | 검증 단계에서 수행할 연산을 선택한다. <br />- DIFF : 원본 및 대상 데이터베이스 간 데이터 불일치 검사 <br />- FILESYNC: DIFF의 결과로 생성된 CSV 파일을 대상 데이터베이스에 반영 |
| Write to CSV                                 | 불일치 데이터를 CSV 파일에 기록할 것인지 설정한다.           |
| Include LOB                                  | 불일치 데이터를 CSV 파일에 기록할 때 LOB 데이터를 포함할 것인지 설정한다. |
| Data Sampling                                | 데이터 샘플링 기능 사용 여부를 설정한다.<br />Yes는 검증 단계의 소요 시간을 줄이기 위해, 샘플 데이터를 대상으로 검증 단계를 수행한다. No는 전체 데이터를 대상으로 검증 단계를 수행한다. 기본 설정은 Yes이다. |
| Percent Sampling (exact counting)            | 테이블에서 샘플링할 데이터의 비율을 퍼센트 단위로 지정한다. 구축 단계에서 Exact Counting Method를 선택한 경우 이 옵션이 사용된다. |
| Record Count Sampling (approximate counting) | 테이블에서 샘플링할 레코드의 개수를 지정한다. 구축 단계에서 Approximate Counting Method를 선택한 경우 이 옵션이 사용된다. |

### DB to File 마이그레이션 옵션

마이그레이션 대상이 되는 원본 데이터베이스의 객체와 테이블의 데이터가 SQL 스크립트 파일, form 파일, CSV 형태의 데이터 파일로 각각 저장된다. 저장된 파일들은 iSQL, iLoader를 이용하여 저장하려는 데이터베이스(Altibase)로 마이그레이션 할 수 있다.

| 이름                         | 설명                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| Execution Thread             | 데이터 마이그레이션 실행 시 수행할 최대 스레드 개수를 설정한다. 기본 설정은 마이그레이션 센터가 실행된 시스템의 논리 CPU 개수 * 3이다. 설정값 범위는 1 ~ 논리 CPU 개수 * 3을 권장한다. |
| Migration Target             | 마이그레이션 대상을 선택한다. <br />- Object & Data: 데이터베이스 객체 및 테이블 데이터 <br />- Object: 데이터베이스 객체만 |
| **Object Options**           |                                                              |
| Foreign Key Migration        | 마이그레이션 대상에 외래 키 제약 조건 포함 여부를 설정한다. 기본 설정은 No이다. |
| PSM Migration                | 마이그레이션 대상에 PSM 객체(저장 프로시저, 저장 함수, Materialized View, 뷰, 타입 세트 및 트리거) 포함 여부를 설정한다. 기본 설정은 Yes이다. |
| Keep Partition Table         | 파티션드 테이블 유지 여부를 설정한다. <br />Yes는 변환 가능한 경우 원본 데이터베이스와 동일한 파티션드 테이블을 생성한다. 이 경우 사용자는 조정(Reconcile) 단계 중 5. Partitioned Table Conversion에서 파티션드 테이블 변환에 필요한 추가 작업을 진행해야 한다. No는 논파티션드 테이블로 변경하여 생성한다. 기본 설정은 No이다. |
| Use Double-quoted Identifier | 데이터베이스 객체 이름에 큰 따옴표 사용 여부를 설정한다. 기본 설정은 No이다. |
| **Data Files**               |                                                              |
| File Encoding                | 스크립트와 데이터 파일 출력에 사용될 인코딩 문자 집합을 지정한다. |

<br/>

