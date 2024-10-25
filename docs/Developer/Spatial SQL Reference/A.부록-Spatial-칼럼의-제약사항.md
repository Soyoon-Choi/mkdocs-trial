# A.부록: Spatial 칼럼의 제약사항

이 부록은 Altibase에 Spatial 기능을 확장함에 따라 기존의 DBMS 기능 중 GEOEMTRY
칼럼에 대한 지원이 제한되는 부분을 기술한다.

### GEOMETRY 칼럼에 대한 제약 사항

#### 제약 조건 

Altibase에서 제공하는 제약 조건 중 GEOMETRY 칼럼에 적용할 수 있는 제약 조건은 SRID를 제외하면, “NOT NULL” 제약 조건이 유일하다.

그 외 다른 제약 조건은 공간 데이터 타입에는 적용할 수 없다.

#### SRID (공간 참조 식별자)

SRID(Spatial Reference Identifier)는 공간 객체를 구분하기 위해 지정하는 식별자이다. SRID는 GEOMETRY 칼럼에 적용할 수 있으며, 테이블에 INSERT하는 GEOMETRY 객체에 SRID를 지정할 수도 있다.
테이블에 INSERT하는 GEOMETRY 객체의 SRID는 대응되는 칼럼의 SRID와 일치하거나 0이어야만 한다. 칼럼이나 객체의 SRID를 지정하지 않는 경우 기본값으로 0이 된다.
ALTER TABLE MODIFY COLUMN 구문을 사용해 칼럼의 SRID를 변경할 수 있다. 이 때 해당 칼럼에 INSERT된 모든 객체의 SRID는 변경하려는 SRID와 일치하거나 0이어야 한다.

##### 예제

```
CREATE TABLE T1 (I1 GEOMETRY);
INSERT INTO T1 VALUES(GEOMETRY'POINT(1 1)');
INSERT INTO T1 VALUES(GEOMETRY'SRID=99;POINT(1 1)');
 
-- FAIL
iSQL> ALTER TABLE T1 MODIFY COLUMN I1 SRID 100;
[ERR-31461 : Invalid SRID datatype.]
 
-- SUCCESS
iSQL> ALTER TABLE T1 MODIFY COLUMN I1 SRID 99;
Alter success.
```

#### 인덱스 

공간 데이터 타입에 대한 인덱스는 “R-Tree” 인덱스를 지원한다. R-Tree 인덱스는
unique속성으로 생성할 수 없고, 복합 컬럼들로 생성할 수도 없다.

다른 인덱스와 동일하게 SET PERSISTENT 옵션으로 생성할 수 있다.

또한 R-Tree 인덱스를 구성하는 칼럼에 NOT NULL 제약조건이 없다면, R-Tree 인덱스가
쿼리 수행에 사용되는지 여부에 따라 결과가 달라질 수 있으므로 주의가 필요하다.
R-Tree 인덱스는 리프 노드에 NULL 또는 EMPTY 값이 들어가지 않는다. 따라서 아래와
같이 R-Tree 인덱스를 사용하는 쿼리에는 NULL이나 EMPTY 값이 영향을 미치지 않는다.

```
CREATE TABLE T1 (I1 GEOMETRY) TABLESPACE SYS_TBS_DISK_DATA;
CREATE INDEX T1_I1_IDX ON T1(I1);
INSERT INTO T1 VALUES (NULL);

iSQL>  SELECT /*+ index(t1, T1_I1_IDX) */ count(*) from T1;
COUNT
-----------------------
0
1 row selected.
```

하지만 아래와 같이 쿼리에 full scan 힌트를 명시하면, R-Tree 인덱스를 구성하는
칼럼에 저장된 NULL이나 EMPTY 값이 쿼리 결과에 영향을 미치게 된다.

```
iSQL>  SELECT /*+ full scan(T1) */ count(*) from T1;
COUNT
-----------------------
1
1 row selected.
```

#### 트리거

Stored Procedure와 동일한 제약 조건을 갖고, 트리거 생성 구문에서 before Value와
after Value로 GEOMETRY 칼럼을 사용할 수 없다.

#### 저장 프로시저

Parameter, Local Variable에 GEOMETRY Type을 사용할 수 없다.

#### 저장 함수

Parameter, Return type, Local Variable에는 GEOMETRY Type을 사용할 수 없다.

