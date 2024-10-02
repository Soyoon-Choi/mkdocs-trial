# B.부록: 스키마

이 부록은 본 매뉴얼에서 사용된 예제의 전반적인 테이블 스키마 및 기본 데이터에
대한 참조 정보를 나타낸다.

### 예제 테이블 정보

#### 목적

Altibase Spatial SQL 문법과 기능 설명을 위해서 사용한 예제 테이블에 대한 정보를
제공한다.

#### 스키마

##### TB1 테이블

기본 키: F1

초기 레코드 개수: 10개

| 칼럼명 | 데이터 타입 | 설명        |
|--------|-------------|-------------|
| F1     | INTEGER     | 식별자      |
| F2     | GEOMETRY    | 공간 데이터 |

##### TB2 테이블

기본 키: F1

초기 레코드 개수: 10개

| 칼럼명 | 데이터 타입 | 설명        |
|--------|-------------|-------------|
| F1     | INTEGER     | 식별자      |
| F2     | GEOMETRY    | 공간 데이터 |

##### TB3 테이블

기본 키: ID

초기 레코드 개수: 0개

| 칼럼명 | 데이터 타입 | 설명        |
|--------|-------------|-------------|
| ID     | INTEGER     | 식별자      |
| OBJ    | GEOMETRY    | 공간 데이터 |

### 샘플 데이터

본 매뉴얼에 작성된 예제 SQL의 결과는 아래의 초기 샘플 데이터를 기준으로 도출된
것이다.

##### TB1 테이블

```
CREATE TABLE TB1 (F1 INTEGER PRIMARY KEY, F2 GEOMETRY);
CREATE INDEX RT_IDX_TB1 ON TB1(F2) ;

INSERT INTO TB1 VALUES (100, NULL);
INSERT INTO TB1 VALUES (101, GEOMETRY'POINT(1 1)');
INSERT INTO TB1 VALUES (102, GEOMETRY'MULTIPOINT(1 1, 2 2)');
INSERT INTO TB1 VALUES (103, GEOMETRY'LINESTRING(1 1, 2 2)');
INSERT INTO TB1 VALUES (104, GEOMETRY'MULTILINESTRING((1 1, 2 2), (3 3, 4 5))');
INSERT INTO TB1 VALUES (105, GEOMETRY'POLYGON((0 0, 10 0, 10 10, 0 10, 0 0 ))');
INSERT INTO TB1 VALUES (106, GEOMETRY'POLYGON((3 5, 7 5, 7 9, 3 9, 3 5 ), ( 4 6, 4 8 , 6 8, 6 6 , 4 6 ))');
INSERT INTO TB1 VALUES (107, GEOMETRY'MULTIPOLYGON(((1 1, 2 1, 2 2, 1 2, 1 1)), ((3 3, 3 5, 5 5, 5 3, 3 3)))');
INSERT INTO TB1 VALUES (108, GEOMFROMTEXT('GEOMETRYCOLLECTION(POINT(1 1), LINESTRING(2 2, 3 3))'));
INSERT INTO TB1 VALUES (109, BOUNDARY(GEOMETRY'POINT(10 10)'));

iSQL> SELECT F1 FROM TB1 ;
F1          
--------------
100         
101         
102         
103         
104         
105         
106         
107         
108         
109         
10 rows selected.
```

##### TB2 테이블

```
CREATE TABLE TB2 (F1 INTEGER PRIMARY KEY, F2 GEOMETRY);
CREATE INDEX RT_IDX_TB2 ON TB2(F2) ;

INSERT INTO TB2 VALUES (200, NULL);
INSERT INTO TB2 VALUES (201, GEOMETRY'POINT(10 10)');
INSERT INTO TB2 VALUES (202, GEOMETRY'MULTIPOINT(10 10, 20 20)');
INSERT INTO TB2 VALUES (203, GEOMETRY'LINESTRING(10 10, 20 20, 30 40)');
INSERT INTO TB2 VALUES (204, GEOMETRY'MULTILINESTRING((10 10, 20 20), (15 15, 30 15))');
INSERT INTO TB2 VALUES (205, GEOMETRY'POLYGON((2 2, 12 2, 12 12, 2 12 ))');
INSERT INTO TB2 VALUES (206, GEOMETRY'POLYGON((8 3, 9 3, 9 5, 8 5, 8 3 ),( 8.2  3.2, 8.2 4.8, 8.8 4.8 , 8.8 3.2 ,8.2 3.2 ))');
INSERT INTO TB2 VALUES (207, GEOMETRY'MULTIPOLYGON(((10 10, 10 20, 20 20, 20 15, 10 10)), ((60 60, 70 70, 80 60, 60 60)))');
INSERT INTO TB2 VALUES (208, GEOMFROMTEXT('GEOMETRYCOLLECTION( POINT(10 10), POINT(30 30), LINESTRING(15 15, 20 20))'));
INSERT INTO TB2 VALUES (209, BOUNDARY(GEOMETRY'POINT(10 10)'));

iSQL> SELECT F1 FROM TB2;
F1          
--------------
200         
201         
202         
203         
204         
205         
206         
207         
208         
209         
10 rows selected.
```

##### TB3 테이블

```
CREATE TABLE TB3(ID INTEGER PRIMARY KEY, OBJ GEOMETRY);
CREATE INDEX RT_IDX_TB3 ON TB3(OBJ) ;
```

