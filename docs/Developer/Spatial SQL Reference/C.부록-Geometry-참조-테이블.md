# C.부록: Geometry 참조 테이블

이 부록은 OGC 표준을 만족하는 메타 테이블 SPATIAL_REF_SYS, GEOMETRY_COLUMNS의 사용법, 관련된 제약 사항에 대해 설명한다.

### Geometry 참조 테이블 

Geometry 참조 테이블은 공간 참조 식별자(SRID, Spatial Reference ID)와, 공간 참조
시스템(SRS, Spatial Reference System)에 대한 정보를 참조하기 위해 사용한다.

#### 제약 사항

- GEOMETRY_COLUMNS, SYSTEM_.SYS_GEOMETRIES_ 테이블은 일반 메타 테이블로 단지 참조용으로만 사용된다.

#### GEOMETRY_COLUMNS

GEOMETRY 칼럼에 공간 참조 식별자(SRID, Spatial Reference ID)를 지정, 관리하기
위해 사용한다.

이 테이블은 SYSTEM_.SYS_GEOMETRY_COLUMNS_ 메타 테이블의 synonym이다.

| Column name     | Type         | Description          |
|-----------------|--------------|----------------------|
| F_TABLE_SCHEMA    | VARCHAR(128) | 테이블 소유자 이름   |
| F_TABLE_NAME      | VARCHAR(128) | 테이블 이름          |
| F_GEOMETRY_COLUMN | VARCHAR(128) | COLUMN의 이름        |
| COORD_DIMENSION | INTERGER     | GEOMETRY 객체의 차원 |
| SRID            | INTERGER     | 데이터베이스 내에서의 공간 참조 식별자 |

#### SPATIAL_REF_SYS

공간 참조 식별자(SRID, Spatial Reference IDentifier)와 이에 대응하는 공간 참조 시스템(SRS, Spatial Reference System)에 관한 정보를 관리하기 위해 사용한다.

이 테이블은 SYSTEM_.USER_SRS 메타 테이블의 synonym이다.

SPATIAL_REF_SYS 테이블에 Spatial Reference System 메타 데이터를 등록하기 위해서는 ADD_SPATIAL_REF_SYS, DELETE_SPATIAL_REF_SYS 프로시저를 사용해야한다.

| Column name | Type           | Description                                          |
|-------------|----------------|------------------------------------------------------|
| SRID        | INTEGER        | 데이터베이스 내에서의 공간 참조 식별자 |
| AUTH_NAME   | VARCHAR(256)    | 표준 이름                                            |
| AUTH_SRID   | INTERGER       | 표준 공간 참조 식별자                                 |
| SRTEXT      | VARCHAR (2048) | OGC-WKT형태로 표현 되는 공간 참조 시스템에 대한 설명 |
| PROJ4TEXT   | VARCHAR (2048) | PROJ4에서 사용되는 정보                              |

### 관련 저장 프로시저 

#### ADD_SPATIAL_REF_SYS

##### 구문

```
SYS_SPATIAL.ADD_SPATIAL_REF_SYS( SRID in integer,
                                 AUTH_NAME in varchar(256),
                                 AUTH_SRID in integer,
                                 SRTEXT in varchar(2048),
                                 PROJ4TEXT in varchar(2048) );
```

##### 설명

SPATIAL_REF_SYS_ 테이블에 Spatial Reference System 메타데이터를 등록하는 프로시저이다.

SRID와 AUTH_SRID는 동일한 값을 사용하는 것을 권장한다.

##### 파라미터

| 이름          | 입출력     | 데이터 타입  | 설명                    |
|---------------|-------------|-------------------|--------|
| SRID      | IN | INTEGER      | Spatial Reference System의 데이터베이스 내에서의 ID |
| AUTH_NAME  | IN| VARCHAR(256) | Spatial Reference System에서 사용된 표준의 이름 |
| AUTH_SRID | IN | INTEGER    | 표준에 의해 정의된 Spatial Reference System의 ID |
| SRTEXT          | IN     | VARCHAR(2048)  | Spatial Reference System의 Well-Known Text 표현 |
| PROJ4TEXT          | IN    |VARCHAR(2048) | PROJ4에서 사용되는 정보 |

##### 결과값

저장 프로시저이므로 결과값을 반환하지 않는다.

##### 예외

예외를 발생시키지 않는다.


#### DELETE_SPATIAL_REF_SYS

##### 구문

```
SYS_SPATIAL.DELETE_SPATIAL_REF_SYS( SRID in integer,
                                    AUTH_NAME in varchar(256) );
```

##### 설명

GEOMETRY_COLUMNS_BASE 테이블에 등록한 Geometry Column의 메타데이터를 삭제하는 프러시저이다.

##### 파라미터

| 이름          | 입출력     | 데이터 타입  | 설명                    |
|---------------|-------------|-------------------|--------|
| SRID      | IN | INTEGER      | Spatial Reference System의 데이터베이스 내에서의 ID |
| AUTH_NAME  | IN| VARCHAR(256) | Spatial Reference System에서 사용된 표준의 이름 |

##### 결과값

저장 프로시저이므로 결과값을 반환하지 않는다.

##### 예외

예외를 발생시키지 않는다.
